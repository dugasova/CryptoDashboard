import { create } from 'zustand';
import { getCoinList } from '../services/cryptos';
import type { StateCreator } from 'zustand';
import type { CoinData } from '../types/cryptoTypes';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CryptoState {
  coins: CoinData[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  minMarketCap: number | '';
  maxMarketCap: number | '';
  selectedCoins: CoinData[];
  fetchCoins: () => Promise<void>;
  setCurrentPage: (page: number) => void;
  setMinMarketCap: (min: number | '') => void;
  setMaxMarketCap: (max: number | '') => void;
  addSelectedCoin: (coin: CoinData) => void;
  removeSelectedCoin: (coinId: string) => void;
}

const useCryptoStore: StateCreator<CryptoState> = (set) => ({
  coins: [],
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 25,
  minMarketCap: '',
  maxMarketCap: '',
  selectedCoins: [],

  fetchCoins: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getCoinList(1, 250);
      set({ coins: data });
    } catch (err) {
      set({ error: 'Failed to fetch cryptocurrency data.' });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  setCurrentPage: (page: number) => set({ currentPage: page }),
  setMinMarketCap: (min: number | '') => set({ minMarketCap: min, currentPage: 1 }),
  setMaxMarketCap: (max: number | '') => set({ maxMarketCap: max, currentPage: 1 }),

  addSelectedCoin: (coin: CoinData) => {
    set(state => {
      if (!state.selectedCoins.find(selected => selected.id === coin.id)) {
        return { selectedCoins: [...state.selectedCoins, coin] };
      }
      return state;
    });
  },

  removeSelectedCoin: (coinId: string) => {
    set(state => ({
      selectedCoins: state.selectedCoins.filter(coin => coin.id !== coinId),
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
        selectedCoins: state.selectedCoins, // Persist selected coins
      }),
    }
  )
);
