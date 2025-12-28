import { formatDateTimeNoSecond, } from '@lm_fe/utils';
import { MODAL_TEMPLATE_TYPES } from '@lm_fe/env';
import { APP_CONFIG } from '../../../utils/constants';
import React from 'react';
export const tableColumns_gysy = [
  {
    title: '日期',
    dataIndex: 'recordTime',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    editable: true,
    align: 'center',
    inputType: 'DateTimeInput',
    inputProps: { showTime: true, format: formatDateTimeNoSecond.format },
    render: formatDateTimeNoSecond,
    sortType: 'date',
    filterType: 'date',
    // showSorter: true,
    defaultSortOrder: 'descend',
    fixed: 'left',
  },
  {
    title: '体温(℃)',
    dataIndex: 'temperature',
    editable: true,
    align: 'center',
    inputType: 'input_number',
    inputProps: { min: 0 },
    width: APP_CONFIG.CELL_WIDTH_TINY,
    render: (value: any) => value && (value >= 37.3 ? <div style={{ color: 'red' }}>{value}</div> : `${value}`),
  },
  {
    title: '心率(次/分)',
    dataIndex: 'heartRate',
    editable: true,
    align: 'center',
    inputType: 'InputNumber',
    inputProps: { type: 'number', min: 0, minValue: 60, maxValue: 100, precision: 0 },
    width: APP_CONFIG.CELL_WIDTH_MINI,
    render: (value: any) =>
      value && (value > 100 || value < 60 ? <div style={{ color: 'red' }}>{value}</div> : `${value}`),
  },
  {
    title: '呼吸(次/分)',
    dataIndex: 'breathing',
    editable: true,
    align: 'center',
    inputType: 'InputNumber',
    inputProps: { type: 'number', min: 0, minValue: 60, maxValue: 100, precision: 0 },
    width: APP_CONFIG.CELL_WIDTH_MINI,
    render: (value: any) =>
      value && (value > 20 || value < 12 ? <div style={{ color: 'red' }}>{value}</div> : `${value}`),
  },
  {
    title: '脉搏(bpm)',
    dataIndex: 'pluse',
    align: 'center',
    editable: true,
    inputType: 'InputNumber',
    inputProps: { type: 'number', min: 0, minValue: 60, maxValue: 100, precision: 0 },
    width: APP_CONFIG.CELL_WIDTH_TINY,
    render: (value: any) =>
      value &&
      (value > 100 ? (
        <div style={{ color: 'red' }}>{value}</div>
      ) : value < 60 ? (
        <div style={{ color: 'red' }}>{value}</div>
      ) : (
        `${value}`
      )),
  },
  {
    title: '反应',
    dataIndex: 'response',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_TINY,
    inputType: 'MyAutoComplete',
    inputProps: {
      optionKey: '反应s',
    },
  },
  {
    title: '面色',
    dataIndex: 'face',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_TINY,
    inputType: 'MyAutoComplete',
    inputProps: {
      optionKey: '面色s',
    },
  },
  {
    title: '哭声',
    dataIndex: 'weep',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_TINY,
    inputType: 'MyAutoComplete',
    inputProps: {
      optionKey: '哭声s',
    },
  },
  {
    title: '吸吮力',
    dataIndex: 'suck',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_TINY,
    inputType: 'MyAutoComplete',
    inputProps: {
      optionKey: '吸吮力s',
    },
  },

  {
    title: '产瘤(cm)',
    dataIndex: 'haematomas',
    editable: true,
    align: 'center',
    inputType: 'MyAutoComplete',
    inputProps: {
      // isPop: true,
      // separator: 'x',
      options: [
        '已吸收',
      ]
    },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    // render(a: any) {
    //   return <ArrayInput.DisplayFC
    //     separator='x'
    //     options={[
    //       { inputType: 'MyInput', props: { style: { width: 32 } }, },
    //       { inputType: 'MyInput', props: { style: { width: 32 } }, },
    //       { inputType: 'MyInput', props: { style: { width: 32 } }, },
    //     ]}
    //     value={a} />
    // }

  },
  {
    title: '脐带',
    dataIndex: 'umbilicus',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_TINY,
    inputType: 'MyAutoComplete',
    inputProps: {
      optionKey: '脐带s',
    },
  },
  {
    title: '臀部',
    dataIndex: 'hips',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_TINY,
    inputType: 'MyAutoComplete',
    inputProps: {
      optionKey: '臀部s',
    },
  },
  {
    title: '大便',
    dataIndex: 'feces',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_TINY,
    inputType: 'MyAutoComplete',
    inputProps: {
      optionKey: '大便s',
    },
  },
  {
    title: '小便',
    dataIndex: 'pee',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_TINY,
    inputType: 'MyAutoComplete',
    inputProps: {
      optionKey: '小便s',
    },
  },
  {
    title: '血糖(mmol/L)',
    dataIndex: 'bloodGlucose',
    editable: true,
    align: 'center',
    inputType: 'input_number',
    inputProps: { min: 0 },
    width: APP_CONFIG.CELL_WIDTH_MINI,
  },
  {
    title: '皮测胆红素(umol/L)',
    dataIndex: 'skinBilirubin',
    editable: true,
    align: 'center',
    inputType: 'input_number',
    inputProps: { min: 0 },
    width: APP_CONFIG.CELL_WIDTH_MINI,
  },
  {
    title: '喂养',
    dataIndex: 'feed',
    editable: true,
    align: 'center',
    inputType: 'MyCheckbox',
    inputProps: { options: [{ value: '无', label: '人工' }, { value: '有', label: '母乳' }], marshal: false },

    width: APP_CONFIG.CELL_WIDTH_TINY,
  },
  {
    title: '识别带 手脚',
    dataIndex: 'idBand',
    editable: true,
    align: 'center',
    inputType: 'MyCheckbox',
    inputProps: { type: 'multiple', options: [{ value: '手', label: '手' }, { value: '脚', label: '脚' }], marshal: false },

    width: APP_CONFIG.CELL_WIDTH_TINY,
  },

  {
    title: '特殊护理记录',
    dataIndex: 'other',
    editable: true,
    align: 'center',
    inputType: 'TextArea',
    inputProps: { type: MODAL_TEMPLATE_TYPES.产前产后, isPop: true, rows: 10 },
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '签名',
    dataIndex: 'recorder',
    inputType: 'TextArea',
    inputProps: { type: MODAL_TEMPLATE_TYPES.科室个人, isPop: true, rows: 10 },

    align: 'center',
    editable: true,
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
];
