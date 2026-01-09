import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import CustomerVehicleNav from '../../src/components/CustomerVehicleNav';
import { fetchCustomers } from '../../src/mock/api';
import { Customer } from '../../src/types';

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const openModal = (customer?: Customer) => {
    if (customer) {
      // 수정 모드
      setEditingCustomer(customer);
      setFormData({
        customer_name: customer.customer_name,
        car_number: customer.car_number,
        phone: customer.phone,
        email: customer.email || '',
        memo: customer.memo || '',
      });
    } else {
      // 등록 모드
      setEditingCustomer(null);
      setFormData({
        customer_name: '',
        car_number: '',
        phone: '',
        email: '',
        memo: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCustomer) {
      // 수정
      setCustomers(prev => prev.map(customer =>
        customer.customer_id === editingCustomer.customer_id
          ? {
              ...customer,
              customer_name: formData.customer_name,
              car_number: formData.car_number,
              phone: formData.phone,
              email: formData.email,
              memo: formData.memo,
            }
          : customer
      ));
      alert('고객 정보가 수정되었습니다 (Mock)');
    } else {
      // 등록
      const newCustomer: Customer = {
        customer_id: Math.max(0, ...customers.map(c => c.customer_id)) + 1,
        customer_name: formData.customer_name,
        car_number: formData.car_number,
        phone: formData.phone,
        email: formData.email,
        memo: formData.memo,
        created_at: new Date().toISOString().split('T')[0],
      };
      setCustomers(prev => [...prev, newCustomer]);
      alert('고객이 등록되었습니다 (Mock)');
    }
    closeModal();
  };

  const handleDelete = (customerId: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setCustomers(prev => prev.filter(customer => customer.customer_id !== customerId));
      alert('고객이 삭제되었습니다 (Mock)');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h1>고객 / 차량 관리</h1>
      <CustomerVehicleNav />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>고객 관리</h2>
        <Button onClick={() => openModal()}>
          고객 등록
        </Button>
      </div>

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
                <th style={{ padding: '12px 8px', textAlign: 'center' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.customer_id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 500 }}>
                    {customer.customer_name}
                  </td>
                  <td style={{ padding: '12px 8px' }}>{customer.car_number}</td>
                  <td style={{ padding: '12px 8px' }}>{customer.phone}</td>
                  <td style={{ padding: '12px 8px' }}>{customer.email || '-'}</td>
                  <td style={{ padding: '12px 8px' }}>{customer.memo || '-'}</td>
                  <td style={{ padding: '12px 8px' }}>{customer.created_at}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <Button size="small" onClick={() => openModal(customer)}>수정</Button>
                      <Button size="small" variant="secondary" onClick={() => handleDelete(customer.customer_id)}>삭제</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 고객 등록/수정 모달 */}
      {isModalOpen && (
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
                {editingCustomer ? '고객 정보 수정' : '고객 등록'}
              </h2>
              <button
                onClick={closeModal}
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
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{
                padding: '24px',
                overflowY: 'auto',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                <Input
                  label="고객명"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  placeholder="홍길동"
                  required
                />
                <Input
                  label="차량번호"
                  name="car_number"
                  value={formData.car_number}
                  onChange={handleInputChange}
                  placeholder="12가3456"
                  required
                />
                <Input
                  type="tel"
                  label="전화번호"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="010-1234-5678"
                  required
                />
                <Input
                  type="email"
                  label="이메일"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                />
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                    메모
                  </label>
                  <textarea
                    name="memo"
                    value={formData.memo}
                    onChange={handleInputChange}
                    placeholder="추가 정보를 입력하세요"
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '12px',
                      borderRadius: 'var(--card-radius)',
                      border: '1px solid #ddd',
                      fontSize: 'var(--font-base)',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>
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
                    {editingCustomer ? '수정' : '등록'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={closeModal}>
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

export default CustomersPage;
