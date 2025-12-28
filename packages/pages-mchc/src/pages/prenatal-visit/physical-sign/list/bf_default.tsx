import { defineFormConfig } from "@lm_fe/service";
import React from 'react';
import { APP_CONFIG, mchcEnv } from '@lm_fe/env';

const c = React.createElement
let engagementOption = [
  { label: '入', value: '入' },
  { label: '未', value: '未' },
  { label: '半', value: '半' },
]
if (mchcEnv.in(['郫都'])) {
  engagementOption = [
    { label: '浮', value: '浮' },
    { label: '半入', value: '半入' },
    { label: '入', value: '入' },
  ]
}
let fetalMovement = [

  { label: '无', value: '无' },
  { label: '有', value: '有' },
  { label: '120-140', value: '120-140' },
]
let fetalPosition = [
  { label: '左上', value: '左上' },
  { label: '左下', value: '左下' },
  { label: '右上', value: '右上' },
  { label: '右下', value: '右下' },
  { label: '脐上', value: '脐上' },
  { label: '脐下', value: '脐下' },
]
let position = [
  { label: 'LOT', value: 'LOT' },
  { label: 'LOA', value: 'LOA' },
  { label: 'ROT', value: 'ROT' },
  { label: 'ROA', value: 'ROA' },
]
let presentation = [
  { label: '头', value: '头' },
  { label: '臀', value: '臀' },
  { label: '肩', value: '肩' },
  { label: '-', value: '-' },
]

export const form_confg = defineFormConfig([
  {
    title: '就诊卡号',
    dataIndex: 'outpatientNO',
    inputType: 'patient_auto_complete',
    inputProps: {},
    width: 120,
    layout: '1/3'
  },
  {
    title: '姓名',
    dataIndex: 'name',

    width: APP_CONFIG.CELL_WIDTH_SMALL - 20,
    ellipsis: true,
    layout: '1/3'
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',

    rules: [{ required: false, message: '请输入创建时间' }],
    inputType: 'DatePicker',
    inputProps: { disabled: true },
    sortType: 'date',
    layout: '1/3',

  },
  {
    title: '血压-首测(mmHg)',
    // title: () => c('span', {}, ['血压-首测', c('em', {}, 'mmHg')]) as any,
    dataIndex: ['physicalExamMeasure'],
    inputType: 'MyPressure',
    align: 'center',
    processRemote: function (v, form) {
      var value = v ? v : {}
      return [value.systolic, value.diastolic]
    },
    processLocal: function (v, form) {
      if (!form) return
      var value = v ? v : []
      var old_value = form.getFieldValue('physicalExamMeasure') || {}
      return Object.assign({}, old_value, {
        systolic: value[0],
        diastolic: value[1],
      },)
    },
    inputProps: {
      marshal: 0
    },
    layout: '1/3'
  },

  // {
  //   title: '血压-首测(mmHg)',
  //   children: [{
  //     label: '收缩压',
  //     dataIndex: ['physicalExamMeasure', 'systolic'],
  //     layout: '1/3'
  //   }, {
  //     label: '舒张压',
  //     dataIndex: ['physicalExamMeasure', 'diastolic'],
  //     layout: '1/3',
  //   }],
  //   layout: '1/3'
  // },
  {
    title: '血压-二测(mmHg)',
    // title: () => (
    //   <span>
    //     血压-二测<em className="suffix">(mmHg)</em>
    //   </span>
    // ),
    dataIndex: ['physicalExamMeasure'],
    inputType: 'MyPressure',
    align: 'center',
    processRemote: function (v, form) {
      var value = v ? v : {}
      return [value.systolic2, value.diastolic2]
    },
    processLocal: function (v, form) {
      if (!form) return
      var value = v ? v : []
      var old_value = form.getFieldValue('physicalExamMeasure') || {}
      return Object.assign({}, old_value, {
        systolic2: value[0],
        diastolic2: value[1],
      },)
    },

    inputProps: {
      marshal: 0
    },
    width: APP_CONFIG.CELL_WIDTH_SMALL - 20,
    layout: '1/3'
  },
  {
    title: '血压-三测(mmHg)',
    // title: () => (
    //   <span>
    //     血压-三测<em className="suffix">(mmHg)</em>
    //   </span>
    // ),
    dataIndex: ['physicalExamMeasure'],

    processRemote: function (v, form) {
      var value = v ? v : {}
      return [value.systolic3, value.diastolic3]
    },
    processLocal: function (v, form) {
      if (!form) return
      var value = v ? v : []
      var old_value = form.getFieldValue('physicalExamMeasure') || {}
      return Object.assign({}, old_value, {
        systolic3: value[0],
        diastolic3: value[1],
      },)
    },
    inputType: 'MyPressure',
    align: 'center',
    inputProps: {
      marshal: 0
    },
    width: APP_CONFIG.CELL_WIDTH_SMALL - 20,

    layout: '1/3'
  },
  {
    // title: () => (
    //   <>
    //     <p>身高</p>
    //     <p className="suffix">(cm)</p>
    //   </>
    // ),
    title: '身高(cm)',
    dataIndex: ['physicalExamMeasure', 'height'],

    inputType: 'input_with_label',
    inputProps: { min: 0, type: 'number' },
    width: 50,
    // render: (value: any) => value || '',
    sortType: 'number',
    showFilter: false,
    align: 'center',
    layout: '1/3'
  },
  {
    // title: () => (
    //   <>
    //     <p>体重</p>
    //     <p className="suffix">(kg)</p>
    //   </>
    // ),
    title: '体重(kg)',
    dataIndex: ['physicalExamMeasure', 'weight'],

    inputType: 'input_with_label',
    inputProps: { min: 0, type: 'number' },
    width: 50,
    // render: (value: any) => value || '',
    sortType: 'number',
    showFilter: false,
    align: 'center',
    layout: '1/3'
  },
  {
    // title: () => (
    //   <>
    //     <p>脉搏</p>
    //     <p className="suffix">(bpm)</p>
    //   </>
    // ),
    title: '脉搏(bpm)',
    dataIndex: ['physicalExamMeasure', 'pulse'],

    inputType: 'input_with_range',
    inputProps: { min: 60, max: 100, tip: '脉搏的正常范围值是60~100bpm' },
    width: 50,
    // render: (value: any) => (
    //   <InputWithRange value={value} min={60} max={100} hiddenIpt={true} style={{ display: 'block' }} />
    // ),
    sortType: 'number',
    showFilter: false,
    align: 'center',
    layout: '1/3'
  },
  {
    title: '宫高',
    dataIndex: ['gynecologicalExamMeasure', 'fundalHeight'],
    width: 45,
    align: 'center',
    layout: '1/3'
  },
  {
    title: '腹围',
    dataIndex: ['gynecologicalExamMeasure', 'waistHip'],
    width: 45,
    align: 'center',
    layout: '1/3'
  },
  {
    title: '衔接',
    dataIndex: ['gynecologicalExamMeasure', 'engagement'],
    width: 60,
    align: 'center',
    layout: '1/3',
    inputType: 'normal_select',
    inputProps: {
      options: engagementOption,
      style: {
        width: 156,
      },
    },
  },
  {
    "dataIndex": [
      "gynecologicalExamMeasure",
      "id"
    ],
    "form_hidden": true,
    "hidden": true,
  },
  {
    title: '胎动',
    dataIndex: 'fetusesMeasure',
    inputType: 'ArrayPanel',
    isActive: false,
    hidden: !mchcEnv.is('郫都'),
    render: (value: any) => {
      if (!value) {
        return ''
      }
      let str = '';
      if (value.length === 1) {
        str = value[0].fetalMovement;
      } else {
        value.map((item) => (str += `${item.fetalMovement || '--'};`));
      }
      return str;
    },
    width: 60,
  },
  {
    title: '胎心率',
    dataIndex: 'fetusesMeasure',
    inputType: 'ArrayPanel',
    inputProps: {
      marshal: 0,
      targetLabelCol: 2,
      tip: '胎儿信息',
      formDescriptions: [
        mchcEnv.is('郫都') ? { layout: '1/5', inputType: 'MA', label: '胎动', name: 'fetalMovement', inputProps: { marshal: 0, options: fetalMovement } } : null,
        { layout: '1/5', inputType: 'input_number', label: '胎心率', name: 'fetalHeartRate' },
        { layout: '1/5', inputType: 'MS', label: '位置', name: 'fetalPosition', inputProps: { marshal: 0, options: fetalPosition } },
        { layout: '1/5', inputType: 'MS', label: '胎方位', name: 'position', inputProps: { marshal: 0, options: position } },
        { layout: '1/5', inputType: 'MS', label: '先露', name: 'presentation', inputProps: { marshal: 0, options: presentation } },
      ]
    },
    render: (value: any) => {
      if (!value) {
        return ''
      }
      let str = '';
      if (value.length === 1) {
        str = value[0].fetalHeartRate;
      } else {
        value.map((item) => (str += `${item.fetalHeartRate || '--'};`));
      }
      return str;
    },
    width: 60,
  },
  {
    title: '位置',
    dataIndex: 'fetusesMeasure',
    inputType: 'ArrayPanel',
    isActive: false,
    render: (value: any) => {
      if (!value) {
        return ''
      }
      let str = '';
      if (value.length === 1) {
        str = value[0].fetalPosition;
      } else {
        value.map((item) => (str += `${item.fetalPosition || '--'};`));
      }
      return str;
    },
    width: 60,
  },
  {
    title: '胎方位',
    dataIndex: 'fetusesMeasure',
    inputType: 'ArrayPanel',
    isActive: false,
    render: (value: any) => {
      if (!value) {
        return ''
      }
      let str = '';
      if (value.length === 1) {
        str = value[0].position;
      } else {
        value.map((item) => (str += `${item.position || '--'};`));
      }
      return str;
    },
    width: 60,
  },
  {
    title: '先露',
    dataIndex: 'fetusesMeasure',
    inputType: 'ArrayPanel',
    isActive: false,
    render: (value: any) => {
      if (!value) {
        return ''
      }
      let str = '';
      if (value.length === 1) {
        str = value[0].presentation;
      } else {
        value.map((item) => (str += `${item.presentation || '--'};`));
      }
      return str;
    },
    width: 60,
  },
])