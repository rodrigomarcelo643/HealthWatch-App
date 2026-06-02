import { View, Text, Image, TouchableOpacity, TextInput, Animated, Modal, ActivityIndicator } from 'react-native';
import { Input, Button } from '../components/ui';
import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Lock, WifiOff } from 'lucide-react-native';
import { loginWithContactNumber } from '../services';
import { useAuth } from '../context';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onNavigateToPending: () => void;
  onNavigateToForgotPassword: () => void;
}

export const LoginScreen = ({ onNavigateToRegister, onNavigateToPending, onNavigateToForgotPassword }: LoginScreenProps) => {
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSigningInModal, setShowSigningInModal] = useState(false);
  const [showNetworkErrorModal, setShowNetworkErrorModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const { setUser } = useAuth();

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
      setContactNumber(cleaned.substring(1, 11));
    } else if (cleaned.length <= 10) {
      setContactNumber(cleaned);
    }
  };

  const handleLogin = async () => {
    if (contactNumber.length !== 10) { 
      setErrorMessage('Please enter a valid 11-digit contact number');
      setShowErrorModal(true);
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      setShowErrorModal(true);
      return;
    }
    
    setShowSigningInModal(true);
    try {
      const userData = await loginWithContactNumber(contactNumber, password);
      
      await setUser(userData);
      
      setTimeout(() => {
        setShowSigningInModal(false);
        if (userData.status === 'pending') {
          onNavigateToPending();
        } else if (userData.status === 'rejected') {
         // Alert.alert('Account Rejected', 'Your account has been rejected. Please contact support.');
        }
        // If approved, App.tsx will automatically show HomeScreen via useAuth
      }, 500);
    } catch (error: any) {
      setShowSigningInModal(false);
      if (error.message.includes('Network error')) {
        setShowNetworkErrorModal(true);
      } else {
        setErrorMessage(error.message || 'Invalid credentials');
        setShowErrorModal(true);
      }
    }
  };

  const handleForgotPassword = () => {
    onNavigateToForgotPassword();
  };

  const handleRegister = () => {
    onNavigateToRegister();
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <Animated.View 
        className="mb-4 items-center"
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        <Image
          source={require('../assets/logo/logo_main.png')}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View 
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        <View className="mb-3">
         
          <View className="flex-row items-center rounded-xl border-2 border-gray-300 bg-white px-4">
            <Text className="mr-2 text-2xl">🇵🇭</Text>
            <Text
              className="mr-2 font-medium text-base text-gray-500"
              style={{ fontFamily: 'Inter-Medium' }}>
              +63 
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
          secureTextEntry={!showPassword}
          icon={<Lock size={20} color="#6b7280" />}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <Eye size={20} color="#6b7280" />
              ) : (
                <EyeOff size={20} color="#6b7280" />
              )}
            </TouchableOpacity>
          }
        />
        <Button
          variant="primary"
          size="lg"
          onPress={handleLogin}
          className="mt-6">
          Sign In
        </Button>
        <TouchableOpacity onPress={handleForgotPassword} className="mt-6 items-center">
          <Text
            className="font-semibold text-lg text-[#3c86e7ff]"
            style={{ textDecorationLine: 'underline' , marginTop: 10}}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <View className="mt-6 flex-row items-center justify-center" style={{ marginTop: 15 }}>
          <Text className="text-lg text-gray-600"   style={{ fontFamily: 'Inter-Medium' }}>Become a Resident? </Text>
          <TouchableOpacity onPress={handleRegister} >
            <Text
              className="font-semibold text-lg text-[#3c86e7ff]"
              style={{ textDecorationLine: 'underline' }}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Modal
        visible={showErrorModal}
        transparent
        animationType="fade"
      >
        <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="bg-white rounded-2xl  items-center" style={{ width: '100%', maxWidth: 320, padding: 10, borderRadius: 10   }}>
            <View className="bg-red-100 rounded-full p-4 mb-4">
              <Lock size={48} color="#EF4444" />
            </View>
            <Text className="text-xl font-semibold text-[#1B365D] mb-2" style={{ fontFamily: 'Inter-SemiBold' }}>
              Login Failed
            </Text>
            <Text className="text-sm text-gray-600 text-center mb-6" style={{ fontFamily: 'Inter-Medium' }}>
              {errorMessage}
            </Text>
            <Button 
              variant="primary" 
              size="lg" 
              onPress={() => setShowErrorModal(false)}
              style={{ width: '100%' }}
            >
              Try Again
            </Button>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSigningInModal}
        transparent
        animationType="fade"
      >
        <View className="flex-1  justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="bg-white rounded-2xl p-8 items-center" style={{ width: 280 }}>
            <ActivityIndicator size="large" color="#1B365D" />
            <Text className="text-lg font-semibold text-[#1B365D] mt-4" style={{ fontFamily: 'Inter-SemiBold' }}>
              Signing In...
            </Text>
            <Text className="text-sm text-gray-600 mt-2 text-center" style={{ fontFamily: 'Inter-Medium' }}>
              Please wait
            </Text>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showNetworkErrorModal}
        transparent
        animationType="fade"
      >
        <View className="flex-1 p-5  justify-center items-center px-6" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="bg-white rounded-2xl p-6 items-center" style={{ width: '100%', maxWidth: 320 }}>
            <View className="bg-red-100 rounded-full p-4 mb-4">
              <WifiOff size={48} color="#EF4444" />
            </View>
            <Text className="text-xl font-semibold text-[#1B365D] mb-2" style={{ fontFamily: 'Inter-SemiBold' }}>
              Network Error
            </Text>
            <Text className="text-sm text-gray-600 text-center mb-6" style={{ fontFamily: 'Inter-Medium' }}>
              Please check your internet connection and try again.
            </Text>
            <Button 
              variant="primary" 
              size="lg" 
              onPress={() => setShowNetworkErrorModal(false)}
              style={{ width: '100%' }}
            >
              Try Again
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};
