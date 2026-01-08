import React from 'react';
import { Link } from 'react-router-dom';
import { useRequireFeature } from '../hooks/useFeature';
import { FeatureKey } from '../types';
import Card from './Card';
import Button from './Button';

interface ProtectedFeatureProps {
  featureKey: FeatureKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedFeature: React.FC<ProtectedFeatureProps> = ({ featureKey, children, fallback }) => {
  const { hasAccess, requiredPlan } = useRequireFeature(featureKey);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card>
      <div style={{
        textAlign: 'center',
        padding: '48px 24px'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}>
          🔒
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 600,
          marginBottom: '8px',
          color: 'var(--text-color)'
        }}>
          {requiredPlan} 플랜 이상 필요
        </h2>
        <p style={{
          color: '#666',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          이 기능을 사용하려면 플랜 업그레이드가 필요합니다.
        </p>
        <Link to="/settings/plan-billing">
          <Button variant="primary">
            플랜 업그레이드
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ProtectedFeature;
