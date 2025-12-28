import React, { useState, useEffect } from 'react';
import './index.less';
import { InfoCircleOutlined } from '@ant-design/icons';
interface Iprops {
  [key: string]: any;
}
/**接诊效率分布 */
export default function ChartEfficiency({ ...props }: Iprops) {
  return (
    <div className="chart-efficienc-container">
      <div className="title-content">
        <div className="title">接诊效率</div>
        <InfoCircleOutlined title="接诊效率指在产科专科病历人均平均接诊时间" />
      </div>
      <div className="count-content border">
        <div className="count">12/1</div>
        <div className="unit">(分钟/人)</div>
      </div>
      <div className="explain-content border">
        <div className="explain">接诊人数</div>
        <div className="unit">12334 (人)</div>
      </div>
      <div className="explain-content">
        <div className="explain">总耗时</div>
        <div className="unit">1220 (分钟)</div>
      </div>
    </div>
  );
}
