import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import CustomerVehicleNav from '../../src/components/CustomerVehicleNav';
import { fetchVehicles } from '../../src/mock/api';
import { Vehicle } from '../../src/types';

const VehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    car_number: '',
    car_model: '',
    car_year: '',
    mileage: '',
    vin: '',
    memo: '',
  });

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

  const openModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      // 수정 모드
      setEditingVehicle(vehicle);
      setFormData({
        customer_name: vehicle.customer_name,
        car_number: vehicle.car_number,
        car_model: vehicle.car_model,
        car_year: vehicle.car_year ? String(vehicle.car_year) : '',
        mileage: vehicle.mileage ? String(vehicle.mileage) : '',
        vin: vehicle.vin || '',
        memo: vehicle.memo || '',
      });
    } else {
      // 등록 모드
      setEditingVehicle(null);
      setFormData({
        customer_name: '',
        car_number: '',
        car_model: '',
        car_year: '',
        mileage: '',
        vin: '',
        memo: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingVehicle) {
      // 수정
      setVehicles(prev => prev.map(vehicle =>
        vehicle.vehicle_id === editingVehicle.vehicle_id
          ? {
              ...vehicle,
              customer_name: formData.customer_name,
              car_number: formData.car_number,
              car_model: formData.car_model,
              car_year: formData.car_year ? Number(formData.car_year) : undefined,
              mileage: formData.mileage ? Number(formData.mileage) : undefined,
              vin: formData.vin,
              memo: formData.memo,
            }
          : vehicle
      ));
      alert('차량 정보가 수정되었습니다 (Mock)');
    } else {
      // 등록
      const newVehicle: Vehicle = {
        vehicle_id: Math.max(0, ...vehicles.map(v => v.vehicle_id)) + 1,
        customer_name: formData.customer_name,
        car_number: formData.car_number,
        car_model: formData.car_model,
        car_year: formData.car_year ? Number(formData.car_year) : undefined,
        mileage: formData.mileage ? Number(formData.mileage) : undefined,
        vin: formData.vin,
        memo: formData.memo,
        created_at: new Date().toISOString().split('T')[0],
      };
      setVehicles(prev => [...prev, newVehicle]);
      alert('차량이 등록되었습니다 (Mock)');
    }
    closeModal();
  };

  const handleDelete = (vehicleId: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setVehicles(prev => prev.filter(vehicle => vehicle.vehicle_id !== vehicleId));
      alert('차량이 삭제되었습니다 (Mock)');
    }
  };

  return (
    <div>
      <h1>고객 / 차량 관리</h1>
      <CustomerVehicleNav />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>차량 관리</h2>
        <Button onClick={() => openModal()}>
          차량 등록
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
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <Button size="small" onClick={() => openModal(vehicle)}>수정</Button>
              <Button size="small" variant="secondary" onClick={() => handleDelete(vehicle.vehicle_id)}>삭제</Button>
            </div>
          </Card>
        ))
      )}

      {/* 차량 등록/수정 모달 */}
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
                {editingVehicle ? '차량 정보 수정' : '차량 등록'}
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
                  label="차량 모델"
                  value={formData.car_model}
                  onChange={(e) => setFormData({ ...formData, car_model: e.target.value })}
                  placeholder="소나타"
                  required
                />
                <Input
                  type="number"
                  label="연식"
                  value={formData.car_year}
                  onChange={(e) => setFormData({ ...formData, car_year: e.target.value })}
                  placeholder="2020"
                />
                <Input
                  type="number"
                  label="주행거리 (km)"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  placeholder="50000"
                />
                <Input
                  label="차대번호 (VIN)"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  placeholder="KMHXX00XXXX000000"
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
                    {editingVehicle ? '수정' : '등록'}
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

export default VehiclesPage;
