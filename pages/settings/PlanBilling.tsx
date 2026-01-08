import React, { useState } from 'react';
import SettingsNav from '../../src/components/SettingsNav';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import { usePlan, PLAN_INFO } from '../../src/contexts/PlanContext';
import { PlanType } from '../../src/types';

const PlanBilling: React.FC = () => {
  const { userPlan, planInfo, changePlan } = usePlan();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(userPlan.current_plan);

  // 플랜 레벨 매핑
  const getPlanLevel = (plan: PlanType): number => {
    const levels: Record<PlanType, number> = { 'FREE': 0, 'BASIC': 1, 'PRO': 2 };
    return levels[plan];
  };

  const handleChangePlan = () => {
    if (selectedPlan !== userPlan.current_plan) {
      changePlan(selectedPlan);
      alert(`플랜이 ${PLAN_INFO[selectedPlan].name}으로 변경되었습니다.`);
    }
  };

  const planCards = (['FREE', 'BASIC', 'PRO'] as PlanType[]).map((plan) => {
    const info = PLAN_INFO[plan];
    const isCurrent = userPlan.current_plan === plan;
    const isSelected = selectedPlan === plan;

    return (
      <div
        key={plan}
        onClick={() => setSelectedPlan(plan)}
        style={{
          flex: '1',
          minWidth: '280px',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        <Card>
          <div style={{
            padding: '24px',
            border: isSelected ? '2px solid var(--primary-color)' : '2px solid transparent',
            borderRadius: '8px',
            position: 'relative'
          }}>
            {isCurrent && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'var(--primary-color)',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600
              }}>
                현재 플랜
              </div>
            )}

            <h3 style={{
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '8px',
              color: 'var(--text-color)'
            }}>
              {info.name}
            </h3>

            <div style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '16px',
              color: 'var(--primary-color)'
            }}>
              {info.price === 0 ? '무료' : `₩${info.price.toLocaleString()}`}
              {info.price > 0 && (
                <span style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#666'
                }}>
                  /월
                </span>
              )}
            </div>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {info.features.map((feature, idx) => (
                <li key={idx} style={{
                  padding: '8px 0',
                  borderBottom: idx < info.features.length - 1 ? '1px solid #f0f0f0' : 'none',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  <span style={{ color: '#22c55e', fontWeight: 600, marginRight: '8px' }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    );
  });

  return (
    <div>
      <h1>설정</h1>
      <SettingsNav />
      <h2>플랜 / 결제 정보</h2>

      <div style={{
        marginTop: '24px'
      }}>
        <Card>
          <div style={{ padding: '20px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '12px'
            }}>
              현재 플랜
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--primary-color)'
              }}>
                {planInfo.name}
              </span>
              <span style={{
                fontSize: '20px',
                color: '#666'
              }}>
                {planInfo.price === 0 ? '무료' : `₩${planInfo.price.toLocaleString()}/월`}
              </span>
            </div>
            <p style={{
              fontSize: '14px',
              color: '#999',
              margin: 0
            }}>
              시작일: {new Date(userPlan.started_at).toLocaleDateString('ko-KR')}
            </p>
          </div>
        </Card>
      </div>

      <div style={{
        marginTop: '32px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '16px'
        }}>
          플랜 선택
        </h3>

        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '24px'
        }}>
          {planCards}
        </div>

        {selectedPlan !== userPlan.current_plan && (
          <div style={{
            textAlign: 'center',
            marginTop: '24px'
          }}>
            <Button variant="primary" onClick={handleChangePlan}>
              {PLAN_INFO[selectedPlan].name} 플랜으로 변경
            </Button>
            <p style={{
              fontSize: '14px',
              color: '#666',
              marginTop: '12px'
            }}>
              {getPlanLevel(selectedPlan) > getPlanLevel(userPlan.current_plan) ? '업그레이드' : '다운그레이드'}하시겠습니까?
            </p>
          </div>
        )}
      </div>

      <div style={{
        marginTop: '32px',
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#666',
          margin: 0
        }}>
          💡 데모 모드: 실제 결제 없이 플랜을 자유롭게 변경해볼 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default PlanBilling;
