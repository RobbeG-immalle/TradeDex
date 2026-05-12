import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuthStore } from '@/stores/auth-store'
import { isValidUsername } from '@tradedex/utils'

export default function RegisterScreen() {
  const { signUp } = useAuthStore()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSignUp() {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }
    if (!isValidUsername(username.trim())) {
      setError('Username must be 3–30 characters: letters, numbers, underscores only')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setError(null)
    setIsLoading(true)
    try {
      const result = await signUp(email.trim(), password, username.trim())
      if (result.error) {
        setError(result.error)
      } else {
        router.replace('/(tabs)')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.logo}>⚡ TradeDex</Text>
            <Text style={styles.subtitle}>Create your collector account</Text>
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              ⚠️ By creating an account you acknowledge that TradeDex only facilitates connections. We do not process payments or guarantee trades. All trades are at your own risk.
            </Text>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="pokecollector42"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Minimum 8 characters"
              placeholderTextColor="#94a3b8"
              secureTextEntry
            />
            <TouchableOpacity
              style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
              onPress={() => void handleSignUp()}
              disabled={isLoading}
            >
              <Text style={styles.submitBtnText}>
                {isLoading ? 'Creating account…' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.switchText}>
              Already have an account? <Text style={styles.switchLink}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  kav: { flex: 1 },
  content: { padding: 24, paddingTop: 32 },
  header: { alignItems: 'center', marginBottom: 20 },
  logo: { fontSize: 28, fontWeight: '900', color: '#1e293b', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748b' },
  disclaimer: { backgroundColor: '#fef3c7', borderRadius: 12, borderWidth: 1, borderColor: '#fde68a', padding: 12, marginBottom: 16 },
  disclaimerText: { fontSize: 12, color: '#92400e', lineHeight: 18 },
  errorBox: { backgroundColor: '#fef2f2', borderRadius: 12, borderWidth: 1, borderColor: '#fecaca', padding: 12, marginBottom: 16 },
  errorText: { color: '#dc2626', fontSize: 14 },
  form: { gap: 4, marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 4, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#1e293b', backgroundColor: '#fff' },
  submitBtn: { backgroundColor: '#6366f1', borderRadius: 14, paddingVertical: 14, marginTop: 24, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  switchText: { textAlign: 'center', color: '#64748b', fontSize: 14 },
  switchLink: { color: '#6366f1', fontWeight: '600' },
})
