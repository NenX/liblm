import { formatTimeToDate, RangePicker_L } from '@lm_fe/components_m';
import { IMchc_Pregnancy } from '@lm_fe/service';
import { Button, Checkbox, Modal, Radio, RadioChangeEvent } from 'antd';
import * as echarts from 'echarts';
import { get, map, set } from 'lodash';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { api } from '../../../../prenatal-visit/pregnancy/doctor-end/.api';
import './index.less';
interface IProps {
  onClose(): void
  isShowCurve: boolean
  itemName: string
  pregnancyData: IMchc_Pregnancy
}
export default function ExaminationItemCurve(props: IProps) {


  const { onClose } = props;
  const { isShowCurve } = props;
  const { itemName } = props;
  const { pregnancyData } = props;

  const itemCurve = useRef<any>(null)
  const itemCurveRef = useRef<any>(null)

  const [itemData, set_itemData] = useState(null)
  const [reportDate, set_reportDate] = useState<any[]>([])
  const [period, set_period] = useState('pregnancy')
  const option = {
    title: {
      text: '',
    },
    xAxis: [
      {
        name: '日期',
        // data: ['2018', '2019', '2020', '2021'],
      },
      {
        name: '孕周',
        data: [],
        position: 'bottom',
        offset: 20,
      },
    ],
    yAxis: {
      type: 'value',
    },
    tooltip: {
      show: true,
    },
    series: [
      {
        // data: [5 * 10 ** -3, 7 * 10 ** -3, 9 * 10 ** -3, 15 * 10 ** -3],
        type: 'line',
        smooth: true,
        symbol: 'emptyCircle',
      },
    ],
  };



  useEffect(() => {

    initializeData();

  }, [])


  function initializeData() {
    const startDate = get(pregnancyData, 'lmp');
    const endDate = get(pregnancyData, 'sureEdd') || get(pregnancyData, 'edd');
    getItemData(startDate!, endDate!);
  };

  async function getItemData(startDate: string, endDate: string) {


    const itemData = await api.survey.getLisItemsGroupByItemname(itemName, startDate, endDate);

    set_itemData(itemData)
    set_reportDate([dayjs(startDate), dayjs(endDate)])
    const dateArr: any[] = [];
    const weekArr: any[] = [];
    const valueArr: any[] = [];
    map(get(itemData, 'data'), (item) => {
      dateArr.push(item.date);
      weekArr.push(item.week);
      valueArr.push(item.value);
    });

    set(option, 'xAxis.0.data', dateArr);
    set(option, 'xAxis.1.data', weekArr);
    set(option, 'series.0.name', itemName);
    set(option, 'title.text', itemName);
    set(option, 'series.0.data', valueArr);

    const _itemCurveRef = itemCurveRef.current;
    itemCurve.current = echarts.init(_itemCurveRef);
    itemCurve.current.setOption(option);
  };

  function handelClose() {


    onClose();
  };

  function handleBtn(e: RadioChangeEvent) {
    const type = e.target.value;
    const currentYear = dayjs().year();
    switch (type) {
      case 'pregnancy':
        initializeData();
        break;
      case 'month':
        getItemData(formatTimeToDate(dayjs().startOf('month')), formatTimeToDate(dayjs(new Date())));
        break;
      case 'quarter':
        getItemData(formatTimeToDate(dayjs().subtract(3, 'months')), formatTimeToDate(dayjs(new Date())));
        break;
      case 'year':
        getItemData(formatTimeToDate(dayjs(`${currentYear}-01-01`)), formatTimeToDate(dayjs(new Date())));
        break;
    }
    set_period(type)
  };

  function handleDatePickerChange(dates: unknown, dateStrings: string[]) {
    const startDate = get(dateStrings, '0');
    const endDate = get(dateStrings, '1');
    getItemData(startDate!, endDate!);
  };

  function handleCheck(e: unknown) {
    set(option, 'tooltip.show', e.target.checked);
    itemCurve.current.setOption(option);
  };

  function handlePrint() { };



  return (
    <Modal
      className="curve-modal"
      title="检验指标曲线图"
      width={1000}
      footer={null}
      visible={isShowCurve}
      onCancel={handelClose}
    >
      <div className="top-wrapper">
        <Radio.Group value={period} onChange={handleBtn}>
          <Radio.Button value="pregnancy">本孕期</Radio.Button>
          <Radio.Button value="month">本月</Radio.Button>
          <Radio.Button value="quarter">近三月</Radio.Button>
          <Radio.Button value="year">全年</Radio.Button>
        </Radio.Group>
        <span>
          报告时间：
          <RangePicker_L
            value={reportDate}
            onChange={(dates, dateStrings) => handleDatePickerChange(dates, dateStrings)}
          />
        </span>
        <Checkbox defaultChecked onChange={handleCheck}>
          显示数值标签
        </Checkbox>
        <ReactToPrint
          trigger={() => (
            <Button type="primary" onClick={handlePrint}>
              打印
            </Button>
          )}
          content={() => itemCurveRef.current}
        />
      </div>
      <div
        className="curve-ref"
        ref={itemCurveRef}
      ></div>
    </Modal>
  );

}
