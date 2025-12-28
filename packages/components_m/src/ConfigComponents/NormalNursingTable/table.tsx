import { APP_CONFIG } from '../../utils/constants';
import { formatDateTime, } from '@lm_fe/utils';
import { MODAL_TEMPLATE_TYPES } from '@lm_fe/env';
import { mchcEnv } from '@lm_fe/env';
import { MyPressure } from '../../FU_components/PressureInput';
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
  {
    title: '意识',
    dataIndex: 'consciousness',
    align: 'center',
    editable: true,
    inputType: 'normal_select',
    inputProps: { type: 'consciousnessMapping' },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any) =>
      value === 0 ? (
        '清醒'
      ) : value === 1 ? (
        <div style={{ color: 'red' }}>嗜睡</div>
      ) : value === 2 ? (
        <div style={{ color: 'red' }}>模糊</div>
      ) : value === 3 ? (
        <div style={{ color: 'red' }}>昏睡</div>
      ) : value === 4 ? (
        <div style={{ color: 'red' }}>昏迷</div>
      ) : (
        ''
      ),
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
    title: '血氧(%)',
    dataIndex: 'bloodOxygen',
    align: 'center',
    editable: true,
    inputType: 'InputNumber',
    inputProps: { type: 'number', min: 0, minValue: 95 },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any) => value && (value < 95 ? <div style={{ color: 'red' }}>{value}</div> : `${value}`),
  },
  {
    title: '血糖(mmol/L)',
    dataIndex: 'bloodGlucose',
    align: 'center',
    editable: true,
    inputType: 'input_number',
    inputProps: { min: 0 },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '入量',
    dataIndex: 'incoming',
    editable: true,
    inputType: 'TakeInVolumn',
    inputProps: { isPop: true },

    width: APP_CONFIG.CELL_WIDTH_SMALL,
    // children: [
    //   {
    //     title: '内容(入量)',
    //     inputType: 'MyAutoComplete',
    //     inputProps: { optionKey: '入量s' },
    //     dataIndex: 'takeinType',
    //     editable: true,
    //     align: 'center',
    //     width: APP_CONFIG.CELL_WIDTH_SMALL,
    //   },
    //   {
    //     title: 'ml(入量)',

    //     dataIndex: 'takeinVolume',
    //     editable: true,
    //     align: 'center',
    //     inputType: 'input_number',
    //     inputProps: { min: 0 },
    //     width: APP_CONFIG.CELL_WIDTH_SMALL,
    //   },
    // ],
  },
  // {
  //   title: 'ml(入量)',
  //   dataIndex: 'takeinVolume',
  //   align: 'center',
  //   editable: true,
  //   inputType: 'input_number',
  //   inputProps: { min: 0 },
  //   width: APP_CONFIG.CELL_WIDTH_SMALL,
  // },
  {
    title: '出量',
    dataIndex: 'outcoming',
    editable: true,
    inputType: 'TakeOutVolumn',
    inputProps: { isPop: true },

    width: APP_CONFIG.CELL_WIDTH_SMALL,
    // children: [
    //   {
    //     title: '内容(出量)',
    //     inputType: 'MyAutoComplete',
    //     inputProps: { optionKey: '出量s' },
    //     dataIndex: 'outputType',
    //     editable: true,
    //     align: 'center',
    //     width: APP_CONFIG.CELL_WIDTH_SMALL,
    //   },
    //   {
    //     title: 'ml(出量)',

    //     dataIndex: 'outputVolume',
    //     editable: true,
    //     align: 'center',
    //     inputType: 'input_number',
    //     inputProps: { min: 0 },
    //     width: APP_CONFIG.CELL_WIDTH_SMALL,
    //   },
    // ],
  },
  // {
  //   title: 'ml(出量)',
  //   dataIndex: 'outputVolume',
  //   align: 'center',
  //   editable: true,
  //   inputType: 'input_number',
  //   inputProps: { min: 0 },
  //   width: APP_CONFIG.CELL_WIDTH_SMALL,
  // },
  {
    title: '子宫收缩',
    dataIndex: 'uterineContraction',
    align: 'center',
    editable: true,
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '伤口',
    dataIndex: 'wound',
    align: 'center',
    editable: true,
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '吸氧(L/min)',
    dataIndex: 'oxygenUptake',
    align: 'center',
    editable: true,
    inputType: 'input_number',
    inputProps: { min: 0 },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '会阴擦洗',
    dataIndex: 'perineumWashing',
    align: 'center',
    editable: true,
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '神灯',
    dataIndex: 'djinni',
    align: 'center',
    editable: true,
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '特殊记录',
    dataIndex: 'specialNote',
    align: 'center',
    inputType: 'TextArea',
    inputProps: { type: MODAL_TEMPLATE_TYPES.产前产后, isPop: true, rows: 10 },

    editable: true,
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '签名',
    dataIndex: 'recorder',
    inputType: 'TextArea',
    inputProps: { type: MODAL_TEMPLATE_TYPES.科室个人, isPop: true, rows: 10 },
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
];
