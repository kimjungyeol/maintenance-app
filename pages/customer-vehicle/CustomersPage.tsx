import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import CustomerVehicleNav from '../../src/components/CustomerVehicleNav';
import { fetchCustomers } from '../../src/mock/api';
import { Customer } from '../../src/types';

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    car_number: '',
    phone: '',
    email: '',
    memo: '',
  });
  const [filters, setFilters] = useState({
    customer_name: '',
    car_number: '',
    phone: '',
    email: '',
    memo: '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers, filters]);

  const loadCustomers = async () => {
    const response = await fetchCustomers();
    if (response.success) {
      setCustomers(response.data);
    }
  };

  const applyFilters = () => {
    let filtered = [...customers];

    if (filters.customer_name) {
      filtered = filtered.filter(c =>
        c.customer_name.toLowerCase().includes(filters.customer_name.toLowerCase())
      );
    }
    if (filters.car_number) {
      filtered = filtered.filter(c =>
        c.car_number.toLowerCase().includes(filters.car_number.toLowerCase())
      );
    }
    if (filters.phone) {
      filtered = filtered.filter(c =>
        c.phone.includes(filters.phone)
      );
    }
    if (filters.email) {
      filtered = filtered.filter(c =>
        c.email?.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    if (filters.memo) {
      filtered = filtered.filter(c =>
        c.memo?.toLowerCase().includes(filters.memo.toLowerCase())
      );
    }

    setFilteredCustomers(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      customer_name: customer.customer_name,
      car_number: customer.car_number,
      phone: customer.phone,
      email: customer.email || '',
      memo: customer.memo || '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('고객 정보 수정 기능은 Mock 데이터로 시뮬레이션됩니다.');
    setEditingCustomer(null);
    setFormData({
      customer_name: '',
      car_number: '',
      phone: '',
      email: '',
      memo: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditingCustomer(null);
    setFormData({
      customer_name: '',
      car_number: '',
      phone: '',
      email: '',
      memo: '',
    });
  };

  const handleExcelDownload = () => {
    alert('엑셀 다운로드 기능은 Mock으로 구현되었습니다.');
  };

  return (
    <div>
      <h1>고객 / 차량 관리</h1>
      <CustomerVehicleNav />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>고객 관리</h2>
        <Button variant="secondary" onClick={handleExcelDownload}>
          엑셀 다운로드
        </Button>
      </div>

      {editingCustomer && (
        <Card style={{ marginBottom: '16px' }}>
          <h2>고객 정보 수정</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                name="customer_name"
                placeholder="고객명 *"
                value={formData.customer_name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="car_number"
                placeholder="차량번호 *"
                value={formData.car_number}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="전화번호 *"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="이메일"
                value={formData.email}
                onChange={handleInputChange}
              />
              <textarea
                name="memo"
                placeholder="메모"
                value={formData.memo}
                onChange={handleInputChange}
                style={{
                  minHeight: '80px',
                  padding: '12px',
                  borderRadius: 'var(--card-radius)',
                  border: '1px solid #ddd',
                  fontSize: 'var(--font-base)',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button type="submit">저장</Button>
                <Button type="button" variant="secondary" onClick={handleCancel}>취소</Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      <Card style={{ marginBottom: '16px' }}>
        <h2>필터</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          <input
            type="text"
            name="customer_name"
            placeholder="고객명 검색"
            value={filters.customer_name}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="car_number"
            placeholder="차량번호 검색"
            value={filters.car_number}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="전화번호 검색"
            value={filters.phone}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="email"
            placeholder="이메일 검색"
            value={filters.email}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="memo"
            placeholder="메모 검색"
            value={filters.memo}
            onChange={handleFilterChange}
          />
        </div>
      </Card>

      <Card>
        <h2>고객 목록 ({filteredCustomers.length}명 / 전체 {customers.length}명)</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 'var(--font-base)',
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '12px 8px', textAlign: 'left' }}>고객명</th>
                <th style={{ padding: '12px 8px', textAlign: 'left' }}>차량번호</th>
                <th style={{ padding: '12px 8px', textAlign: 'left' }}>전화번호</th>
                <th style={{ padding: '12px 8px', textAlign: 'left' }}>이메일</th>
                <th style={{ padding: '12px 8px', textAlign: 'left' }}>메모</th>
                <th style={{ padding: '12px 8px', textAlign: 'left' }}>등록일</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.customer_id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td
                    style={{
                      padding: '12px 8px',
                      color: 'var(--primary-color)',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                    onClick={() => handleCustomerClick(customer)}
                  >
                    {customer.customer_name}
                  </td>
                  <td style={{ padding: '12px 8px' }}>{customer.car_number}</td>
                  <td style={{ padding: '12px 8px' }}>{customer.phone}</td>
                  <td style={{ padding: '12px 8px' }}>{customer.email || '-'}</td>
                  <td style={{ padding: '12px 8px' }}>{customer.memo || '-'}</td>
                  <td style={{ padding: '12px 8px' }}>{customer.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CustomersPage;
