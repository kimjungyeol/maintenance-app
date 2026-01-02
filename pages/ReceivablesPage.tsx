import React, { useEffect, useState } from 'react';
import Card from '../src/components/Card';
import Button from '../src/components/Button';
import { fetchReceivables } from '../src/mock/api';
import { Receivable } from '../src/types';

const ReceivablesPage: React.FC = () => {
  const [receivables, setReceivables] = useState<Receivable[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchReceivables();
      if (response.success) {
        setReceivables(response.data);
      }
    };
    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  const handleCollect = (recvId: number) => {
    alert(`미수금 ${recvId}번이 수금 처리되었습니다 (Mock)`);
  };

  const unpaidTotal = receivables
    .filter((r) => !r.paid)
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div>
      <h1>미수금 관리</h1>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>미수금 총액:</span>
          <strong style={{ color: 'red', fontSize: '18px' }}>
            {formatCurrency(unpaidTotal)}
          </strong>
        </div>
      </Card>

      <h2>미수금 목록</h2>
      {receivables.map((receivable) => (
        <Card key={receivable.recv_id}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '8px',
          }}>
            <div>
              <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                {receivable.customer_name}
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                수금 예정일: {receivable.due_date}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '8px' }}>
                {formatCurrency(receivable.amount)}
              </div>
              {receivable.paid ? (
                <span style={{
                  backgroundColor: 'var(--primary-color)',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}>
                  수금완료
                </span>
              ) : (
                <Button onClick={() => handleCollect(receivable.recv_id)}>
                  수금처리
                </Button>
              )}
            </div>
          </div>
          {receivable.paid && receivable.paid_date && (
            <div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
              수금일: {receivable.paid_date}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ReceivablesPage;
