import { View, Text, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context';
import { Mail, Phone, MapPin, FileText, Camera, LogOut, Shield, AlertTriangle, X, Users, BadgeCheck, QrCode } from 'lucide-react-native';

interface ProfileTabProps {
  navigation?: any;
}

export const ProfileTab = ({ navigation }: ProfileTabProps) => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  const getStatusColor = () => {
    switch(user?.status) {
      case 'approved': return { bg: '#DCFCE7', text: '#16A34A' };
      case 'pending': return { bg: '#FEF3C7', text: '#D97706' };
      case 'rejected': return { bg: '#FEE2E2', text: '#DC2626' };
      default: return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const statusColors = getStatusColor();

  if (!user) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <View style={{ backgroundColor: '#3c86e7ff', paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 16 }} />
            <View style={{ width: 180, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 12 }} />
            <View style={{ width: 100, height: 26, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.3)' }} />
          </View>
        </View>
        <View style={{ padding: 20, marginTop: -20 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
            <View style={{ width: 150, height: 20, borderRadius: 10, backgroundColor: '#E5E7EB', marginBottom: 16 }} />
            {[1, 2, 3].map(i => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: i < 3 ? 1 : 0, borderBottomColor: '#F3F4F6' }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E5E7EB' }} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <View style={{ width: 80, height: 10, borderRadius: 5, backgroundColor: '#E5E7EB', marginBottom: 6 }} />
                  <View style={{ width: 140, height: 12, borderRadius: 6, backgroundColor: '#E5E7EB' }} />
                </View>
              </View>
            ))}
          </View>
          <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
            <View style={{ width: 150, height: 20, borderRadius: 10, backgroundColor: '#E5E7EB', marginBottom: 16 }} />
            <View style={{ width: '100%', height: 160, borderRadius: 12, backgroundColor: '#E5E7EB', marginBottom: 16 }} />
            <View style={{ width: '100%', height: 160, borderRadius: 12, backgroundColor: '#E5E7EB' }} />
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#3c86e7ff', paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, position: 'relative' }}>
        {/* QR Code Button - Top Right */}
        <TouchableOpacity 
          onPress={() => navigation?.navigate('qr')}
          style={{ position: 'absolute', top: 60, right: 20, alignItems: 'center' }}
        >
          <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>
            <QrCode size={20} color="white" strokeWidth={2} />
          </View>
          <Text style={{ color: 'white', fontSize: 10, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>My QR</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          {user?.documents?.selfieUrl ? (
            <Image 
              source={{ uri: user.documents.selfieUrl }} 
              style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: 'white', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8,  }}
              resizeMode="cover"
            />
          ) : (
            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 }}>
              <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#1B365D', fontFamily: 'Inter-SemiBold' }}>
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </Text>
            </View>
          )}
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', fontFamily: 'Inter-SemiBold', textAlign: 'center' }}>
            {user?.firstName} {user?.middleInitial}. {user?.lastName}
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
            {user?.communityRole && (
              <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}>
                <Users size={14} color="#FCD34D" strokeWidth={2} />
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
                  {user.communityRole}
                </Text>
              </View>
            )}
            
            <View style={{ backgroundColor: statusColors.bg, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {user?.status === 'approved' && <BadgeCheck size={16} color={statusColors.text} strokeWidth={2.5} />}
              <Text style={{ color: statusColors.text, fontSize: 13, fontWeight: '700', fontFamily: 'Inter-SemiBold' }}>
                {user?.status === 'approved' ? 'Verified' : user?.status?.charAt(0).toUpperCase() + user?.status?.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ padding: 20, marginTop: -20 }}>
        {/* Personal Details */}
        <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Shield size={20} color="#1B365D" strokeWidth={2} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1B365D', marginLeft: 8, fontFamily: 'Inter-SemiBold' }}>Personal Details</Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={18} color="#3B82F6" strokeWidth={2} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter-Medium', marginBottom: 2 }}>Email Address</Text>
              <Text style={{ fontSize: 14, color: '#1F2937', fontFamily: 'Inter-SemiBold' }}>{user?.email}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={18} color="#16A34A" strokeWidth={2} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter-Medium', marginBottom: 2 }}>Contact Number</Text>
              <Text style={{ fontSize: 14, color: '#1F2937', fontFamily: 'Inter-SemiBold' }}>{user?.contactNumber}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingTop: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={18} color="#D97706" strokeWidth={2} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter-Medium', marginBottom: 2 }}>Address</Text>
              <Text style={{ fontSize: 14, color: '#1F2937', fontFamily: 'Inter-SemiBold' }}>
                {user?.address?.barangay}, {user?.address?.municipality}
              </Text>
              <Text style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter-Medium', marginTop: 2 }}>
                {user?.address?.region}
              </Text>
            </View>
          </View>
        </View>

        {/* Verified Documents */}
        <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <FileText size={20} color="#1B365D" strokeWidth={2} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1B365D', marginLeft: 8, fontFamily: 'Inter-SemiBold' }}>Verified Documents</Text>
          </View>
          
          <View style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter-Medium', marginBottom: 4 }}>ID Type</Text>
            <Text style={{ fontSize: 14, color: '#1F2937', fontFamily: 'Inter-SemiBold' }}>{user?.documents?.idType}</Text>
          </View>

          {user?.documents?.validIdUrl && (
            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <FileText size={16} color="#6B7280" strokeWidth={2} />
                <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 6, fontFamily: 'Inter-SemiBold' }}>Valid ID</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedImage(user.documents.validIdUrl)}>
                <Image 
                  source={{ uri: user.documents.validIdUrl }} 
                  style={{ width: '100%', height: 160, borderRadius: 12, backgroundColor: '#F3F4F6' }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          )}

          {user?.documents?.selfieUrl && (
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Camera size={16} color="#6B7280" strokeWidth={2} />
                <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 6, fontFamily: 'Inter-SemiBold' }}>Selfie with ID</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedImage(user.documents.selfieUrl)}>
                <Image 
                  source={{ uri: user.documents.selfieUrl }} 
                  style={{ width: '100%', height: 160, borderRadius: 12, backgroundColor: '#F3F4F6' }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          onPress={() => setShowLogoutModal(true)}
          style={{ backgroundColor: '#DC2626', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#DC2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3, marginBottom: 20 }}
        >
          <LogOut size={20} color="white" strokeWidth={2} />
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700', marginLeft: 8, fontFamily: 'Inter-SemiBold' }}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Image Viewer Modal */}
      <Modal visible={!!selectedImage} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setSelectedImage(null)} style={{ position: 'absolute', top: 50, right: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 8 }}>
            <X size={24} color="white" strokeWidth={2} />
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={{ width: '90%', height: '70%', borderRadius: 12 }} resizeMode="contain" />
          )}
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 }}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <AlertTriangle size={28} color="#DC2626" strokeWidth={2} />
              </View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937', fontFamily: 'Inter-SemiBold', marginBottom: 8 }}>Logout Confirmation</Text>
              <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', fontFamily: 'Inter-Medium' }}>Are you sure you want to logout?</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity onPress={() => setShowLogoutModal(false)} style={{ flex: 1, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 14, alignItems: 'center' }}>
                <Text style={{ color: '#4B5563', fontSize: 15, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} style={{ flex: 1, backgroundColor: '#DC2626', borderRadius: 12, padding: 14, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 15, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
