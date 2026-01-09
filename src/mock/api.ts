import {
  ApiResponse,
  Sale,
  Expense,
  Receivable,
  Employee,
  Payroll,
  DashboardSummary,
  MonthlyTrends,
  Customer,
  Vehicle,
  Schedule,
  MaintenanceRecord,
  BusinessHoursConfig,
  MaintenanceItem,
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

const mockCustomers: Customer[] = [
  {
    customer_id: 1,
    customer_name: '김철수',
    car_number: '12가3456',
    phone: '010-1234-5678',
    email: 'kim@example.com',
    memo: '단골 고객',
    created_at: '2025-01-15',
  },
  {
    customer_id: 2,
    customer_name: '이영희',
    car_number: '78나9012',
    phone: '010-2345-6789',
    email: 'lee@example.com',
    created_at: '2025-02-20',
  },
  {
    customer_id: 3,
    customer_name: '박민수',
    car_number: '34다5678',
    phone: '010-3456-7890',
    memo: '정기점검 고객',
    created_at: '2025-03-10',
  },
  {
    customer_id: 4,
    customer_name: '정대리',
    car_number: '56라7890',
    phone: '010-4567-8901',
    email: 'jung@example.com',
    created_at: '2025-04-05',
  },
  {
    customer_id: 5,
    customer_name: '강사장',
    car_number: '90마1234',
    phone: '010-5678-9012',
    created_at: '2025-05-18',
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

// 2025년 월별 테스트 데이터 생성
const generate2025MonthlyData = (): MonthlyTrends => {
  return {
    year: 2025,
    sales: [
      { month: 1, value: 15000000 },
      { month: 2, value: 18000000 },
      { month: 3, value: 22000000 },
      { month: 4, value: 19000000 },
      { month: 5, value: 24000000 },
      { month: 6, value: 21000000 },
      { month: 7, value: 26000000 },
      { month: 8, value: 23000000 },
      { month: 9, value: 25000000 },
      { month: 10, value: 28000000 },
      { month: 11, value: 30000000 },
      { month: 12, value: 32000000 },
    ],
    expenses: [
      { month: 1, value: 8000000 },
      { month: 2, value: 9500000 },
      { month: 3, value: 11000000 },
      { month: 4, value: 10000000 },
      { month: 5, value: 12000000 },
      { month: 6, value: 11500000 },
      { month: 7, value: 13000000 },
      { month: 8, value: 12500000 },
      { month: 9, value: 13500000 },
      { month: 10, value: 14000000 },
      { month: 11, value: 15000000 },
      { month: 12, value: 16000000 },
    ],
    receivables: [
      { month: 1, value: 2000000 },
      { month: 2, value: 2500000 },
      { month: 3, value: 3000000 },
      { month: 4, value: 2800000 },
      { month: 5, value: 3500000 },
      { month: 6, value: 3200000 },
      { month: 7, value: 4000000 },
      { month: 8, value: 3800000 },
      { month: 9, value: 4200000 },
      { month: 10, value: 4500000 },
      { month: 11, value: 5000000 },
      { month: 12, value: 5500000 },
    ],
    customers: [
      { month: 1, value: 45 },
      { month: 2, value: 48 },
      { month: 3, value: 52 },
      { month: 4, value: 55 },
      { month: 5, value: 60 },
      { month: 6, value: 63 },
      { month: 7, value: 68 },
      { month: 8, value: 71 },
      { month: 9, value: 75 },
      { month: 10, value: 80 },
      { month: 11, value: 85 },
      { month: 12, value: 90 },
    ],
  };
};

export const fetchMonthlyTrends = async (year: number): Promise<ApiResponse<MonthlyTrends>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (year === 2025) {
        resolve({ success: true, data: generate2025MonthlyData() });
      } else {
        // 다른 연도는 기본 데이터 반환
        resolve({
          success: true,
          data: {
            year,
            sales: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 0 })),
            expenses: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 0 })),
            receivables: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 0 })),
            customers: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 0 })),
          },
        });
      }
    }, 300);
  });
};

export const fetchCustomers = async (): Promise<ApiResponse<Customer[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: mockCustomers });
    }, 300);
  });
};

const mockVehicles: Vehicle[] = [
  {
    vehicle_id: 1,
    customer_id: 1,
    customer_name: '김철수',
    car_number: '12가3456',
    car_model: '현대 그랜저',
    car_year: 2022,
    mileage: 35000,
    vin: 'KMHXX00XXXX000001',
    memo: '정기점검 고객',
    created_at: '2025-01-15',
  },
  {
    vehicle_id: 2,
    customer_id: 2,
    customer_name: '이영희',
    car_number: '78나9012',
    car_model: '기아 K5',
    car_year: 2021,
    mileage: 48000,
    created_at: '2025-02-20',
  },
  {
    vehicle_id: 3,
    customer_id: 3,
    customer_name: '박민수',
    car_number: '34다5678',
    car_model: '쌍용 티볼리',
    car_year: 2020,
    mileage: 62000,
    memo: '브레이크 점검 필요',
    created_at: '2025-03-10',
  },
  {
    vehicle_id: 4,
    customer_id: 4,
    customer_name: '정대리',
    car_number: '56라7890',
    car_model: '벤츠 E-Class',
    car_year: 2023,
    mileage: 15000,
    created_at: '2025-04-05',
  },
  {
    vehicle_id: 5,
    customer_id: 5,
    customer_name: '강사장',
    car_number: '90마1234',
    car_model: 'BMW 5시리즈',
    car_year: 2022,
    mileage: 28000,
    created_at: '2025-05-18',
  },
];

const mockSchedules: Schedule[] = [
  {
    schedule_id: 1,
    customer_id: 1,
    customer_name: '김철수',
    car_number: '12가3456',
    phone: '010-1234-5678',
    schedule_date: '2026-01-09',
    schedule_time: '10:00',
    service_type: '엔진오일 교체',
    status: 'COMPLETED',
    memo: '정기점검 포함',
    created_at: '2026-01-05',
  },
  {
    schedule_id: 2,
    customer_id: 2,
    customer_name: '이영희',
    car_number: '78나9012',
    phone: '010-2345-6789',
    schedule_date: '2026-01-09',
    schedule_time: '14:00',
    service_type: '타이어 교체',
    status: 'IN_PROGRESS',
    created_at: '2026-01-06',
  },
  {
    schedule_id: 3,
    customer_id: 3,
    customer_name: '박민수',
    car_number: '34다5678',
    phone: '010-3456-7890',
    schedule_date: '2026-01-09',
    schedule_time: '16:00',
    service_type: '브레이크 점검',
    status: 'PENDING',
    memo: '브레이크 소음 발생',
    created_at: '2026-01-09',
  },
  {
    schedule_id: 4,
    customer_name: '최고객',
    car_number: '11바2233',
    phone: '010-9999-8888',
    schedule_date: '2026-01-08',
    schedule_time: '11:00',
    service_type: '정기점검',
    status: 'CANCELLED',
    created_at: '2026-01-06',
  },
  {
    schedule_id: 5,
    customer_id: 4,
    customer_name: '정대리',
    car_number: '56라7890',
    phone: '010-4567-8901',
    schedule_date: '2026-01-08',
    schedule_time: '15:00',
    service_type: '에어컨 점검',
    status: 'PENDING',
    created_at: '2026-01-05',
  },
  {
    schedule_id: 6,
    customer_name: '최고객',
    car_number: '11바2233',
    phone: '010-9999-8888',
    schedule_date: '2026-01-08',
    schedule_time: '16:00',
    service_type: '정기점검',
    status: 'PENDING',
    created_at: '2026-01-06',
  },
  {
    schedule_id: 7,
    customer_id: 4,
    customer_name: '정대리',
    car_number: '56라7890',
    phone: '010-4567-8901',
    schedule_date: '2026-01-08',
    schedule_time: '17:00',
    service_type: '에어컨 점검',
    status: 'PENDING',
    created_at: '2026-01-05',
  },
];

const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    maintenance_id: 1,
    vehicle_id: 1,
    customer_name: '김철수',
    car_number: '12가3456',
    service_date: '2026-01-02',
    service_items: ['엔진오일 교체', '오일필터 교체', '에어컨 필터 교체'],
    parts_cost: 180000,
    labor_cost: 80000,
    total_cost: 260000,
    mileage: 35000,
    technician: '홍길동',
    memo: '정기점검 완료',
  },
  {
    maintenance_id: 2,
    vehicle_id: 2,
    customer_name: '이영희',
    car_number: '78나9012',
    service_date: '2025-12-28',
    service_items: ['타이어 교체 (4개)', '휠 밸런싱'],
    parts_cost: 480000,
    labor_cost: 80000,
    total_cost: 560000,
    mileage: 47500,
    technician: '김정비',
  },
  {
    maintenance_id: 3,
    vehicle_id: 3,
    customer_name: '박민수',
    car_number: '34다5678',
    service_date: '2025-12-20',
    service_items: ['브레이크 패드 교체', '브레이크 오일 교체'],
    parts_cost: 220000,
    labor_cost: 100000,
    total_cost: 320000,
    mileage: 61800,
    technician: '홍길동',
    memo: '브레이크 소음 해결',
  },
  {
    maintenance_id: 4,
    vehicle_id: 1,
    customer_name: '김철수',
    car_number: '12가3456',
    service_date: '2025-10-15',
    service_items: ['정기점검', '엔진오일 교체'],
    parts_cost: 120000,
    labor_cost: 60000,
    total_cost: 180000,
    mileage: 32000,
    technician: '홍길동',
  },
  {
    maintenance_id: 5,
    vehicle_id: 4,
    customer_name: '정대리',
    car_number: '56라7890',
    service_date: '2025-11-10',
    service_items: ['엔진오일 교체', '와이퍼 교체', '배터리 점검'],
    parts_cost: 250000,
    labor_cost: 70000,
    total_cost: 320000,
    mileage: 14000,
    technician: '김정비',
  },
];

const mockBusinessHours: BusinessHoursConfig[] = [
  { day: 'mon', dayKo: '월요일', isOpen: true, openTime: '09:00', closeTime: '18:00' },
  { day: 'tue', dayKo: '화요일', isOpen: true, openTime: '09:00', closeTime: '18:00' },
  { day: 'wed', dayKo: '수요일', isOpen: true, openTime: '09:00', closeTime: '18:00' },
  { day: 'thu', dayKo: '목요일', isOpen: true, openTime: '09:00', closeTime: '18:00' },
  { day: 'fri', dayKo: '금요일', isOpen: true, openTime: '09:00', closeTime: '18:00' },
  { day: 'sat', dayKo: '토요일', isOpen: true, openTime: '09:00', closeTime: '15:00' },
  { day: 'sun', dayKo: '일요일', isOpen: false, openTime: '09:00', closeTime: '18:00' },
];

const mockMaintenanceItems: MaintenanceItem[] = [
  {
    item_id: 1,
    item_name: '엔진오일 교체',
    category: 'ENGINE',
    default_price: 80000,
    default_duration: 30,
    description: '순정 엔진오일 사용',
    is_active: true,
  },
  {
    item_id: 2,
    item_name: '오일필터 교체',
    category: 'ENGINE',
    default_price: 25000,
    default_duration: 15,
    is_active: true,
  },
  {
    item_id: 3,
    item_name: '브레이크 패드 교체',
    category: 'BRAKE',
    default_price: 180000,
    default_duration: 60,
    description: '전륜 또는 후륜 기준',
    is_active: true,
  },
  {
    item_id: 4,
    item_name: '타이어 교체',
    category: 'SUSPENSION',
    default_price: 120000,
    default_duration: 45,
    description: '1개 기준 가격',
    is_active: true,
  },
  {
    item_id: 5,
    item_name: '배터리 교체',
    category: 'ELECTRICAL',
    default_price: 150000,
    default_duration: 20,
    is_active: true,
  },
  {
    item_id: 6,
    item_name: '에어컨 필터 교체',
    category: 'ETC',
    default_price: 35000,
    default_duration: 15,
    is_active: true,
  },
  {
    item_id: 7,
    item_name: '와이퍼 교체',
    category: 'ETC',
    default_price: 20000,
    default_duration: 10,
    is_active: true,
  },
  {
    item_id: 8,
    item_name: '정기점검',
    category: 'ETC',
    default_price: 50000,
    default_duration: 40,
    description: '종합 점검 서비스',
    is_active: true,
  },
];

export const fetchVehicles = async (): Promise<ApiResponse<Vehicle[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: mockVehicles });
    }, 300);
  });
};

export const fetchSchedules = async (): Promise<ApiResponse<Schedule[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: mockSchedules });
    }, 300);
  });
};

export const fetchMaintenanceRecords = async (): Promise<ApiResponse<MaintenanceRecord[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: mockMaintenanceRecords });
    }, 300);
  });
};

export const fetchBusinessHours = async (): Promise<ApiResponse<BusinessHoursConfig[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: mockBusinessHours });
    }, 300);
  });
};

export const fetchMaintenanceItems = async (): Promise<ApiResponse<MaintenanceItem[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: mockMaintenanceItems });
    }, 300);
  });
};
