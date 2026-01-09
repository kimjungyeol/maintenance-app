import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import ScheduleNav from '../../src/components/ScheduleNav';
import { fetchMaintenanceItems } from '../../src/mock/api';
import { MaintenanceItem } from '../../src/types';

const BookingCreate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    customer_name: '',
    car_number: '',
    phone: '',
    schedule_date: new Date().toISOString().split('T')[0],
    schedule_time: '10:00',
    service_type: '',
    memo: '',
  });

  const [serviceInputMode, setServiceInputMode] = useState<'select' | 'manual'>('select');
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    loadMaintenanceItems();

    // URL 파라미터에서 날짜와 시간 읽기
    const dateParam = searchParams.get('date');
    const timeParam = searchParams.get('time');

    if (dateParam || timeParam) {
      setFormData(prev => ({
        ...prev,
        ...(dateParam && { schedule_date: dateParam }),
        ...(timeParam && { schedule_time: timeParam }),
      }));
    }
  }, [searchParams]);

  const loadMaintenanceItems = async () => {
    const response = await fetchMaintenanceItems();
    if (response.success) {
      // 활성화된 항목만 필터링
      setMaintenanceItems(response.data.filter(item => item.is_active));
    }
  };

  const handleServiceSelect = (serviceName: string) => {
    if (serviceName && !selectedServices.includes(serviceName)) {
      setSelectedServices(prev => [...prev, serviceName]);
    }
  };

  const handleRemoveService = (serviceName: string) => {
    setSelectedServices(prev => prev.filter(s => s !== serviceName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 선택 모드일 때는 selectedServices를 사용하고, 직접 입력일 때는 formData.service_type 사용
    const serviceType = serviceInputMode === 'select'
      ? selectedServices.join(', ')
      : formData.service_type;

    if (!serviceType) {
      alert('서비스를 선택하거나 입력해주세요');
      return;
    }

    alert('예약이 등록되었습니다 (Mock)');
    // 폼 초기화
    setFormData({
      customer_name: '',
      car_number: '',
      phone: '',
      schedule_date: new Date().toISOString().split('T')[0],
      schedule_time: '10:00',
      service_type: '',
      memo: '',
    });
    setSelectedServices([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 시간 옵션 생성 (09:00 ~ 18:00, 30분 단위)
  const timeOptions: string[] = [];
  for (let hour = 9; hour <= 18; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 18) {
      timeOptions.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  return (
    <div>
      <h1>스케줄 관리</h1>
      <ScheduleNav />

      <Card>
        <h2>예약 정보 입력</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
              label="연락처"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="010-1234-5678"
              required
            />

            <Input
              label="예약일"
              type="date"
              name="schedule_date"
              value={formData.schedule_date}
              onChange={handleInputChange}
              required
            />

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                예약시간 <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                name="schedule_time"
                value={formData.schedule_time}
                onChange={handleInputChange}
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
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                서비스 종류 <span style={{ color: 'red' }}>*</span>
              </label>

              {/* 입력 모드 선택 라디오 버튼 */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '12px',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}>
                  <input
                    type="radio"
                    name="serviceInputMode"
                    value="select"
                    checked={serviceInputMode === 'select'}
                    onChange={() => {
                      setServiceInputMode('select');
                      setFormData(prev => ({ ...prev, service_type: '' }));
                      setSelectedServices([]);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>항목 선택</span>
                </label>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}>
                  <input
                    type="radio"
                    name="serviceInputMode"
                    value="manual"
                    checked={serviceInputMode === 'manual'}
                    onChange={() => {
                      setServiceInputMode('manual');
                      setFormData(prev => ({ ...prev, service_type: '' }));
                      setSelectedServices([]);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>직접 입력</span>
                </label>
              </div>

              {/* 항목 선택 모드 */}
              {serviceInputMode === 'select' && (
                <>
                  <select
                    value=""
                    onChange={(e) => {
                      handleServiceSelect(e.target.value);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 'var(--card-radius)',
                      border: '1px solid #ddd',
                      fontSize: 'var(--font-base)',
                      minHeight: '44px',
                      marginBottom: '12px',
                    }}
                  >
                    <option value="">서비스를 선택하세요</option>
                    {maintenanceItems.map((item) => (
                      <option key={item.item_id} value={item.item_name}>
                        {item.item_name} - {item.default_price.toLocaleString('ko-KR')}원 (약 {Math.floor(item.default_duration / 60)}시간)
                      </option>
                    ))}
                  </select>

                  {/* 선택된 서비스 배지 표시 */}
                  {selectedServices.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      padding: '12px',
                      backgroundColor: '#f0f9ff',
                      borderRadius: '8px',
                      border: '1px solid #bae6fd',
                    }}>
                      {selectedServices.map((service, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 10px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            borderRadius: '16px',
                            fontSize: '13px',
                            fontWeight: 500,
                            boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)',
                          }}
                        >
                          <span>{service}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveService(service)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '16px',
                              height: '16px',
                              minWidth: '16px',
                              minHeight: '16px',
                              padding: 0,
                              border: 'none',
                              backgroundColor: 'rgba(255, 255, 255, 0.3)',
                              color: '#fff',
                              borderRadius: '50%',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              lineHeight: '17px',
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* 직접 입력 모드 */}
              {serviceInputMode === 'manual' && (
                <input
                  type="text"
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleInputChange}
                  placeholder="엔진오일 교체, 정기점검 등"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--card-radius)',
                    border: '1px solid #ddd',
                    fontSize: 'var(--font-base)',
                    minHeight: '44px',
                  }}
                />
              )}
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                메모
              </label>
              <textarea
                name="memo"
                value={formData.memo}
                onChange={handleInputChange}
                placeholder="특이사항이나 요청사항을 입력하세요"
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  borderRadius: 'var(--card-radius)',
                  border: '1px solid #ddd',
                  fontSize: 'var(--font-base)',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <Button type="submit" fullWidth>
                예약 등록
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  if (window.confirm('입력한 내용을 취소하시겠습니까?')) {
                    setFormData({
                      customer_name: '',
                      car_number: '',
                      phone: '',
                      schedule_date: new Date().toISOString().split('T')[0],
                      schedule_time: '10:00',
                      service_type: '',
                      memo: '',
                    });
                    setSelectedServices([]);
                  }
                }}
              >
                취소
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <Card style={{ backgroundColor: '#f9fafb', marginTop: '16px' }}>
        <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: 600 }}>예약 안내</h3>
        <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#666' }}>
          <div>• 등록 된 예약은 취소 할 수 있습니다.</div>
          <div>• 등록 된 예약은 일정 캘린더나 오늘 일정에서 확인 할 수 있습니다.</div>
        </div>
      </Card>
    </div>
  );
};

export default BookingCreate;
