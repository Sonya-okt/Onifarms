import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Color} from '../../constants/GlobalStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const OPENWEATHER_API_KEY = 'f95bedbc9dbffb68cac9a9edf749dc23';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

interface LocationSearchProps {
  onSelect: (item: Location, weatherData: WeatherResponse | null) => void;
  onChangeQuery: (isTyping: boolean) => void;
}

interface Location {
  place_id: string;
  display_name: string;
  address: {
    village?: string;
    town?: string;
    city?: string;
    county?: string;
    state?: string;
    region?: string;
  };
}

export interface WeatherResponse {
  main: {
    temp: number;
  };
  [key: string]: any;
}

export const getWeather = async (city: string): Promise<WeatherResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}weather`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const LocationSearch: React.FC<LocationSearchProps> = ({
  onSelect,
  onChangeQuery,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (selectedLocation) {
      const locality =
        selectedLocation.address.village ||
        selectedLocation.address.town ||
        selectedLocation.address.city;

      const fetchWeatherData = async () => {
        if (locality) {
          try {
            const weatherResponse = await getWeather(locality);
            setWeatherData(weatherResponse);
            onSelect({...selectedLocation}, {...weatherResponse});
            await AsyncStorage.setItem(
              'selectedLocation',
              JSON.stringify({...selectedLocation}),
            );
            await AsyncStorage.setItem(
              'weatherData',
              JSON.stringify({...weatherResponse}),
            );
            const storedWeatherData = await AsyncStorage.getItem('weatherData');
            console.log('Stored Weather Data:', storedWeatherData);
          } catch (error) {
            console.error('Error fetching weather data:', error);
          }
        }
      };

      fetchWeatherData();
      intervalId = setInterval(fetchWeatherData, 600000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selectedLocation, onSelect]);

  const searchLocation = async (text: string) => {
    setQuery(text);
    onChangeQuery(text.length > 0);
    if (text.length > 2) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${text}&format=json&addressdetails=1`,
        );
        setResults(response.data);
      } catch (error) {
        console.error(error);
      }
    } else {
      setResults([]);
    }
  };

  const handleSelect = async (item: Location) => {
    const locality =
      item.address.village || item.address.town || item.address.city;
    if (locality) {
      try {
        const weatherData = await getWeather(locality);
        setSelectedLocation({...item});
        setWeatherData({...weatherData});
        onSelect({...item}, {...weatherData});
        await AsyncStorage.setItem(
          'selectedLocation',
          JSON.stringify({...item}),
        );
        await AsyncStorage.setItem(
          'weatherData',
          JSON.stringify({...weatherData}),
        );
        const storedWeatherData = await AsyncStorage.getItem('weatherData');
        console.log('Stored Weather Data:', storedWeatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        onSelect({...item}, null);
      }
    } else {
      onSelect({...item}, null);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={searchLocation}
          placeholder="Cari lokasi"
        />
        <FlatList
          data={results}
          keyExtractor={item => item.place_id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleSelect(item)}>
              <Text style={styles.itemText}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp('95%'),
    height: hp('80%'),
    paddingVertical: hp('2%'),
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  itemText: {
    color: Color.GREY,
    padding: 10,
    borderBottomColor: Color.GREY,
    borderBottomWidth: 1,
  },
});

export default LocationSearch;
