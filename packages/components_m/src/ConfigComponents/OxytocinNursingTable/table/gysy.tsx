import { formatDateTimeNoSecond, safe_json_parse } from '@lm_fe/utils';
import { MODAL_TEMPLATE_TYPES } from '@lm_fe/env';
import { MyPressure } from '../../../FU_components/PressureInput';
import { APP_CONFIG } from '../../../utils/constants';
export function getTableColumns_gysy(fetal: number) {
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
      title: '缩宫素浓度',
      align: 'center',
      children: [
        {
          title: 'U/500ml',
          dataIndex: 'concentration1',
          editable: true,
          align: 'center',
          inputType: 'input_number',
          inputProps: { min: 0 },
          width: APP_CONFIG.CELL_WIDTH_TINY,
        },
        {
          title: 'U/20ml',
          dataIndex: 'concentration2',
          editable: true,
          align: 'center',
          inputType: 'input_number',
          inputProps: { min: 0 },
          width: APP_CONFIG.CELL_WIDTH_TINY,
        },
      ]
    },
    {
      title: '滴速',
      align: 'center',
      children: [
        {
          title: '滴/分',
          dataIndex: 'speed1',
          editable: true,
          align: 'center',
          inputType: 'input_number',
          inputProps: { min: 0 },
          width: APP_CONFIG.CELL_WIDTH_TINY,
        },
        {
          title: 'ml/h',
          dataIndex: 'speed2',
          editable: true,
          align: 'center',
          inputType: 'input_number',
          inputProps: { min: 0 },
          width: APP_CONFIG.CELL_WIDTH_TINY,
        },
      ]
    },
    {
      title: '催产素用量(U)',
      dataIndex: 'dosage',
      editable: true,
      align: 'center',
      inputType: 'input_number',
      inputProps: { min: 0 },
      width: APP_CONFIG.CELL_WIDTH_TINY,
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
      title: '脉搏(次/分)',
      dataIndex: 'pluse',
      editable: true,
      align: 'center',
      inputType: 'MyInput',
      inputProps: { type: 'number', min: 0, minValue: 60, maxValue: 100 },
      width: APP_CONFIG.CELL_WIDTH_TINY,
      // render: (value: any) =>
      //   value &&
      //   (value > 100 ? (
      //     <div style={{ color: 'red' }}>{value}</div>
      //   ) : value < 60 ? (
      //     <div style={{ color: 'red' }}>{value}</div>
      //   ) : (
      //     `${value}`
      //   )),
    },
    {
      title: '胎心1(bpm)',
      dataIndex: 'fetalHeart',
      editable: true,
      align: 'center',
      inputType: 'input',
      width: APP_CONFIG.CELL_WIDTH_TINY,
      render: (value: any) => value && value,
    },
    fetal > 1 && {
      title: '胎心2(bpm)',
      dataIndex: 'fetalHeart2',
      editable: true,
      align: 'center',
      inputType: 'input',
      width: APP_CONFIG.CELL_WIDTH_TINY,
      render: (value: any) => value && value,
    },
    fetal > 2 && {
      title: '胎心3(bpm)',
      dataIndex: 'fetalHeart3',
      editable: true,
      align: 'center',
      inputType: 'input',
      width: APP_CONFIG.CELL_WIDTH_TINY,
      render: (value: any) => value && value,
    },
    {
      title: '宫缩强度',
      dataIndex: 'intensity',
      editable: true,
      align: 'center',
      width: APP_CONFIG.CELL_WIDTH_TINY,
      inputType: 'MyAutoComplete',
      inputProps: {
        options: [
          { label: '强', value: '强' },
          { label: '中', value: '中' },
          { label: '弱', value: '弱' },
        ],
      },
    },
    // {
    //   title: '宫缩持续(秒)',
    //   dataIndex: 'cerShrinkPersist',
    //   editable: true,
    //   align: 'center',
    //   inputType: 'input_number',
    //   inputProps: { min: 0 },
    //   width: APP_CONFIG.CELL_WIDTH_TINY,
    //   render: (value: any) => value && value,
    // },
    // {
    //   title: '宫缩间隔(分)',
    //   dataIndex: 'cerShrinkCycle',
    //   editable: true,
    //   align: 'center',
    //   inputType: 'input_number',
    //   inputProps: { min: 0 },
    //   width: APP_CONFIG.CELL_WIDTH_TINY,
    //   render: (value: any) => value && value,
    // },

    {
      title: '宫缩(秒/分)',
      dataIndex: 'uc',
      editable: true,
      align: 'center',
      inputType: 'MyInput',
      inputProps: { min: 0 },
      width: APP_CONFIG.CELL_WIDTH_TINY,
      // render: (value: any) => value && value,
    },
    {
      title: '宫口扩张(cm)',
      dataIndex: 'cervixDilatation',
      editable: true,
      align: 'center',
      inputType: 'input_number',
      inputProps: { min: 0, max: 10 },
      width: APP_CONFIG.CELL_WIDTH_TINY,
      render: (value: any) => value && value,
    },
    {
      title: '先露高低(cm)',
      dataIndex: 'fetalPresentationPosition',
      editable: true,
      align: 'center',
      width: APP_CONFIG.CELL_WIDTH_TINY,
      render: (value: any) => value && value,
      inputType: 'MyAutoComplete',
      inputProps: {
        options: [
          '-5', '-4', '-3', '-2', '-1', '0', '+1', '+2', '+3', '+4', '+5',
        ],
      },
    },

    {
      title: '特殊记录',
      dataIndex: 'specialNote',
      editable: true,
      align: 'center',
      inputType: 'TextArea',
      inputProps: { type: MODAL_TEMPLATE_TYPES.产前产后, isPop: true, rows: 10 },

      width: APP_CONFIG.CELL_WIDTH_SMALL,
    },
    {
      title: '签名',
      dataIndex: 'recorder',
      align: 'center',
      editable: true,
      inputType: 'TextArea',
      inputProps: { type: MODAL_TEMPLATE_TYPES.科室个人, isPop: true, rows: 10 },
      width: APP_CONFIG.CELL_WIDTH_SMALL,
    },
  ]
    .filter(_ => _)
}


