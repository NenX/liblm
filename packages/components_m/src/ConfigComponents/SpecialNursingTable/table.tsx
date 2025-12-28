import { mchcEnv } from '@lm_fe/env';
import { formatDateTimeNoSecond } from '@lm_fe/utils';
import { MyPressure } from '../../FU_components/PressureInput';
import { APP_CONFIG } from '../../utils/constants';
export const tableColumns = [
  {
    title: '日期',
    dataIndex: 'recordTime',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
    align: 'center',
    editable: true,
    inputType: 'DateTimeInput',
    inputProps: { showTime: true, format: formatDateTimeNoSecond.format },
    render: formatDateTimeNoSecond,
    sortType: 'date',
    filterType: 'date',
    showSorter: true,
    defaultSortOrder: 'descend',
    fixed: 'left',
  },
  {
    title: '体温(℃)',
    dataIndex: 'temperature',
    align: 'center',
    editable: true,
    inputType: 'InputNumber',
    inputProps: { type: 'number', min: 0, minValue: 36.5, maxValue: 37.3 },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any) =>
      value && (value > 37.3 || value < 36.5 ? <div style={{ color: 'red' }}>{value}</div> : `${value}`),
  },

  {
    title: '脉搏(bpm)',
    dataIndex: 'pulse',
    align: 'center',
    editable: true,
    inputType: 'InputNumber',
    inputProps: { type: 'number', min: 0, minValue: 60, maxValue: 100 },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
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
    title: '呼吸(bpm)',
    dataIndex: 'breath',
    align: 'center',
    editable: true,
    inputType: 'InputNumber',
    inputProps: { type: 'number', min: 0, minValue: 12, maxValue: 20 },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any) =>
      value &&
      (value > 20 ? (
        <div style={{ color: 'red' }}>{value}</div>
      ) : value < 12 ? (
        <div style={{ color: 'red' }}>{value}</div>
      ) : (
        `${value}`
      )),
  },
  mchcEnv.is('广三') ?

  {
    title: '血压(mmHg)',
    align: 'center',
    dataIndex: 'bp',
    editable: true,
    inputType: 'MyPressure',
    inputProps: { isPop: false },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any) => {

      return MyPressure.DisplayFC ? <MyPressure.DisplayFC value={value} /> : null
    }
  } :
  {
    title: '血压',
    align: 'center',
    children: [
      {
        title: '收缩压(mmHg)',
        dataIndex: 'systolic',
        align: 'center',
        editable: true,
        inputType: 'InputNumber',
        inputProps: { type: 'number', min: 0, minValue: 90, maxValue: 130 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
        render: (value: any) =>
          value &&
          (value > 130 ? (
            <div style={{ color: 'red' }}>{value}</div>
          ) : value < 90 ? (
            <div style={{ color: 'red' }}>{value}</div>
          ) : (
            `${value}`
          )),
      },
      {
        title: '舒张压(mmHg)',
        dataIndex: 'diastolic',
        align: 'center',
        editable: true,
        inputType: 'InputNumber',
        inputProps: { type: 'number', min: 0, minValue: 60, maxValue: 90 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
        render: (value: any) =>
          value &&
          (value > 90 ? (
            <div style={{ color: 'red' }}>{value}</div>
          ) : value < 60 ? (
            <div style={{ color: 'red' }}>{value}</div>
          ) : (
            `${value}`
          )),
      },
    ],
  },
  {
    title: '入量',
    align: 'center',
    children: [
      {
        title: '名称',
        dataIndex: 'takeinType1',
        editable: true,
        align: 'center',
        // inputType: 'input_number',
        // inputProps: { min: 0 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
      },
      {
        title: '量',
        dataIndex: 'takeinVolume1',
        editable: true,
        align: 'center',
        inputType: 'input_number',
        inputProps: { min: 0 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
      },
      {
        title: '名称',
        dataIndex: 'takeinType2',
        editable: true,
        align: 'center',
        // inputType: 'input_number',
        // inputProps: { min: 0 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
      },
      {
        title: '量',
        dataIndex: 'takeinVolume2',
        editable: true,
        align: 'center',
        inputType: 'input_number',
        inputProps: { min: 0 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
      },
      {
        title: '名称',
        dataIndex: 'takeinType3',
        editable: true,
        align: 'center',
        // inputType: 'input_number',
        // inputProps: { min: 0 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
      },
      {
        title: '量',
        dataIndex: 'takeinVolume3',
        editable: true,
        align: 'center',
        inputType: 'input_number',
        inputProps: { min: 0 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
      },
    ],
  },
  {
    title: '出量',
    align: 'center',
    children: [
      {
        title: '名称',
        dataIndex: 'outputType1',
        editable: true,
        align: 'center',
        inputType: 'MyAutoComplete',
        inputProps: { optionKey: '出量s' },
        // inputType: 'input_number',
        // inputProps: { min: 0 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
      },
      {
        title: '量',
        dataIndex: 'outputVolume1',
        editable: true,
        align: 'center',
        inputType: 'input_number',
        inputProps: { min: 0 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
      },
      {
        title: '名称',
        dataIndex: 'outputType2',
        editable: true,
        align: 'center',
        // inputType: 'input_number',
        // inputProps: { min: 0 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
      },
      {
        title: '量',
        dataIndex: 'outputVolume2',
        editable: true,
        align: 'center',
        inputType: 'input_number',
        inputProps: { min: 0 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
      },
      {
        title: '名称',
        dataIndex: 'outputType3',
        editable: true,
        align: 'center',
        // inputType: 'input_number',
        // inputProps: { min: 0 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
      },
      {
        title: '量',
        dataIndex: 'outputVolume3',
        editable: true,
        align: 'center',
        inputType: 'input_number',
        inputProps: { min: 0 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
      },
    ],
  },
  {
    title: '特殊情况',
    dataIndex: 'specialNote',
    align: 'center',
    editable: true,
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '签名',
    dataIndex: 'recorder',
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
];
