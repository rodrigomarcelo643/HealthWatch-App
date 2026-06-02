import { View, Text, Image, ScrollView, Animated } from 'react-native';
import { Button } from '../components/ui';
import { Clock, User, Mail, Phone, MapPin, FileText } from 'lucide-react-native';
import { useAuth } from '../context';
import { useState, useEffect, useRef } from 'react';

interface PendingApprovalScreenProps {
  onBackToLogin: () => void;
}
// Skeleton Load UI
const SkeletonLoader = () => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <Animated.View 
      style={{ 
        width: '100%', 
        height: 150, 
        backgroundColor: '#e5e7eb', 
        borderRadius: 8,
        opacity 
      }} 
    />
  );
};

export const PendingApprovalScreen = ({ onBackToLogin }: PendingApprovalScreenProps) => {
  const { user, logout } = useAuth();
  const [idLoaded, setIdLoaded] = useState(false);
  const [selfieLoaded, setSelfieLoaded] = useState(false);

  const handleLogout = async () => {
    await logout();
    onBackToLogin();
  };

  if (!user) return null;

  return (
    <ScrollView className="flex-1 bg-white">
      {/** Parent Display of Approval Section */}
      <View className="px-6 py-8">
        <View className="items-center mb-8">
          <View className="bg-yellow-100 rounded-full p-6 mb-4">
            <Clock size={64} color="#F59E0B" />
          </View>
          
          <Text className="text-2xl font-semibold text-[#1B365D] text-center mb-2" style={{ fontFamily: 'Inter-SemiBold' }}>
            Account Pending Approval
          </Text>
          
          <Text className="text-base text-gray-600 text-center" style={{ fontFamily: 'Inter-Medium' }}>
            Your account is under review by our administrators
          </Text>
        </View>

        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <Text className="text-lg font-semibold text-[#1B365D] mb-4" style={{ fontFamily: 'Inter-SemiBold' }}>
            Personal Information
          </Text>
          
          <View className="mb-3 flex-row items-center">
            <User size={20} color="#6b7280" />
            <View className="ml-3 flex-1">
              <Text className="text-sm text-gray-500" style={{ fontFamily: 'Inter-Medium' }}>Full Name</Text>
              <Text className="text-base text-gray-800" style={{ fontFamily: 'Inter-SemiBold' }}>
                {user.firstName} {user.middleInitial && `${user.middleInitial}. `}{user.lastName}
              </Text>
            </View>
          </View>

          <View className="mb-3 flex-row items-center">
            <Phone size={20} color="#6b7280" />
            <View className="ml-3 flex-1">
              <Text className="text-sm text-gray-500" style={{ fontFamily: 'Inter-Medium' }}>Contact Number</Text>
              <Text className="text-base text-gray-800" style={{ fontFamily: 'Inter-SemiBold' }}>
                {user.contactNumber}
              </Text>
            </View>
          </View>

          <View className="mb-3 flex-row items-center">
            <Mail size={20} color="#6b7280" />
            <View className="ml-3 flex-1">
              <Text className="text-sm text-gray-500" style={{ fontFamily: 'Inter-Medium' }}>Email</Text>
              <Text className="text-base text-gray-800" style={{ fontFamily: 'Inter-SemiBold' }}>
                {user.email}
              </Text>
            </View>
          </View>

          <View className="flex-row items-start">
            <MapPin size={20} color="#6b7280" style={{ marginTop: 2 }} />
            <View className="ml-3 flex-1">
              <Text className="text-sm text-gray-500" style={{ fontFamily: 'Inter-Medium' }}>Address</Text>
              <Text className="text-base text-gray-800" style={{ fontFamily: 'Inter-SemiBold' }}>
                {user.address.barangay}, {user.address.municipality}, {user.address.region}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <Text className="text-lg font-semibold text-[#1B365D] mb-4" style={{ fontFamily: 'Inter-SemiBold' }}>
            Document Verification
          </Text>
          
          <View className="mb-3 flex-row items-center">
            <FileText size={20} color="#6b7280" />
            <View className="ml-3 flex-1">
              <Text className="text-sm text-gray-500" style={{ fontFamily: 'Inter-Medium' }}>ID Type</Text>
              <Text className="text-base text-gray-800" style={{ fontFamily: 'Inter-SemiBold' }}>
                {user.documents.idType}
              </Text>
            </View>
          </View>

          <View className="mb-3">
            <Text className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'Inter-Medium' }}>Valid ID</Text>
            {!idLoaded && <SkeletonLoader />}
            <Image 
              source={{ uri: user.documents.validIdUrl }} 
              style={{ width: '100%', height: 150, borderRadius: 8, display: idLoaded ? 'flex' : 'none' }}
              resizeMode="cover"
              onLoadStart={() => setIdLoaded(false)}
              onLoad={() => setIdLoaded(true)}
            />
          </View>

          <View>
            <Text className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'Inter-Medium' }}>Selfie</Text>
            {!selfieLoaded && <SkeletonLoader />}
            <Image 
              source={{ uri: user.documents.selfieUrl }} 
              style={{ width: '100%', height: 150, borderRadius: 8, display: selfieLoaded ? 'flex' : 'none' }}
              resizeMode="cover"
              onLoadStart={() => setSelfieLoaded(false)}
              onLoad={() => setSelfieLoaded(true)}
            />
          </View>
        </View>

        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <Text className="text-sm text-blue-800" style={{ fontFamily: 'Inter-Medium' }}>
            ℹ️ You will receive a notification once your account has been reviewed. This process typically takes 1-3 business days.
          </Text>
        </View>

        <Button variant="primary" size="lg" onPress={handleLogout}>
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};
