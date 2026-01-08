# 메뉴 구조 변경 이력

## 개요
SaaS 요금제 기준 문서(saas_pricing_and_features_final.md)에 맞춰 메뉴 구조를 재구성하였습니다.

**작업 일자:** 2026-01-07

---

## 1. 새로운 폴더 구조

```
pages/
├── home/              # 🏠 홈 (대시보드)
├── schedule/          # 📅 스케줄 관리
├── customer-vehicle/  # 👤 고객 / 차량 관리
├── sales/            # 💰 매출 관리
├── expense-payroll/  # 📉 지출 / 급여 관리
├── reports/          # 📊 정산 / 리포트
└── settings/         # ⚙ 설정
```

---

## 2. 페이지 매핑 (총 20개 페이지)

### 2.1 🏠 홈 (대시보드)
| 파일명 | 경로 | 라우트 | 상태 |
|---|---|---|---|
| Dashboard.tsx | pages/home/ | / | 기존 이동 |

### 2.2 📅 스케줄 관리
| 파일명 | 경로 | 라우트 | 상태 |
|---|---|---|---|
| TodaySchedule.tsx | pages/schedule/ | /schedule/today | 신규 생성 |
| BookingCreate.tsx | pages/schedule/ | /schedule/booking | 신규 생성 |
| ScheduleCalendar.tsx | pages/schedule/ | /schedule/calendar | 신규 생성 |
| WorkStatus.tsx | pages/schedule/ | /schedule/work-status | 신규 생성 |

### 2.3 👤 고객 / 차량 관리
| 파일명 | 경로 | 라우트 | 상태 |
|---|---|---|---|
| CustomersPage.tsx | pages/customer-vehicle/ | /customer-vehicle/customers | 기존 이동 |
| VehiclesPage.tsx | pages/customer-vehicle/ | /customer-vehicle/vehicles | 신규 생성 |
| MaintenanceHistory.tsx | pages/customer-vehicle/ | /customer-vehicle/maintenance-history | 신규 생성 |

### 2.4 💰 매출 관리
| 파일명 | 경로 | 라우트 | 상태 |
|---|---|---|---|
| SalesPage.tsx | pages/sales/ | /sales | 기존 이동 |
| ReceivablesPage.tsx | pages/sales/ | /sales/receivables | 기존 이동 |
| SalesStatistics.tsx | pages/sales/ | /sales/statistics | 신규 생성 (PRO) |

### 2.5 📉 지출 / 급여 관리
| 파일명 | 경로 | 라우트 | 상태 |
|---|---|---|---|
| ExpensesPage.tsx | pages/expense-payroll/ | /expense-payroll/expenses | 기존 이동 |
| PayrollPage.tsx | pages/expense-payroll/ | /expense-payroll/payroll | 기존 이동 |

### 2.6 📊 정산 / 리포트
| 파일명 | 경로 | 라우트 | 상태 |
|---|---|---|---|
| MonthlyReportPage.tsx | pages/reports/ | /reports/monthly | 기존 이동 |
| ExcelExport.tsx | pages/reports/ | /reports/excel | 신규 생성 |
| ProfitAnalysis.tsx | pages/reports/ | /reports/profit-analysis | 신규 생성 (PRO) |

### 2.7 ⚙ 설정
| 파일명 | 경로 | 라우트 | 상태 |
|---|---|---|---|
| SettingsPage.tsx | pages/settings/ | /settings | 기존 이동 |
| BusinessHours.tsx | pages/settings/ | /settings/business-hours | 신규 생성 |
| MaintenanceItems.tsx | pages/settings/ | /settings/maintenance-items | 신규 생성 |
| PlanBilling.tsx | pages/settings/ | /settings/plan-billing | 신규 생성 |

---

## 3. 작업 내역

### 3.1 기존 페이지 이동 (8개)
- ✅ Dashboard.tsx → pages/home/
- ✅ CustomersPage.tsx → pages/customer-vehicle/
- ✅ SalesPage.tsx → pages/sales/
- ✅ ReceivablesPage.tsx → pages/sales/
- ✅ ExpensesPage.tsx → pages/expense-payroll/
- ✅ PayrollPage.tsx → pages/expense-payroll/
- ✅ MonthlyReportPage.tsx → pages/reports/
- ✅ SettingsPage.tsx → pages/settings/

### 3.2 신규 페이지 생성 (12개)
모든 신규 페이지는 기본 구조(타이틀만 포함)로 생성되었습니다.

**스케줄 관리 (4개)**
- ✅ TodaySchedule.tsx - 오늘 일정
- ✅ BookingCreate.tsx - 예약 등록
- ✅ ScheduleCalendar.tsx - 일정 캘린더 (주/월)
- ✅ WorkStatus.tsx - 작업 현황판

**고객/차량 관리 (2개)**
- ✅ VehiclesPage.tsx - 차량 관리
- ✅ MaintenanceHistory.tsx - 정비 이력

**매출 관리 (1개)**
- ✅ SalesStatistics.tsx - 매출 통계 (PRO)

**정산/리포트 (2개)**
- ✅ ExcelExport.tsx - 엑셀 다운로드
- ✅ ProfitAnalysis.tsx - 수익 분석 (PRO)

**설정 (3개)**
- ✅ BusinessHours.tsx - 영업시간 / 휴무일
- ✅ MaintenanceItems.tsx - 정비 항목 관리
- ✅ PlanBilling.tsx - 플랜 / 결제 정보

### 3.3 Import 경로 수정
모든 이동된 페이지의 import 경로를 상대 경로로 수정:
```typescript
// 변경 전
import Card from '../src/components/Card';

// 변경 후
import Card from '../../src/components/Card';
```

### 3.4 라우팅 업데이트 (src/App.tsx)
- Import 구문 재구성 (카테고리별 주석 추가)
- Routes 섹션 업데이트 (모든 경로 추가)
- 데스크톱 네비게이션 메뉴 간소화 (주요 카테고리만)
- 모바일 네비게이션 메뉴 상세화 (이모지 + 전체 하위 메뉴)

---

## 4. 네비게이션 구조

### 4.1 데스크톱 메뉴 (간소화)
```
홈 | 스케줄 | 고객/차량 | 매출 | 지출/급여 | 정산 | 설정
```

### 4.2 모바일 메뉴 (전체)
```
🏠 홈

📅 스케줄 - 오늘 일정
📅 스케줄 - 예약 등록
📅 스케줄 - 일정 캘린더
📅 스케줄 - 작업 현황판

👤 고객 관리
👤 차량 관리
👤 정비 이력

💰 매출 등록
💰 미수금 관리
💰 매출 통계 (PRO)

📉 지출 관리
📉 급여 관리

📊 월별 정산
📊 엑셀 다운로드
📊 수익 분석 (PRO)

⚙ 기초 설정
⚙ 영업시간 / 휴무일
⚙ 정비 항목 관리
⚙ 플랜 / 결제 정보
```

---

## 5. 빌드 결과

### 빌드 성공 ✅
```
✓ 57 modules transformed
✓ built in 814ms

dist/index.html                  0.46 kB │ gzip:  0.30 kB
dist/assets/index-N12XbBk7.css   1.37 kB │ gzip:  0.61 kB
dist/assets/index-Cj7F7aEd.js  202.99 kB │ gzip: 62.06 kB
```

- 모든 TypeScript 타입 체크 통과
- 모든 import 경로 정상 작동
- 라우팅 설정 정상 작동

---

## 6. 향후 작업 (TODO)

### 6.1 신규 페이지 기능 구현
각 신규 페이지에 실제 기능을 구현해야 합니다:

**우선순위 높음**
- [x] TodaySchedule.tsx - 오늘 일정 목록 표시 ✅
- [x] BookingCreate.tsx - 예약 등록 폼 ✅
- [x] VehiclesPage.tsx - 차량 목록 및 관리 ✅
- [x] MaintenanceHistory.tsx - 정비 이력 조회 ✅

**우선순위 중간**
- [x] ScheduleCalendar.tsx - 주/월 캘린더 뷰 ✅
- [x] WorkStatus.tsx - 작업 현황 대시보드 ✅
- [x] BusinessHours.tsx - 영업시간 설정 ✅
- [x] MaintenanceItems.tsx - 정비 항목 설정 ✅

**우선순위 낮음 (PRO 기능)**
- [x] SalesStatistics.tsx - 매출 통계 차트 ✅
- [x] ProfitAnalysis.tsx - 수익 분석 리포트 ✅
- [x] ExcelExport.tsx - 엑셀 다운로드 기능 ✅

### 6.2 플랜 기반 접근 제어
- [ ] Feature Flag 시스템 구현
- [ ] 플랜별 페이지 접근 권한 설정
- [ ] PRO 기능 접근 제한 UI 추가

### 6.3 UI/UX 개선
- [ ] 서브메뉴 네비게이션 추가 고려
- [ ] 브레드크럼(Breadcrumb) 추가
- [ ] 페이지별 권한 안내 메시지

---

## 7. 참고 문서
- [SaaS 요금제 및 기능 설계](./saas_pricing_and_features_final.md)
- [프론트엔드 가이드](../frontend_guide.md)
- [메뉴 레이아웃](../MENU_LAYOUT.md)
