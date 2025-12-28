import React, { useContext, useCallback, useEffect, useState } from 'react';
import request from '@/lib/request';
import { Modal, Space } from 'antd';
import { map, get } from 'lodash';
import './index.less';
import { OnlyShowText } from '@/pages/highrisk-management/phone-call-review-timeout/list/components/Modal';
import { showMenu } from 'react-contextmenu';
interface Iprops {
  visible: boolean;
  onCancle: Function;
  onShow: Function;
  id: string;
  [key: string]: any;
}
/**高危快讯弹窗模块 */
export default function HighRiskModal({ visible, onCancle, onShow, id, ...prps }: Iprops) {
  const [highriskData, setHighriskData] = useState(null);
  useEffect(() => {
    async function initData() {
      if (!id) return;
      const data: any = await request.get('/api/doctor/getRiskNewsFlash?id=' + id);
      setHighriskData(data);
    }
    initData();
  }, [id]);

  function handleCancel() {
    onCancle && onCancle();
  }

  function renderFooter() {
    return (
      <div className="footer-content">
        <div className="know-btn" onClick={handleCancel}>
          知道了
        </div>
      </div>
    );
  }
  return !highriskData ? null : (
    <Modal
      className="high-risk-container"
      title="高危快讯"
      visible={visible}
      // style={{ top: '48px' }}
      width={1095}
      onCancel={handleCancel}
      footer={renderFooter()}
    >
      {map(highriskData, (item, index) => {
        return (
          <div className="mian-content">
            <div className="col-name">{get(item, `colName`)}</div>
            <div className="news-content">
              {map(get(item, `news`), (newsItem, ind) => {
                return (
                  <div className="item-content">
                    <div className="item-title">{get(newsItem, `title`)}</div>
                    <div className="data-content">
                      {map(get(newsItem, `contents`), (contentsItem, i) => {
                        return (
                          <div className="item-event">
                            <span className="event">{get(contentsItem, `event`)}</span>
                            {get(contentsItem, `date`) && <span className="date">({get(contentsItem, `date`)})</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </Modal>
  );
}
