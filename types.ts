// FIX: Removed self-import of `MessagePlatform` which was causing a declaration conflict.
export enum Language {
  EN = 'en',
  DE = 'de',
  FR = 'fr',
  TR = 'tr',
  RU = 'ru',
  AR = 'ar',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Moderator' | 'Agent';
  avatarUrl: string;
  status: 'Active' | 'Inactive';
  platforms: MessagePlatform[];
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  agent: string;
  avatarUrl: string;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'TRY';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: Currency;
  category: string;
}

export enum MessagePlatform {
  Facebook = 'Facebook',
  Instagram = 'Instagram',
  WhatsApp = 'WhatsApp',
  WebChat = 'Web Chat',
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  isPaymentLink?: boolean;
  agentName?: string;
  attachment?: {
    name: string;
    url: string;
    type: string;
  };
}

export interface Conversation {
  id: number;
  customerName: string;
  lastMessage: string;
  timestamp: string;
  platform: MessagePlatform;
  avatarUrl: string;
  unreadCount: number;
}

export interface Invoice {
  id: string;
  customer: Customer;
  services: Service[];
  totalAmount: number;
  currency: Currency;
  status: 'Paid' | 'Pending' | 'Overdue' | 'SentToGIB';
  issueDate: string;
  dueDate: string;
}