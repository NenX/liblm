import { formatDateTimeNoSecond, } from '@lm_fe/utils';
import { MyPressure } from '../../../FU_components/PressureInput';
import { APP_CONFIG } from '../../../utils/constants';
import { MODAL_TEMPLATE_TYPES } from '@lm_fe/env';
export function getTableColumn_gysy(fetal: number) {
  fetal = fetal ?? 1
  return [
    {
      title: '日期',
      dataIndex: 'recordTime',
      width: APP_CONFIG.CELL_WIDTH_MIDDLE,
      editable: true,
      align: 'center',
      inputType: 'DateTimeInput',
      inputProps: { showTime: true, format: formatDateTimeNoSecond.format },
      render: formatDateTimeNoSecond,
      // sortType: 'date',
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
      width: APP_CONFIG.CELL_WIDTH_TINY,
      render: (value: any) =>
        value && (value > 37.3 || value < 36.5 ? <div style={{ color: 'red' }}>{value}</div> : `${value}`),
    },
    {
      title: '心率(次/分)',
      dataIndex: 'heartrate',
      editable: true,
      align: 'center',
      inputType: 'InputNumber',
      inputProps: { type: 'number', min: 0, minValue: 60, maxValue: 100 },
      width: APP_CONFIG.CELL_WIDTH_TINY,
      render: (value: any) =>
        value && (value > 100 || value < 60 ? <div style={{ color: 'red' }}>{value}</div> : `${value}`),
    },
    {
      title: '脉搏(次/分)',
      dataIndex: 'pulse',
      editable: true,
      align: 'center',
      inputType: 'InputNumber',
      inputProps: { type: 'number', min: 0, minValue: 60, maxValue: 100 },
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
      title: '呼吸(次/分)',
      dataIndex: 'breath',
      editable: true,
      align: 'center',
      inputType: 'InputNumber',
      inputProps: { type: 'number', min: 0, minValue: 12, maxValue: 20 },
      width: APP_CONFIG.CELL_WIDTH_TINY,
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
    },
    {
      title: '血氧饱和度(%)',
      dataIndex: 'os',
      editable: true,
      align: 'center',
      inputType: 'InputNumber',
      inputProps: { type: 'number', min: 0, minValue: 95, maxValue: 100 },
      width: APP_CONFIG.CELL_WIDTH_TINY,
      render: (value: any) =>
        value && (value > 100 || value < 95 ? <div style={{ color: 'red' }}>{value}</div> : `${value}`),
    },
    {
      title: '意识',
      dataIndex: 'ys',
      editable: true,
      align: 'center',
      width: APP_CONFIG.CELL_WIDTH_TINY,
      inputType: 'MyAutoComplete',
      inputProps: {
        optionKey: '意识s',
      },
    },
    // {
    //   title: '胎位',
    //   dataIndex: 'fetalPosition',
    //   editable: true,
    //   align: 'center',
    //   width: APP_CONFIG.CELL_WIDTH_TINY,
    //   inputType: 'select_with_options_or_input',
    //   inputProps: {
    //     options: [
    //       { label: 'LOA', value: 'LOA' },
    //       { label: 'LOT', value: 'LOT' },
    //       { label: 'ROA', value: 'ROA' },
    //       { label: 'ROT', value: 'ROT' },
    //     ],
    //   },
    // },
    ...(
      Array(fetal).fill(0).reduce((sum, f, fIdx) => {
        const diffLabel = fIdx > 0 ? `${fIdx + 1}` : ''
        return [
          ...sum,
          {
            title: `胎心${fIdx + 1}(次/分)`,
            align: 'center',

            children: [

              {
                title: `部位(胎心${fIdx + 1})`,
                dataIndex: `fetalhartPostion${diffLabel}`,

                editable: true,
                align: 'center',
                width: APP_CONFIG.CELL_WIDTH_SMALL,
                inputType: 'MyAutoComplete',
                inputProps: {
                  options: [
                    // { label: 'Ⅱ°浑浊', value: 'Ⅱ°浑浊' },
                    // { label: 'Ⅱ°浑浊22', value: 'Ⅱ°浑浊22' },

                  ]
                },


              },
              {
                title: `次数(胎心${fIdx + 1})`,

                dataIndex: `fetalhartCount${diffLabel}`,

                editable: true,
                align: 'center',
                inputType: 'MyAutoComplete',
                inputProps: {
                  options: [
                    // { label: 'Ⅱ°浑浊', value: 'Ⅱ°浑浊' },
                    // { label: 'Ⅱ°浑浊22', value: 'Ⅱ°浑浊22' },

                  ]
                },
                width: APP_CONFIG.CELL_WIDTH_SMALL,
              },
            ],

          },
          {
            title: `胎动${fIdx + 1}(次/时)`,
            dataIndex: `fetalmovement${diffLabel}`,
            editable: true,
            align: 'center',
            inputType: 'MyAutoComplete',
            inputProps: { min: 0 },
            width: APP_CONFIG.CELL_WIDTH_TINY,
          },
        ]
      }, [])
    ),

    {
      title: '宫缩(s/min)',
      align: 'center',
      inputType: 'input',
      dataIndex: 'uc',
      editable: true,
      width: APP_CONFIG.CELL_WIDTH_SMALL,
    },
    {
      title: '宫颈扩张(cm)',
      dataIndex: 'dilatation',
      editable: true,
      align: 'center',
      inputType: 'input_number',
      inputProps: { min: 0 },
      width: APP_CONFIG.CELL_WIDTH_TINY,
    },
    {
      title: '先露高低',
      dataIndex: 'presentation',
      editable: true,
      align: 'center',
      width: APP_CONFIG.CELL_WIDTH_TINY,
      inputType: 'MyAutoComplete',
      inputProps: {
        options: [
          '-5', '-4', '-3', '-2', '-1', '0', '+1', '+2', '+3', '+4', '+5',
        ],
      },
    },
    // {
    //   title: '羊水性状',
    //   dataIndex: 'amnioticFluid',
    //   editable: true,
    //   align: 'center',
    //   width: APP_CONFIG.CELL_WIDTH_TINY,
    //   inputType: 'select_with_options_or_input',
    //   inputProps: {
    //     options: [
    //       { label: '', value: '' },
    //       { label: '清', value: '清' },
    //       { label: 'Ⅰ°浑浊', value: 'Ⅰ°浑浊' },
    //       { label: 'Ⅱ°浑浊', value: 'Ⅱ°浑浊' },
    //       { label: 'Ⅲ°浑浊', value: 'Ⅲ°浑浊' },
    //       { label: '血性', value: '血性' },
    //       { label: '其他', value: '其他' },
    //       { label: '未见', value: '未见' },
    //     ],
    //   },
    // },
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

      //     dataIndex: 'takeinType',
      //     editable: true,
      //     align: 'center',
      //     width: APP_CONFIG.CELL_WIDTH_TINY,
      //     inputType: 'MyAutoComplete',
      //     inputProps: { optionKey: '入量s' },
      //   },
      //   {
      //     title: 'ml(入量)',

      //     dataIndex: 'takeinVolume',
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
      //     inputType: 'MyAutoComplete',
      //     inputProps: { optionKey: '出量s' },
      //     dataIndex: 'outputType',
      //     editable: true,
      //     align: 'center',
      //     width: APP_CONFIG.CELL_WIDTH_TINY,

      //   },
      //   {
      //     title: 'ml(出量)',

      //     dataIndex: 'outputVolume',
      //     editable: true,
      //     align: 'center',
      //     inputType: 'input_number',
      //     inputProps: { min: 0 },
      //     width: APP_CONFIG.CELL_WIDTH_TINY,
      //   },
      //   {
      //     title: '颜色(出量)',

      //     dataIndex: 'outputColor',
      //     editable: true,
      //     align: 'center',
      //     width: APP_CONFIG.CELL_WIDTH_TINY,
      //     inputType: 'MyAutoComplete',
      //     inputProps: {
      //       options: ['暗红色', '鲜红色', '酱油色', '无']
      //     }
      //   },
      // ],
    },
    {
      title: '特殊护理记录',
      dataIndex: 'specialNote',
      inputType: 'TextArea',

      editable: true,
      inputProps: { type: MODAL_TEMPLATE_TYPES.产前产后, isPop: true, rows: 10 },

      align: 'center',
      width: APP_CONFIG.CELL_WIDTH_MIDDLE,
    },
    {
      title: '签名',
      dataIndex: 'recorder',
      inputType: 'TextArea',
      inputProps: { type: MODAL_TEMPLATE_TYPES.科室个人, isPop: true, rows: 10 },

      editable: true,
      align: 'center',
      width: APP_CONFIG.CELL_WIDTH_SMALL,
    },
  ]
    .filter(_ => _);
}