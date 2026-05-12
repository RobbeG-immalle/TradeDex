import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TradeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Find Trades</Text>
        <Text style={styles.subtitle}>
          Sign in and add cards to your collection to see trade matches here
        </Text>
        <Text style={styles.emoji}>🔄</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 22 },
  emoji: { fontSize: 64, marginTop: 24 },
})
