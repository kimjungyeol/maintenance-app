import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import ScheduleNav from '../../src/components/ScheduleNav';
import { fetchSchedules } from '../../src/mock/api';
import { Schedule } from '../../src/types';

const TodaySchedule: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingInterval, setBookingInterval] = useState(60);
  const [bookingCapacity, setBookingCapacity] = useState(1);
  const [expandedSlots, setExpandedSlots] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadSchedules();
    loadBookingInterval();
  }, []);

  const loadSchedules = async () => {
    setLoading(true);
    const response = await fetchSchedules();
    if (response.success) {
      // 오늘 날짜로 필터링
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;
      const todaySchedules = response.data.filter(s => s.schedule_date === todayStr);
      setSchedules(todaySchedules);
    }
    setLoading(false);
  };

  const loadBookingInterval = () => {
    const savedInterval = localStorage.getItem('bookingInterval');
    if (savedInterval) {
      setBookingInterval(Number(savedInterval));
    }

    const savedCapacity = localStorage.getItem('bookingCapacity');
    if (savedCapacity) {
      setBookingCapacity(Number(savedCapacity));
    }
  };

  const toggleSlot = (time: string) => {
    setExpandedSlots(prev => {
      const newSet = new Set(prev);
      if (newSet.has(time)) {
        newSet.delete(time);
      } else {
        newSet.add(time);
      }
      return newSet;
    });
  };

  const handleStatusChange = (scheduleId: number, newStatus: Schedule['status']) => {
    setSchedules(prev =>
      prev.map(s => s.schedule_id === scheduleId ? { ...s, status: newStatus } : s)
    );
    alert(`일정 상태가 변경되었습니다 (Mock)`);
  };

  const getStatusBadge = (status: Schedule['status']) => {
    const statusConfig = {
      PENDING: { label: '예약', bg: '#fef2f2', color: '#ef4444' },
      IN_PROGRESS: { label: '진행중', bg: '#eff6ff', color: '#3b82f6' },
      COMPLETED: { label: '완료', bg: '#f0fdf4', color: '#10b981' },
      CANCELLED: { label: '취소', bg: '#f9fafb', color: '#6b7280' },
    };
    const config = statusConfig[status];
    return (
      <span style={{
        backgroundColor: config.bg,
        color: config.color,
        padding: '4px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 500,
      }}>
        {config.label}
      </span>
    );
  };

  // 시간 문자열을 분으로 변환
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // 분을 시간 문자열로 변환
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  // 타임슬롯 생성 (09:00 ~ 18:00 기본)
  const generateTimeSlots = () => {
    const slots = [];
    const startTime = 9 * 60; // 09:00
    const endTime = 18 * 60; // 18:00

    for (let time = startTime; time < endTime; time += bookingInterval) {
      slots.push({
        time: minutesToTime(time),
        timeMinutes: time,
        isStandardSlot: true,
      });
    }
    return slots;
  };

  // 예약이 표준 타임슬롯에 맞는지 확인
  const findMatchingSlot = (scheduleTime: string) => {
    const scheduleMinutes = timeToMinutes(scheduleTime);
    const startTime = 9 * 60;
    const remainder = (scheduleMinutes - startTime) % bookingInterval;
    return remainder === 0 ? scheduleMinutes : null;
  };

  const timeSlots = generateTimeSlots();

  // 표준 슬롯에 없는 예약 찾기
  const nonStandardSchedules = schedules.filter(s => findMatchingSlot(s.schedule_time) === null);

  // 각 타임슬롯별 예약 매칭
  const getSlotsWithSchedules = () => {
    return timeSlots.map(slot => {
      const matchingSchedules = schedules.filter(s =>
        findMatchingSlot(s.schedule_time) === slot.timeMinutes
      );
      return {
        ...slot,
        schedules: matchingSchedules,
      };
    });
  };

  const slotsWithSchedules = getSlotsWithSchedules();

  if (loading) {
    return (
      <div>
        <h1>오늘 일정</h1>
        <Card>로딩 중...</Card>
      </div>
    );
  }

  const today = new Date();
  const formattedDate = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  });

  return (
    <div>
      <h1>스케줄 관리</h1>
      <ScheduleNav />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ margin: 0 }}>오늘 일정</h2>
          <span style={{ fontSize: '16px', color: '#666', fontWeight: 500 }}>
            {formattedDate}
          </span>
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          총 {schedules.length}건
        </div>
      </div>

      {/* 표준 타임슬롯 */}
      {slotsWithSchedules.map((slot) => {
        const isExpanded = expandedSlots.has(slot.time);
        const hasSchedules = slot.schedules.length > 0;

        return (
          <div key={slot.time} style={{ marginBottom: '12px' }}>
            {/* 시간대 헤더 카드 */}
            <div onClick={() => toggleSlot(slot.time)} style={{ cursor: 'pointer' }}>
              <Card
                style={{
                  backgroundColor: hasSchedules ? '#eff6ff' : '#f9fafb',
                  border: hasSchedules ? '2px solid var(--primary-color)' : '1px solid #e5e7eb',
                  transition: 'all 0.2s',
                }}
              >
              <div style={{
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#333' }}>
                    {slot.time}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#666',
                    padding: '4px 12px',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                  }}>
                    {slot.schedules.length} / {bookingCapacity}
                  </div>
                </div>
                <div style={{
                  fontSize: '24px',
                  color: '#999',
                  transition: 'transform 0.2s',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}>
                  ▼
                </div>
              </div>
              </Card>
            </div>

            {/* 팀 슬롯 상세 (토글) */}
            {isExpanded && (
              <div style={{
                marginTop: '8px',
                marginLeft: '16px',
                borderLeft: '3px solid var(--primary-color)',
                paddingLeft: '12px',
              }}>
                {Array.from({ length: bookingCapacity }, (_, index) => {
                  const teamNumber = index + 1;
                  const teamSchedule = slot.schedules[index];

                  return (
                    <Card
                      key={teamNumber}
                      style={{
                        marginBottom: '8px',
                        backgroundColor: teamSchedule ? '#fff' : '#fafafa',
                        border: teamSchedule ? '2px solid var(--primary-color)' : '1px dashed #d1d5db',
                      }}
                    >
                      <div style={{ padding: '12px' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: teamSchedule
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                          color: teamSchedule ? '#fff' : '#6b7280',
                          fontSize: '14px',
                          fontWeight: 700,
                          marginBottom: '12px',
                          boxShadow: teamSchedule ? '0 2px 8px rgba(102, 126, 234, 0.4)' : '0 2px 4px rgba(0,0,0,0.1)',
                        }}>
                          {teamNumber}
                        </div>

                        {teamSchedule ? (
                          // 예약이 있는 경우
                          <>
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
                                  {teamSchedule.customer_name}
                                </div>
                                {getStatusBadge(teamSchedule.status)}
                              </div>
                              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--primary-color)' }}>
                                {teamSchedule.service_type}
                              </div>
                            </div>

                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: '80px 1fr',
                              gap: '8px',
                              fontSize: '14px',
                              marginBottom: '12px'
                            }}>
                              <span style={{ color: '#666', fontWeight: 500 }}>차량번호</span>
                              <span style={{ color: '#222', fontWeight: 600 }}>{teamSchedule.car_number}</span>

                              <span style={{ color: '#666', fontWeight: 500 }}>연락처</span>
                              <span style={{ color: '#222', fontWeight: 600 }}>{teamSchedule.phone}</span>

                              {teamSchedule.memo && (
                                <>
                                  <span style={{ color: '#666', fontWeight: 500 }}>메모</span>
                                  <span style={{ color: '#222' }}>{teamSchedule.memo}</span>
                                </>
                              )}
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                              <Button
                                onClick={(e) => {
                                  e?.stopPropagation();
                                  handleStatusChange(teamSchedule.schedule_id, 'IN_PROGRESS');
                                }}
                                size="small"
                              >
                                작업 시작
                              </Button>
                              <Button
                                variant="success"
                                onClick={(e) => {
                                  e?.stopPropagation();
                                  handleStatusChange(teamSchedule.schedule_id, 'COMPLETED');
                                }}
                                size="small"
                              >
                                작업 완료
                              </Button>
                              <Button
                                variant="secondary"
                                onClick={(e) => {
                                  e?.stopPropagation();
                                  handleStatusChange(teamSchedule.schedule_id, 'CANCELLED');
                                }}
                                size="small"
                              >
                                예약 취소
                              </Button>
                            </div>
                          </>
                        ) : (
                          // 예약이 없는 경우
                          <div style={{
                            padding: '24px',
                            textAlign: 'center',
                            color: '#999',
                          }}>
                            <div style={{ fontSize: '14px' }}>예약 가능</div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* 표준 타임슬롯이 아닌 예약 */}
      {nonStandardSchedules.length > 0 && (
        <>
          <div style={{
            marginTop: '24px',
            marginBottom: '12px',
            padding: '8px 12px',
            backgroundColor: '#fef2f2',
            borderLeft: '4px solid #ef4444',
            borderRadius: '4px',
          }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#991b1b' }}>
              기타 시간대 예약
            </div>
            <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '2px' }}>
              설정된 예약시간 단위와 다른 시간대입니다
            </div>
          </div>

          {nonStandardSchedules.map((schedule) => (
            <Card
              key={schedule.schedule_id}
              style={{
                marginBottom: '12px',
                border: '2px solid #fbbf24',
                backgroundColor: '#fffbeb',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: '2px solid #fbbf24',
              }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>
                    {schedule.schedule_time} - {schedule.customer_name}
                  </div>
                  {getStatusBadge(schedule.status)}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 500, color: '#d97706' }}>
                  {schedule.service_type}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: '8px',
                fontSize: '14px',
                marginBottom: '12px'
              }}>
                <span style={{ color: '#666', fontWeight: 500 }}>차량번호</span>
                <span style={{ color: '#222', fontWeight: 600 }}>{schedule.car_number}</span>

                <span style={{ color: '#666', fontWeight: 500 }}>연락처</span>
                <span style={{ color: '#222', fontWeight: 600 }}>{schedule.phone}</span>

                {schedule.memo && (
                  <>
                    <span style={{ color: '#666', fontWeight: 500 }}>메모</span>
                    <span style={{ color: '#222' }}>{schedule.memo}</span>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <Button
                  onClick={() => handleStatusChange(schedule.schedule_id, 'IN_PROGRESS')}
                  size="small"
                >
                  작업 시작
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleStatusChange(schedule.schedule_id, 'COMPLETED')}
                  size="small"
                >
                  작업 완료
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleStatusChange(schedule.schedule_id, 'CANCELLED')}
                  size="small"
                >
                  예약 취소
                </Button>
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default TodaySchedule;
