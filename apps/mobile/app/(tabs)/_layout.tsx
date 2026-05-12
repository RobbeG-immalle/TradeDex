import { Tabs } from 'expo-router'
import { useAuthStore } from '@/stores/auth-store'

export default function TabsLayout() {
  const { user } = useAuthStore()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e2e8f0',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabIcon emoji="🔍" color={color} />,
        }}
      />
      <Tabs.Screen
        name="trade"
        options={{
          title: 'Trades',
          tabBarIcon: ({ color }) => <TabIcon emoji="🔄" color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <TabIcon emoji="💬" color={color} />,
          href: user ? '/messages' : null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: user ? 'Profile' : 'Sign In',
          tabBarIcon: ({ color }) => <TabIcon emoji={user ? '👤' : '🔑'} color={color} />,
        }}
      />
    </Tabs>
  )
}

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  const { Text } = require('react-native') as typeof import('react-native')
  return <Text style={{ fontSize: 20, opacity: color === '#6366f1' ? 1 : 0.6 }}>{emoji}</Text>
}
