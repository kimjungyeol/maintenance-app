import {
  ApiResponse,
  Sale,
  Expense,
  Receivable,
  Employee,
  Payroll,
  DashboardSummary,
} from '../types';

const mockSales: Sale[] = [
  {
    sale_id: 1,
    sale_date: '2026-01-02',
    amount: 350000,
    payment_type: 'CARD',
    car_number: '12가3456',
    customer_name: '김철수',
    memo: '엔진오일 교체',
  },
  {
    sale_id: 2,
    sale_date: '2026-01-02',
    amount: 120000,
    payment_type: 'CASH',
    car_number: '78나9012',
    customer_name: '이영희',
    memo: '타이어 교체',
  },
  {
    sale_id: 3,
    sale_date: '2026-01-01',
    amount: 250000,
    payment_type: 'TRANSFER',
    car_number: '34다5678',
    customer_name: '박민수',
    memo: '정기점검',
  },
];

const mockExpenses: Expense[] = [
  {
    expense_id: 1,
    expense_date: '2026-01-02',
    category: 'PART',
    vendor_name: '부품상사',
    amount: 150000,
    payment_type: 'CARD',
    memo: '엔진오일 구매',
  },
  {
    expense_id: 2,
    expense_date: '2026-01-02',
    category: 'FIXED',
    vendor_name: '임대료',
    amount: 800000,
    payment_type: 'TRANSFER',
    memo: '1월 임대료',
  },
  {
    expense_id: 3,
    expense_date: '2026-01-01',
    category: 'OUTSOURCE',
    vendor_name: '외주업체',
    amount: 200000,
    payment_type: 'CASH',
    memo: '도장 작업',
  },
];

const mockReceivables: Receivable[] = [
  {
    recv_id: 1,
    sale_id: 1,
    customer_name: '정대리',
    amount: 500000,
    due_date: '2026-01-10',
    paid: false,
  },
  {
    recv_id: 2,
    sale_id: 2,
    customer_name: '강사장',
    amount: 300000,
    due_date: '2026-01-05',
    paid: true,
    paid_date: '2026-01-04',
  },
];

const mockEmployees: Employee[] = [
  {
    emp_id: 1,
    emp_name: '홍길동',
    role: '정비사',
    monthly_pay: 3000000,
    join_date: '2024-01-01',
  },
  {
    emp_id: 2,
    emp_name: '김정비',
    role: '정비사',
    monthly_pay: 2800000,
    join_date: '2024-06-01',
  },
];

const mockPayrolls: Payroll[] = [
  {
    payroll_id: 1,
    emp_id: 1,
    pay_month: '2025-12',
    pay_amount: 3000000,
    paid_date: '2025-12-25',
  },
  {
    payroll_id: 2,
    emp_id: 2,
    pay_month: '2025-12',
    pay_amount: 2800000,
    paid_date: '2025-12-25',
  },
];

export const fetchSales = async (): Promise<ApiResponse<Sale[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: mockSales });
    }, 300);
  });
};

export const fetchExpenses = async (): Promise<ApiResponse<Expense[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: mockExpenses });
    }, 300);
  });
};

export const fetchReceivables = async (): Promise<ApiResponse<Receivable[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: mockReceivables });
    }, 300);
  });
};

export const fetchEmployees = async (): Promise<ApiResponse<Employee[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: mockEmployees });
    }, 300);
  });
};

export const fetchPayrolls = async (): Promise<ApiResponse<Payroll[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: mockPayrolls });
    }, 300);
  });
};

export const fetchDashboardSummary = async (): Promise<ApiResponse<DashboardSummary>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      const todaySales = mockSales
        .filter((s) => s.sale_date === today)
        .reduce((sum, s) => sum + s.amount, 0);
      const todayExpenses = mockExpenses
        .filter((e) => e.expense_date === today)
        .reduce((sum, e) => sum + e.amount, 0);

      resolve({
        success: true,
        data: {
          todaySales,
          todayExpenses,
          todayNetCash: todaySales - todayExpenses,
        },
      });
    }, 300);
  });
};
