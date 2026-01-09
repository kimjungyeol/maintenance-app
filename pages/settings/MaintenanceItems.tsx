import React, { useEffect, useState } from 'react';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import SettingsNav from '../../src/components/SettingsNav';
import { fetchMaintenanceItems } from '../../src/mock/api';
import { MaintenanceItem } from '../../src/types';

const MaintenanceItems: React.FC = () => {
  const [items, setItems] = useState<MaintenanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MaintenanceItem | null>(null);
  const [formData, setFormData] = useState<Partial<MaintenanceItem>>({});
  const [showGuideButton, setShowGuideButton] = useState(() => {
    const confirmed = localStorage.getItem('settings_maintenance_items_confirmed');
    return confirmed !== 'true';
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const response = await fetchMaintenanceItems();
    if (response.success) {
      setItems(response.data);
    }
    setLoading(false);
  };

  const getCategoryLabel = (category: MaintenanceItem['category']) => {
    const labels = {
      ENGINE: '엔진',
      BRAKE: '브레이크',
      SUSPENSION: '타이어/서스펜션',
      ELECTRICAL: '전기/전자',
      BODY: '차체',
      ETC: '기타',
    };
    return labels[category];
  };

  const getCategoryColor = (category: MaintenanceItem['category']) => {
    const colors = {
      ENGINE: '#ef4444',
      BRAKE: '#f59e0b',
      SUSPENSION: '#10b981',
      ELECTRICAL: '#3b82f6',
      BODY: '#8b5cf6',
      ETC: '#6b7280',
    };
    return colors[category];
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}분`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
  };

  const handleToggleActive = (itemId: number, e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setItems(prev =>
      prev.map(item =>
        item.item_id === itemId ? { ...item, is_active: !item.is_active } : item
      )
    );
    alert('정비 항목 상태가 변경되었습니다 (Mock)');
  };

  const handleEditClick = (item: MaintenanceItem) => {
    setEditingItem(item);
    setFormData(item);
  };

  const handleCloseEdit = () => {
    setEditingItem(null);
    setFormData({});
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    setItems(prev =>
      prev.map(item =>
        item.item_id === editingItem.item_id
          ? { ...item, ...formData }
          : item
      )
    );
    alert('정비 항목이 수정되었습니다 (Mock)');
    handleCloseEdit();
  };

  const handleFormChange = (field: keyof MaintenanceItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGuideConfirm = () => {
    if (window.confirm('설정 방법을 확인 하셨습니까?')) {
      localStorage.setItem('settings_maintenance_items_confirmed', 'true');
      setShowGuideButton(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1>설정</h1>
        <SettingsNav />
        <Card>로딩 중...</Card>
      </div>
    );
  }

  // 카테고리별로 그룹화
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MaintenanceItem[]>);

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
                정비 항목 정보를 추가 및 수정 or 비활성화 할 수 있습니다. 예약 등록시 사용 됩니다.
              </div>
            </div>
            <Button size="small" onClick={handleGuideConfirm}>
              사용 확인
            </Button>
          </div>
        </Card>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>정비 항목 관리</h2>
        <Button onClick={() => alert('항목 추가 기능 (Mock)')}>
          항목 추가
        </Button>
      </div>

      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <Card key={category} style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
          }}>
            <div
              style={{
                width: '4px',
                height: '20px',
                backgroundColor: getCategoryColor(category as MaintenanceItem['category']),
                borderRadius: '2px',
              }}
            />
            <h2 style={{ margin: 0 }}>{getCategoryLabel(category as MaintenanceItem['category'])}</h2>
            <span style={{ fontSize: '14px', color: '#999' }}>({categoryItems.length}개)</span>
          </div>

          {categoryItems.map((item) => (
            <div
              key={item.item_id}
              onClick={() => handleEditClick(item)}
              style={{
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: item.is_active ? '#fff' : '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                opacity: item.is_active ? 1 : 0.6,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-color)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>
                    {item.item_name}
                  </div>
                  {item.description && (
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {item.description}
                    </div>
                  )}
                </div>
                <Button
                  size="small"
                  variant={item.is_active ? 'secondary' : 'primary'}
                  onClick={(e) => handleToggleActive(item.item_id, e)}
                >
                  {item.is_active ? '비활성화' : '활성화'}
                </Button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 80px 1fr',
                gap: '8px',
                fontSize: '14px',
              }}>
                <span style={{ color: '#666', fontWeight: 500 }}>기본 가격</span>
                <span style={{ color: '#222', fontWeight: 600 }}>{formatCurrency(item.default_price)}</span>

                <span style={{ color: '#666', fontWeight: 500 }}>소요 시간</span>
                <span style={{ color: '#222', fontWeight: 600 }}>{formatDuration(item.default_duration)}</span>
              </div>
            </div>
          ))}
        </Card>
      ))}

      <Card style={{ backgroundColor: '#f9fafb' }}>
        <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: 600 }}>안내</h3>
        <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#666' }}>
          <div>• 항목을 클릭하면 수정할 수 있습니다</div>
          <div>• 비활성화된 항목은 예약 시 선택할 수 없습니다</div>
          <div>• 기본 가격과 소요 시간은 예약 시 참고용입니다</div>
          <div>• 실제 금액은 작업 후 조정할 수 있습니다</div>
        </div>
      </Card>

      {/* 수정 모달 */}
      {editingItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={handleCloseEdit}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>정비 항목 수정</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#333' }}>
                항목명 *
              </label>
              <input
                type="text"
                value={formData.item_name || ''}
                onChange={(e) => handleFormChange('item_name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--card-radius)',
                  border: '1px solid #ddd',
                  fontSize: 'var(--font-base)',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#333' }}>
                카테고리 *
              </label>
              <select
                value={formData.category || ''}
                onChange={(e) => handleFormChange('category', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--card-radius)',
                  border: '1px solid #ddd',
                  fontSize: 'var(--font-base)',
                }}
              >
                <option value="ENGINE">엔진</option>
                <option value="BRAKE">브레이크</option>
                <option value="SUSPENSION">타이어/서스펜션</option>
                <option value="ELECTRICAL">전기/전자</option>
                <option value="BODY">차체</option>
                <option value="ETC">기타</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#333' }}>
                기본 가격 (원) *
              </label>
              <input
                type="number"
                value={formData.default_price || ''}
                onChange={(e) => handleFormChange('default_price', Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--card-radius)',
                  border: '1px solid #ddd',
                  fontSize: 'var(--font-base)',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#333' }}>
                소요 시간 (분) *
              </label>
              <input
                type="number"
                value={formData.default_duration || ''}
                onChange={(e) => handleFormChange('default_duration', Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--card-radius)',
                  border: '1px solid #ddd',
                  fontSize: 'var(--font-base)',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#333' }}>
                설명
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--card-radius)',
                  border: '1px solid #ddd',
                  fontSize: 'var(--font-base)',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={handleCloseEdit}>
                취소
              </Button>
              <Button variant="primary" onClick={handleSaveEdit}>
                저장
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceItems;
