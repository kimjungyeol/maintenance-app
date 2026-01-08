import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlanType, UserPlan, PlanInfo } from '../types';

interface PlanContextValue {
  userPlan: UserPlan;
  planInfo: PlanInfo;
  changePlan: (newPlan: PlanType) => void;
  hasFeature: (feature: string[]) => boolean;
}

const PlanContext = createContext<PlanContextValue | undefined>(undefined);

export const PLAN_INFO: Record<PlanType, PlanInfo> = {
  FREE: {
    type: 'FREE',
    name: '무료',
    price: 0,
    features: [
      '고객 관리',
      '차량 관리',
      '오늘 일정',
      '예약 등록 (월 30건)',
      '작업 현황판',
      '정비 이력'
    ]
  },
  BASIC: {
    type: 'BASIC',
    name: '베이직',
    price: 19000,
    features: [
      'FREE 플랜 모든 기능',
      '예약 무제한',
      '주/월 캘린더',
      '매출 관리',
      '미수금 관리',
      '지출/급여 관리',
      '월별 정산',
      '엑셀 다운로드',
      '영업시간/휴무일 설정',
      '정비 항목 관리'
    ]
  },
  PRO: {
    type: 'PRO',
    name: '프로',
    price: 39000,
    features: [
      'BASIC 플랜 모든 기능',
      '매출 통계 대시보드',
      '수익 분석',
      '예약 알림',
      '데이터 자동 백업'
    ]
  }
};

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock data - 실제 구현 시 API에서 가져오거나 localStorage 사용
  const [userPlan, setUserPlan] = useState<UserPlan>(() => {
    const saved = localStorage.getItem('userPlan');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      current_plan: 'FREE',
      started_at: new Date().toISOString(),
      auto_renew: false
    };
  });

  useEffect(() => {
    localStorage.setItem('userPlan', JSON.stringify(userPlan));
  }, [userPlan]);

  const planInfo = PLAN_INFO[userPlan.current_plan];

  const changePlan = (newPlan: PlanType) => {
    setUserPlan({
      current_plan: newPlan,
      started_at: new Date().toISOString(),
      auto_renew: true
    });
  };

  const hasFeature = (feature: string[]): boolean => {
    return feature.includes(userPlan.current_plan);
  };

  return (
    <PlanContext.Provider value={{ userPlan, planInfo, changePlan, hasFeature }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = (): PlanContextValue => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};
