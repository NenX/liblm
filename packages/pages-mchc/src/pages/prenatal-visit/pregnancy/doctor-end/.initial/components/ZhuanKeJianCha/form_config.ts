import { mchcEnv } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
import { 门诊_胎儿_form } from '../../../../utils';
export default defineFormConfig(
  [
    {
      // "key": "gynecologicalFetusExam",
      "label": "胎儿信息",
      // "inputType": "array-custom",
      // "inputProps": { 'header_label': true, 'array_title': '胎儿', 'config': [{ 'name': 'id', 'key': '.id', 'label': 'id', 'input_type': 'input', 'hidden': true, 'span': 5 }, { 'name': 'fetalHeartRate', 'key': '.fetalHeartRate', 'label': '胎心率', 'input_type': 'input', 'span': 5, 'input_props': { 'type': 'number', 'unit': 'bpm' } }, { 'name': 'fetalPosition', 'key': '.fetalPosition', 'label': '位置', 'input_type': 'select', 'span': 5, 'input_props': { 'options': 'positonOptions' } }, { 'name': 'position', 'key': '.position', 'label': '胎方位', 'input_type': 'MA', 'span': 5, 'input_props': { 'options': 'fetalPositonOptions' } }, { 'name': 'presentation', 'key': '.presentation', 'label': '先露', 'input_type': 'select', 'span': 5, 'input_props': { 'options': 'presentationOptions' } }] },
      // layout: '1/4',
      children: [
        {
          ...门诊_胎儿_form,
          name: 'gynecologicalFetusExam',
        }
      ]
    },
    {

      "label": "产科检查",
      children: [
        {
          "key": "gynecologicalMotherExam.fundalHeight",
          "label": "宫高",
          "inputType": "input",
          "inputProps": { 'unit': 'cm', 'type': 'number' },
          layout: '1/4',
        }, {
          "key": "gynecologicalMotherExam.waistHip",
          "label": "腹围",
          "inputType": "input",
          "inputProps": { 'unit': 'cm', 'type': 'number' },
          layout: '1/4',
        }, {
          "key": "gynecologicalMotherExam.engagement",
          "label": "衔接",
          "inputType": "select",


          "inputProps": { 'options': mchcEnv.get_other_options('engagementOptions'), marshal: 0 },
          layout: '1/4',


        },
      ]
    },
    {
      "label": "妇科检查",
      children: [
        {
          "key": "gynecologicalMotherExam.vulva",
          "label": "外阴",
          "inputType": "MA",
          "inputProps": { 'options': '未见异常,-' },
          layout: '1/4',
        }, {
          "key": "gynecologicalMotherExam.vagina",
          "label": "阴道",
          "inputType": "MA",
          "inputProps": { 'options': '未见异常,-' },
          layout: '1/4',
        }, {
          "key": "gynecologicalMotherExam.cervix",
          "label": "宫颈",
          "inputType": "MA",
          "inputProps": { 'options': '未见异常,-' },
          layout: '1/4',
        }, {
          "key": "gynecologicalMotherExam.uterus",
          "label": "子宫",
          "inputType": "MA",
          "inputProps": { 'options': '未见异常,-' },
          layout: '1/4',
          "isNewRow": 1,
        }, {
          "key": "gynecologicalMotherExam.adnexa",
          "label": "附件",
          "inputType": "MA",
          "inputProps": { 'options': '未见异常,-' },
          layout: '1/4',
        },
        {
          "label": "一键勾选",
          "inputType": "check_invert_button",
          layout: "1/4",
        }
      ]
    },
    { name: 'id', form_hidden: true }
  ]
)
