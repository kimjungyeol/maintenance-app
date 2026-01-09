import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import { fetchDashboardSummary, fetchSchedules } from '../../src/mock/api';
import { DashboardSummary, Schedule } from '../../src/types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary>({
    todaySales: 0,
    todayExpenses: 0,
    todayNetCash: 0,
  });

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    total: 0,
  });

  const [unconfirmedSettings, setUnconfirmedSettings] = useState<Array<{
    name: string;
    path: string;
    message: string;
  }>>([]);

  useEffect(() => {
    loadData();
    checkUnconfirmedSettings();
  }, []);

  const checkUnconfirmedSettings = () => {
    const settings = [
      {
        key: 'settings_basic_confirmed',
        name: '기초 설정',
        path: '/settings',
        message: '사업장의 기본 정보를 입력해 주시기 바랍니다.',
      },
      {
        key: 'settings_business_hours_confirmed',
        name: '영업시간/휴무일',
        path: '/settings/business-hours',
        message: '요일별 영업시간, 예약을 받을 시간 단위 및 예약 시간별 동시 예약 가능 인원을 설정해 주세요.',
      },
      {
        key: 'settings_maintenance_items_confirmed',
        name: '정비 항목 관리',
        path: '/settings/maintenance-items',
        message: '정비 항목 정보를 추가 및 수정 or 비활성화 할 수 있습니다. 예약 등록시 사용 됩니다.',
      },
      {
        key: 'settings_plan_billing_confirmed',
        name: '플랜/결제 정보',
        path: '/settings/plan-billing',
        message: '플랜을 확인 하시고, 필요한 기능을 사용해 보세요.',
      },
    ];

    const unconfirmed = settings.filter(
      (setting) => localStorage.getItem(setting.key) !== 'true'
    );

    setUnconfirmedSettings(unconfirmed);
  };

  const loadData = async () => {
    const [dashboardResponse, scheduleResponse] = await Promise.all([
      fetchDashboardSummary(),
      fetchSchedules(),
    ]);

    if (dashboardResponse.success) {
      setSummary(dashboardResponse.data);
    }

    if (scheduleResponse.success) {
      const today = new Date().toISOString().split('T')[0];
      const todaySchedules = scheduleResponse.data.filter(s => s.schedule_date === today);

      setSchedules(todaySchedules);
      setStats({
        pending: todaySchedules.filter(s => s.status === 'PENDING').length,
        inProgress: todaySchedules.filter(s => s.status === 'IN_PROGRESS').length,
        completed: todaySchedules.filter(s => s.status === 'COMPLETED').length,
        cancelled: todaySchedules.filter(s => s.status === 'CANCELLED').length,
        total: todaySchedules.length,
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
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

  return (
    <div>
      {unconfirmedSettings.length > 0 && (
        <Card style={{ marginBottom: '16px', backgroundColor: '#fef2f2', border: '2px solid #ef4444' }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#991b1b', marginBottom: '8px' }}>
              ⚠️ 설정 확인 필요
            </h3>
            <p style={{ fontSize: '14px', color: '#7f1d1d', margin: 0 }}>
              아래 설정 페이지들을 확인해주세요.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {unconfirmedSettings.map((setting) => (
              <div
                key={setting.path}
                style={{
                  padding: '12px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  border: '1px solid #fca5a5',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '14px', color: '#991b1b' }}>
                    {setting.name}
                  </strong>
                  <Button
                    size="small"
                    onClick={() => navigate(setting.path)}
                  >
                    설정하러 가기
                  </Button>
                </div>
                <p style={{ fontSize: '13px', color: '#7f1d1d', margin: 0 }}>
                  {setting.message}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2>오늘의 요약</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>오늘 매출:</span>
            <strong style={{ color: 'var(--primary-color)' }}>
              {formatCurrency(summary.todaySales)}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>오늘 지출:</span>
            <strong style={{ color: 'red' }}>
              {formatCurrency(summary.todayExpenses)}
            </strong>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid #eee',
            paddingTop: '12px',
          }}>
            <span>순수익:</span>
            <strong style={{
              color: summary.todayNetCash >= 0 ? 'var(--primary-color)' : 'red',
              fontSize: '18px',
            }}>
              {formatCurrency(summary.todayNetCash)}
            </strong>
          </div>
        </div>
      </Card>

      <Card>
        <h2>빠른 등록</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={() => navigate('/sales')}>매출 등록</Button>
          <Button variant="secondary" onClick={() => navigate('/expense-payroll/expenses')}>
            지출 등록
          </Button>
        </div>
      </Card>

      {/* 구분선 */}
      <div style={{
        margin: '40px 0 32px 0',
        height: '2px',
        background: 'linear-gradient(to right, transparent, #e5e7eb 20%, #e5e7eb 80%, transparent)',
      }} />

      <div style={{
        backgroundColor: '#f9fafb',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
      }}>
        <h2 style={{
          margin: '0 0 20px 0',
          fontSize: '20px',
          fontWeight: 700,
          color: '#111',
          paddingBottom: '12px',
          borderBottom: '2px solid var(--primary-color)',
        }}>
          오늘의 작업 현황
        </h2>

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

      <Card>
        <h2>오늘의 완료율</h2>
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
        <h2>오늘의 일정 ({stats.total}건)</h2>
        {schedules.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
            오늘 예약된 일정이 없습니다.
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

    </div>
  );
};

export default Dashboard;
