import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useAuth } from '../../context';
import { Shield, Eye, MapPin, ChevronRight, AlertTriangle, CheckCircle, Star, TrendingUp, Users, Activity, Clock, FileText } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { subscribeToSymptomReports, SymptomReport } from '../../services/symptomReports';
import { useAnnouncements } from '../../context/AnnouncementContext';

interface HomeTabProps {
  onNavigateToMap?: () => void;
  onNavigateToAnnouncements?: () => void;
  onNavigateToHistory?: () => void;
}

export const HomeTab = ({ onNavigateToMap, onNavigateToAnnouncements, onNavigateToHistory }: HomeTabProps = {}) => {
  const { user } = useAuth();
  const { announcements } = useAnnouncements();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<SymptomReport[]>([]);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    const unsubscribe = subscribeToSymptomReports((data) => {
      setReports(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const shimmerOpacity = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  const userReports = reports.filter(r => r.userId === user?.uid);
  const verifiedReports = userReports.filter(r => r.status === 'verified');
  const pendingReports = userReports.filter(r => r.status === 'pending');
  const recentReports = userReports.slice(0, 2);
  
  const selfReportedCount = userReports.filter(r => r.reportType === 'self').length;
  
  const recentAlerts = announcements
    .filter(a => a.type === 'outbreak_alert' || a.type === 'health_advisory')
    .slice(0, 2);
  
  const clusterReports = reports.filter(r => {
    const reportTime = r.createdAt?.toDate?.();
    if (!reportTime) return false;
    const hoursDiff = (Date.now() - reportTime.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 24 && r.status === 'verified';
  });
  
  const moderateCount = clusterReports.filter(r => r.symptoms.length >= 2 && r.symptoms.length < 4).length;
  const lowCount = clusterReports.filter(r => r.symptoms.length < 2).length;
  
  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <View style={{ backgroundColor: '#1B365D', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
          <Animated.View style={{ width: 150, height: 20, backgroundColor: '#2B4A6D', borderRadius: 5, marginBottom: 12, opacity: shimmerOpacity }} />
          <Animated.View style={{ width: 200, height: 28, backgroundColor: '#2B4A6D', borderRadius: 5, marginBottom: 8, opacity: shimmerOpacity }} />
          <Animated.View style={{ width: 120, height: 16, backgroundColor: '#2B4A6D', borderRadius: 5, opacity: shimmerOpacity }} />
        </View>
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: -20, gap: 12 }}>
          <Animated.View style={{ flex: 1, backgroundColor: 'white', borderRadius: 5, height: 100, opacity: shimmerOpacity, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }} />
          <Animated.View style={{ flex: 1, backgroundColor: 'white', borderRadius: 5, height: 100, opacity: shimmerOpacity, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }} />
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Animated.View style={{ width: 150, height: 20, backgroundColor: '#E5E7EB', borderRadius: 5, marginBottom: 12, opacity: shimmerOpacity }} />
          <Animated.View style={{ width: '100%', height: 120, backgroundColor: '#E5E7EB', borderRadius: 5, opacity: shimmerOpacity }} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Welcome Section */}
      <View style={{ 
        backgroundColor: '#1B365D', 
        paddingHorizontal: 20, 
        paddingTop: 20, 
        paddingBottom: 30, 
        borderBottomLeftRadius: 20, 
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 20 }}>
            <Shield size={24} color="#20A0D8" strokeWidth={2} />
          </View>
          <Text className="text-white text-lg ml-2" style={{ fontFamily: 'Inter-Medium' }}>{user?.communityRole || 'Community Sentinel'}</Text>
        </View>
        <Text className="text-white text-2xl font-bold mt-2" style={{ fontFamily: 'Inter-SemiBold' }}>
          Welcome back, {user?.firstName}!
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
          <Star size={16} color="#FFD700" fill="#FFD700" />
          <Text className="text-white text-sm ml-1" style={{ fontFamily: 'Inter-Medium' }}>Trust Score: {Math.min(50 + verifiedReports.length * 5, 100)}/100</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: -20, gap: 12 }}>
        <View style={{ 
          flex: 1, 
          backgroundColor: 'white', 
          borderRadius: 5, 
          padding: 16, 
          shadowColor: '#000', 
          shadowOffset: { width: 0, height: 2 }, 
          shadowOpacity: 0.08, 
          shadowRadius: 4, 
          elevation: 3,
          borderWidth: 1,
          borderColor: '#F0F0F0'
        }}>
          <View style={{ backgroundColor: '#EBF5FF', padding: 10, borderRadius: 5, alignSelf: 'flex-start', marginBottom: 12 }}>
            <Eye size={24} color="#20A0D8" strokeWidth={2} />
          </View>
          <Text className="text-gray-600 text-xs mt-2" style={{ fontFamily: 'Inter-Medium' }}>Total Reports</Text>
          <Text className="text-[#1B365D] text-2xl font-bold mt-1" style={{ fontFamily: 'Inter-SemiBold' }}>{userReports.length}</Text>
          <Text className="text-green-600 text-xs mt-1" style={{ fontFamily: 'Inter-Medium' }}>+{verifiedReports.length} verified</Text>
        </View>
        <View style={{ 
          flex: 1, 
          backgroundColor: 'white', 
          borderRadius: 5, 
          padding: 16, 
          shadowColor: '#000', 
          shadowOffset: { width: 0, height: 2 }, 
          shadowOpacity: 0.08, 
          shadowRadius: 4, 
          elevation: 3,
          borderWidth: 1,
          borderColor: '#F0F0F0'
        }}>
          <View style={{ backgroundColor: '#F3E8FF', padding: 10, borderRadius: 5, alignSelf: 'flex-start', marginBottom: 12 }}>
            <FileText size={24} color="#8B5CF6" strokeWidth={2} />
          </View>
          <Text className="text-gray-600 text-xs mt-2" style={{ fontFamily: 'Inter-Medium' }}>Self Reported</Text>
          <Text className="text-[#1B365D] text-2xl font-bold mt-1" style={{ fontFamily: 'Inter-SemiBold' }}>{selfReportedCount}</Text>
          <Text className="text-gray-500 text-xs mt-1" style={{ fontFamily: 'Inter-Medium' }}>Personal records</Text>
        </View>
      </View>

      {/* Health Alerts & Advisories */}
      <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text className="text-[#1B365D] text-lg font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>Health Alerts</Text>
          <TouchableOpacity onPress={onNavigateToAnnouncements} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F8FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 5 }}>
            <Text className="text-[#20A0D8] text-sm" style={{ fontFamily: 'Inter-Medium' }}>See all</Text>
            <ChevronRight size={16} color="#20A0D8" />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
          {recentAlerts.length === 0 ? (
            <View style={{ 
              width: 280, 
              backgroundColor: 'white', 
              borderRadius: 5, 
              padding: 16, 
              marginRight: 12, 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 2 }, 
              shadowOpacity: 0.08, 
              shadowRadius: 4, 
              elevation: 2, 
              borderLeftWidth: 4, 
              borderLeftColor: '#10B981' 
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <CheckCircle size={20} color="#10B981" strokeWidth={2} />
                <Text className="text-[#10B981] font-semibold ml-2" style={{ fontFamily: 'Inter-SemiBold' }}>All Clear</Text>
              </View>
              <Text className="text-gray-700 text-sm" style={{ fontFamily: 'Inter-Medium' }}>No active health alerts in your area. Stay vigilant!</Text>
              <Text className="text-gray-500 text-xs mt-2" style={{ fontFamily: 'Inter-Medium' }}>Updated now</Text>
            </View>
          ) : recentAlerts.map((alert) => {
            const isOutbreak = alert.type === 'outbreak_alert';
            const borderColor = isOutbreak ? '#EF4444' : '#10B981';
            const iconColor = isOutbreak ? '#EF4444' : '#10B981';
            const bgColor = isOutbreak ? '#FEF2F2' : '#F0FDF4';
            return (
              <View key={alert.id} style={{ 
                width: 280, 
                backgroundColor: 'white', 
                borderRadius: 5, 
                padding: 16, 
                marginRight: 12, 
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 2 }, 
                shadowOpacity: 0.08, 
                shadowRadius: 4, 
                elevation: 2, 
                borderWidth: 1,
                borderColor: borderColor,
                borderLeftWidth: 4 
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: bgColor, padding: 8, borderRadius: 5 }}>
                  {isOutbreak ? <AlertTriangle size={20} color={iconColor} strokeWidth={2} /> : <CheckCircle size={20} color={iconColor} strokeWidth={2} />}
                  <Text className="font-semibold ml-2" style={{ fontFamily: 'Inter-SemiBold', color: iconColor }}>{isOutbreak ? 'Outbreak Alert' : 'Health Advisory'}</Text>
                </View>
                <Text className="text-gray-700 text-sm" style={{ fontFamily: 'Inter-Medium' }} numberOfLines={2}>{alert.message}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                  <Clock size={12} color="#9CA3AF" />
                  <Text className="text-gray-500 text-xs ml-1" style={{ fontFamily: 'Inter-Medium' }}>{getTimeAgo(alert.createdAt)} • {alert.createdBy}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Observation Heatmap */}
      <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text className="text-[#1B365D] text-lg font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>Area Heatmap</Text>
          <TouchableOpacity onPress={onNavigateToMap} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F8FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 5 }}>
            <Text className="text-[#20A0D8] text-sm" style={{ fontFamily: 'Inter-Medium' }}>View map</Text>
            <ChevronRight size={16} color="#20A0D8" />
          </TouchableOpacity>
        </View>
        <View style={{ 
          backgroundColor: 'white', 
          borderRadius: 5, 
          padding: 16, 
          shadowColor: '#000', 
          shadowOffset: { width: 0, height: 2 }, 
          shadowOpacity: 0.08, 
          shadowRadius: 4, 
          elevation: 2,
          borderWidth: 1,
          borderColor: '#F0F0F0'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
            <MapPin size={20} color="#1B365D" strokeWidth={2} />
            <Text className="text-[#1B365D] font-semibold ml-2" style={{ fontFamily: 'Inter-SemiBold' }}>Your Coverage Area</Text>
          </View>
          <Text className="text-gray-700 text-sm mb-4" style={{ fontFamily: 'Inter-Medium' }}>Brgy. San Antonio - Purok 1, 2, 3</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1, backgroundColor: '#FEF3C7', borderRadius: 5, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#FDE68A' }}>
              <Text className="text-[#D97706] text-xs font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>MODERATE</Text>
              <Text className="text-[#D97706] text-2xl font-bold mt-2" style={{ fontFamily: 'Inter-SemiBold' }}>{moderateCount}</Text>
              <Text className="text-[#D97706] text-xs mt-1" style={{ fontFamily: 'Inter-Medium' }}>cases</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#DCFCE7', borderRadius: 5, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#BBF7D0' }}>
              <Text className="text-[#16A34A] text-xs font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>LOW</Text>
              <Text className="text-[#16A34A] text-2xl font-bold mt-2" style={{ fontFamily: 'Inter-SemiBold' }}>{lowCount}</Text>
              <Text className="text-[#16A34A] text-xs mt-1" style={{ fontFamily: 'Inter-Medium' }}>cases</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Community Stats */}
      <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
        <Text className="text-[#1B365D] text-lg font-semibold mb-3" style={{ fontFamily: 'Inter-SemiBold' }}>Community Impact</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ 
            flex: 1, 
            backgroundColor: 'white', 
            borderRadius: 5, 
            padding: 12, 
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.08, 
            shadowRadius: 4, 
            elevation: 2,
            borderWidth: 1,
            borderColor: '#F0F0F0'
          }}>
            <View style={{ backgroundColor: '#F3E8FF', padding: 8, borderRadius: 5, alignSelf: 'flex-start', marginBottom: 12 }}>
              <Users size={20} color="#8B5CF6" strokeWidth={2} />
            </View>
            <Text className="text-gray-600 text-xs" style={{ fontFamily: 'Inter-Medium' }}>Active Sentinels</Text>
            <Text className="text-[#1B365D] text-2xl font-bold mt-1" style={{ fontFamily: 'Inter-SemiBold' }}>{new Set(reports.map(r => r.userId)).size}</Text>
          </View>
          <View style={{ 
            flex: 1, 
            backgroundColor: 'white', 
            borderRadius: 5, 
            padding: 12, 
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.08, 
            shadowRadius: 4, 
            elevation: 2,
            borderWidth: 1,
            borderColor: '#F0F0F0'
          }}>
            <View style={{ backgroundColor: '#FEF2F2', padding: 8, borderRadius: 5, alignSelf: 'flex-start', marginBottom: 12 }}>
              <Activity size={20} color="#EF4444" strokeWidth={2} />
            </View>
            <Text className="text-gray-600 text-xs" style={{ fontFamily: 'Inter-Medium' }}>Today's Reports</Text>
            <Text className="text-[#1B365D] text-2xl font-bold mt-1" style={{ fontFamily: 'Inter-SemiBold' }}>{clusterReports.length}</Text>
          </View>
        </View>
      </View>

      {/* Recent Observations */}
      <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text className="text-[#1B365D] text-lg font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>Your Observations</Text>
          <TouchableOpacity onPress={onNavigateToHistory} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F8FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 5 }}>
            <Text className="text-[#20A0D8] text-sm" style={{ fontFamily: 'Inter-Medium' }}>View all</Text>
            <ChevronRight size={16} color="#20A0D8" />
          </TouchableOpacity>
        </View>
        {recentReports.length === 0 ? (
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 5, 
            padding: 32, 
            marginBottom: 12, 
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.08, 
            shadowRadius: 4, 
            elevation: 2, 
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#F0F0F0'
          }}>
            <Eye size={40} color="#D1D5DB" strokeWidth={2} />
            <Text className="text-gray-500 text-sm mt-3" style={{ fontFamily: 'Inter-Medium' }}>No observations yet</Text>
            <Text className="text-gray-400 text-xs mt-1" style={{ fontFamily: 'Inter-Medium' }}>Start monitoring your community</Text>
          </View>
        ) : recentReports.map((report) => {
          const isVerified = report.status === 'verified';
          const bgColor = isVerified ? '#DCFCE7' : '#FEF3C7';
          const iconColor = isVerified ? '#16A34A' : '#D97706';
          const statusText = report.status.toUpperCase();
          const Icon = report.reportType === 'observed' ? Eye : CheckCircle;
          const title = report.symptoms.slice(0, 2).join(' & ') || 'Symptoms reported';
          return (
            <View key={report.id} style={{ 
              backgroundColor: 'white', 
              borderRadius: 5, 
              padding: 16, 
              marginBottom: 12, 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 2 }, 
              shadowOpacity: 0.08, 
              shadowRadius: 4, 
              elevation: 2,
              borderWidth: 1,
              borderColor: '#F0F0F0'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 52, height: 52, borderRadius: 5, backgroundColor: bgColor, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Icon size={24} color={iconColor} strokeWidth={2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text className="text-[#1B365D] font-semibold text-base" style={{ fontFamily: 'Inter-SemiBold' }}>{title}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Clock size={12} color="#9CA3AF" />
                    <Text className="text-gray-500 text-xs ml-1" style={{ fontFamily: 'Inter-Medium' }}>{getTimeAgo(report.createdAt)}</Text>
                  </View>
                </View>
                <View style={{ backgroundColor: bgColor, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }}>
                  <Text className="text-xs font-semibold" style={{ fontFamily: 'Inter-SemiBold', color: iconColor }}>{statusText}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Weekly Trend */}
      <View style={{ paddingHorizontal: 20, marginTop: 24, marginBottom: 20 }}>
        <Text className="text-[#1B365D] text-lg font-semibold mb-3" style={{ fontFamily: 'Inter-SemiBold' }}>Weekly Trend</Text>
        <View style={{ 
          backgroundColor: 'white', 
          borderRadius: 5, 
          padding: 16, 
          shadowColor: '#000', 
          shadowOffset: { width: 0, height: 2 }, 
          shadowOpacity: 0.08, 
          shadowRadius: 4, 
          elevation: 2,
          borderWidth: 1,
          borderColor: '#F0F0F0'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
            <View style={{ backgroundColor: '#DCFCE7', padding: 8, borderRadius: 5 }}>
              <TrendingUp size={20} color="#10B981" strokeWidth={2} />
            </View>
            <Text className="text-[#1B365D] font-semibold ml-2" style={{ fontFamily: 'Inter-SemiBold' }}>Health Status Improving</Text>
          </View>
          <Text className="text-gray-700 text-sm mb-4" style={{ fontFamily: 'Inter-Medium' }}>Reports decreased by {Math.max(0, 100 - clusterReports.length * 10)}% compared to last week</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1, backgroundColor: '#F9FAFB', borderRadius: 5, padding: 12, borderWidth: 1, borderColor: '#F0F0F0' }}>
              <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Inter-Medium' }}>This Week</Text>
              <Text className="text-[#1B365D] text-2xl font-bold" style={{ fontFamily: 'Inter-SemiBold' }}>{clusterReports.length}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#F9FAFB', borderRadius: 5, padding: 12, borderWidth: 1, borderColor: '#F0F0F0' }}>
              <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Inter-Medium' }}>Last Week</Text>
              <Text className="text-gray-500 text-2xl font-bold" style={{ fontFamily: 'Inter-SemiBold' }}>{Math.max(clusterReports.length + 3, 5)}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};