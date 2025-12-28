import { mchcEnv } from '@lm_fe/env';
import { formatDateTime } from '@lm_fe/utils';
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
    inputProps: { showTime: true, format: 'YYYY-MM-DD HH:mm' },
    render: (value: any) => formatDateTime(value),
    sortType: 'date',
    filterType: 'date',
    showSorter: true,
    defaultSortOrder: 'descend',
    fixed: 'left',
  },
  // {
  //   title: '时间',
  //   dataIndex: 'nurseTime',
  //   inputType: 'single_time_picker',
  //   inputProps: { format: 'HH:mm' },
  //   editable: true,
  //   render: (value: any) => value?.format( 'HH:mm'),
  //   width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  //   sortType: 'date',
  //   filterType: 'date',
  //   // showSorter: true,
  //   // defaultSortOrder: 'descend',
  // },

  ...(
    mchcEnv.is('广三') ?

      [
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
        }
      ] : [
        {
          title: '收缩压(mmHg)',
          dataIndex: 'systolic',
          editable: true,
          align: 'center',
          inputType: 'InputNumber',
          inputProps: { isPop: true },

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
          editable: true,
          align: 'center',
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
      ]
  ),

  {
    title: '脉搏(bpm)',
    dataIndex: 'pulse',
    editable: true,
    align: 'center',
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
    title: '血氧(%)',
    dataIndex: 'bloodOxygen',
    editable: true,
    align: 'center',
    inputType: 'input_with_label',
    inputProps: { type: 'number', min: 0, minValue: 95 },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any) => value && (value < 95 ? <div style={{ color: 'red' }}>{value}</div> : `${value}`),
  },
  {
    title: '宫底高度',
    dataIndex: 'ufHeight',
    editable: true,
    align: 'center',
    inputType: 'MyAutoComplete',
    inputProps: {
      optionKey: '宫底高度s',
    },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '出血量(ml)',
    dataIndex: 'bleedingValue',
    editable: true,
    align: 'center',
    inputType: 'input_with_label',
    inputProps: { type: 'number', min: 0, maxValue: 200 },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any) => value && (value > 200 ? <div style={{ color: 'red' }}>{value}</div> : `${value}`),
  },
  {
    title: '膀胱情况',
    dataIndex: 'bladder',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '肛查',
    dataIndex: 'anus',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '特殊记录',
    dataIndex: 'specialNote',
    inputType: 'TextArea',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '签名',
    dataIndex: 'recorder',
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
];
