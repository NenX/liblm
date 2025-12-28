import React from 'react';
import { message } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { request } from '@lm_fe/utils';
import './PregnancyToolbar.less';
export default function ClearCache() {
  const handleClearCache = async () => {
    await request.get('/api/clearCache');
    message.success('清除缓存成功');
  };

  return (
    <div className="toolbar-wrapper" style={{ marginRight: 32 }}>
      <div className="toolbar-action" onClick={handleClearCache}>
        <ClearOutlined style={{ fontSize: '14px', marginRight: 2 }} /> 清除缓存
      </div>
    </div>
  );
}
