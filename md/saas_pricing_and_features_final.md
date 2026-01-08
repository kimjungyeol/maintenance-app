
# 자동차 정비소 SaaS – 유료 플랜 기준 기능 분리 설계 (최종안)

본 문서는 **5인 이하 자동차 정비소 대상 SaaS** 개발을 위한
**유료 플랜 기준 기능 분리 설계 최종안**이다.
프론트엔드/백엔드/기획자가 공통 기준으로 활용할 수 있도록
구현 관점 위주로 작성한다.

---

## 1. 서비스 전제 조건

### 대상
- 1~5인 소규모 자동차 정비소
- PC + 모바일 병행 사용
- 전화 예약 비중 높음
- 엑셀·수기 관리 비율 높음

### 핵심 목표
- 일정 + 정비 + 매출 + 고객 관리의 통합
- 무료 → 유료 전환이 자연스러운 구조
- 월 과금 SaaS 모델

---

## 2. 플랜 구조 개요

| 플랜 | 대상 | 월 요금 |
|---|---|---|
| FREE | 1인 / 초기 정비소 | 0원 |
| BASIC | 소형 정비소 (1~3인) | 19,000원 |
| PRO | 안정 운영 정비소 (3~5인) | 39,000원 |

---

## 3. 플랜별 기능 정의

### 3.1 FREE 플랜
- 고객 관리
- 차량 관리
- 오늘 일정
- 예약 등록 (월 30건 제한)
- 작업 현황판
- 정비 이력

### 3.2 BASIC 플랜
- 예약 무제한
- 주/월 캘린더
- 매출 관리
- 고객 방문 이력
- 엑셀 다운로드
- 영업시간/휴무일 설정

### 3.3 PRO 플랜
- 매출 통계 대시보드
- 정비 항목별 수익 분석
- 고객 재방문율
- 예약 알림
- 데이터 자동 백업

---

## 4. 기능 매트릭스

| 기능 | FREE | BASIC | PRO |
|---|---|---|---|
| 고객/차량 | O | O | O |
| 예약 무제한 | X | O | O |
| 매출 관리 | X | O | O |
| 통계 | X | X | O |
| 백업 | X | X | O |

---

## 5. 개발 가이드

- Feature Flag 기반 제어
- 데이터 구조는 동일
- 접근 권한만 플랜으로 분리

---

## 6. 최종 메뉴
🏠 홈 (대시보드)

📅 스케줄 관리
 ├─ 오늘 일정
 ├─ 예약 등록
 ├─ 일정 캘린더 (주/월)
 └─ 작업 현황판

👤 고객 / 차량 관리
 ├─ 고객 관리
 ├─ 차량 관리
 └─ 정비 이력

💰 매출 관리
 ├─ 매출 등록
 ├─ 미수금 관리
 └─ 매출 통계 (PRO)

📉 지출 / 급여 관리
 ├─ 지출 관리
 └─ 급여 관리

📊 정산 / 리포트
 ├─ 월별 정산
 ├─ 엑셀 다운로드
 └─ 수익 분석 (PRO)

⚙ 설정
 ├─ 기초 설정
 ├─ 영업시간 / 휴무일
 ├─ 정비 항목 관리
 └─ 플랜 / 결제 정보

 ---
 


  ## 플랜 기반 접근 제어 기능 ##
  
  구현 내용

  1. 핵심 시스템 구축

  타입 정의 (src/types/index.ts:142-188)
  - PlanType, PlanInfo, UserPlan 타입 추가
  - PLAN_FEATURES 상수로 기능별 플랜 권한 정의
  - FREE, BASIC, PRO 플랜별 접근 가능 기능 매핑

  PlanContext (src/contexts/PlanContext.tsx)
  - 사용자 플랜 상태 관리
  - localStorage를 통한 플랜 정보 저장
  - usePlan hook으로 어디서나 플랜 정보 접근 가능

  useFeature Hook (src/hooks/useFeature.ts)
  - 특정 기능에 대한 접근 권한 확인
  - useRequireFeature로 필요한 플랜 정보 제공

  ProtectedFeature 컴포넌트 (src/components/ProtectedFeature.tsx)   
  - 권한이 없는 경우 업그레이드 안내 UI 표시
  - 업그레이드 버튼으로 플랜 변경 페이지 이동

  2. 적용된 페이지

  PRO 플랜 전용
  - pages/sales/SalesStatistics.tsx - 매출 통계
  - pages/reports/ProfitAnalysis.tsx - 수익 분석

  BASIC 플랜 이상
  - pages/reports/ExcelExport.tsx - 엑셀 다운로드

  3. 플랜 관리 페이지

  PlanBilling (pages/settings/PlanBilling.tsx)
  - 현재 플랜 정보 표시
  - 플랜별 기능 비교 카드
  - 플랜 변경 기능 (데모 모드)
  - 플랜별 가격 정보
    - FREE: 무료
    - BASIC: 19,000원/월
    - PRO: 39,000원/월

  4. 동작 방식

  1. 사용자가 PRO 전용 페이지 접속 시
  2. ProtectedFeature 컴포넌트가 현재 플랜 확인
  3. 권한이 없으면 업그레이드 안내 표시
  4. "플랜 업그레이드" 버튼으로 /settings/plan-billing 이동
  5. 플랜 변경 페이지에서 플랜 선택 및 변경

  5. 테스트 방법

  1. /settings/plan-billing 페이지 접속
  2. 현재 플랜을 FREE로 설정
  3. /sales/statistics 또는 /reports/profit-analysis 접속
  4. 잠금 화면 및 업그레이드 안내 확인
  5. 플랜을 PRO로 변경 후 페이지 접근 가능 확인