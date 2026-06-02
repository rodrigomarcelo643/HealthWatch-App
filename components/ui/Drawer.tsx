import { View, Text, TouchableOpacity, Dimensions, Animated, Image, Modal } from 'react-native';
import { useState } from 'react';
import { Users, LogOut, AlertTriangle, Phone, Briefcase, Megaphone, UserCheck, Award, X, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../../context';
import { useAnnouncements } from '../../context/AnnouncementContext';

const { width } = Dimensions.get('window');

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  drawerAnim: Animated.Value;
  onNavigateToAnnouncements?: () => void;
  onNavigateToCommunity?: () => void;
  onNavigateToOutbreaks?: () => void;
  onNavigateToBHWDirectory?: () => void;
  onNavigateToEmergencyContacts?: () => void;
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  badge?: number;
  isDanger?: boolean;
}

const MenuItem = ({ icon, label, onPress, badge, isDanger }: MenuItemProps) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 4
    }}
  >
    <View style={{ width: 24, marginRight: 16 }}>
      {icon}
    </View>
    <Text style={{ 
      flex: 1, 
      fontSize: 15, 
      fontWeight: '500',
      color: isDanger ? '#DC2626' : '#374151'
    }}>
      {label}
    </Text>
    {badge ? (
      <View style={{ 
        backgroundColor: '#EF4444', 
        borderRadius: 12, 
        minWidth: 24, 
        height: 24, 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingHorizontal: 6
      }}>
        <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>
          {badge > 99 ? '99+' : badge}
        </Text>
      </View>
    ) : (
      <ChevronRight size={18} color="#D1D5DB" strokeWidth={1.5} />
    )}
  </TouchableOpacity>
);

export const Drawer = ({ 
  isOpen, 
  onClose, 
  drawerAnim, 
  onNavigateToAnnouncements, 
  onNavigateToCommunity, 
  onNavigateToOutbreaks, 
  onNavigateToBHWDirectory, 
  onNavigateToEmergencyContacts 
}: DrawerProps) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useAnnouncements();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  return (
    <>
      {/* Overlay - only show when open */}
      {isOpen && (
        <TouchableOpacity 
          activeOpacity={1}
          onPress={onClose}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.4)', 
            zIndex: 100 
          }}
        />
      )}

      {/* Drawer - always rendered but positioned off-screen when closed */}
      <Animated.View 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          bottom: 0, 
          width: width * 0.70, 
          backgroundColor: '#FFFFFF',
          // CRITICAL FIX: Push drawer completely off-screen when closed
          transform: [{ translateX: drawerAnim }],
          zIndex: 101,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 8
        }}
      >
        {/* Close Button */}
        <TouchableOpacity 
          onPress={onClose}
          style={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            zIndex: 1,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(0,0,0,0.05)',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>

        {/* Profile Section */}
        <View style={{ 
          paddingTop: 60,
          paddingBottom: 24,
          paddingHorizontal: 20,
          backgroundColor: '#F8FAFC'
        }}>
          <View style={{ alignItems: 'center' }}>
            {user?.documents?.selfieUrl ? (
              <Image 
                source={{ uri: user.documents.selfieUrl }} 
                style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 12 }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ 
                backgroundColor: '#1B365D', 
                borderRadius: 40, 
                width: 80, 
                height: 80, 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: 12
              }}>
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 32 }}>
                  {user?.firstName?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
            
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 4 }}>
              {user?.firstName} {user?.lastName}
            </Text>
            
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              backgroundColor: '#E5E7EB',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 20
            }}>
              <Briefcase size={14} color="#6B7280" strokeWidth={2} />
              <Text style={{ color: '#6B7280', fontSize: 12, marginLeft: 6 }}>
                {user?.communityRole || 'Resident'}
              </Text>
            </View>
          </View>

          {/* Trust Score */}
          <View style={{ 
            marginTop: 20, 
            backgroundColor: 'white', 
            borderRadius: 16, 
            padding: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Award size={16} color="#F59E0B" strokeWidth={2} />
                <Text style={{ color: '#374151', fontSize: 13, fontWeight: '600', marginLeft: 8 }}>Trust Score</Text>
              </View>
              <Text style={{ color: '#1B365D', fontWeight: '800', fontSize: 18 }}>85</Text>
            </View>
            <View style={{ backgroundColor: '#F3F4F6', height: 6, borderRadius: 3, overflow: 'hidden' }}>
              <View style={{ width: '85%', height: '100%', backgroundColor: '#F59E0B', borderRadius: 3 }} />
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={{ flex: 1, paddingHorizontal: 12, paddingTop: 20 }}>
          <MenuItem 
            icon={<Megaphone size={20} color="#1B365D" strokeWidth={2} />}
            label="Announcements"
            onPress={onNavigateToAnnouncements}
            badge={unreadCount}
          />

          <MenuItem 
            icon={<Users size={20} color="#1B365D" strokeWidth={2} />}
            label="Community"
            onPress={onNavigateToCommunity}
          />

          <MenuItem 
            icon={<AlertTriangle size={20} color="#1B365D" strokeWidth={2} />}
            label="Recent Outbreaks"
            onPress={onNavigateToOutbreaks}
          />

          <MenuItem 
            icon={<UserCheck size={20} color="#1B365D" strokeWidth={2} />}
            label="BHW Directory"
            onPress={onNavigateToBHWDirectory}
          />

          <MenuItem 
            icon={<Phone size={20} color="#1B365D" strokeWidth={2} />}
            label="Emergency Contacts"
            onPress={onNavigateToEmergencyContacts}
          />

          <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 16, marginHorizontal: 8 }} />

          <MenuItem 
            icon={<LogOut size={20} color="#DC2626" strokeWidth={2} />}
            label="Logout"
            onPress={() => setShowLogoutModal(true)}
            isDanger
          />
        </View>

        {/* Footer */}
        <View style={{ 
          paddingVertical: 20, 
          alignItems: 'center',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6'
        }}>
          <Text style={{ color: '#9CA3AF', fontSize: 11 }}>
            Version 1.0.0
          </Text>
        </View>
      </Animated.View>

      {/* Logout Confirmation Modal */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: 20 
        }}>
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 20, 
            padding: 24, 
            width: '100%', 
            maxWidth: 320,
            alignItems: 'center'
          }}>
            <View style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 24, 
              backgroundColor: '#FEE2E2', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: 16 
            }}>
              <AlertTriangle size={24} color="#DC2626" strokeWidth={2} />
            </View>
            
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 8 }}>
              Sign Out
            </Text>
            
            <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 }}>
              Are you sure you want to sign out?
            </Text>
            
            <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
              <TouchableOpacity 
                onPress={() => setShowLogoutModal(false)} 
                style={{ 
                  flex: 1, 
                  backgroundColor: '#F3F4F6', 
                  borderRadius: 12, 
                  paddingVertical: 12, 
                  alignItems: 'center' 
                }}
              >
                <Text style={{ color: '#4B5563', fontSize: 15, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleLogout} 
                style={{ 
                  flex: 1, 
                  backgroundColor: '#DC2626', 
                  borderRadius: 12, 
                  paddingVertical: 12, 
                  alignItems: 'center' 
                }}
              >
                <Text style={{ color: 'white', fontSize: 15, fontWeight: '600' }}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};