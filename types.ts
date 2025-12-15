export enum UserRole {
  FARMER = 'FARMER',
  CONSUMER = 'CONSUMER',
  DELIVERY = 'DELIVERY',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // In a real app, never store plain text
}

export type ProductCategory = 'Vegetables' | 'Fruits' | 'Grains' | 'Dairy' | 'Other';

export interface Review {
  id: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  description: string;
  category: ProductCategory;
  isPreOrder?: boolean;
  availableDate?: string;
  rating?: number;
  reviews?: Review[];
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export enum OrderStatus {
  PENDING = 'PENDING', // Consumer placed, waiting for delivery pickup
  ACCEPTED = 'ACCEPTED', // Delivery admin accepted, pending delivery
  DELIVERED = 'DELIVERED', // Completed
  CANCELLED = 'CANCELLED',
}

export interface Order {
  id: string;
  consumerId: string;
  consumerName: string;
  deliveryId?: string; // Assigned delivery admin
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: string;
  createdAt: string;
  
  // Delivery specific fields
  distanceKm?: number;
  deliveryCost?: number; // 5 * distance
}