import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Page, User, Establishment, SearchFilters } from '../types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface ReservationRecord {
  id: string;
  establishmentId: string;
  establishmentName: string;
  establishmentImage: string;
  establishmentType: string;
  establishmentNeighborhood: string;
  establishmentCity: string;
  date: string;
  time: string;
  people: number;
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

interface AppContextValue {
  currentPage: Page;
  navigate: (page: Page, params?: Record<string, string>) => void;
  pageParams: Record<string, string>;
  user: User | null;
  setUser: (user: User | null) => void;
  selectedEstablishment: Establishment | null;
  setSelectedEstablishment: (e: Establishment | null) => void;
  filters: SearchFilters;
  setFilters: (f: Partial<SearchFilters>) => void;
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  reservations: ReservationRecord[];
  addReservation: (r: ReservationRecord) => void;
  userPoints: number;
  addPoints: (pts: number) => void;
}

const defaultFilters: SearchFilters = {
  location: '',
  date: '',
  people: 2,
  type: '',
  priceRange: '',
  minRating: 0,
  sortBy: 'relevance',
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});
  const [user, setUser] = useState<User | null>(null);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [filters, setFiltersState] = useState<SearchFilters>(defaultFilters);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [userPoints, setUserPoints] = useState(0);

  const navigate = useCallback((page: Page, params: Record<string, string> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setFilters = useCallback((partial: Partial<SearchFilters>) => {
    setFiltersState(prev => ({ ...prev, ...partial }));
  }, []);

  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addReservation = useCallback((r: ReservationRecord) => {
    setReservations(prev => [r, ...prev]);
  }, []);

  const addPoints = useCallback((pts: number) => {
    setUserPoints(prev => prev + pts);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigate,
        pageParams,
        user,
        setUser,
        selectedEstablishment,
        setSelectedEstablishment,
        filters,
        setFilters,
        toasts,
        addToast,
        removeToast,
        reservations,
        addReservation,
        userPoints,
        addPoints,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
