import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import CustomerVehicleNav from '../../src/components/CustomerVehicleNav';
import { fetchVehicles } from '../../src/mock/api';
import { Vehicle } from '../../src/types';

const VehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = vehicles.filter(v =>
        v.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.car_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.car_model.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicles);
    }
  }, [searchTerm, vehicles]);

  const loadVehicles = async () => {
    const response = await fetchVehicles();
    if (response.success) {
      setVehicles(response.data);
    }
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
        <h2 style={{ margin: 0 }}>차량 관리</h2>
        <Button variant="secondary" onClick={handleExcelDownload}>
          엑셀 다운로드
        </Button>
      </div>

      <Card style={{ marginBottom: '16px' }}>
        <h2>차량 검색</h2>
        <input
          type="text"
          placeholder="고객명, 차량번호, 차량 모델로 검색"
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
        총 {filteredVehicles.length}대 / 전체 {vehicles.length}대
      </div>

      {filteredVehicles.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
            {searchTerm ? '검색 결과가 없습니다.' : '등록된 차량이 없습니다.'}
          </div>
        </Card>
      ) : (
        filteredVehicles.map((vehicle) => (
          <Card key={vehicle.vehicle_id}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              paddingBottom: '12px',
              borderBottom: '2px solid var(--primary-color)',
            }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>
                  {vehicle.car_number}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {vehicle.customer_name}
                </div>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--primary-color)' }}>
                {vehicle.car_model}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr',
              gap: '8px',
              fontSize: '14px',
            }}>
              {vehicle.car_year && (
                <>
                  <span style={{ color: '#666', fontWeight: 500 }}>연식</span>
                  <span style={{ color: '#222', fontWeight: 600 }}>{vehicle.car_year}년</span>
                </>
              )}

              <span style={{ color: '#666', fontWeight: 500 }}>주행거리</span>
              <span style={{ color: '#222', fontWeight: 600 }}>{formatMileage(vehicle.mileage)}</span>

              {vehicle.vin && (
                <>
                  <span style={{ color: '#666', fontWeight: 500 }}>차대번호</span>
                  <span style={{ color: '#222', fontWeight: 600, fontSize: '12px' }}>{vehicle.vin}</span>
                </>
              )}

              <span style={{ color: '#666', fontWeight: 500 }}>등록일</span>
              <span style={{ color: '#222', fontWeight: 600 }}>{vehicle.created_at}</span>

              {vehicle.memo && (
                <>
                  <span style={{ color: '#666', fontWeight: 500 }}>메모</span>
                  <span style={{ color: '#222' }}>{vehicle.memo}</span>
                </>
              )}
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default VehiclesPage;
