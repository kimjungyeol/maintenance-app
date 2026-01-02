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
  memo?: string;
}

export interface Expense {
  expense_id: number;
  expense_date: string;
  category: 'PART' | 'OUTSOURCE' | 'FIXED' | 'ETC';
  vendor_name: string;
  amount: number;
  payment_type: 'CASH' | 'CARD' | 'TRANSFER';
  receipt_path?: string;
  memo?: string;
}

export interface Receivable {
  recv_id: number;
  sale_id: number;
  customer_name: string;
  amount: number;
  due_date: string;
  paid: boolean;
  paid_date?: string;
}

export interface Employee {
  emp_id: number;
  emp_name: string;
  role: string;
  monthly_pay: number;
  join_date: string;
}

export interface Payroll {
  payroll_id: number;
  emp_id: number;
  pay_month: string;
  pay_amount: number;
  paid_date: string;
}

export interface DashboardSummary {
  todaySales: number;
  todayExpenses: number;
  todayNetCash: number;
}
