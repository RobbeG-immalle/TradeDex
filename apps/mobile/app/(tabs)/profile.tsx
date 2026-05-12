import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuthStore } from '@/stores/auth-store'

export default function ProfileTabScreen() {
  const { user, profile, signOut } = useAuthStore()

  if (!user || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.emoji}>🔑</Text>
          <Text style={styles.title}>Sign in to TradeDex</Text>
          <Text style={styles.subtitle}>
            Access your collection, find trades, and chat with collectors
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.primaryBtnText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.secondaryBtnText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.username[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text style={styles.username}>{profile.username}</Text>
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
          {profile.location && <Text style={styles.location}>📍 {profile.location}</Text>}
          {profile.rating_count > 0 && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>
                ✓ {profile.rating}% positive ({profile.rating_count} reviews)
              </Text>
            </View>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          {[
            { emoji: '🃏', label: 'My Collection', onPress: () => router.push(`/profile/${profile.username}`) },
            { emoji: '🔄', label: 'Find Trades', onPress: () => router.push('/(tabs)/trade') },
            { emoji: '💬', label: 'Messages', onPress: () => router.push('/(tabs)/messages') },
            { emoji: '✏️', label: 'Edit Profile', onPress: () => router.push('/profile/edit') },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={() => signOut()}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#64748b', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  primaryBtn: { backgroundColor: '#6366f1', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32, marginBottom: 12, width: '100%' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16, textAlign: 'center' },
  secondaryBtn: { borderWidth: 1, borderColor: '#6366f1', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32, width: '100%' },
  secondaryBtnText: { color: '#6366f1', fontWeight: '700', fontSize: 16, textAlign: 'center' },
  profileHeader: { alignItems: 'center', paddingVertical: 24, marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
  username: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  bio: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 4 },
  location: { fontSize: 13, color: '#94a3b8', marginBottom: 8 },
  ratingBadge: { backgroundColor: '#dcfce7', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginTop: 4 },
  ratingText: { color: '#166534', fontSize: 13, fontWeight: '600' },
  menu: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden', marginBottom: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  menuEmoji: { fontSize: 20, marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1e293b' },
  menuArrow: { fontSize: 20, color: '#94a3b8' },
  signOutBtn: { borderWidth: 1, borderColor: '#fee2e2', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  signOutText: { color: '#ef4444', fontWeight: '700', fontSize: 15 },
})
