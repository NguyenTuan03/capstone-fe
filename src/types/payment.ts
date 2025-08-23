export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'e_wallet';
  recipientId: string;
  recipientName: string;
  senderId: string;
  senderName: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  description: string;
  paymentMethod: string;
  recipientId: string;
}

export interface PaymentStats {
  totalAmount: number;
  totalTransactions: number;
  successRate: number;
  recentTransactions: Payment[];
}