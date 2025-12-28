import { getOptionLabel, getOptionValue, mchcEnv } from "@lm_fe/env";
import { IMchc_FormDescriptions, IMchc_FormDescriptions_Field, IMchc_FormDescriptions_Field_Nullable } from "@lm_fe/service";




export const form_config = (): IMchc_FormDescriptions_Field_Nullable[] => {

    return [{
        // "id": 2017,
        "key": "partnerName",
        "label": "姓名",
        "inputType": "input",

        layout: '1/3',
    }, {
        // "id": 2023,
        "key": "partnerTelephone",
        "label": "手机号码",
        "inputType": "input",

        layout: '1/3',
    },
    {
        // "id": 2019,
        "key": "partnerPatientNO",
        "label": "就诊卡号",
        "inputType": "input",


        layout: '1/3',
    },
    {
        // "id": 2024,
        "key": "partnerIdType",
        "label": "证件类型",
        "inputType": "MS",
        "inputProps": { "optionKey": "证件类型", marshal: 0 },

        "isNewRow": 1,
        layout: '1/3',
    },
    {
        // "id": 2025,
        "key": "partnerIdNO",
        "label": "证件号码",
        "inputType": "input",


        layout: '1/3',
    }, {
        // "id": 12522,
        "key": "partnerDob",
        "label": "出生日期",
        "inputType": "DatePicker",

        layout: '1/3',
    }, {
        // "id": 2018,
        "key": "partnerAge",
        "label": "年龄",
        "inputType": "input",
        "inputProps": { "type": "number" },

        layout: '1/3',
    }, {
        // "id": 2020,
        "key": "partnerNationality",
        "label": "国籍",
        "inputType": "input",


        layout: '1/3',
    }, {
        // "id": 2021,
        "key": "partnerNativeplace",
        "label": "籍贯",
        "inputType": "MS",
        "inputProps": { "optionKey": "provinceMapping", marshal: 0 },

        layout: '1/3',
    }, {
        // "id": 2022,
        "key": "partnerEthnic",
        "label": "民族",
        "inputType": "MS",
        "inputProps": { "optionKey": "民族s", marshal: 0 },

        layout: '1/3',
    }, {
        // "id": 2026,
        "key": "partnerOccupation",
        "label": "职业",
        "inputType": "MS",
        "inputProps": { "optionKey": "职业s", marshal: 0 },

        layout: '1/3',
    },

    mchcEnv.in(['建瓯']) ? {
        "key": "hfmh",
        "label": "家族史",
        "inputType": "checkbox_group_object",

        "inputProps": {
            optionKey: '家族史',

        },
        layout: '1/1',
        "isNewRow": 1,
    }
        : null,
    {
        // "id": 2027,
        "key": "smoke__",
        "label": "烟",
        "inputType": "MyCheckbox",
        isNewRow: 1,
        "inputProps": {
            marshal: 1,
            options: [
                { value: false, label: '无' },
                { value: true, label: '有', warning: true, inputType: 'Input', }
            ]
        },
        layout: '1/3',
    }, {
        // "id": 2028,
        "key": "alcohol__",
        "label": "酒",
        "inputType": "MyCheckbox",
        "inputProps": {
            marshal: 1,
            options: [
                { value: false, label: '无' },
                { value: true, label: '有', warning: true, inputType: 'Input', }
            ]
        },
        layout: '1/3',
    }, {
        // "id": 2029,
        "key": "disease__",
        "label": "疾病史",
        "inputType": "MyCheckbox",
        "inputProps": {
            marshal: 1,
            options: [
                { value: false, label: '无' },
                { value: true, label: '有', warning: true, inputType: 'Input', }
            ]
        },

        layout: '1/3',
    }, {
        // "id": 2030,
        "key": "partnerPermanentResidenceAddress",
        "label": "户口地址",
        "inputType": "MyAddress",


        layout: '1/1',
    }, {
        // "id": 12282,
        "key": "partnerResidenceAddress",
        "label": "居住地址",
        "inputType": "MyAddress",


        layout: '1/1',
    }]
}