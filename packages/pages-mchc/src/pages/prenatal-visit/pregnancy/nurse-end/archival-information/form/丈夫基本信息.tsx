import { mchcEnv } from "@lm_fe/env";
import { IMchc_FormDescriptions_Field_Nullable } from "@lm_fe/service";
import { marry_deps } from "./common";



export const 丈夫基本信息_config = () => {
    const config: IMchc_FormDescriptions_Field_Nullable = {
        "name": "丈夫基本信息",

        "children": [{
            "key": "partnerInfo.partnerName",
            "label": "姓名",
            "inputType": "input",

            requiredDeps: {
                ...marry_deps
            },

            layout: '1/3',
        }, {
            "key": "partnerInfo.partnerTelephone",
            "label": "手机号码",
            "inputType": "input",

            requiredDeps: {
                ...marry_deps
            },

            layout: '1/3',
        }, {
            "key": "partnerInfo.partnerPatientNO",
            "label": "就诊卡号",
            "inputType": "input",

            "inputProps": {},
            layout: '1/3',
        },

        {
            "key": "partnerInfo.partnerIdType",
            "label": "证件类型",
            "inputType": "normal_select",
            requiredDeps: {
                ...marry_deps
            },

            "specialConfig": { "type": "IDCardMapping" },
            "inputProps": {},
            isNewRow: 1,
            layout: '1/3',
        },
        {
            "key": "partnerInfo.partnerIdNO",
            "label": "证件号码",
            "inputType": "input",

            requiredDeps: {
                ...marry_deps
            },

            layout: '1/3',
        }, {
            "key": "partnerInfo.partnerDob",
            "label": "出生日期",
            "inputType": "single_date_picker",
            requiredDeps: {
                ...marry_deps
            },

            layout: '1/3',
            "isNewRow": 1,
        }, {
            "key": "partnerInfo.partnerAge",
            "label": "年龄",
            "inputType": "input_number",
            requiredDeps: {
                ...marry_deps
            },

            "inputProps": { "style": { "width": 156 } },
            layout: '1/3',
        }, {
            "key": "partnerInfo.partnerNationality",
            "label": "国籍",
            "inputType": "country_select",

            requiredDeps: {
                ...marry_deps
            },

            layout: '1/3',
        }, {
            "key": "partnerInfo.partnerNativeplace",
            "label": "籍贯",
            "inputType": "normal_select",
            requiredDeps: {
                ...marry_deps
            },

            "specialConfig": { "type": "provinceMapping", "showSearch": true },
            "inputProps": {},
            layout: '1/3',
        }, {
            "key": "partnerInfo.partnerEthnic",
            "label": "民族",
            "inputType": "normal_select",

            "specialConfig": { "type": "ethnicMapping", "showSearch": true },
            "inputProps": {},
            layout: '1/3',
        }, {
            "key": "partnerInfo.partnerOccupation",
            "label": "职业",
            "inputType": "normal_select",

            "specialConfig": { "type": "jobMapping" },
            "inputProps": {},
            layout: '1/3',
        },

        {
            "key": "partnerInfo.workplace",
            "label": "工作单位",
            "inputType": "input",
            isActive: mchcEnv.is('广三'),
            layout: '1/3',
        },
        {
            "key": "partnerInfo.smoke__",
            "label": "吸烟",
            "inputType": "MyCheckbox",

            "inputProps": { marshal: 1, options: [{ value: false, label: '无' }, { value: true, label: '有', warning: true, inputType: 'Input', sufix: '支/天' }] },
            layout: '1/3',
        }, {
            "key": "partnerInfo.alcohol__",
            "label": "饮酒",
            "inputType": "MyCheckbox",
            "inputProps": { marshal: 1, options: [{ value: false, label: '无' }, { value: true, label: '有', warning: true, inputType: 'Input', sufix: 'ml' }] },

            layout: '1/3',
        }, {
            "key": "partnerInfo.disease__",
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
            "key": "partnerInfo.partnerPermanentResidenceAddress",
            "label": "男方身份证地址",
            "inputType": "MyAddress",
            requiredDeps: {
                ...marry_deps
            },

            "inputProps": {
                addressBtns: [
                    { name: 'baseInfo.permanentResidenceAddress', label: '同女方户籍地' },
                ]
            },
            layout: '2/3',
            "isNewRow": 1,
        }, {
            "key": "partnerInfo.partnerResidenceAddress",
            "label": "男方居住地址",
            "inputType": "MyAddress",

            "inputProps": {
                addressBtns: [
                    { name: 'partnerInfo.partnerPermanentResidenceAddress', label: '同上' },
                    { name: 'baseInfo.residenceAddress', label: '同女方居住地' },
                ]
            },
            layout: '2/3',
            "isNewRow": 1,
        }]
    }
    return config
}
