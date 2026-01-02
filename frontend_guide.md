
# 🚗 5인 이하 자동차 정비소 경리 시스템  
## Frontend 개발 가이드 (React + TypeScript)

본 문서는  
**DB 설계 및 전체 메뉴 구조(확정안)**을 기준으로  
AI 기반 Frontend 개발을 수행하기 위한 명세서이다.

- Backend API는 아직 미구현
- 실제 DB 저장 없이 Mock 데이터 기반 UI 개발
- 화면 전환 및 UX 검증 목적

---

## 1. 개발 목표

- 5인 이하 자동차 정비소의 **경리 업무 대체**
- 모바일 우선(Mobile First)
- 심플 / 깔끔 / 업무용 UI
- 입력 최소화, 숫자 중심 화면
- React + TypeScript 기반 SPA

---

## 2. 전체 메뉴 구조 (확정안)

```
[ 홈 ]
[ 매출 관리 ]
[ 지출 관리 ]
[ 미수금 관리 ]
[ 급여 관리 ]
[ 월별 정산 ]
[ 기초 설정 ]
```

---

## 3. DB 테이블 요약 (UI 기준)

### 3.1 매출 (sales)

| 컬럼명 | 설명 |
|------|----|
| sale_id | 매출 ID |
| sale_date | 매출일 |
| amount | 금액 |
| payment_type | CASH / CARD / TRANSFER |
| car_number | 차량번호 (선택) |
| customer_name | 고객명 (선택) |
| memo | 메모 |

---

### 3.2 지출 (expenses)

| 컬럼명 | 설명 |
|------|----|
| expense_id | 지출 ID |
| expense_date | 지출일 |
| category | PART / OUTSOURCE / FIXED / ETC |
| vendor_name | 거래처 |
| amount | 금액 |
| payment_type | 결제수단 |
| receipt_path | 영수증 이미지 경로 |
| memo | 메모 |

---

### 3.3 미수금 (receivables)

| 컬럼명 | 설명 |
|------|----|
| recv_id | 미수금 ID |
| sale_id | 매출 ID |
| customer_name | 고객명 |
| amount | 금액 |
| due_date | 수금 예정일 |
| paid | 수금 여부 |
| paid_date | 수금일 |

---

### 3.4 직원 / 급여

**employees**

| 컬럼 | 설명 |
|----|----|
| emp_id | 직원 ID |
| emp_name | 이름 |
| role | 역할 |
| monthly_pay | 월급 |
| join_date | 입사일 |

**payroll**

| 컬럼 | 설명 |
|----|----|
| payroll_id | 급여 ID |
| emp_id | 직원 ID |
| pay_month | YYYY-MM |
| pay_amount | 지급액 |
| paid_date | 지급일 |

---

## 4. 메뉴별 화면 정의

### 4.1 홈 (Dashboard)

- 오늘 매출 합계
- 오늘 지출 합계
- 오늘 순현금
- 매출 등록 버튼
- 지출 등록 버튼

---

### 4.2 매출 관리

- 매출 목록
- 매출 등록
- 사용 테이블: sales

---

### 4.3 지출 관리

- 지출 목록
- 지출 등록
- 영수증 첨부
- 사용 테이블: expenses

---

### 4.4 미수금 관리

- 미수금 목록
- 수금 처리
- 사용 테이블: receivables

---

### 4.5 급여 관리

- 직원 관리
- 급여 지급 내역
- 사용 테이블: employees, payroll

---

### 4.6 월별 정산

- 월별 매출 합계
- 월별 지출 합계
- 순이익
- 엑셀 다운로드(Mock)

---

### 4.7 기초 설정

- 사업장 정보
- 지출 카테고리
- 결제수단 코드

---

## 5. React 컴포넌트 구조 (권장)

```
src/
 ├─ components/
 ├─ pages/
 ├─ types/
 ├─ mock/
 └─ App.tsx
```

---

## 6. TypeScript 타입 예시

```ts
export interface Sale {
  sale_id: number;
  sale_date: string;
  amount: number;
  payment_type: 'CASH' | 'CARD' | 'TRANSFER';
  car_number?: string;
  customer_name?: string;
  memo?: string;
}
```

---

## 7. 개발 제외 범위

- 세무 신고
- 부가세 계산
- 4대 보험 자동 계산
- POS / 은행 API 연동

---

## 8. 최종 지침

> 이 프로젝트는 회계 시스템이 아니라  
> **정비소 사장을 위한 숫자 정리 UI**다.
