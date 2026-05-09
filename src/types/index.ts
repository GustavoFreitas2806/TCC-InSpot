export type EstablishmentType =
  | 'bar'
  | 'restaurante'
  | 'salao'
  | 'churrascaria'
  | 'buffet'
  | 'hamburgueria'
  | 'pizzaria'
  | 'cafe';

export type PriceRange = '$' | '$$' | '$$$' | '$$$$';

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  event: string;
}

export interface Establishment {
  id: string;
  name: string;
  type: EstablishmentType;
  priceRange: PriceRange;
  rating: number;
  reviewCount: number;
  capacity: number;
  address: string;
  neighborhood: string;
  city: string;
  description: string;
  images: string[];
  tags: string[];
  reviews: Review[];
  isFeatured?: boolean;
  isNew?: boolean;
  distance?: string;
}

export interface Reservation {
  id: string;
  establishmentId: string;
  establishmentName: string;
  date: string;
  time: string;
  people: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type Page =
  | 'home'
  | 'login'
  | 'register'
  | 'register-establishment'
  | 'detail'
  | 'edit-establishment'
  | 'reservation'
  | 'reservation-success';

export interface SearchFilters {
  location: string;
  date: string;
  people: number;
  type: EstablishmentType | '';
  priceRange: PriceRange | '';
  minRating: number;
  sortBy: 'relevance' | 'rating' | 'price-asc' | 'price-desc';
}
