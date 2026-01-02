import React, { useEffect, useState } from 'react';
import Card from '../src/components/Card';
import { fetchEmployees, fetchPayrolls } from '../src/mock/api';
import { Employee, Payroll } from '../src/types';

const PayrollPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);

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

  return (
    <div>
      <h1>급여 관리</h1>

      <h2>직원 목록</h2>
      {employees.map((employee) => (
        <Card key={employee.emp_id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <div style={{ fontWeight: 500 }}>{employee.emp_name}</div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                {employee.role} | 입사일: {employee.join_date}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                월급: {formatCurrency(employee.monthly_pay)}
              </div>
            </div>
          </div>
        </Card>
      ))}

      <h2 style={{ marginTop: '32px' }}>급여 지급 내역</h2>
      {payrolls.map((payroll) => (
        <Card key={payroll.payroll_id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontWeight: 500 }}>
              {getEmployeeName(payroll.emp_id)}
            </span>
            <span style={{ color: 'red', fontWeight: 'bold' }}>
              -{formatCurrency(payroll.pay_amount)}
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            {payroll.pay_month} | 지급일: {payroll.paid_date}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PayrollPage;
