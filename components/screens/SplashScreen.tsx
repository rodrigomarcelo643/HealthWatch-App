import { View, Image, ActivityIndicator, Dimensions, Platform, StatusBar } from 'react-native';
import { useEffect, useState } from 'react';

const { width, height } = Dimensions.get('window');

export const SplashScreen = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Ensure splash screen shows for minimum duration
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View 
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
      }}
    >
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={{ alignItems: 'center' }}>
        <Image
          source={require('../../assets/logo/logo_main.png')}
          style={{
            width: Math.min(width * 0.6, 200),
            height: Math.min(width * 0.6, 200),
            marginBottom: 20,
          }}
          resizeMode="contain"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
        {imageLoaded && (
          <ActivityIndicator 
            size="large" 
            color="#1B365D" 
            style={{ marginTop: -10 }}
          />
        )}
      </View>
    </View>
  );
};
