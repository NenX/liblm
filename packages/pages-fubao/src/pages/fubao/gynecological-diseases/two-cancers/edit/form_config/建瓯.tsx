
import { defineFormConfig } from "@lm_fe/service";
import { 两癌月经史form_config } from "./common";
const required = false
export default defineFormConfig([{
    "name": "基本信息",
    "sort": 0,
    "children": [
        {
            "key": "name",
            "label": "姓名",
            "inputType": "input",
            required,
            "inputProps": { "placeholder": "请输入姓名" },
            layout: '1/3',
        },
        {
            "key": "idNO",
            "label": "身份证号",
            "inputType": "input",
            required: true,
            layout: '1/3',
        },
        {
            "key": "idNO",
            "label": "查询历史",
            "inputType": 'MyButton',
            required: true,
            layout: '1/3',
        },
        {
            "key": "__obdriver_read",
            "inputType": 'IdNOButton',
            label: '外设读取',
            hidden: true,
            layout: '1/3',
        },
        {
            "key": "dob",
            "label": "出生日期",
            "inputType": "DatePicker",
            required,
            hidden: true,

            layout: '1/3',
        },
        {
            "key": "age",
            "label": "年龄",
            "inputType": "input_number",
            required,
            hidden: true,

            layout: '1/3',
        },
        {
            "key": "telephone",
            "label": "电话",
            "inputType": "input",
            required,
            layout: '1/3',
        },
        {
            "key": "ethnic",
            "label": "民族",
            hidden: true,
            "inputType": "MS",
            required,
            inputProps: { optionKey: '民族s', marshal: 0 },
            layout: '1/3',
        },
        {
            "key": "outpatientNo",
            "label": "门诊号",
            "inputType": "input",
            required,
            layout: '1/3',
        },
        {
            "key": "reportYear",
            "label": "上报年份",
            "inputType": 'DatePicker',
            hidden: true,
            required,
            layout: '1/3',
        },

        {
            "key": "poorWomenCard",
            "label": "贫困妇女立卡",
            "inputType": "MS",
            hidden: true,
            required,
            inputProps: { options: '否,是', marshal: 0 },
            layout: '1/3',
        },



        {
            "key": "residenceAddress",
            "label": "居住地址",
            isNewRow: 1,
            "inputType": "MyAddress",
            hidden: true,

            layout: '2/3',
        }]
},
...两癌月经史form_config(true),
{
    "name": "其他信息",
    "sort": 0,
    "children": [{
        "key": "testingFacility",
        "label": "检测机构",
        "inputType": "input",
        hidden: true,
        layout: '1/3',
    },
    {
        "key": "registerDate",
        "label": "登记日期",
        hidden: true,
        "inputType": "single_date_picker",
        layout: '1/3',
    },
    {
        "key": "unitName",
        "label": "检测单位",
        "inputType": "input",
        layout: '1/3',
    },
    {
        "key": "registerPerson",
        "label": "登记者",
        "inputType": "input",
        hidden: true,
        layout: '1/3',
    },
    {
        "key": "fileStatus",
        "label": "审核状态",
        "inputType": "MS",
        inputProps: { options: '未审核,已审核', marshal: 0 },
        layout: '1/3',
    },
    ]
}])
