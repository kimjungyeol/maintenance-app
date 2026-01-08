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

export interface MonthlyData {
  month: number;
  value: number;
}

export interface MonthlyTrends {
  year: number;
  sales: MonthlyData[];
  expenses: MonthlyData[];
  receivables: MonthlyData[];
  customers?: MonthlyData[];
}

export interface Customer {
  customer_id: number;
  customer_name: string;
  car_number: string;
  phone: string;
  email?: string;
  memo?: string;
  created_at: string;
}

export interface Vehicle {
  vehicle_id: number;
  customer_id: number;
  customer_name: string;
  car_number: string;
  car_model: string;
  car_year?: number;
  mileage?: number;
  vin?: string;
  memo?: string;
  created_at: string;
}

export interface Schedule {
  schedule_id: number;
  customer_id?: number;
  customer_name: string;
  car_number: string;
  phone: string;
  schedule_date: string;
  schedule_time: string;
  service_type: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
  created_at: string;
}

export interface MaintenanceRecord {
  maintenance_id: number;
  vehicle_id: number;
  customer_name: string;
  car_number: string;
  service_date: string;
  service_items: string[];
  parts_cost: number;
  labor_cost: number;
  total_cost: number;
  mileage?: number;
  technician?: string;
  memo?: string;
}

export interface BusinessHoursConfig {
  day: string;
  dayKo: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface MaintenanceItem {
  item_id: number;
  item_name: string;
  category: 'ENGINE' | 'BRAKE' | 'SUSPENSION' | 'ELECTRICAL' | 'BODY' | 'ETC';
  default_price: number;
  default_duration: number; // minutes
  description?: string;
  is_active: boolean;
}

// Plan & Feature Access
export type PlanType = 'FREE' | 'BASIC' | 'PRO';

export interface PlanInfo {
  type: PlanType;
  name: string;
  price: number;
  features: string[];
}

export interface UserPlan {
  current_plan: PlanType;
  started_at: string;
  expires_at?: string;
  auto_renew: boolean;
}

// Feature flags for plan-based access control
export const PLAN_FEATURES = {
  // FREE features
  CUSTOMER_MANAGEMENT: ['FREE', 'BASIC', 'PRO'],
  VEHICLE_MANAGEMENT: ['FREE', 'BASIC', 'PRO'],
  TODAY_SCHEDULE: ['FREE', 'BASIC', 'PRO'],
  BOOKING_LIMITED: ['FREE'],
  WORK_STATUS: ['FREE', 'BASIC', 'PRO'],
  MAINTENANCE_HISTORY: ['FREE', 'BASIC', 'PRO'],

  // BASIC features
  BOOKING_UNLIMITED: ['BASIC', 'PRO'],
  SCHEDULE_CALENDAR: ['BASIC', 'PRO'],
  SALES_MANAGEMENT: ['BASIC', 'PRO'],
  RECEIVABLES_MANAGEMENT: ['BASIC', 'PRO'],
  EXPENSE_MANAGEMENT: ['BASIC', 'PRO'],
  PAYROLL_MANAGEMENT: ['BASIC', 'PRO'],
  MONTHLY_REPORT: ['BASIC', 'PRO'],
  EXCEL_EXPORT: ['BASIC', 'PRO'],
  BUSINESS_HOURS_SETTINGS: ['BASIC', 'PRO'],
  MAINTENANCE_ITEMS_SETTINGS: ['BASIC', 'PRO'],

  // PRO features
  SALES_STATISTICS: ['PRO'],
  PROFIT_ANALYSIS: ['PRO'],
  AUTO_BACKUP: ['PRO'],
  BOOKING_NOTIFICATION: ['PRO'],
} as const;

export type FeatureKey = keyof typeof PLAN_FEATURES;
