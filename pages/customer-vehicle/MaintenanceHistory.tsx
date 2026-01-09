import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import CustomerVehicleNav from '../../src/components/CustomerVehicleNav';
import { fetchMaintenanceRecords } from '../../src/mock/api';
import { MaintenanceRecord } from '../../src/types';

const MaintenanceHistory: React.FC = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MaintenanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    car_number: '',
    service_date: new Date().toISOString().split('T')[0],
    service_items: '',
    parts_cost: '',
    labor_cost: '',
    mileage: '',
    technician: '',
    memo: '',
  });

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = records.filter(r =>
        r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.car_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.service_items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(records);
    }
  }, [searchTerm, records]);

  const loadRecords = async () => {
    const response = await fetchMaintenanceRecords();
    if (response.success) {
      // 날짜 내림차순 정렬
      const sorted = response.data.sort((a, b) =>
        new Date(b.service_date).getTime() - new Date(a.service_date).getTime()
      );
      setRecords(sorted);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  const formatMileage = (mileage?: number) => {
    if (!mileage) return '-';
    return mileage.toLocaleString('ko-KR') + ' km';
  };

  const openModal = (record?: MaintenanceRecord) => {
    if (record) {
      // 수정 모드
      setEditingRecord(record);
      setFormData({
        customer_name: record.customer_name,
        car_number: record.car_number,
        service_date: record.service_date,
        service_items: record.service_items.join(', '),
        parts_cost: String(record.parts_cost),
        labor_cost: String(record.labor_cost),
        mileage: record.mileage ? String(record.mileage) : '',
        technician: record.technician || '',
        memo: record.memo || '',
      });
    } else {
      // 등록 모드
      setEditingRecord(null);
      setFormData({
        customer_name: '',
        car_number: '',
        service_date: new Date().toISOString().split('T')[0],
        service_items: '',
        parts_cost: '',
        labor_cost: '',
        mileage: '',
        technician: '',
        memo: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const serviceItemsArray = formData.service_items
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const partsCost = Number(formData.parts_cost) || 0;
    const laborCost = Number(formData.labor_cost) || 0;

    if (editingRecord) {
      // 수정
      setRecords(prev => prev.map(record =>
        record.maintenance_id === editingRecord.maintenance_id
          ? {
              ...record,
              customer_name: formData.customer_name,
              car_number: formData.car_number,
              service_date: formData.service_date,
              service_items: serviceItemsArray,
              parts_cost: partsCost,
              labor_cost: laborCost,
              total_cost: partsCost + laborCost,
              mileage: formData.mileage ? Number(formData.mileage) : undefined,
              technician: formData.technician,
              memo: formData.memo,
            }
          : record
      ));
      alert('정비 이력이 수정되었습니다 (Mock)');
    } else {
      // 등록
      const newRecord: MaintenanceRecord = {
        maintenance_id: Math.max(0, ...records.map(r => r.maintenance_id)) + 1,
        customer_name: formData.customer_name,
        car_number: formData.car_number,
        service_date: formData.service_date,
        service_items: serviceItemsArray,
        parts_cost: partsCost,
        labor_cost: laborCost,
        total_cost: partsCost + laborCost,
        mileage: formData.mileage ? Number(formData.mileage) : undefined,
        technician: formData.technician,
        memo: formData.memo,
      };
      setRecords(prev => [newRecord, ...prev]);
      alert('정비 이력이 등록되었습니다 (Mock)');
    }
    closeModal();
  };

  const handleDelete = (maintenanceId: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setRecords(prev => prev.filter(record => record.maintenance_id !== maintenanceId));
      alert('정비 이력이 삭제되었습니다 (Mock)');
    }
  };

  return (
    <div>
      <h1>고객 / 차량 관리</h1>
      <CustomerVehicleNav />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>정비 이력</h2>
        <Button onClick={() => openModal()}>
          정비 이력 등록
        </Button>
      </div>

      <Card style={{ marginBottom: '16px' }}>
        <h2>이력 검색</h2>
        <input
          type="text"
          placeholder="고객명, 차량번호, 작업 내역으로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 'var(--card-radius)',
            border: '1px solid #ddd',
            fontSize: 'var(--font-base)',
          }}
        />
      </Card>

      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
        총 {filteredRecords.length}건 / 전체 {records.length}건
      </div>

      {filteredRecords.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
            {searchTerm ? '검색 결과가 없습니다.' : '정비 이력이 없습니다.'}
          </div>
        </Card>
      ) : (
        filteredRecords.map((record) => (
          <Card key={record.maintenance_id}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              paddingBottom: '12px',
              borderBottom: '2px solid var(--primary-color)',
            }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>
                  {record.service_date}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {record.customer_name} - {record.car_number}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  {formatCurrency(record.total_cost)}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
                작업 내역
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {record.service_items.map((item, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#eff6ff',
                      color: '#3b82f6',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 500,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr',
              gap: '8px',
              fontSize: '14px',
            }}>
              <span style={{ color: '#666', fontWeight: 500 }}>부품비</span>
              <span style={{ color: '#222', fontWeight: 600 }}>{formatCurrency(record.parts_cost)}</span>

              <span style={{ color: '#666', fontWeight: 500 }}>공임비</span>
              <span style={{ color: '#222', fontWeight: 600 }}>{formatCurrency(record.labor_cost)}</span>

              <span style={{ color: '#666', fontWeight: 500 }}>주행거리</span>
              <span style={{ color: '#222', fontWeight: 600 }}>{formatMileage(record.mileage)}</span>

              {record.technician && (
                <>
                  <span style={{ color: '#666', fontWeight: 500 }}>담당자</span>
                  <span style={{ color: '#222', fontWeight: 600 }}>{record.technician}</span>
                </>
              )}

              {record.memo && (
                <>
                  <span style={{ color: '#666', fontWeight: 500 }}>메모</span>
                  <span style={{ color: '#222' }}>{record.memo}</span>
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <Button size="small" onClick={() => openModal(record)}>수정</Button>
              <Button size="small" variant="secondary" onClick={() => handleDelete(record.maintenance_id)}>삭제</Button>
            </div>
          </Card>
        ))
      )}

      {/* 정비 이력 등록/수정 모달 */}
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
                {editingRecord ? '정비 이력 수정' : '정비 이력 등록'}
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
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="홍길동"
                  required
                />
                <Input
                  label="차량번호"
                  value={formData.car_number}
                  onChange={(e) => setFormData({ ...formData, car_number: e.target.value })}
                  placeholder="12가3456"
                  required
                />
                <Input
                  type="date"
                  label="정비일"
                  value={formData.service_date}
                  onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                  required
                />
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                    작업 내역 <span style={{ color: 'red' }}>*</span>
                  </label>
                  <textarea
                    value={formData.service_items}
                    onChange={(e) => setFormData({ ...formData, service_items: e.target.value })}
                    placeholder="엔진오일 교체, 브레이크 패드 교체 (쉼표로 구분)"
                    required
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
                <Input
                  type="number"
                  label="부품비"
                  value={formData.parts_cost}
                  onChange={(e) => setFormData({ ...formData, parts_cost: e.target.value })}
                  placeholder="0"
                  required
                />
                <Input
                  type="number"
                  label="공임비"
                  value={formData.labor_cost}
                  onChange={(e) => setFormData({ ...formData, labor_cost: e.target.value })}
                  placeholder="0"
                  required
                />
                <Input
                  type="number"
                  label="주행거리 (km)"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  placeholder="50000"
                />
                <Input
                  label="담당자"
                  value={formData.technician}
                  onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                  placeholder="정비사 이름"
                />
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                    메모
                  </label>
                  <textarea
                    value={formData.memo}
                    onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
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
                    {editingRecord ? '수정' : '등록'}
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

export default MaintenanceHistory;
