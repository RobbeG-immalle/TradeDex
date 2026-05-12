import { useState, useCallback } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { searchCards } from '@/lib/pokemon/api'
import type { PokemonCard } from '@tradedex/types'

export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['pokemon-search', query],
    queryFn: () => searchCards(query),
    enabled: query.length > 0,
    staleTime: 300_000,
  })

  const handleSearch = useCallback(() => {
    if (searchInput.trim()) {
      setQuery(searchInput.trim())
    }
  }, [searchInput])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Cards</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            value={searchInput}
            onChangeText={setSearchInput}
            placeholder="Charizard, Pikachu…"
            placeholderTextColor="#94a3b8"
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={[styles.searchBtn, !searchInput.trim() && styles.searchBtnDisabled]}
            onPress={handleSearch}
            disabled={!searchInput.trim()}
          >
            <Text style={styles.searchBtnText}>Go</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Searching…</Text>
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load results. Please try again.</Text>
        </View>
      )}

      {!query && !isLoading && (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>🃏</Text>
          <Text style={styles.emptyTitle}>Search for any Pokémon card</Text>
          <Text style={styles.emptySubtitle}>Type a card name above to get started</Text>
        </View>
      )}

      {data && data.count === 0 && (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>😔</Text>
          <Text style={styles.emptyTitle}>No cards found for &quot;{query}&quot;</Text>
          <Text style={styles.emptySubtitle}>Try a different search term</Text>
        </View>
      )}

      {data && data.count > 0 && (
        <FlatList
          data={data.data}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => <CardItem card={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}

function CardItem({ card }: { card: PokemonCard }) {
  return (
    <TouchableOpacity
      style={styles.cardItem}
      onPress={() => router.push(`/cards/${card.id}`)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: card.images.small }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <Text style={styles.cardName} numberOfLines={1}>
        {card.name}
      </Text>
      <Text style={styles.cardSet} numberOfLines={1}>
        {card.set.name}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  title: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginBottom: 12 },
  searchRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  searchBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  searchBtnDisabled: { opacity: 0.5 },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  loadingText: { marginTop: 12, color: '#64748b', fontSize: 15 },
  errorText: { color: '#ef4444', textAlign: 'center' },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1e293b', marginBottom: 4, textAlign: 'center' },
  emptySubtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center' },
  grid: { padding: 12 },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  cardItem: { width: '48%', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0' },
  cardImage: { width: '100%', aspectRatio: 2.5 / 3.5 },
  cardName: { fontSize: 12, fontWeight: '600', color: '#1e293b', paddingHorizontal: 8, paddingTop: 6 },
  cardSet: { fontSize: 10, color: '#94a3b8', paddingHorizontal: 8, paddingBottom: 8 },
})
