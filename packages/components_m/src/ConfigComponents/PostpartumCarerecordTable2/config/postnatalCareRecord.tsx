/**
 * 产后护理记录
 */
import { MODAL_TEMPLATE_TYPES } from '@lm_fe/env';
import dayjs from 'dayjs';
import { MyPressure } from '../../../FU_components/PressureInput';
import { APP_CONFIG } from '../../../utils/constants';
export const tableColumns: any = [
  {
    title: '日期',
    dataIndex: 'recordTime',
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    editable: true,
    inputType: 'DateTimeInput',
    inputProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm',
      setDefaultValue: true,
    },
    defaultValue: {
      boolean: true,
      type: 'dataTime',
    },
    render: (value, data) => {
      return value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '';
    },
  },
  {
    title: '体温(℃)',
    dataIndex: 'temperature',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_TINY,
    inputType: 'input_number',
    inputProps: { min: 0 },
  },
  {
    title: 'P/HR次/分',
    dataIndex: 'heartrate',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_MINI,
    inputType: 'input_number',
    inputProps: { min: 0 },
  },
  {
    title: 'R次/分',
    dataIndex: 'respiratory',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_MINI,
    inputType: 'input_number',
    inputProps: { min: 0 },
  },
  {
    title: '血压(mmHg)',
    dataIndex: 'bp',
    editable: true,
    align: 'center',

    inputType: 'MyPressure',
    inputProps: { isPop: false },
    width: APP_CONFIG.CELL_WIDTH_SMALL,

    render: (value: any) => {

      return MyPressure.DisplayFC ? <MyPressure.DisplayFC value={value} /> : null
    }
  },
  {
    title: '血氧饱和度%',
    dataIndex: 'os',
    editable: true,
    align: 'center',
    inputType: 'input_number',
    inputProps: { min: 0 },
    width: APP_CONFIG.CELL_WIDTH_TINY,
  },
  {
    title: '意识',
    dataIndex: 'awareness',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_TINY,

    inputType: 'MyAutoComplete',
    inputProps: {
      optionKey: '意识s',
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
    //     dataIndex: 'incomingContent',
    //     editable: true,
    //     align: 'center',
    //     inputType: 'MyAutoComplete',
    //     inputProps: { optionKey: '入量s' },
    //     width: APP_CONFIG.CELL_WIDTH_TINY,
    //   },
    //   {
    //     title: 'ml(入量)',
    //     dataIndex: 'incomingML',
    //     editable: true,
    //     align: 'center',
    //     inputType: 'input_number',
    //     inputProps: { min: 0 },
    //     width: APP_CONFIG.CELL_WIDTH_TINY,
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
    //     dataIndex: 'outcomingContent',
    //     editable: true,
    //     align: 'center',
    //     inputType: 'MyAutoComplete',
    //     inputProps: { optionKey: '出量s' },
    //     width: APP_CONFIG.CELL_WIDTH_TINY,
    //   },
    //   {
    //     title: 'ml(出量)',
    //     dataIndex: 'outcomingML',
    //     editable: true,
    //     align: 'center',
    //     width: APP_CONFIG.CELL_WIDTH_TINY,
    //     inputType: 'input_number',
    //     inputProps: { min: 0 },
    //   },
    //   {
    //     title: '颜色(出量)',
    //     dataIndex: 'outcomingColor',
    //     editable: true,
    //     align: 'center',
    //     inputType: 'MyAutoComplete',
    //     inputProps: {
    //       options: ['暗红色', '鲜红色', '酱油色', '无']
    //     },
    //     width: APP_CONFIG.CELL_WIDTH_TINY,
    //   },
    // ],
  },
  {
    title: '乳房情况',
    dataIndex: 'breastCondition',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_TINY,
    inputType: 'MyAutoComplete',
    inputProps: {
      optionKey: '乳房情况s',
    },
  },
  {
    title: '泌乳情况',
    dataIndex: 'lactation',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_TINY,
    inputType: 'MyAutoComplete',
    inputProps: {
      optionKey: '泌乳情况s',
    },
  },
  {
    title: '伤口',
    align: 'center',
    children: [
      {
        title: '伤口(腹部)',
        dataIndex: 'woundAbdomen',
        editable: true,
        align: 'center',
        width: APP_CONFIG.CELL_WIDTH_TINY,
        inputType: 'MyAutoComplete',
        inputProps: {
          optionKey: '腹部伤口s',
        },
      },
      {
        title: '伤口(会阴)',
        dataIndex: 'woundPerineum',
        editable: true,
        align: 'center',
        width: APP_CONFIG.CELL_WIDTH_TINY,
        inputType: 'MyAutoComplete',
        inputProps: {
          optionKey: '会阴伤口s',
        },
      },
    ],
  },

  {
    title: '子宫收缩',
    dataIndex: 'uterineContractions',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_TINY,
    inputType: 'MyAutoComplete',

    inputProps: {
      // options: ['强', '中', '弱']
      options: ['乏力', '强']
    }
  },
  {
    title: '宫底高度',
    dataIndex: 'fundalHeight',
    editable: true,
    align: 'center',
    inputType: 'MyAutoComplete',
    inputProps: {
      optionKey: '宫底高度s',
    },
    width: APP_CONFIG.CELL_WIDTH_TINY,
  },
  {
    title: '特殊护理记录',
    dataIndex: 'specialSituationRecord',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    inputType: 'TemplateTextarea',
    inputProps: { type: MODAL_TEMPLATE_TYPES.产前产后, isPop: true, rows: 10 },


  },
  {
    title: '护士签名',
    dataIndex: 'nurseSignature',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    inputType: 'TextArea',
    inputProps: { type: MODAL_TEMPLATE_TYPES.科室个人, isPop: true, rows: 10 },
    fixed: 'right',
  },
];
