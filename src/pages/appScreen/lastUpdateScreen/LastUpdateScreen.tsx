import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Color, FontFamily} from '../../../constants/GlobalStyles';
import database from '@react-native-firebase/database';
import RNSecureStorage from 'rn-secure-storage';

interface Bedengan {
  id: string;
  name: string;
  nodes: Node[];
}

interface Node {
  id: string;
  time: string;
  date: string;
  status: string;
  lastUpdateTime: number;
}

const LastUpdateScreen: React.FC = () => {
  const [bedenganList, setBedenganList] = useState<Bedengan[]>([]);
  const lastUpdateTimeRef = useRef<{[key: string]: number}>({});
  const nodeUpdateTimeoutsRef = useRef<{[key: string]: NodeJS.Timeout}>({});

  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        const uid = await RNSecureStorage.getItem('userUID');
        if (uid) {
          const bedenganRef = database().ref(`${uid}/Data`);

          const onValueChange = (snapshot: any) => {
            const bedenganData = snapshot.val();
            const parsedBedenganList: Bedengan[] = [];

            Object.keys(bedenganData).forEach(bedenganKey => {
              const bedengan = bedenganData[bedenganKey];
              let nodes: Node[] = [];

              Object.keys(bedengan).forEach(nodeKey => {
                if (nodeKey.startsWith('node')) {
                  const node: Node = {
                    id: nodeKey,
                    time: '',
                    date: '',
                    status: 'No Node Detection',
                    lastUpdateTime: 0,
                  };

                  const nodeRef = bedenganRef.child(
                    `${bedenganKey}/${nodeKey}`,
                  );

                  nodeRef.child('date').on('value', dateSnapshot => {
                    const date = dateSnapshot.val();
                    if (date) {
                      node.date = date;
                      updateNodeStatus(bedenganKey, nodeKey, node);
                    }
                  });

                  nodeRef.child('time').on('value', timeSnapshot => {
                    const time = timeSnapshot.val();
                    if (time) {
                      node.time = time;
                      updateNodeStatus(bedenganKey, nodeKey, node);
                    }
                  });

                  nodes.push(node);
                }
              });

              // Urutkan nodes berdasarkan seluruh bagian dari id
              nodes.sort((a, b) => {
                const getParts = (id: string) =>
                  id
                    .split(/[_\s]+/)
                    .map(part => parseInt(part.replace(/[^\d]/g, ''), 10));
                const partsA = getParts(a.id);
                const partsB = getParts(b.id);

                for (
                  let i = 0;
                  i < Math.max(partsA.length, partsB.length);
                  i++
                ) {
                  if (partsA[i] !== partsB[i]) {
                    return (partsA[i] || 0) - (partsB[i] || 0);
                  }
                }
                return 0;
              });

              parsedBedenganList.push({
                id: bedenganKey,
                name: `Bedengan ${bedenganKey.replace('bedengan', '')}`,
                nodes,
              });
            });

            parsedBedenganList.sort((a, b) => {
              const numA = parseInt(a.id.replace('bedengan', ''), 10);
              const numB = parseInt(b.id.replace('bedengan', ''), 10);
              return numA - numB;
            });

            setBedenganList(parsedBedenganList);
          };

          const updateNodeStatus = (
            bedenganId: string,
            nodeId: string,
            node: Node,
          ) => {
            const currentTime = new Date().getTime();
            const nodeTime = new Date(`${node.date} ${node.time}`).getTime();
            const timeDifference = (currentTime - nodeTime) / (1000 * 60); // in minutes

            if (timeDifference <= 1) {
              node.status = 'Updated';
            } else {
              node.status = 'Not Updated';
            }

            node.lastUpdateTime = currentTime;
            lastUpdateTimeRef.current[`${bedenganId}_${nodeId}`] = currentTime;

            // Clear any existing timeout for this node
            if (nodeUpdateTimeoutsRef.current[`${bedenganId}_${nodeId}`]) {
              clearTimeout(
                nodeUpdateTimeoutsRef.current[`${bedenganId}_${nodeId}`],
              );
            }

            // Set a timeout to update the status to "Not Updated" after 1 minute
            nodeUpdateTimeoutsRef.current[`${bedenganId}_${nodeId}`] =
              setTimeout(() => {
                setBedenganList(prevBedenganList => {
                  const newBedenganList = [...prevBedenganList];
                  const bedenganIndex = newBedenganList.findIndex(
                    b => b.id === bedenganId,
                  );

                  if (bedenganIndex > -1) {
                    const nodeIndex = newBedenganList[
                      bedenganIndex
                    ].nodes.findIndex(n => n.id === nodeId);

                    if (nodeIndex > -1) {
                      newBedenganList[bedenganIndex].nodes[nodeIndex] = {
                        ...newBedenganList[bedenganIndex].nodes[nodeIndex],
                        status: 'Not Updated',
                      };
                    }
                  }

                  return newBedenganList;
                });
              }, 60000); // 1 minute

            setBedenganList(prevBedenganList => {
              const newBedenganList = [...prevBedenganList];
              const bedenganIndex = newBedenganList.findIndex(
                b => b.id === bedenganId,
              );

              if (bedenganIndex > -1) {
                const nodeIndex = newBedenganList[
                  bedenganIndex
                ].nodes.findIndex(n => n.id === nodeId);

                if (nodeIndex > -1) {
                  newBedenganList[bedenganIndex].nodes[nodeIndex] = node;
                }
              }

              return newBedenganList;
            });
          };

          bedenganRef.on('value', onValueChange);

          return () => {
            bedenganRef.off('value', onValueChange);
            bedenganList.forEach(bedengan => {
              bedengan.nodes.forEach(node => {
                const nodeRef = bedenganRef.child(`${bedengan.id}/${node.id}`);
                nodeRef.child('date').off('value');
                nodeRef.child('time').off('value');
              });
            });

            // Clear all timeouts on unmount
            Object.values(nodeUpdateTimeoutsRef.current).forEach(clearTimeout);
          };
        }
      } catch (error) {
        console.error('Error fetching User UID:', error);
      }
    };

    fetchRealtimeData();
  }, []);

  const renderItem = ({item}: {item: Bedengan}) => {
    return (
      <View style={styles.parentContainer}>
        <View style={styles.container}>
          <View style={styles.containerText}>
            <Text style={styles.textTitle}>{item.name}</Text>
            <View
              style={{
                borderTopColor: Color.GREY,
                borderTopWidth: wp('0.2%'),
                width: wp('80%'),
                marginBottom: hp('1.5%'),
              }}
            />

            {item.nodes.length > 0 ? (
              item.nodes.map(node => (
                <View
                  style={{flexDirection: 'row', marginBottom: hp('1%')}}
                  key={node.id}>
                  <Text style={[styles.textSubtitle, {width: wp('20%')}]}>
                    {node.id}
                  </Text>
                  <Text style={[styles.textSubtitle, {marginRight: wp('2%')}]}>
                    :
                  </Text>
                  <View style={{flexDirection: 'row', width: wp('32%')}}>
                    <Text
                      style={[styles.textSubtitle, {marginRight: wp('2%')}]}>
                      {node.time}
                    </Text>
                    <Text
                      style={[styles.textSubtitle, {marginRight: wp('7%')}]}>
                      {node.date}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.indicatorContainer,
                      {
                        backgroundColor:
                          node.status === 'Updated'
                            ? Color.GREEN
                            : Color.RED_WARN,
                      },
                    ]}>
                    <Text style={styles.textIndicator}>{node.status}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View
                style={[
                  styles.indicatorContainer,
                  {backgroundColor: Color.RED_WARN},
                ]}>
                <Text style={styles.textIndicator}>No Node Detection</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      style={styles.linearGradient}
      colors={['#E0F8F0', '#FFFFFF', '#9BD5B5']}
      start={{x: 0, y: -0.4}}
      end={{x: 0.9, y: 1.5}}
      locations={[0.1, 0.5, 1]}>
      <FlatList
        data={bedenganList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    marginTop: hp('-2%'),
    paddingTop: hp('3.5%'),
    alignItems: 'center',
  },
  parentContainer: {
    width: wp('98%'),
    alignItems: 'center',
  },
  container: {
    width: wp('89%'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.WHITE,
    borderColor: Color.PRIMARY,
    borderWidth: 0.7,
    borderRadius: wp('5%'),
    marginBottom: hp('1.5%'),
  },
  textTitle: {
    fontFamily: FontFamily.poppinsBold,
    fontSize: wp('3.5%'),
    color: Color.PRIMARY,
    marginBottom: hp('0.8%'),
  },
  textSubtitle: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: wp('3.1%'),
    color: Color.PRIMARY,
  },
  indicatorContainer: {
    borderRadius: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textIndicator: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: wp('2.5%'),
    color: Color.WHITE,
    marginHorizontal: wp('2%'),
    textAlign: 'center',
  },
  containerText: {
    paddingHorizontal: wp('4%'),
    marginVertical: hp('1.6%'),
  },
});

export default LastUpdateScreen;
