export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface Sale {
  sale_id: number;
  sale_date: string;
  amount: number;
  payment_type: 'CASH' | 'CARD' | 'TRANSFER';
  car_number?: string;
  customer_name?: string;
}

export interface Expense {
  expense_id: number;
  expense_date: string;
  category: 'PART' | 'OUTSOURCE' | 'FIXED' | 'ETC';
  amount: number;
}

export const fetchSales = async (): Promise<ApiResponse<Sale[]>> => {
  return { success: true, data: [] };
};
