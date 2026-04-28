/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  isSpecial?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';

export interface Order {
  id: string;
  table_id: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  item_id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface TableSession {
  tableId: string;
  sessionId: string;
  restaurantId: string;
  guestToken?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'upi' | 'card' | 'cash';
  status: 'pending' | 'success' | 'failed';
  createdAt: string;
}

export interface Feedback {
  id: string;
  table_id: string;
  food_rating: number;
  service_rating: number;
  ambience_rating: number;
  comment: string;
}

export interface Table {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'bill_requested';
  currentSessionId?: string;
}

export interface KDSOrder extends Order {
  elapsedSeconds: number;
}

export interface AdminStats {
  revenueToday: number;
  ordersToday: number;
  activeTables: number;
  capacity: number;
  avgOrderValue: number;
}

export interface WebSocketMessage {
  type: 'ORDER_UPDATE' | 'TABLE_UPDATE' | 'NEW_ORDER';
  payload: any;
}
