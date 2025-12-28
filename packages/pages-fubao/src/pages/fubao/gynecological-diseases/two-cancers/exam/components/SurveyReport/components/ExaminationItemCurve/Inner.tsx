import { RangePicker_L } from '@lm_fe/components';
import { formatDate as formatTimeToDate } from '@lm_fe/utils';
import { Button, Checkbox, Modal, Radio } from 'antd';
import * as echarts from 'echarts';
import { get, map, set } from 'lodash';
import dayjs from 'dayjs';
import React, { Component } from 'react';
import ReactToPrint from 'react-to-print';
import './index.less';
export default class Index extends Component {
  itemCurve: any = null;
  itemCurveRef: any = null;

  option = {
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

  state = {
    itemData: null,
    reportDate: [],
    period: 'pregnancy',
  };

  componentDidMount() {
    this.initializeData();
  }

  initializeData = () => {
    const { pregnancyData } = this.props;
    const startDate = get(pregnancyData, 'lmp');
    const endDate = get(pregnancyData, 'sureEdd') || get(pregnancyData, 'edd');
    this.getItemData(startDate, endDate);
  };

  getItemData = async (startDate: string, endDate: string) => {
    const { itemName } = this.props;
    const itemData = await getLisItemsGroupByItemname(itemName, startDate, endDate);
    await this.setState({
      itemData,
      reportDate: [dayjs(startDate), dayjs(endDate)],
    });

    const dateArr: any[] = [];
    const weekArr: any[] = [];
    const valueArr: any[] = [];
    map(get(itemData, 'data'), (item) => {
      dateArr.push(item.date);
      weekArr.push(item.week);
      valueArr.push(item.value);
    });

    set(this.option, 'xAxis.0.data', dateArr);
    set(this.option, 'xAxis.1.data', weekArr);
    set(this.option, 'series.0.name', itemName);
    set(this.option, 'title.text', itemName);
    set(this.option, 'series.0.data', valueArr);

    const itemCurveRef = this.itemCurveRef;
    this.itemCurve = echarts.init(itemCurveRef);
    this.itemCurve.setOption(this.option);
  };

  handelClose = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleBtn = (e: unknown) => {
    const type = e.target.value;
    const currentYear = dayjs().year();
    switch (type) {
      case 'pregnancy':
        this.initializeData();
        break;
      case 'month':
        this.getItemData(formatTimeToDate(dayjs().startOf('month')), formatTimeToDate(dayjs(new Date())));
        break;
      case 'quarter':
        this.getItemData(formatTimeToDate(dayjs().subtract(3, 'months')), formatTimeToDate(dayjs(new Date())));
        break;
      case 'year':
        this.getItemData(formatTimeToDate(dayjs(`${currentYear}-01-01`)), formatTimeToDate(dayjs(new Date())));
        break;
    }
    this.setState({ period: type });
  };

  handleDatePickerChange = (dates: unknown, dateStrings: unknown) => {
    const startDate = get(dateStrings, '0');
    const endDate = get(dateStrings, '1');
    this.getItemData(startDate, endDate);
  };

  handleCheck = (e: unknown) => {
    set(this.option, 'tooltip.show', e.target.checked);
    this.itemCurve.setOption(this.option);
  };

  handlePrint = () => { };

  render() {
    const { reportDate, period } = this.state;
    const { isShowCurve } = this.props;

    return (
      <Modal
        className="curve-modal"
        title="检验指标曲线图"
        width={1000}
        footer={null}
        visible={isShowCurve}
        onCancel={this.handelClose}
      >
        <div className="top-wrapper">
          <Radio.Group value={period} onChange={this.handleBtn}>
            <Radio.Button value="pregnancy">本孕期</Radio.Button>
            <Radio.Button value="month">本月</Radio.Button>
            <Radio.Button value="quarter">近三月</Radio.Button>
            <Radio.Button value="year">全年</Radio.Button>
          </Radio.Group>
          <span>
            报告时间：
            <RangePicker_L
              value={reportDate}
              onChange={(dates, dateStrings) => this.handleDatePickerChange(dates, dateStrings)}
            />
          </span>
          <Checkbox defaultChecked onChange={this.handleCheck}>
            显示数值标签
          </Checkbox>
          <ReactToPrint
            trigger={() => (
              <Button type="primary" onClick={this.handlePrint}>
                打印
              </Button>
            )}
            content={() => this.itemCurveRef}
          />
        </div>
        <div
          className="curve-ref"
          ref={(ref) => {
            this.itemCurveRef = ref;
          }}
        ></div>
      </Modal>
    );
  }
}
function getLisItemsGroupByItemname(a: any, b: any, c: any) {
  return new Promise((res, rej) => res({}))
}