import { formatTimeToStandard } from '../../utils/format';
import { APP_CONFIG } from '../../utils/constants';
import { formatDateTimeNoSecond } from '@lm_fe/utils'
import { MODAL_TEMPLATE_TYPES } from '@lm_fe/env';
import { mchcEnv } from '@lm_fe/env';
import { MyPressure } from '../../FU_components/PressureInput';
export const tableColumns1 = [
  {
    title: '日期',
    dataIndex: 'recordTime',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
    editable: true,
    align: 'center',
    inputType: 'DateTimeInput',
    inputProps: { showTime: true, format: formatDateTimeNoSecond.format },
    render: (value: any) => formatDateTimeNoSecond(value),
    sortType: 'date',
    filterType: 'date',
    // showSorter: true,
    defaultSortOrder: 'descend',
    fixed: 'left',
  },
  {
    title: '体重(g)',
    dataIndex: 'weight',
    inputType: 'input_number',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '身长(cm)',
    dataIndex: 'height',
    inputType: 'input_number',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '头围(cm)',
    dataIndex: 'hc',
    inputType: 'input_number',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '头颈部',
    dataIndex: 'headAndNeck',
    inputType: 'MyAutoComplete',
    inputProps: {
      optionKey: '头颈s',
    },

    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '腹部',
    inputType: 'MyAutoComplete',
    inputProps: {
      optionKey: '腹部s',
    },
    dataIndex: 'abdomen',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '生殖器及会阴部',
    inputType: 'MyAutoComplete',
    inputProps: {
      optionKey: '生殖器s',
    },

    dataIndex: 'genital',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '四肢',
    dataIndex: 'limb',
    editable: true,
    inputType: 'MyAutoComplete',
    inputProps: {
      optionKey: '四肢s',
    },

    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  // {
  //   title: '皮测黄疸指数(mmol/L)',
  //   dataIndex: 'jaundice',
  //   inputType: 'input_number',
  //   editable: true,
  //   align: 'center',
  //   width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  // },
  {
    title: '护士签名',
    inputType: 'MyInput',

    dataIndex: 'sign',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
];
export const tableColumns2 = [
  {
    title: '日期',
    dataIndex: 'recordTime',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
    editable: true,
    align: 'center',
    inputType: 'DateTimeInput',
    inputProps: { showTime: true, format: formatDateTimeNoSecond.format },
    render: (value: any) => formatTimeToStandard(value, formatDateTimeNoSecond.format),
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
    inputType: 'InputNumber',
    inputProps: { type: 'number', min: 0, minValue: 36.5, maxValue: 37.3 },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any) =>
      value && (value > 37.3 || value < 36.5 ? <div style={{ color: 'red' }}>{value}</div> : `${value}`),
  },
  {
    title: '脉搏(次/分)',
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
    title: '呼吸(次/分)',
    dataIndex: 'breath',
    editable: true,
    align: 'center',
    inputType: 'input_number',
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
          editable: true,
          align: 'center',
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
      ],
    },
  {
    title: '胎位',
    dataIndex: 'fetalPosition',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    inputType: 'select_with_options_or_input',
    inputProps: {
      options: [
        { label: 'LOA', value: 'LOA' },
        { label: 'LOT', value: 'LOT' },
        { label: 'ROA', value: 'ROA' },
        { label: 'ROT', value: 'ROT' },
      ],
    },
  },
  {
    title: '胎心1(次/分)',
    dataIndex: 'fetalhart',
    editable: true,
    align: 'center',
    inputType: 'input_number',
    inputProps: { min: 0 },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '胎心2(次/分)',
    dataIndex: 'fetalhart2',
    editable: true,
    align: 'center',
    inputType: 'input_number',
    inputProps: { min: 0 },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  mchcEnv.is('广三') ? {
    title: '宫缩(s/min)',
    align: 'center',
    inputType: 'input',
    dataIndex: 'uc',
    editable: true,
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  } : {
    title: '宫缩',
    align: 'center',
    children: [
      {
        title: '持续(s)',
        dataIndex: 'ucPeriod',
        editable: true,
        align: 'center',
        inputType: 'input_number',
        inputProps: { min: 0 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
      },
      {
        title: '间歇(min)',
        dataIndex: 'ucGap',
        editable: true,
        align: 'center',
        inputType: 'input_number',
        inputProps: { min: 0 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
      },
    ],
  },
  {
    title: '宫颈扩张(cm)',
    dataIndex: 'dilatation',
    editable: true,
    align: 'center',
    inputType: 'input_number',
    inputProps: { min: 0 },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '先露高低',
    dataIndex: 'presentation',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    inputType: 'MyAutoComplete',
    inputProps: {
      options: [
        '-5', '-4', '-3', '-2', '-1', '0', '+1', '+2', '+3', '+4', '+5',
      ],
    },
  },
  {
    title: '羊水性状',
    dataIndex: 'amnioticFluid',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    inputType: 'select_with_options_or_input',
    inputProps: {
      options: [
        { label: '', value: '' },
        { label: '清', value: '清' },
        { label: 'Ⅰ°浑浊', value: 'Ⅰ°浑浊' },
        { label: 'Ⅱ°浑浊', value: 'Ⅱ°浑浊' },
        { label: 'Ⅲ°浑浊', value: 'Ⅲ°浑浊' },
        { label: '血性', value: '血性' },
        { label: '其他', value: '其他' },
        { label: '未见', value: '未见' },
      ],
    },
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
  {
    title: '特殊护理记录',
    dataIndex: 'specialNote',
    inputType: 'TextArea',
    inputProps: { type: MODAL_TEMPLATE_TYPES.产前产后, isPop: true, rows: 10 },


    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '签名',
    dataIndex: 'recorder',
    editable: true,
    inputType: 'TextArea',
    inputProps: { type: MODAL_TEMPLATE_TYPES.科室个人, isPop: true, rows: 10 },
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
];
export const tableColumns3 = [
  {
    title: '日期',
    dataIndex: 'recordTime',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
    editable: true,
    align: 'center',
    inputType: 'DateTimeInput',
    inputProps: { showTime: true, format: formatDateTimeNoSecond.format },
    render: (value: any) => formatTimeToStandard(value, formatDateTimeNoSecond.format),
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
    inputType: 'InputNumber',
    inputProps: { type: 'number', min: 0, minValue: 36.5, maxValue: 37.3 },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any) =>
      value && (value > 37.3 || value < 36.5 ? <div style={{ color: 'red' }}>{value}</div> : `${value}`),
  },
  {
    title: '脉搏(次/分)',
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
    title: '呼吸(次/分)',
    dataIndex: 'breath',
    editable: true,
    align: 'center',
    inputType: 'input_number',
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
          editable: true,
          align: 'center',
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
      ],
    },
  {
    title: '胎位',
    dataIndex: 'fetalPosition',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    inputType: 'select_with_options_or_input',
    inputProps: {
      options: [
        { label: 'LOA', value: 'LOA' },
        { label: 'LOT', value: 'LOT' },
        { label: 'ROA', value: 'ROA' },
        { label: 'ROT', value: 'ROT' },
      ],
    },
  },
  {
    title: '胎心1(次/分)',
    dataIndex: 'fetalhart',
    editable: true,
    align: 'center',
    inputType: 'input_number',
    inputProps: { min: 0 },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '胎心2(次/分)',
    dataIndex: 'fetalhart2',
    editable: true,
    align: 'center',
    inputType: 'input_number',
    inputProps: { min: 0 },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '胎心3(次/分)',
    dataIndex: 'fetalhart3',
    editable: true,
    align: 'center',
    inputType: 'input_number',
    inputProps: { min: 0 },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '宫缩',
    align: 'center',
    children: [
      {
        title: '持续(s)',
        dataIndex: 'ucPeriod',
        editable: true,
        align: 'center',
        inputType: 'input_number',
        inputProps: { min: 0 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
      },
      {
        title: '间歇(min)',
        dataIndex: 'ucGap',
        editable: true,
        align: 'center',
        inputType: 'input_number',
        inputProps: { min: 0 },
        width: APP_CONFIG.CELL_WIDTH_SMALL,
      },
    ],
  },
  {
    title: '宫颈扩张(cm)',
    dataIndex: 'dilatation',
    editable: true,
    align: 'center',
    inputType: 'input_number',
    inputProps: { min: 0 },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '先露高低',
    dataIndex: 'presentation',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    inputType: 'MyAutoComplete',
    inputProps: {
      options: [
        '-5', '-4', '-3', '-2', '-1', '0', '+1', '+2', '+3', '+4', '+5',
      ],
    },
  },
  {
    title: '羊水性状',
    dataIndex: 'amnioticFluid',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    inputType: 'select_with_options_or_input',
    inputProps: {
      options: [
        { label: '', value: '' },
        { label: '清', value: '清' },
        { label: 'Ⅰ°浑浊', value: 'Ⅰ°浑浊' },
        { label: 'Ⅱ°浑浊', value: 'Ⅱ°浑浊' },
        { label: 'Ⅲ°浑浊', value: 'Ⅲ°浑浊' },
        { label: '血性', value: '血性' },
        { label: '其他', value: '其他' },
        { label: '未见', value: '未见' },
      ],
    },
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
  {
    title: '特殊护理记录',
    dataIndex: 'specialNote',
    inputType: 'TextArea',
    inputProps: { type: MODAL_TEMPLATE_TYPES.产前产后, isPop: true, rows: 10 },


    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '签名',
    dataIndex: 'recorder',
    editable: true,
    inputType: 'TextArea',
    inputProps: { type: MODAL_TEMPLATE_TYPES.科室个人, isPop: true, rows: 10 },
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
];
