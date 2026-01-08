import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import CustomerVehicleNav from '../../src/components/CustomerVehicleNav';
import { fetchMaintenanceRecords } from '../../src/mock/api';
import { MaintenanceRecord } from '../../src/types';

const MaintenanceHistory: React.FC = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MaintenanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleExcelDownload = () => {
    alert('엑셀 다운로드 기능은 Mock으로 구현되었습니다.');
  };

  return (
    <div>
      <h1>고객 / 차량 관리</h1>
      <CustomerVehicleNav />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>정비 이력</h2>
        <Button variant="secondary" onClick={handleExcelDownload}>
          엑셀 다운로드
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
          </Card>
        ))
      )}
    </div>
  );
};

export default MaintenanceHistory;
