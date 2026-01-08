import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import ScheduleNav from '../../src/components/ScheduleNav';
import { fetchSchedules } from '../../src/mock/api';
import { Schedule } from '../../src/types';

const ScheduleCalendar: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    const response = await fetchSchedules();
    if (response.success) {
      setSchedules(response.data);
    }
  };

  // 현재 월의 첫날과 마지막 날
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // 달력 시작일 (이전 달의 마지막 주 일요일부터)
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // 달력 종료일 (다음 달의 첫 주 토요일까지)
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  // 날짜 배열 생성
  const days: Date[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // 특정 날짜의 예약 찾기
  const getSchedulesForDate = (date: Date) => {
    // 로컬 시간대 기준으로 날짜 문자열 생성
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return schedules.filter(s => s.schedule_date === dateStr);
  };

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 오늘로 이동
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  const getStatusColor = (status: Schedule['status']) => {
    switch (status) {
      case 'PENDING': return '#ef4444';
      case 'IN_PROGRESS': return '#3b82f6';
      case 'COMPLETED': return '#10b981';
      case 'CANCELLED': return '#6b7280';
      default: return '#999';
    }
  };

  return (
    <div>
      <h1>스케줄 관리</h1>
      <ScheduleNav />

      <Card style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <button
            onClick={goToPreviousMonth}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--secondary-color)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ← 이전 달
          </button>

          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>
              {year}년 {month + 1}월
            </h2>
            <button
              onClick={goToToday}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f3f4f6',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              오늘
            </button>
          </div>

          <button
            onClick={goToNextMonth}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--secondary-color)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            다음 달 →
          </button>
        </div>

        {/* 요일 헤더 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1px',
          backgroundColor: '#e5e7eb',
          border: '1px solid #e5e7eb',
          marginBottom: '1px',
        }}>
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <div
              key={day}
              style={{
                padding: '12px',
                backgroundColor: '#f9fafb',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '14px',
                color: index === 0 ? '#ef4444' : index === 6 ? '#3b82f6' : '#333',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 캘린더 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1px',
          backgroundColor: '#e5e7eb',
          border: '1px solid #e5e7eb',
        }}>
          {days.map((date, index) => {
            const daySchedules = getSchedulesForDate(date);
            const isTodayDate = isToday(date);
            const isCurrentMonthDate = isCurrentMonth(date);

            return (
              <div
                key={index}
                style={{
                  minHeight: '100px',
                  padding: '8px',
                  backgroundColor: isTodayDate ? '#eff6ff' : '#fff',
                  border: isTodayDate ? '2px solid var(--primary-color)' : 'none',
                  opacity: isCurrentMonthDate ? 1 : 0.4,
                }}
              >
                <div style={{
                  fontSize: '14px',
                  fontWeight: isTodayDate ? 700 : 500,
                  color: index % 7 === 0 ? '#ef4444' : index % 7 === 6 ? '#3b82f6' : '#333',
                  marginBottom: '4px',
                }}>
                  {date.getDate()}
                </div>

                {daySchedules.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}>
                    {daySchedules.slice(0, 3).map((schedule) => (
                      <div
                        key={schedule.schedule_id}
                        style={{
                          fontSize: '11px',
                          padding: '2px 4px',
                          backgroundColor: getStatusColor(schedule.status),
                          color: '#fff',
                          borderRadius: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={`${schedule.schedule_time} ${schedule.customer_name} - ${schedule.service_type}`}
                      >
                        {schedule.schedule_time} {schedule.customer_name}
                      </div>
                    ))}
                    {daySchedules.length > 3 && (
                      <div style={{
                        fontSize: '10px',
                        color: '#666',
                        textAlign: 'center',
                      }}>
                        +{daySchedules.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* 범례 */}
      <Card style={{ backgroundColor: '#f9fafb' }}>
        <h3 style={{ marginTop: 0, fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
          상태 범례
        </h3>
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          fontSize: '13px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#ef4444',
              borderRadius: '2px',
            }} />
            <span>예약</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#3b82f6',
              borderRadius: '2px',
            }} />
            <span>진행중</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#10b981',
              borderRadius: '2px',
            }} />
            <span>완료</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#6b7280',
              borderRadius: '2px',
            }} />
            <span>취소</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ScheduleCalendar;
