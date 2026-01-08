import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import MonthFilter from '../../src/components/MonthFilter';
import ExpensePayrollNav from '../../src/components/ExpensePayrollNav';
import { fetchEmployees, fetchPayrolls } from '../../src/mock/api';
import { Employee, Payroll } from '../../src/types';

const PayrollPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

  useEffect(() => {
    const loadData = async () => {
      const [empResponse, payResponse] = await Promise.all([
        fetchEmployees(),
        fetchPayrolls(),
      ]);
      if (empResponse.success) setEmployees(empResponse.data);
      if (payResponse.success) setPayrolls(payResponse.data);
    };
    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  const getEmployeeName = (empId: number) => {
    const employee = employees.find((e) => e.emp_id === empId);
    return employee?.emp_name || '알 수 없음';
  };

  const handleExcelDownload = () => {
    alert('엑셀 다운로드 기능은 Mock으로 구현되었습니다.');
  };

  const selectedMonthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
  const filteredPayrolls = payrolls.filter((payroll) =>
    payroll.pay_month === selectedMonthStr
  );

  return (
    <div>
      <h1>지출 / 급여 관리</h1>
      <ExpensePayrollNav />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>급여 관리</h2>
        <Button variant="secondary" onClick={handleExcelDownload}>
          엑셀 다운로드
        </Button>
      </div>

      <h2>직원 목록</h2>
      {employees.map((employee) => (
        <Card key={employee.emp_id}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            paddingBottom: '12px',
            borderBottom: '2px solid var(--primary-color)',
          }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>
              {employee.emp_name}
            </div>
            <div style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '18px' }}>
              {formatCurrency(employee.monthly_pay)}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', fontSize: '14px' }}>
            <span style={{ color: '#666', fontWeight: 500 }}>직책</span>
            <span style={{ color: '#222', fontWeight: 600 }}>{employee.role}</span>

            <span style={{ color: '#666', fontWeight: 500 }}>입사일</span>
            <span style={{ color: '#222', fontWeight: 600 }}>{employee.join_date}</span>
          </div>
        </Card>
      ))}

      <div style={{ marginTop: '32px' }}>
        <MonthFilter
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={setSelectedYear}
          onMonthChange={setSelectedMonth}
        />
      </div>

      <h2>급여 지급 내역</h2>
      {filteredPayrolls.map((payroll) => (
        <Card key={payroll.payroll_id}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            paddingBottom: '12px',
            borderBottom: '2px solid #ef4444',
          }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>
              {getEmployeeName(payroll.emp_id)}
            </div>
            <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '18px' }}>
              -{formatCurrency(payroll.pay_amount)}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', fontSize: '14px' }}>
            <span style={{ color: '#666', fontWeight: 500 }}>지급월</span>
            <span style={{ color: '#222', fontWeight: 600 }}>{payroll.pay_month}</span>

            <span style={{ color: '#666', fontWeight: 500 }}>지급일</span>
            <span style={{ color: '#222', fontWeight: 600 }}>{payroll.paid_date}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PayrollPage;
