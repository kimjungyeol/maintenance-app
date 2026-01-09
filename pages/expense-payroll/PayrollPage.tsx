import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
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

  // 직원 등록/수정 모달
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeForm, setEmployeeForm] = useState({
    emp_name: '',
    role: '',
    monthly_pay: '',
    join_date: new Date().toISOString().split('T')[0],
  });

  // 급여 지급 등록/수정 모달
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<Payroll | null>(null);
  const [payrollForm, setPayrollForm] = useState({
    emp_id: '',
    pay_month: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
    pay_amount: '',
    paid_date: new Date().toISOString().split('T')[0],
  });

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

  // 직원 등록/수정 관련
  const openEmployeeModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setEmployeeForm({
        emp_name: employee.emp_name,
        role: employee.role,
        monthly_pay: String(employee.monthly_pay),
        join_date: employee.join_date,
      });
    } else {
      setEditingEmployee(null);
      setEmployeeForm({
        emp_name: '',
        role: '',
        monthly_pay: '',
        join_date: new Date().toISOString().split('T')[0],
      });
    }
    setIsEmployeeModalOpen(true);
  };

  const closeEmployeeModal = () => {
    setIsEmployeeModalOpen(false);
    setEditingEmployee(null);
  };

  const handleEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEmployee) {
      // 수정
      setEmployees(prev => prev.map(emp =>
        emp.emp_id === editingEmployee.emp_id
          ? { ...emp, ...employeeForm, monthly_pay: Number(employeeForm.monthly_pay) }
          : emp
      ));
      alert('직원 정보가 수정되었습니다 (Mock)');
    } else {
      // 등록
      const newEmployee: Employee = {
        emp_id: Math.max(0, ...employees.map(e => e.emp_id)) + 1,
        emp_name: employeeForm.emp_name,
        role: employeeForm.role,
        monthly_pay: Number(employeeForm.monthly_pay),
        join_date: employeeForm.join_date,
      };
      setEmployees(prev => [...prev, newEmployee]);
      alert('직원이 등록되었습니다 (Mock)');
    }
    closeEmployeeModal();
  };

  const handleDeleteEmployee = (empId: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setEmployees(prev => prev.filter(emp => emp.emp_id !== empId));
      alert('직원이 삭제되었습니다 (Mock)');
    }
  };

  // 급여 지급 등록/수정 관련
  const openPayrollModal = (payroll?: Payroll) => {
    if (payroll) {
      setEditingPayroll(payroll);
      setPayrollForm({
        emp_id: String(payroll.emp_id),
        pay_month: payroll.pay_month,
        pay_amount: String(payroll.pay_amount),
        paid_date: payroll.paid_date,
      });
    } else {
      setEditingPayroll(null);
      setPayrollForm({
        emp_id: '',
        pay_month: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
        pay_amount: '',
        paid_date: new Date().toISOString().split('T')[0],
      });
    }
    setIsPayrollModalOpen(true);
  };

  const closePayrollModal = () => {
    setIsPayrollModalOpen(false);
    setEditingPayroll(null);
  };

  const handlePayrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPayroll) {
      // 수정
      setPayrolls(prev => prev.map(pay =>
        pay.payroll_id === editingPayroll.payroll_id
          ? {
              ...pay,
              emp_id: Number(payrollForm.emp_id),
              pay_month: payrollForm.pay_month,
              pay_amount: Number(payrollForm.pay_amount),
              paid_date: payrollForm.paid_date,
            }
          : pay
      ));
      alert('급여 지급 내역이 수정되었습니다 (Mock)');
    } else {
      // 등록
      const newPayroll: Payroll = {
        payroll_id: Math.max(0, ...payrolls.map(p => p.payroll_id)) + 1,
        emp_id: Number(payrollForm.emp_id),
        pay_month: payrollForm.pay_month,
        pay_amount: Number(payrollForm.pay_amount),
        paid_date: payrollForm.paid_date,
      };
      setPayrolls(prev => [...prev, newPayroll]);
      alert('급여 지급 내역이 등록되었습니다 (Mock)');
    }
    closePayrollModal();
  };

  const handleDeletePayroll = (payrollId: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setPayrolls(prev => prev.filter(pay => pay.payroll_id !== payrollId));
      alert('급여 지급 내역이 삭제되었습니다 (Mock)');
    }
  };

  const selectedMonthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
  const filteredPayrolls = payrolls.filter((payroll) =>
    payroll.pay_month === selectedMonthStr
  );

  return (
    <div>
      <h1>지출 / 급여 관리</h1>
      <ExpensePayrollNav />
      <h2>급여 관리</h2>

      {/* 직원 목록 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ margin: 0 }}>직원 목록</h2>
        <Button onClick={() => openEmployeeModal()}>직원 등록</Button>
      </div>

      {employees.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', color: '#999', padding: '24px' }}>
            등록된 직원이 없습니다.
          </div>
        </Card>
      ) : (
        employees.map((employee) => (
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
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', fontSize: '14px', marginBottom: '12px' }}>
              <span style={{ color: '#666', fontWeight: 500 }}>직책</span>
              <span style={{ color: '#222', fontWeight: 600 }}>{employee.role}</span>

              <span style={{ color: '#666', fontWeight: 500 }}>입사일</span>
              <span style={{ color: '#222', fontWeight: 600 }}>{employee.join_date}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button size="small" onClick={() => openEmployeeModal(employee)}>수정</Button>
              <Button size="small" variant="secondary" onClick={() => handleDeleteEmployee(employee.emp_id)}>삭제</Button>
            </div>
          </Card>
        ))
      )}

      {/* 급여 지급 내역 */}
      <div style={{ marginTop: '32px' }}>
        <MonthFilter
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={setSelectedYear}
          onMonthChange={setSelectedMonth}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', marginTop: '16px' }}>
        <h2 style={{ margin: 0 }}>급여 지급 내역</h2>
        <Button onClick={() => openPayrollModal()}>급여 지급 등록</Button>
      </div>

      {filteredPayrolls.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', color: '#999', padding: '24px' }}>
            {selectedYear}년 {selectedMonth}월 급여 지급 내역이 없습니다.
          </div>
        </Card>
      ) : (
        filteredPayrolls.map((payroll) => (
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
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', fontSize: '14px', marginBottom: '12px' }}>
              <span style={{ color: '#666', fontWeight: 500 }}>지급월</span>
              <span style={{ color: '#222', fontWeight: 600 }}>{payroll.pay_month}</span>

              <span style={{ color: '#666', fontWeight: 500 }}>지급일</span>
              <span style={{ color: '#222', fontWeight: 600 }}>{payroll.paid_date}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button size="small" onClick={() => openPayrollModal(payroll)}>수정</Button>
              <Button size="small" variant="secondary" onClick={() => handleDeletePayroll(payroll.payroll_id)}>삭제</Button>
            </div>
          </Card>
        ))
      )}

      {/* 직원 등록/수정 모달 */}
      {isEmployeeModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px',
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* 헤더 - 고정 영역 */}
            <div style={{
              padding: '24px',
              borderBottom: '2px solid #e5e7eb',
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
                {editingEmployee ? '직원 수정' : '직원 등록'}
              </h2>
              <button
                onClick={closeEmployeeModal}
                type="button"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  color: '#666',
                  fontSize: '20px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* 폼 영역 - 스크롤 가능 */}
            <form onSubmit={handleEmployeeSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{
                padding: '24px',
                overflowY: 'auto',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                <Input
                  label="직원명"
                  value={employeeForm.emp_name}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, emp_name: e.target.value }))}
                  placeholder="홍길동"
                  required
                />

                <Input
                  label="직책"
                  value={employeeForm.role}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="정비사, 매니저 등"
                  required
                />

                <Input
                  label="월급여"
                  type="number"
                  value={employeeForm.monthly_pay}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, monthly_pay: e.target.value }))}
                  placeholder="3000000"
                  required
                />

                <Input
                  label="입사일"
                  type="date"
                  value={employeeForm.join_date}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, join_date: e.target.value }))}
                  required
                />
              </div>

              {/* 버튼 영역 - 고정 */}
              <div style={{
                padding: '24px',
                borderTop: '2px solid #e5e7eb',
                flexShrink: 0,
                backgroundColor: '#fff',
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button type="submit" fullWidth>
                    {editingEmployee ? '수정' : '등록'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={closeEmployeeModal}>
                    취소
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 급여 지급 등록/수정 모달 */}
      {isPayrollModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px',
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* 헤더 - 고정 영역 */}
            <div style={{
              padding: '24px',
              borderBottom: '2px solid #e5e7eb',
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
                {editingPayroll ? '급여 지급 수정' : '급여 지급 등록'}
              </h2>
              <button
                onClick={closePayrollModal}
                type="button"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  color: '#666',
                  fontSize: '20px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* 폼 영역 - 스크롤 가능 */}
            <form onSubmit={handlePayrollSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{
                padding: '24px',
                overflowY: 'auto',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                    직원 <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    value={payrollForm.emp_id}
                    onChange={(e) => setPayrollForm(prev => ({ ...prev, emp_id: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 'var(--card-radius)',
                      border: '1px solid #ddd',
                      fontSize: 'var(--font-base)',
                      minHeight: '44px',
                    }}
                  >
                    <option value="">직원을 선택하세요</option>
                    {employees.map(emp => (
                      <option key={emp.emp_id} value={emp.emp_id}>
                        {emp.emp_name} ({emp.role})
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="지급월"
                  type="month"
                  value={payrollForm.pay_month}
                  onChange={(e) => setPayrollForm(prev => ({ ...prev, pay_month: e.target.value }))}
                  required
                />

                <Input
                  label="지급액"
                  type="number"
                  value={payrollForm.pay_amount}
                  onChange={(e) => setPayrollForm(prev => ({ ...prev, pay_amount: e.target.value }))}
                  placeholder="3000000"
                  required
                />

                <Input
                  label="지급일"
                  type="date"
                  value={payrollForm.paid_date}
                  onChange={(e) => setPayrollForm(prev => ({ ...prev, paid_date: e.target.value }))}
                  required
                />
              </div>

              {/* 버튼 영역 - 고정 */}
              <div style={{
                padding: '24px',
                borderTop: '2px solid #e5e7eb',
                flexShrink: 0,
                backgroundColor: '#fff',
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button type="submit" fullWidth>
                    {editingPayroll ? '수정' : '등록'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={closePayrollModal}>
                    취소
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollPage;
