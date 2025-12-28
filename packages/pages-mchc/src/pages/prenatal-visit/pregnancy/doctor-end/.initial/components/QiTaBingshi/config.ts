
import { get_check_invert_values } from '@lm_fe/components_m';
import { ICommonOption, otherOptions } from '@lm_fe/env';
import { defineFormConfig } from '@lm_fe/service';

function get_无有option(suffix?: string) {
  const options: ICommonOption[] = [
    { value: false, label: '无' },
    { value: true, label: '有', warning: true, inputType: 'Input', suffix },
  ]
  return options
}

export default defineFormConfig(
  [
    { name: 'id', form_hidden: true },
    {
      "key": "menarche",
      "label": "初潮",

      "inputType": "input",
      "rules": [{ 'required': true, 'message': '初潮是必填项' }],
      "inputProps": { 'type': 'number', 'unit': '岁' },
      layout: '1/3',
    }, {
      "key": "menstrualCycle",
      "label": "月经周期",

      "inputType": "input",
      "rules": [{ 'required': true, 'message': '月经周期是必填项' }],
      "inputProps": { 'type': 'number', 'unit': '天' },
      layout: '1/3',

    }, {
      "key": "menstrualPeriod",
      "label": "月经持续天数",

      "inputType": "input",
      "rules": [{ 'required': true, 'message': '月经持续天数是必填项' }],
      "inputProps": { 'type': 'number' },
      layout: '1/3',

    }, {
      "key": "menstrualVolume",
      "label": "经量",
      disabled_check: true,
      "inputType": "MA",
      "rules": [{ 'required': true, 'message': '经量是必填项' }],
      "inputProps": { 'options': '多,中,少' },
      layout: '1/3',

    },
    {
      "key": "maritalYears",
      "label": "结婚年龄",

      "inputType": "input",
      
      "inputProps": { 'type': 'number' },
      layout: '1/3',
    },
    {
      "key": "maritalStatus",
      "label": "婚姻史",

      "inputType": "MC",
      "rules": [{ 'required': true, 'message': '婚姻史是必填项' }],
      "inputProps": { 'options': otherOptions['maritalStatusOptions'], marshal: 0 },
      layout: '1/3',

    },
    {
      "key": "dysmenorrhea__",
      "label": "痛经",

      "inputType": "MC",
      "rules": [{ 'required': true, 'message': '痛经是必填项' }],
      "inputProps": { options: get_无有option() },
      layout: '1/3',

    },



    {
      "key": "nearRelation",
      "label": "近亲结婚",

      "inputType": "MC",
      "rules": [{ 'required': true, 'message': '近亲结婚是必填项' }],
      "inputProps": { 'options': otherOptions['nyOptions'], marshal: 0 },

      layout: '1/3',

    },
    {
      inputType: 'check_invert_button',
      layout: '1/3',
      input_props: { get_check_invert_values }
    },
    {
      label: '个人史',
      children: [
        {
          "key": "pmh.smoke__",
          "label": "吸烟",

          "inputType": "MC",
          "rules": [{ 'required': true, 'message': '吸烟是必填项' }],
          "inputProps": { options: get_无有option('支/天') },
          layout: '1/3',

        }, {
          "key": "pmh.alcohol__",
          "label": "饮酒",

          "inputType": "MC",
          "rules": [{ 'required': true, 'message': '饮酒是必填项' }],
          "inputProps": { options: get_无有option('ml/天') },
          layout: '1/3',

        }, {
          "key": "pmh.hazardoussubstances__",
          "label": "接触有害物质",

          "inputType": "MC",
          "rules": [{ 'required': true, 'message': '接触有害物质是必填项' }],
          "inputProps": { options: get_无有option() },
          layout: '1/3',

        }, {
          "key": "pmh.radioactivity__",
          "label": "接触放射线",

          "inputType": "MC",
          "rules": [{ 'required': true, 'message': '接触放射线是必填项' }],
          "inputProps": { options: get_无有option() },
          layout: '1/3',

        }, {
          "key": "pmh.medicine__",
          "label": "近期是否服药",

          "inputType": "MC",
          "rules": [{ 'required': true, 'message': '近期是否服药是必填项' }],
          "inputProps": { options: get_无有option() },
          layout: '1/3',

        },
        {
          "key": "pmh.other__",
          "label": "其他",

          "inputType": "MC",
          
          "inputProps": { options: get_无有option() },
          layout: '1/3',

        },
      ]
    },

    {
      "label": "家族史",
      children: [
        {
          "key": "fmh.hypertension__",
          "label": "高血压",

          "inputType": "MC",
          "rules": [{ 'required': true, 'message': '高血压是必填项' }],
          "inputProps": { options: get_无有option() },
          layout: '1/3',

        }, {
          "key": "fmh.diabetes__",
          "label": "糖尿病",

          "inputType": "MC",
          "rules": [{ 'required': true, 'message': '糖尿病是必填项' }],
          "inputProps": { options: get_无有option() },
          layout: '1/3',

        }, {
          "key": "fmh.birthdefects__",
          "label": "先天畸形",

          "inputType": "MC",
          "rules": [{ 'required': true, 'message': '先天畸形是必填项' }],
          "inputProps": { options: get_无有option() },
          layout: '1/3',

        }, {
          "key": "fmh.heritableDisease__",
          "label": "遗传疾病",

          "inputType": "MC",
          "rules": [{ 'required': true, 'message': '遗传疾病是必填项' }],
          "inputProps": { options: get_无有option() },
          layout: '1/3',

        }, {
          "key": "fmh.other__",
          "label": "其他",

          "inputType": "MC",
          
          "inputProps": { options: get_无有option() },
          layout: '1/3',

        }
      ]

    },
  ]);
