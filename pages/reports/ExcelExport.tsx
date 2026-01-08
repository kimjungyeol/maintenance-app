import React, { useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import ReportsNav from '../../src/components/ReportsNav';
import ProtectedFeature from '../../src/components/ProtectedFeature';

const ExcelExport: React.FC = () => {
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-12-31');
  const [selectedData, setSelectedData] = useState<string[]>(['sales']);

  const dataTypes = [
    { id: 'sales', label: '매출 내역', description: '매출 등록 및 미수금 데이터' },
    { id: 'expenses', label: '지출 내역', description: '카테고리별 지출 데이터' },
    { id: 'payroll', label: '급여 내역', description: '직원별 급여 지급 데이터' },
    { id: 'customers', label: '고객 정보', description: '고객 연락처 및 기본 정보' },
    { id: 'vehicles', label: '차량 정보', description: '차량 번호, 모델, 연식 등' },
    { id: 'schedules', label: '예약 일정', description: '예약 및 작업 일정 데이터' },
    { id: 'maintenance', label: '정비 이력', description: '정비 내역 및 비용 데이터' },
  ];

  const handleToggleData = (id: string) => {
    setSelectedData(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleExport = () => {
    if (selectedData.length === 0) {
      alert('다운로드할 데이터를 선택해주세요.');
      return;
    }

    const selectedLabels = dataTypes
      .filter(dt => selectedData.includes(dt.id))
      .map(dt => dt.label)
      .join(', ');

    alert(`엑셀 다운로드가 시작됩니다.\n\n기간: ${startDate} ~ ${endDate}\n데이터: ${selectedLabels}\n\n실제 환경에서는 엑셀 파일이 다운로드됩니다.`);
  };

  const handleSelectAll = () => {
    setSelectedData(dataTypes.map(dt => dt.id));
  };

  const handleDeselectAll = () => {
    setSelectedData([]);
  };

  const setQuickPeriod = (months: number) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);

    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  };

  return (
    <div>
      <h1>정산 / 리포트</h1>
      <ReportsNav />
      <ProtectedFeature featureKey="EXCEL_EXPORT">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <h2 style={{ margin: 0 }}>엑셀 다운로드</h2>
          <div style={{
            padding: '6px 12px',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#0369a1',
            fontWeight: 600,
          }}>
            BASIC 플랜 이상
          </div>
        </div>

      {/* 날짜 범위 선택 */}
      <Card style={{ marginBottom: '24px' }}>
        <h2>다운로드 기간 설정</h2>
        <div style={{ marginTop: '16px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '16px',
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#333',
                marginBottom: '8px',
              }}>
                시작일
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--card-radius)',
                  border: '1px solid #ddd',
                  fontSize: 'var(--font-base)',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#333',
                marginBottom: '8px',
              }}>
                종료일
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--card-radius)',
                  border: '1px solid #ddd',
                  fontSize: 'var(--font-base)',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setQuickPeriod(1)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              최근 1개월
            </button>
            <button
              onClick={() => setQuickPeriod(3)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              최근 3개월
            </button>
            <button
              onClick={() => setQuickPeriod(6)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              최근 6개월
            </button>
            <button
              onClick={() => setQuickPeriod(12)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              최근 1년
            </button>
          </div>
        </div>
      </Card>

      {/* 데이터 선택 */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <h2 style={{ margin: 0 }}>다운로드 데이터 선택</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSelectAll}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              전체 선택
            </button>
            <button
              onClick={handleDeselectAll}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              전체 해제
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px',
        }}>
          {dataTypes.map((dataType) => {
            const isSelected = selectedData.includes(dataType.id);
            return (
              <div
                key={dataType.id}
                onClick={() => handleToggleData(dataType.id)}
                style={{
                  padding: '16px',
                  backgroundColor: isSelected ? '#eff6ff' : '#f9fafb',
                  border: isSelected ? '2px solid var(--primary-color)' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#333',
                  }}>
                    {dataType.label}
                  </span>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: isSelected ? 'var(--primary-color)' : '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}>
                    {isSelected && '✓'}
                  </div>
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#666',
                }}>
                  {dataType.description}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#166534',
        }}>
          <strong>{selectedData.length}개</strong>의 데이터 유형이 선택되었습니다.
        </div>
      </Card>

      {/* 다운로드 옵션 */}
      <Card style={{ marginBottom: '24px' }}>
        <h2>다운로드 옵션</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginTop: '16px',
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
              파일 형식
            </div>
            <select
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px',
              }}
            >
              <option value="xlsx">Excel (.xlsx)</option>
              <option value="csv">CSV (.csv)</option>
            </select>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
              시트 구성
            </div>
            <select
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px',
              }}
            >
              <option value="separate">데이터별 시트 분리</option>
              <option value="single">단일 시트로 통합</option>
            </select>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
              통화 표시
            </div>
            <select
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px',
              }}
            >
              <option value="krw">원화 (₩)</option>
              <option value="number">숫자만 표시</option>
            </select>
          </div>
        </div>
      </Card>

      {/* 다운로드 버튼 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
      }}>
        <Button
          onClick={handleExport}
          variant="primary"
          size="large"
        >
          엑셀 다운로드
        </Button>
      </div>

      {/* 안내 사항 */}
      <Card style={{ marginTop: '24px', backgroundColor: '#fffbeb', border: '1px solid #fcd34d' }}>
        <h3 style={{ marginTop: 0, fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#92400e' }}>
          다운로드 안내
        </h3>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#78350f', lineHeight: '1.8' }}>
          <li>선택한 기간과 데이터 유형에 따라 파일 크기가 달라질 수 있습니다.</li>
          <li>대용량 데이터의 경우 다운로드에 시간이 소요될 수 있습니다.</li>
          <li>개인정보가 포함된 데이터는 안전하게 관리해주세요.</li>
          <li>다운로드된 파일은 최신 Excel 또는 Google Sheets에서 열 수 있습니다.</li>
        </ul>
      </Card>
      </ProtectedFeature>
    </div>
  );
};

export default ExcelExport;
