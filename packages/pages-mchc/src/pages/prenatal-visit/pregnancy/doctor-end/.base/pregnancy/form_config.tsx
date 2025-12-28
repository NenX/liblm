import { getOptionLabel, getOptionValue } from "@lm_fe/env";
import { IMchc_FormDescriptions, IMchc_FormDescriptions_Field } from "@lm_fe/service";




export const form_config = (): IMchc_FormDescriptions_Field[] => {

    return [{
        // "id": 1265,
        "key": "age",
        "label": "年龄",
        "inputType": "input",
        "rules": [{ "required": true, "message": "年龄是必填项" }],
        "inputProps": { "type": "number" },
        layout: '1/3',
    }, {
        // "id": 1266,
        "key": "dob",
        "label": "出生日期",
        "inputType": "DatePicker",
        "rules": [{ "required": true, "message": "出生日期是必填项" }],
        layout: '1/3',

    }, {
        // "id": 2002,
        "key": "validateDate",
        "label": "建档日期",
        "inputType": "DatePicker",
        "rules": [{ "required": true, "message": "建档日期是必填项" }],

        layout: '1/3',
    }, {
        // "id": 2003,
        "key": "birthPermit",
        "label": "准生证号",
        "inputType": "input",

        layout: '1/3',
    }, {
        // "id": 2004,
        "key": "outpatientNO",
        "label": "就诊卡号",
        "inputType": "input",
        "rules": [{ "required": true, "message": "就诊卡号是必填项" }],

        layout: '1/3',
    }, {
        // "id": 2005,
        "key": "checkupNO",
        "label": "产检编号",
        "inputType": "input",


        layout: '1/3',
    }, {
        // "id": 2006,
        "key": "nationality",
        "label": "国籍",
        "inputType": "country_select",
        "rules": [{ "required": true, "message": "国籍是必填项" }],

        layout: '1/3',
    }, {
        // "id": 2007,
        "key": "nativeplace",
        "label": "籍贯",
        "inputType": "MS",
        "rules": [{ "required": true, "message": "籍贯是必填项" }],
        "inputProps": { "optionKey": "provinceMapping", marshal: 0 },

        layout: '1/3',
    }, {
        // "id": 2008,
        "key": "ethnic",
        "label": "民族",
        "inputType": "MS",
        "rules": [{ "required": true, "message": "民族是必填项" }],
        "inputProps": { "optionKey": "民族s", marshal: 0 },

        layout: '1/3',
    }, {
        // "id": 2009,
        "key": "occupation",
        "label": "职业",
        "inputType": "MS",
        "rules": [{ "required": true, "message": "职业是必填项" }],
        "inputProps": { "optionKey": "职业s", marshal: 0 },

        layout: '1/3',
    }, {
        // "id": 2010,
        "key": "telephone",
        "label": "手机号码",
        "inputType": "input",
        "rules": [
            { "required": true, "message": "手机号码是必填项" },
            // { "type": "telephone" }

        ],

        layout: '1/3',
    }, {
        // "id": 2011,
        "key": "workPhone",
        "label": "固定电话",
        "inputType": "input",

        layout: '1/3',
    }, {
        // "id": 2012,
        "key": "idType",
        "label": "证件类型",
        "inputType": "MS",
        "rules": [{ "required": true, "message": "证件类型是必填项" }],
        "inputProps": {
            "optionKey": "证件类型",
            marshal: 0
        },

        layout: '1/3',
    }, {
        // "id": 2013,
        "key": "idNO",
        "label": "证件号码",
        "inputType": "input",

        layout: '1/3',
    }, {
        // "id": 2014,
        "key": "permanentResidenceAddress",
        "label": "户口地址",
        "inputType": "MyAddress",
        "rules": [{ "required": true, "message": "户口地址是必填项" }],

        layout: '1/1',
    }, {
        // "id": 2015,
        "key": "residenceAddress",
        "label": "居住地地址",
        "inputType": "MyAddress",
        "rules": [{ "required": true, "message": "居住地地址是必填项" }],

        layout: '1/1',
    }, {
        // "id": 2016,
        "key": "postpartumAddress",
        "label": "产休地址",
        "inputType": "MyAddress",
        "rules": [{ "required": true, "message": "产休地址是必填项" }],

        layout: '1/1',
    }]
}