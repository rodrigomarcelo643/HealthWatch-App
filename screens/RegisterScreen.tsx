import { View, Text, Image, TouchableOpacity, TextInput, Animated, ScrollView } from 'react-native';
import { Input, Button } from '../components/ui';
import { useState, useEffect, useRef } from 'react';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export const RegisterScreen = ({ onNavigateToLogin }: RegisterScreenProps) => {
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContactChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      setContactNumber(cleaned.substring(1));
    } else if (cleaned.length <= 10) {
      setContactNumber(cleaned);
    }
  };

  const handleRegister = () => {
    console.log('Register:', '+63' + contactNumber, fullName, password);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6 py-12">
        <Animated.View 
          className="mb-4 items-center"
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <Image
            source={require('../assets/logo/logo.png')}
            style={{ width: 150, height: 150 }}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View 
          style={{ marginBottom: -20, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          
          <View className="mb-3">
            <View className="flex-row items-center rounded-xl border-2 border-gray-300 bg-white px-4">
              <Text className="mr-2 text-2xl">🇵🇭</Text>
              <Text
                className="mr-2 font-medium text-base text-gray-300"
                style={{ fontFamily: 'Inter-Medium' }}>
                +63 | 
              </Text>
              <View className="mr-2 h-6 w-px bg-gray-300" />
              <TextInput
                className="flex-1 text-base text-gray-800"
                style={{ paddingVertical: 16, fontFamily: 'Inter-Medium' }}
                placeholder="9XX XXX XXXX"
                value={contactNumber}
                onChangeText={handleContactChange}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Button
            variant="primary"
            size="lg"
            onPress={handleRegister}
            className="mt-4"
            disabled={contactNumber.length !== 10 || !fullName || !password || !confirmPassword}
          >
            Register
          </Button>

          <View className="mt-4 flex-row items-center justify-center">
            <Text className="text-lg text-gray-600" style={{ fontFamily: 'Inter-Medium' }}>Already have an account? </Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text
                className="font-semibold text-lg text-[#3c86e7ff]"
                style={{ textDecorationLine: 'underline' }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
};
