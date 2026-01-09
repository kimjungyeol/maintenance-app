import React, { useState } from 'react';
import Card from '../../src/components/Card';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import SettingsNav from '../../src/components/SettingsNav';

const SettingsPage: React.FC = () => {
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Bro Motors',
    owner: '홍길동',
    phone: '010-1234-5678',
    address: '경기도 평택시',
  });
  const [showGuideButton, setShowGuideButton] = useState(() => {
    const confirmed = localStorage.getItem('settings_basic_confirmed');
    return confirmed !== 'true';
  });

  const handleSave = () => {
    alert('설정이 저장되었습니다 (Mock)');
  };

  const handleGuideConfirm = () => {
    if (window.confirm('설정 방법을 확인 하셨습니까?')) {
      localStorage.setItem('settings_basic_confirmed', 'true');
      setShowGuideButton(false);
    }
  };

  return (
    <div>
      <h1>설정</h1>
      <SettingsNav />

      {showGuideButton && (
        <Card style={{ marginBottom: '16px', backgroundColor: '#fffbeb', border: '2px solid #fbbf24' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#92400e', fontWeight: 500, marginBottom: '4px' }}>
                💡 설정 페이지를 처음 사용하시나요? 사용 방법을 확인해주세요.
              </div>
              <div style={{ fontSize: '13px', color: '#78350f' }}>
                사업장의 기본 정보를 입력해 주시기 바랍니다.
              </div>
            </div>
            <Button size="small" onClick={handleGuideConfirm}>
              사용 확인
            </Button>
          </div>
        </Card>
      )}

      <Card>
        <h2>사업장 정보</h2>
        <Input
          label="사업장명"
          value={businessInfo.name}
          onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
        />
        <Input
          label="대표자명"
          value={businessInfo.owner}
          onChange={(e) => setBusinessInfo({ ...businessInfo, owner: e.target.value })}
        />
        <Input
          label="전화번호"
          value={businessInfo.phone}
          onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
        />
        <Input
          label="주소"
          value={businessInfo.address}
          onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
        />
        <Button onClick={handleSave} fullWidth>저장</Button>
      </Card>

      <Card>
        <h2>지출 카테고리</h2>
        <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
          <div>• 부품 (PART)</div>
          <div>• 외주 (OUTSOURCE)</div>
          <div>• 고정비 (FIXED)</div>
          <div>• 기타 (ETC)</div>
        </div>
      </Card>

      <Card>
        <h2>결제수단</h2>
        <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
          <div>• 현금 (CASH)</div>
          <div>• 카드 (CARD)</div>
          <div>• 계좌이체 (TRANSFER)</div>
        </div>
      </Card>

      <Card style={{ backgroundColor: '#f9f9f9' }}>
        <h2>시스템 정보</h2>
        <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.8' }}>
          <div>버전: 1.0.0</div>
          <div>모드: Mock Data</div>
          <div>Backend API: 미연결</div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
