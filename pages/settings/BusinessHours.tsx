import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import SettingsNav from '../../src/components/SettingsNav';
import { fetchBusinessHours } from '../../src/mock/api';
import { BusinessHoursConfig } from '../../src/types';

const BusinessHours: React.FC = () => {
  const [businessHours, setBusinessHours] = useState<BusinessHoursConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingInterval, setBookingInterval] = useState(60); // 기본 1시간(60분)
  const [bookingCapacity, setBookingCapacity] = useState(1); // 기본 1명

  useEffect(() => {
    loadBusinessHours();
    loadBookingSettings();
  }, []);

  const loadBusinessHours = async () => {
    setLoading(true);
    const response = await fetchBusinessHours();
    if (response.success) {
      setBusinessHours(response.data);
    }
    setLoading(false);
  };

  const loadBookingSettings = () => {
    // Mock: localStorage에서 예약 시간 단위 불러오기
    const savedInterval = localStorage.getItem('bookingInterval');
    if (savedInterval) {
      setBookingInterval(Number(savedInterval));
    }

    const savedCapacity = localStorage.getItem('bookingCapacity');
    if (savedCapacity) {
      setBookingCapacity(Number(savedCapacity));
    }
  };

  const handleToggleOpen = (day: string) => {
    setBusinessHours(prev =>
      prev.map(config =>
        config.day === day ? { ...config, isOpen: !config.isOpen } : config
      )
    );
  };

  const handleTimeChange = (day: string, field: 'openTime' | 'closeTime', value: string) => {
    setBusinessHours(prev =>
      prev.map(config =>
        config.day === day ? { ...config, [field]: value } : config
      )
    );
  };

  const handleSave = () => {
    alert('영업시간 설정이 저장되었습니다 (Mock)');
  };

  const handleBookingIntervalSave = () => {
    localStorage.setItem('bookingInterval', String(bookingInterval));
    localStorage.setItem('bookingCapacity', String(bookingCapacity));
    alert('예약시간 설정이 저장되었습니다 (Mock)');
  };

  const handleCapacityChange = (value: number) => {
    if (value >= 1 && value <= 10) {
      setBookingCapacity(value);
    }
  };

  const intervalOptions = [
    { value: 15, label: '15분' },
    { value: 30, label: '30분' },
    { value: 45, label: '45분' },
    { value: 60, label: '1시간' },
    { value: 90, label: '1시간 30분' },
    { value: 120, label: '2시간' },
    { value: 180, label: '3시간' },
  ];

  const getIntervalDisplay = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}분`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
  };

  if (loading) {
    return (
      <div>
        <h1>설정</h1>
        <SettingsNav />
        <Card>로딩 중...</Card>
      </div>
    );
  }

  return (
    <div>
      <h1>설정</h1>
      <SettingsNav />

      <Card>
        <h2>요일별 영업시간 설정</h2>
        <div style={{ marginTop: '16px' }}>
          {businessHours.map((config) => (
            <div
              key={config.day}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                gap: '16px',
              }}
            >
              <div style={{ width: '80px', fontWeight: 600, color: '#333' }}>
                {config.dayKo}
              </div>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                userSelect: 'none',
              }}>
                <input
                  type="checkbox"
                  checked={config.isOpen}
                  onChange={() => handleToggleOpen(config.day)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px' }}>영업</span>
              </label>

              {config.isOpen && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="time"
                      value={config.openTime}
                      onChange={(e) => handleTimeChange(config.day, 'openTime', e.target.value)}
                      style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        fontSize: '14px',
                      }}
                    />
                    <span>~</span>
                    <input
                      type="time"
                      value={config.closeTime}
                      onChange={(e) => handleTimeChange(config.day, 'closeTime', e.target.value)}
                      style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                </>
              )}

              {!config.isOpen && (
                <div style={{ fontSize: '14px', color: '#999' }}>휴무</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px' }}>
          <Button onClick={handleSave} fullWidth>저장</Button>
        </div>
      </Card>

      <Card style={{ marginTop: '16px' }}>
        {/* 현재 설정 요약 - 상단 강조 */}
        <div style={{
          textAlign: 'center',
          padding: '20px',
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
        }}>
          <div style={{
            fontSize: '15px',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '8px',
            fontWeight: 500,
          }}>
            현재 예약 설정
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.4,
          }}>
            {getIntervalDisplay(bookingInterval)} 단위로 최대 <span style={{
              fontSize: '32px',
              color: '#fbbf24',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}>{bookingCapacity}명</span> 예약 가능
          </div>
        </div>

        <h2>예약시간 단위 설정</h2>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '8px', marginBottom: '16px' }}>
          고객이 예약할 수 있는 시간 간격을 설정합니다
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}>
          {intervalOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => setBookingInterval(option.value)}
              style={{
                padding: '16px',
                backgroundColor: bookingInterval === option.value ? '#eff6ff' : '#f9fafb',
                border: bookingInterval === option.value ? '2px solid var(--primary-color)' : '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (bookingInterval !== option.value) {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (bookingInterval !== option.value) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div style={{
                fontSize: '18px',
                fontWeight: 600,
                color: bookingInterval === option.value ? 'var(--primary-color)' : '#333',
                marginBottom: '4px',
              }}>
                {option.label}
              </div>
              {bookingInterval === option.value && (
                <div style={{
                  fontSize: '12px',
                  color: 'var(--primary-color)',
                  fontWeight: 500,
                }}>
                  선택됨
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          marginBottom: '16px',
        }}>
          <div style={{ fontSize: '14px', color: '#0369a1', marginBottom: '8px' }}>
            <strong>현재 설정:</strong> {getIntervalDisplay(bookingInterval)} 단위로 예약 가능
          </div>
          <div style={{ fontSize: '13px', color: '#0284c7' }}>
            예: 09:00, {new Date(0, 0, 0, 9, bookingInterval).toTimeString().slice(0, 5)}, {new Date(0, 0, 0, 9, bookingInterval * 2).toTimeString().slice(0, 5)} ...
          </div>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', marginTop: '24px' }}>
          시간대별 예약 가능 고객 수
        </h3>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px',
          padding: '20px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
              동시 예약 가능 인원
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              각 시간대에 동시에 예약할 수 있는 고객 수를 설정합니다
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <button
              onClick={() => handleCapacityChange(bookingCapacity - 1)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                backgroundColor: '#fff',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 600,
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              disabled={bookingCapacity <= 1}
            >
              −
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <style>
                {`
                  .capacity-input::-webkit-inner-spin-button,
                  .capacity-input::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                  }
                `}
              </style>
              <input
                type="number"
                className="capacity-input"
                value={bookingCapacity}
                onChange={(e) => handleCapacityChange(Number(e.target.value))}
                min="1"
                max="10"
                style={{
                  width: '60px',
                  padding: '10px 8px',
                  borderRadius: '6px',
                  border: '2px solid var(--primary-color)',
                  fontSize: '20px',
                  fontWeight: 700,
                  textAlign: 'center',
                  color: 'var(--primary-color)',
                  MozAppearance: 'textfield',
                  appearance: 'none',
                } as React.CSSProperties}
              />
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#666' }}>
                명
              </span>
            </div>

            <button
              onClick={() => handleCapacityChange(bookingCapacity + 1)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                backgroundColor: '#fff',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 600,
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              disabled={bookingCapacity >= 10}
            >
              +
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '8px',
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#fffbeb',
          borderRadius: '8px',
          border: '1px solid #fcd34d',
        }}>
          <div style={{ fontSize: '13px', color: '#78350f', lineHeight: '1.6' }}>
            <strong>💡 팁:</strong> 작업 공간이 여러 개 있거나 동시에 여러 차량 작업이 가능한 경우 인원을 늘려보세요.
          </div>
        </div>

        <Button onClick={handleBookingIntervalSave} fullWidth>저장</Button>
      </Card>

      <Card style={{ backgroundColor: '#f9fafb', marginTop: '16px' }}>
        <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: 600 }}>안내</h3>
        <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#666' }}>
          <div>• 영업시간은 예약 가능한 시간대를 의미합니다</div>
          <div>• 휴무일로 설정된 요일은 예약이 불가능합니다</div>
          <div>• 예약시간 단위는 고객이 선택할 수 있는 시간 간격입니다</div>
          <div>• 동시 예약 가능 인원은 각 시간대에 최대 몇 명까지 예약받을지 결정합니다</div>
          <div>• 임시 휴무는 별도로 설정할 수 있습니다</div>
        </div>
      </Card>
    </div>
  );
};

export default BusinessHours;
