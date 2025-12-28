
import { defineFormConfig } from "@lm_fe/service";
import { 两癌月经史form_config } from "./common";

export default defineFormConfig(
    [{
        "name": "基本信息",
        "sort": 0,
        "children": [
            {
                "key": "name",
                "label": "姓名",
                "inputType": "input",
                required: true,
                "inputProps": { "placeholder": "请输入姓名" },
                layout: '1/3',
            },
            {
                "key": "telephone",
                "label": "手机号码",
                "inputType": "input",
                "rules": [{ "required": true, "message": "手机号码是必填项" }, { "type": "string", "min": 11, "message": "请输入11位手机号码" }, { "max": 11, "message": "请输入正确的手机号码格式" }],
                "inputProps": { "placeholder": "请输入手机号码" },
                layout: '1/3',
            },
            {
                "key": "outpatientNo",
                "label": "门诊号",
                "inputType": "input",
                layout: '1/3',
            },

            {
                "key": "idType",
                "label": "证件类型",
                "inputType": "normal_select",
                layout: '1/3',
            },
            {
                "key": "idNO",
                "label": "证件号码",
                "inputType": "input",
                "rules": [{ "required": true, "message": "证件号码是必填项" }],
                layout: '1/3',
            },

            {
                "key": "dob",
                "label": "出生日期",
                hidden: true,
                "inputType": "single_date_picker",
                "rules": [{ "required": true, "message": "出生日期是必填项" }],
                "inputProps": { "placeholder": "请输入出生日期", "maxDate": "now" },
                layout: '1/3',
            },

            {
                "key": "ethnic",
                "label": "民族",
                "inputType": "MS",
                hidden: true,
                "required": true,
                inputProps: { optionKey: '民族s', marshal: 0 },
                layout: '1/3',
            },
            {
                "key": "age",
                "label": "年龄",
                "inputType": "input_number",
                "rules": [{ "required": true, "message": "年龄是必填项" }],
                layout: '1/3',
            },

            {
                "key": "maritalStatus",
                "label": "婚姻状态",
                hidden: true,
                "inputType": "MS",
                "rules": [{ "required": true, "message": "婚姻状态是必填项" }],
                inputProps: { optionKey: '婚姻', marshal: 0 },
                layout: '1/3',
            },

            {
                "key": "education",
                "label": "文化程度",
                hidden: true,
                "inputType": "MS",
                inputProps: { optionKey: '文化程度s', marshal: 0 },
                layout: '1/3',
            },

            {
                "key": "profession",
                "label": "职业",
                hidden: true,
                "inputType": "MS",
                inputProps: { optionKey: '职业s', marshal: 0 },
                layout: '1/3',
            },

            {
                "key": "householdType",
                "label": "户口类型",
                hidden: true,
                "inputType": "MS",
                // "specialConfig": { "type": "familyTypeMapping" },
                inputProps: { options: ['农村', '城市'].map((_, idx) => ({ value: idx + '', label: _ })), marshal: 0 },
                layout: '1/3',
            },

            {
                "key": "permanentResidenceAddress",
                hidden: true,
                "label": "户口地址",
                "inputType": "MyAddress",
                layout: '2/3',
                isNewRow: 1,
            },
            {
                "key": "residenceAddress",
                "label": "居住地址",
                isNewRow: 1,
                "inputType": "MyAddress",
                "inputProps": {
                    addressBtns: [
                        { name: 'permanentResidenceAddress', label: '同上' },
                    ]
                },
                layout: '2/3',
            }]
    },
    ...两癌月经史form_config(),
    {
        "name": "其他信息",
        hidden: true,
        "sort": 0,
        "children": [{
            "key": "testingFacility",
            "label": "检测机构",
            "inputType": "input",
            layout: '1/3',
        }, {
            "key": "registerDate",
            "label": "登记日期",
            "inputType": "single_date_picker",
            layout: '1/3',
        }, {
            "key": "registerPerson",
            "label": "登记者",
            "inputType": "input",
            layout: '1/3',
        }]
    }]
)
