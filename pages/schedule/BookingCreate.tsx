import React, { useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import ScheduleNav from '../../src/components/ScheduleNav';

const BookingCreate: React.FC = () => {
  const [formData, setFormData] = useState({
    customer_name: '',
    car_number: '',
    phone: '',
    schedule_date: new Date().toISOString().split('T')[0],
    schedule_time: '10:00',
    service_type: '',
    memo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

            <Input
              label="서비스 종류"
              name="service_type"
              value={formData.service_type}
              onChange={handleInputChange}
              placeholder="엔진오일 교체, 정기점검 등"
              required
            />

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
          <div>• 영업시간: 월~금 09:00-18:00, 토 09:00-15:00</div>
          <div>• 일요일은 휴무입니다</div>
          <div>• 예약 변경은 전화로 문의해 주세요</div>
          <div>• 예약 시간보다 10분 일찍 도착해 주시면 감사하겠습니다</div>
        </div>
      </Card>
    </div>
  );
};

export default BookingCreate;
