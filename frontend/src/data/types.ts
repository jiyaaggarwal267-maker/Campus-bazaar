export type ProductStatus = 'available' | 'reserved' | 'sold';
export type ProductCondition = 'new' | 'like-new' | 'good' | 'fair';
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'countered';

export interface User {
  _id: string;
  name: string;
  email: string;
  college: string;
  year?: string;
  avatar: string;
  bio?: string;
  rating: number;
  totalRatings: number;
  totalSales: number;
  isVerified: boolean;
  isTrustedSeller: boolean;
  interests?: string[];
  createdAt: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  category: string;
  condition: ProductCondition;
  status: ProductStatus;
  images: string[];
  seller: User | string;
  college: string;
  views: number;
  reservedBy?: string;
  soldTo?: string;
  soldAt?: string;
  createdAt: string;
}

export interface Offer {
  _id: string;
  amount: number;
  status: OfferStatus;
  counterAmount?: number;
  fromUser: string;
  conversation: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: User | string;
  type: 'text' | 'offer' | 'system';
  content?: string;
  offer?: Offer;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  product: Product;
  buyer: User;
  seller: User;
  other: User;
  unread: number;
  lastMessage?: Message;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  type: string;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export const conditionLabels: Record<ProductCondition, string> = {
  new: 'New', 'like-new': 'Like new', good: 'Good', fair: 'Fair',
};
