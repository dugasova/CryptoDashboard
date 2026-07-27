import { create } from 'zustand';
import { getCoinList, getCoinsByIds, searchCoins, ApiError } from '../services/cryptos';
import type { StateCreator } from 'zustand';
import type { CoinData } from '../types/cryptoTypes';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CryptoState {
  coins: CoinData[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  minMarketCap: number | '';
  maxMarketCap: number | '';
  searchQuery: string;
  // Keyed by username so each account has its own watchlist in shared localStorage.
  selectedCoinsByUser: Record<string, CoinData[]>;
  fetchCoins: () => Promise<void>;
  setCurrentPage: (page: number) => void;
  setMinMarketCap: (min: number | '') => void;
  setMaxMarketCap: (max: number | '') => void;
  setSearchQuery: (query: string) => void;
  addSelectedCoin: (username: string, coin: CoinData) => void;
  removeSelectedCoin: (username: string, coinId: string) => void;
}

const useCryptoStore: StateCreator<CryptoState> = (set, get) => ({
  coins: [],
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 25,
  hasNextPage: true,
  minMarketCap: '',
  maxMarketCap: '',
  searchQuery: '',
  selectedCoinsByUser: {},

  fetchCoins: async () => {
    set({ loading: true, error: null });
    try {
      const { currentPage, itemsPerPage, searchQuery } = get();
      const trimmedQuery = searchQuery.trim();

      if (trimmedQuery) {
        // Search isn't paginated: fetch the top matches and their market data in one go.
        const matches = await searchCoins(trimmedQuery);
        const ids = matches.slice(0, itemsPerPage).map((coin) => coin.id);
        const data = await getCoinsByIds(ids);
        set({ coins: data, hasNextPage: false });
      } else {
        const data = await getCoinList(currentPage, itemsPerPage);
        // CoinGecko's /coins/markets doesn't return a total count, so we infer
        // whether more pages exist from whether this page came back full.
        set({ coins: data, hasNextPage: data.length === itemsPerPage });
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch cryptocurrency data.';
      set({ error: message, coins: [], hasNextPage: false });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  setCurrentPage: (page: number) => set({ currentPage: page }),
  setMinMarketCap: (min: number | '') => set({ minMarketCap: min, currentPage: 1 }),
  setMaxMarketCap: (max: number | '') => set({ maxMarketCap: max, currentPage: 1 }),
  setSearchQuery: (query: string) => set({ searchQuery: query, currentPage: 1 }),

  addSelectedCoin: (username: string, coin: CoinData) => {
    set((state) => {
      const existing = state.selectedCoinsByUser[username] ?? [];
      if (existing.some((selected) => selected.id === coin.id)) {
        return state;
      }
      return {
        selectedCoinsByUser: {
          ...state.selectedCoinsByUser,
          [username]: [...existing, coin],
        },
      };
    });
  },

  removeSelectedCoin: (username: string, coinId: string) => {
    set((state) => ({
      selectedCoinsByUser: {
        ...state.selectedCoinsByUser,
        [username]: (state.selectedCoinsByUser[username] ?? []).filter((coin) => coin.id !== coinId),
      },
    }));
  },
});

// Wrap the store with persist middleware
export default create<CryptoState>()(
  persist(
    useCryptoStore,
    {
      name: 'crypto-storage', // unique name
      storage: createJSONStorage(() => localStorage), // use localStorage
      // Optionally, specify which parts of the state to persist
      partialize: (state) => ({
        selectedCoinsByUser: state.selectedCoinsByUser, // Persist each user's selected coins
      }),
    }
  )
);
