import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuthStore } from '@/stores/auth-store'

export default function HomeScreen() {
  const { user, profile } = useAuthStore()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>⚡</Text>
          <Text style={styles.heroTitle}>TradeDex</Text>
          <Text style={styles.heroSubtitle}>
            {user && profile
              ? `Welcome back, ${profile.username}!`
              : 'Find your perfect Pokémon card trade'}
          </Text>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ TradeDex only facilitates connections between collectors. We do not process
            payments, guarantee trades, or authenticate cards. All trades are at your own risk.
          </Text>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <QuickAction
            emoji="🔍"
            title="Search Cards"
            subtitle="Browse the TCG database"
            onPress={() => router.push('/(tabs)/search')}
            color="#6366f1"
          />
          <QuickAction
            emoji="🔄"
            title="Find Trades"
            subtitle="Discover matches"
            onPress={() => router.push('/(tabs)/trade')}
            color="#10b981"
          />
          {user ? (
            <QuickAction
              emoji="💬"
              title="Messages"
              subtitle="Chat with collectors"
              onPress={() => router.push('/(tabs)/messages')}
              color="#f59e0b"
            />
          ) : (
            <QuickAction
              emoji="🔑"
              title="Sign In"
              subtitle="Access your collection"
              onPress={() => router.push('/auth')}
              color="#ef4444"
            />
          )}
          <QuickAction
            emoji="👤"
            title="My Profile"
            subtitle="Manage your collection"
            onPress={() => router.push('/(tabs)/profile')}
            color="#8b5cf6"
          />
        </View>

        {/* How it works */}
        <Text style={styles.sectionTitle}>How TradeDex Works</Text>
        {[
          { step: '1', title: 'Build Collection', desc: 'Add cards as For Trade, Wanted, or Collection' },
          { step: '2', title: 'Find Matches', desc: 'See who has your wanted cards and wants yours' },
          { step: '3', title: 'Chat & Trade', desc: 'Message collectors and arrange trades privately' },
        ].map((item) => (
          <View key={item.step} style={styles.step}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>{item.step}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{item.title}</Text>
              <Text style={styles.stepDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

function QuickAction({
  emoji,
  title,
  subtitle,
  onPress,
  color,
}: {
  emoji: string
  title: string
  subtitle: string
  onPress: () => void
  color: string
}) {
  return (
    <TouchableOpacity
      style={[styles.actionCard, { borderColor: `${color}30` }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.actionEmoji}>{emoji}</Text>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 32 },
  hero: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  heroEmoji: { fontSize: 56, marginBottom: 8 },
  heroTitle: { fontSize: 32, fontWeight: '900', color: '#1e293b', marginBottom: 4 },
  heroSubtitle: { fontSize: 16, color: '#64748b', textAlign: 'center' },
  disclaimer: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
    padding: 12,
    marginBottom: 24,
  },
  disclaimerText: { fontSize: 12, color: '#92400e', lineHeight: 18 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  actionCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  actionEmoji: { fontSize: 32, marginBottom: 8 },
  actionTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 2 },
  actionSubtitle: { fontSize: 11, color: '#94a3b8', textAlign: 'center' },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepBadgeText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: '600', color: '#1e293b', marginBottom: 2 },
  stepDesc: { fontSize: 13, color: '#64748b' },
})
