import { usePlan } from '../contexts/PlanContext';
import { PLAN_FEATURES, FeatureKey } from '../types';

export const useFeature = (featureKey: FeatureKey): boolean => {
  const { hasFeature } = usePlan();
  const allowedPlans = PLAN_FEATURES[featureKey];
  return hasFeature([...allowedPlans]);
};

export const useRequireFeature = (featureKey: FeatureKey): { hasAccess: boolean; requiredPlan: string } => {
  const hasAccess = useFeature(featureKey);
  const allowedPlans = PLAN_FEATURES[featureKey];
  const requiredPlan = allowedPlans[0];

  return {
    hasAccess,
    requiredPlan
  };
};
