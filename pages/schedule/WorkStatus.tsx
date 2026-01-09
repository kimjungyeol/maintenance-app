import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import Input from '../../src/components/Input';
import ScheduleNav from '../../src/components/ScheduleNav';
import { fetchSchedules } from '../../src/mock/api';
import { Schedule } from '../../src/types';

const WorkStatus: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    total: 0,
  });

  useEffect(() => {
    loadSchedules();
  }, [selectedDate]);

  const loadSchedules = async () => {
    const response = await fetchSchedules();
    if (response.success) {
      const filteredSchedules = response.data.filter(s => s.schedule_date === selectedDate);

      setSchedules(filteredSchedules);
      setStats({
        pending: filteredSchedules.filter(s => s.status === 'PENDING').length,
        inProgress: filteredSchedules.filter(s => s.status === 'IN_PROGRESS').length,
        completed: filteredSchedules.filter(s => s.status === 'COMPLETED').length,
        cancelled: filteredSchedules.filter(s => s.status === 'CANCELLED').length,
        total: filteredSchedules.length,
      });
    }
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

  const getStatusLabel = (status: Schedule['status']) => {
    switch (status) {
      case 'PENDING': return '예약';
      case 'IN_PROGRESS': return '진행중';
      case 'COMPLETED': return '완료';
      case 'CANCELLED': return '취소';
      default: return status;
    }
  };

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  return (
    <div>
      <h1>스케줄 관리</h1>
      <ScheduleNav />

      <Card style={{ marginBottom: '24px' }}>
        <h2>날짜 선택</h2>
        <Input
          type="date"
          label="조회 날짜"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </Card>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <Card style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>대기중</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>
            {stats.pending}
          </div>
        </Card>

        <Card style={{ backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>진행중</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
            {stats.inProgress}
          </div>
        </Card>

        <Card style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>완료</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
            {stats.completed}
          </div>
        </Card>

        <Card style={{ backgroundColor: '#f9fafb', borderLeft: '4px solid #6b7280' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>취소</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6b7280' }}>
            {stats.cancelled}
          </div>
        </Card>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <h2>{formatDate(selectedDate)} 완료율</h2>
        <div style={{ marginTop: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '14px',
          }}>
            <span>{stats.completed} / {stats.total} 완료</span>
            <strong style={{ color: 'var(--primary-color)' }}>{completionRate}%</strong>
          </div>
          <div style={{
            width: '100%',
            height: '24px',
            backgroundColor: '#e5e7eb',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${completionRate}%`,
              height: '100%',
              backgroundColor: 'var(--primary-color)',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      </Card>

      <Card>
        <h2>{formatDate(selectedDate)} 일정 ({stats.total}건)</h2>
        {schedules.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
            {formatDate(selectedDate)} 예약된 일정이 없습니다.
          </div>
        ) : (
          <div style={{ marginTop: '16px' }}>
            {schedules.map((schedule, index) => (
              <div
                key={schedule.schedule_id}
                style={{
                  padding: '12px',
                  marginBottom: index === schedules.length - 1 ? 0 : '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${getStatusColor(schedule.status)}`,
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>
                      {schedule.schedule_time} - {schedule.customer_name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {schedule.car_number} | {schedule.service_type}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: getStatusColor(schedule.status),
                  }}>
                    {getStatusLabel(schedule.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default WorkStatus;
