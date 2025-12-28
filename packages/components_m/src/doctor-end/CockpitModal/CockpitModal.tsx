import React, { useContext, useCallback, useEffect, useState } from 'react';
import { Modal, Space } from 'antd';
import { TimeHeader, ChartBooking, ChartEfficiency, ChartHighrisk, ChartType } from './components/index';
import { getUrgentSituation, getBookingSituation } from './methods/request-methods';
import './index.less';
interface Iprops {
  visible: boolean;
  onCancle: Function;
  [key: string]: any;
}
export default function CockpitModal({ visible, onCancle, ...prps }: Iprops) {
  const [bookingDate, setBookingDate] = useState(null); // 预约时间
  const [urgentDate, setUrgentDate] = useState(null); // 接诊时间
  const [bookingSituation, setBookingSituation] = useState(null); // 预约数据
  const [urgentSituation, setUrgentSituation] = useState(null); // 接诊数据
  useEffect(() => {
    if (bookingDate) {
      (async function anyNameFunction() {
        const data: any = await getBookingSituation(bookingDate);
        setBookingSituation(data);
      })();
    }
  }, [bookingDate]);
  useEffect(() => {
    if (urgentDate) {
      (async function anyNameFunction() {
        const data: any = await getUrgentSituation(urgentDate);
        setUrgentSituation(data);
      })();
    }
  }, [urgentDate]);

  useEffect(() => {
    console.log({ bookingSituation, urgentSituation });
  }, [bookingSituation, urgentSituation]);
  function handleCancel() {
    onCancle && onCancle();
  }
  function selecTimeChange(value: any) {
    setUrgentDate(value);
  }
  function selecTimeChange2(value: any) {
    setBookingDate(value);
  }
  return (
    <Modal
      className="cockpit-container"
      title="可视化驾驶舱"
      visible={visible}
      style={{ top: '48px' }}
      width={1000}
      onCancel={handleCancel}
      footer={null}
    >
      <TimeHeader title={'接诊情况'} onChange={selecTimeChange} />
      <div className="urgent-content">
        <ChartEfficiency />
        <ChartType />
        <ChartHighrisk />
      </div>
      <TimeHeader title={'预约情况'} onChange={selecTimeChange2} />
      <div className="booking-content">
        <ChartBooking />
      </div>
    </Modal>
  );
}
