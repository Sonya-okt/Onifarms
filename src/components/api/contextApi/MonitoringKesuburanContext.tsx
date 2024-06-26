import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import database from '@react-native-firebase/database';

type MonitoringContextType = {
  suhu: React.MutableRefObject<number>;
  kelembapan: React.MutableRefObject<number>;
  pH: React.MutableRefObject<number>;
  nitrogen: React.MutableRefObject<number>;
  phosphor: React.MutableRefObject<number>;
  kalium: React.MutableRefObject<number>;
};

const MonitoringContext = createContext<MonitoringContextType | undefined>(
  undefined,
);

export const MonitoringProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const suhu = useRef<number>(0);
  const kelembapan = useRef<number>(0);
  const pH = useRef<number>(0);
  const nitrogen = useRef<number>(0);
  const phosphor = useRef<number>(0);
  const kalium = useRef<number>(0);

  useEffect(() => {
    const refs = {
      suhuRef: database().ref('1002/average/suhu'),
      kelembapanRef: database().ref('1002/average/kelembapan'),
      pHRef: database().ref('1002/average/ph'),
      nitrogenRef: database().ref('1002/average/nitrogen'),
      phosphorRef: database().ref('1002/average/phosphor'),
      kaliumRef: database().ref('1002/average/kalium'),
    };

    const handleUpdate = (ref: any, setRef: React.MutableRefObject<number>) => {
      ref.on('value', (snapshot: any) => {
        const value = snapshot.val();
        if (value !== null) {
          setRef.current = value;
        }
      });
    };

    Object.keys(refs).forEach(key => {
      handleUpdate(
        refs[key as keyof typeof refs],
        {
          suhu: suhu,
          kelembapan: kelembapan,
          pH: pH,
          nitrogen: nitrogen,
          phosphor: phosphor,
          kalium: kalium,
        }[key.replace('Ref', '') as keyof MonitoringContextType],
      );
    });

    return () => {
      Object.values(refs).forEach(ref => {
        ref.off();
      });
    };
  }, []);

  return (
    <MonitoringContext.Provider
      value={{suhu, kelembapan, pH, nitrogen, phosphor, kalium}}>
      {children}
    </MonitoringContext.Provider>
  );
};

export const useMonitoring = (): MonitoringContextType => {
  const context = useContext(MonitoringContext);
  if (!context) {
    throw new Error('useMonitoring must be used within a MonitoringProvider');
  }
  return context;
};
