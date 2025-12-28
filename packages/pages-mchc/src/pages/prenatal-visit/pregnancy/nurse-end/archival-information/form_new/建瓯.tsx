import { get_check_invert_values } from "@lm_fe/components_m";
import { mchcEnv } from "@lm_fe/env";
import { IMchc_FormDescriptions_Field_Nullable } from "@lm_fe/service";
import { __obdriver_read, month1_12, unmarry_deps } from "../form/common";
import { 转入登记_config } from "../form/转入登记";
import { 高危管理_config } from "../form/高危管理";
import { 既往史_pack } from "../form/既往史";
import { defineFormConfig } from "@lm_fe/service";

function 孕妇基本信息_config_建瓯() {

    const config: IMchc_FormDescriptions_Field_Nullable = {
        "name": "孕妇基本信息",
        "children": [
            {
                "key": "baseInfo.outpatientNO",
                "label": "就诊卡号",
                "inputType": "input",
                "rules": [{ "required": true, "message": "就诊卡号是必填项" }],
                "inputProps": { "placeholder": "请输入就诊卡号" },
                layout: '1/3',
            },
            {
                "key": "baseInfo.name",
                "label": "姓名",
                "inputType": "input",
                "rules": [{ "required": true, "message": "姓名是必填项" }],
                "inputProps": { "placeholder": "请输入姓名" },
                layout: '1/3',
            },
            __obdriver_read,
            {
                "key": "baseInfo.registeredResidenceStart",
                "label": "户口状态",
                "inputType": "MS",
                required: true,
                "inputProps": { options: '本省、本市、本县、省外', marshal: 0 },
                layout: '1/3',
            },
            {
                "key": "baseInfo.registeredResidenceType",
                "label": "户籍类型",
                "inputType": "MS",
                required: true,
                "inputProps": { options: '城镇,农村', marshal: 0 },
                layout: '1/3',
            },
            {
                "key": "baseInfo.agricultural",
                "label": "是否农业户",
                "inputType": "MS",
                required: true,
                "inputProps": { options: '是,否', marshal: 0 },
                layout: '1/3',
            },
            {
                "key": "baseInfo.telephone",
                "label": "手机号码",
                "inputType": "input",
                "rules": [{ "required": true, "message": "手机号码是必填项" }, { "type": "string", "min": 11, "message": "请输入11位手机号码" }, { "max": 11, "message": "请输入正确的手机号码格式" }],
                "inputProps": { "placeholder": "请输入手机号码" },
                layout: '1/3',
            },

            {
                "key": "baseInfo.workplace",
                "label": "工作单位",
                "inputType": "input",
                layout: '1/3',
            },

            {
                "key": "baseInfo.idType",
                "label": "证件类型",
                "inputType": "MS",
                "rules": [{ "required": true, "message": "证件类型是必填项" }],
                "inputProps": { optionKey: '证件类型', marshal: 0 },
                layout: '1/3',
            }, {
                "key": "baseInfo.idNO",
                "label": "证件号码",
                "inputType": "id_number_input",
                "rules": [{ "required": true, "message": "证件号码是必填项" }],
                "inputProps": { "placeholder": "请输入证件号码" },
                layout: '1/3',
            },

            {
                "key": "baseInfo.dob",
                "label": "出生日期",
                "inputType": "DatePicker",

                // "inputProps": { "placeholder": "请输入出生日期", "maxDate": "now", "dependency": { "disabled": { "key": "idType", "value": [1] } } },
                disabledDeps: {
                    'baseInfo.idType': [1]
                },
                layout: '1/3',
                // "isNewRow": 1,
            }, {
                "key": "baseInfo.age",
                "label": "年龄",
                "inputType": "input_number",
                disabledDeps: {
                    'baseInfo.idType': [1]
                },
                // "inputProps": { "placeholder": "请输入年龄", "style": { "width": 145 }, "dependency": { "disabled": { "key": "idType", "value": [1] } } },
                layout: '1/3',
            },

            {
                "key": "baseInfo.nativeplace",
                "label": "籍贯",
                "inputType": "normal_select",

                "specialConfig": { "type": "provinceMapping", "showSearch": true },
                "inputProps": { "placeholder": "请输入籍贯" },
                layout: '1/3',
            }, {
                "key": "baseInfo.nationality",
                "label": "国籍",
                "inputType": "country_select",

                "inputProps": { "placeholder": "请输入国籍" },
                layout: '1/3',
            },

            {
                "key": "baseInfo.ethnic",
                "label": "民族",
                "inputType": "normal_select",

                "specialConfig": { "type": "ethnicMapping", "showSearch": true },
                "inputProps": { "placeholder": "请输入民族" },
                layout: '1/3',
            }, {
                "key": "baseInfo.occupation",
                "label": "职业",
                "inputType": "MS",
                "inputProps": { optionKey: '职业s', marshal: 0 },
                layout: '1/3',
            },
            {
                "key": "baseInfo.maritalStatus",
                "label": "婚姻状况",
                "inputType": "MS",
                required: true,
                "inputProps": { optionKey: '婚姻', marshal: 0 },
                layout: '1/3',
            }, {
                "key": "baseInfo.education",
                "label": "文化程度",
                "inputType": "MS",
                "inputProps": { optionKey: '文化程度s', marshal: 0 },
                layout: '1/3',
            },
            // {
            //     "key": "baseInfo.nearRelation",
            //     "label": "是否近亲结婚",
            //     "inputType": "MC",
            //     "inputProps": {
            //         options: '否,是',
            //         marshal: 0
            //     },
            //     layout: '1/3',
            // },

            {
                "key": "baseInfo.maritalAge",
                "label": "结婚年龄",
                "inputType": "input_number",
                "rules": [{ "required": true, "message": "结婚年龄是必填项" }],
                // "inputProps": { "placeholder": "请输入结婚年龄", "dependency": { "show": { "key": "maritalStatus", "value": [1, 4] } } },

                showDeps: {
                    "baseInfo.maritalStatus": [1, 4]
                },
                layout: '1/3',
            },
            {
                "key": "baseInfo.spinsterhoodName",
                "label": "联系人",
                "inputType": "input",
                "rules": [{ "required": true, "message": "联系人是必填项" }],
                showDeps: {
                    ...unmarry_deps

                },
                layout: '1/3',
            }, {
                "key": "baseInfo.spinsterhoodTelephone",
                "label": "联系电话",
                "inputType": "input",
                "rules": [{ "required": true, "message": "联系电话是必填项" }, { "type": "string", "min": 11, "message": "请输入11位手机号码" }, { "max": 11, "message": "请输入正确的手机号码格式" }],
                showDeps: {
                    ...unmarry_deps

                },
                layout: '1/3',
            }, {
                "key": "baseInfo.spinsterhoodRelation",
                "label": "关系",
                "inputType": "input",
                "rules": [{ "required": true, "message": "关系是必填项" }],
                showDeps: {
                    ...unmarry_deps
                },
                layout: '1/3',
            },


            {
                "key": "baseInfo.permanentResidenceAddress",
                "label": "身份证地址",
                "inputType": "MyAddress",

                layout: '2/3',
                "isNewRow": 1,
            },


            {
                "key": "baseInfo.residenceAddress",
                "label": "居住地址",
                "inputType": "MyAddress",

                "inputProps": {
                    addressBtns: [
                        { name: 'baseInfo.permanentResidenceAddress', label: '同上' },
                    ]
                },
                layout: '2/3',
                "isNewRow": 1,
            },

        ]
    }
    return config
}

const 既往史_建瓯_pluse = (isPure = false) => {

    const config: IMchc_FormDescriptions_Field_Nullable[] = [
        {
            // "key": "pregnancyInfo.heart",
            "label": "心",
            "inputType": "MC",
            "inputProps": { marshal: 1, options: '无,异常i' },
            "key": `${isPure ? '' : 'pregnancyInfo.'}heart`,
            required: isPure,
            layout: '1/3',
        },
        {
            // "key": "pregnancyInfo.lung",
            "key": `${isPure ? '' : 'pregnancyInfo.'}lung`,
            required: isPure,
            "label": "肺",
            "inputType": "MC",
            "inputProps": { marshal: 1, options: '无,异常i' },

            layout: '1/3',
        },

        {
            // "key": "pregnancyInfo.nephropathyNote",
            "key": `${isPure ? '' : 'pregnancyInfo.'}nephropathyNote`,
            required: isPure,
            "label": "肾",
            "inputType": "MC",
            "inputProps": { marshal: 1, options: '无,异常i' },


            layout: '1/3',
        },
        {
            // "key": "pregnancyInfo.hepaticDiseaseNote",
            "key": `${isPure ? '' : 'pregnancyInfo.'}hepaticDiseaseNote`,
            required: isPure,
            "label": "肝",
            "inputType": "MC",
            "inputProps": { marshal: 1, options: '无,异常i' },


            layout: '1/3',
        },

        {
            // "key": "pregnancyInfo.psychosis",
            "key": `${isPure ? '' : 'pregnancyInfo.'}psychosis`,
            required: isPure,
            "label": "精神病",
            "inputType": "MC",
            "inputProps": { marshal: 1, options: '无,有i' },


            layout: '1/3',
        },
        {
            // "key": "pregnancyInfo.hematopathyNote",
            "key": `${isPure ? '' : 'pregnancyInfo.'}hematopathyNote`,
            required: isPure,
            "label": "血液病",
            "inputType": "MC",
            "inputProps": { marshal: 1, options: '无,有i' },



            layout: '1/3',
        },

        {
            // "key": "pregnancyInfo.anemia",
            "key": `${isPure ? '' : 'pregnancyInfo.'}anemia`,
            required: isPure,
            "label": "贫血",
            "inputType": "MC",
            "inputProps": { marshal: 1, options: '无,有i' },



            layout: '1/3',
        },
        {
            // "key": "pregnancyInfo.hyperthyroidism",
            "key": `${isPure ? '' : 'pregnancyInfo.'}hyperthyroidism`,
            required: isPure,
            "label": "甲亢",
            "inputType": "MC",
            "inputProps": { marshal: 1, options: '无,有i' },



            layout: '1/3',
        },
        {
            // "key": "pregnancyInfo.epilepsyNote",
            "key": `${isPure ? '' : 'pregnancyInfo.'}epilepsyNote`,
            required: isPure,
            "label": "癫痫",
            "inputType": "MC",
            "inputProps": { marshal: 1, options: '无,有i' },



            layout: '1/3',
        },
        {
            // "key": "pregnancyInfo.gynaecologyProcedureHistory",
            "key": `${isPure ? '' : 'pregnancyInfo.'}gynaecologyProcedureHistory`,
            required: isPure,
            "label": "妇科手术史",

            "inputType": "MC",
            "inputProps": { marshal: 1, options: '否,是i', },
            layout: '1/3',
        },
    ]

    return config
}


export function 既往史_pack_建瓯(isPure = false, needOther = false): any[] {
    const res = [
        ...既往史_建瓯_pluse(isPure),
        ...既往史_pack(isPure, needOther),

    ]

    return res
}

const 既往史_config_建瓯 = () => {

    const config: IMchc_FormDescriptions_Field_Nullable = {
        "name": "既往史",
        "children": [

            ...既往史_pack_建瓯(false, true),
            {
                "key": "既往史一键勾选",
                "label": "一键勾选",
                "inputType": "check_invert_button",
                inputPropsFn() {
                    return {
                        check_invert_values: {
                            ...get_check_invert_values([config]),
                        }
                    }
                },
                layout: '1/3',
            },

        ]
    }

    return config
}
const 丈夫基本信息_config_建瓯 = () => {
    const config: IMchc_FormDescriptions_Field_Nullable = {
        "name": "丈夫基本信息",
        "children": [{
            "key": "partnerInfo.partnerName",
            "label": "姓名",
            "inputType": "input",

            "inputProps": {},
            layout: '1/3',
        }, {
            "key": "partnerInfo.partnerTelephone",
            "label": "手机号码",
            "inputType": "input",

            "inputProps": {},
            layout: '1/3',
        }, {
            "key": "partnerInfo.partnerPatientNO",
            "label": "就诊卡号",
            "inputType": "input",

            "inputProps": {},
            layout: '1/3',
        },
        {
            "key": "partnerInfo.partnerWorkplace",
            "label": "工作单位",
            "inputType": "Input",

            "inputProps": {},
            isNewRow: 1,
            layout: '1/3',
        },
        {
            "key": "partnerInfo.partnerHealthStatus",
            "label": "健康状况",
            "inputType": "MS",

            "inputProps": { options: '好、良好、差', marshal: 0 },
            layout: '1/3',
        },

        {
            "key": "partnerInfo.hfmh",
            "label": "家族史",
            "inputType": "checkbox_group_object",

            "inputProps": {
                optionKey: '家族史',
            },
            layout: '1/1',
            "isNewRow": 1,
        },
        {
            "key": "partnerInfo.partnerIdType",
            "label": "证件类型",
            "inputType": "normal_select",

            "specialConfig": { "type": "IDCardMapping" },
            "inputProps": {},
            isNewRow: 1,
            layout: '1/3',
        },
        {
            "key": "partnerInfo.partnerIdNO",
            "label": "证件号码",
            "inputType": "input",

            "inputProps": {},
            layout: '1/3',
        }, {
            "key": "partnerInfo.partnerDob",
            "label": "出生日期",
            "inputType": "single_date_picker",

            "inputProps": { "maxDate": "now" },
            layout: '1/3',
            "isNewRow": 1,
        }, {
            "key": "partnerInfo.partnerAge",
            "label": "年龄",
            "inputType": "input_number",

            "inputProps": { "style": { "width": 156 } },
            layout: '1/3',
        }, {
            "key": "partnerInfo.partnerNationality",
            "label": "国籍",
            "inputType": "country_select",

            "inputProps": {},
            layout: '1/3',
        }, {
            "key": "partnerInfo.partnerNativeplace",
            "label": "籍贯",
            "inputType": "normal_select",

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
        }, {
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
function 本次孕产信息_config_建瓯() {
    const config: IMchc_FormDescriptions_Field_Nullable = {
        "name": "本次孕产信息",
        "children": [
            {
                "key": "pregnancyInfo.validateDate",
                "label": "建档日期",
                "inputType": "single_date_picker",

                "inputProps": { "placeholder": "请输入建档日期", "maxDate": "now" },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.checkupNO",
                "label": "产检编号",
                "inputType": "input",

                "inputProps": { "placeholder": "请输入产检编号", "disabled": false },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.healthHandbookNO",
                "label": "保健手册号",
                "inputType": "input",

                "inputProps": { "placeholder": "请输入保健手册号" },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.lmp",
                "label": "末次月经",
                "inputType": "single_date_picker",

                "inputProps": { "placeholder": "请输入末次月经", "maxDate": "now" },
                layout: '1/3',
                "isNewRow": 1,
            }, {
                "key": "pregnancyInfo.edd",
                "label": "预产期-日期",
                "inputType": "single_date_picker",

                "inputProps": { "placeholder": "请输入预产期-日期", "minDate": "now" },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.sureEdd",
                "label": "预产期-B超",
                "inputType": "single_date_picker",
                "rules": [{ "required": true, "message": "预产期-B超是必填项" }],
                "inputProps": { "placeholder": "请输入预产期-B超", "minDate": "now" },
                layout: '1/3',
            },

            {
                key: 'pregnancyInfo.gestationalWeek',
                "label": "孕周",
                layout: '1/3',
                "inputType": "input",
            },
            {
                "key": "pregnancyInfo.preweight",
                "label": "孕前体重(kg)",
                "inputType": "input_number",

                "inputProps": { "placeholder": "请输入孕前体重(kg)", "style": { "width": 156 } },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.preheight",
                "label": "孕前身高(cm)",
                "inputType": "input_number",

                "inputProps": { "placeholder": "请输入孕前身高(cm)", "style": { "width": 156 } },
                layout: '1/3',
            },
            {
                "key": "pregnancyInfo.bmi",
                "label": "BMI",
                "inputType": "input_with_range",

                "specialConfig": { "tip": "BMI的正常范围值是18.5~24.9kg/㎡", "min": 18.5, "max": 24.9 },
                "inputProps": { "placeholder": "请输入BMI", "style": { "width": 156 }, "disabled": true },
                layout: '1/3',
            },


            {
                "key": "pregnancyInfo.maritalAge",
                "label": "结婚年龄",
                "inputType": "input_number",

                "inputProps": { "placeholder": "请输入结婚年龄", "style": { "width": 156 } },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.menarche",
                "label": "初潮(岁)",
                "inputType": "input_number",

                "inputProps": { "placeholder": "请输入初潮(岁)", "style": { "width": 156 } },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.menstrualCycle",
                "label": "月经周期",
                "inputType": "input_number",

                "inputProps": { "placeholder": "请输入月经周期", "style": { "width": 156 } },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.menstrualPeriod",
                "label": "月经持续天数",
                "inputType": "input_number",

                "inputProps": { "placeholder": "请输入痛经持续天数", "style": { "width": 156 } },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.menstrualVolume",
                "label": "经量",
                "inputType": "checkbox_group",

                "specialConfig": { "type": "single", "options": [{ "value": "多", "label": "多", "withInput": false, "span": 6 }, { "value": "中", "label": "中", "withInput": false, "span": 6 }, { "value": "少", "label": "少", "withInput": false, "span": 6 }] },
                "inputProps": { "placeholder": "请输入经量" },
                layout: '1/3',
            },
            {
                "key": "本次孕产信息一键勾选",
                "label": "一键勾选",
                "inputType": "check_invert_button",
                inputPropsFn() {
                    return {
                        check_invert_values: {
                            ...get_check_invert_values([config]),
                            'pregnancyInfo.fmh': [{ nothing: true }, null]
                        }
                    }
                },
                layout: '1/3',

            },

            {
                "key": "pregnancyInfo.nearRelation",
                "label": "近亲结婚",
                "inputType": "MC",

                "inputProps": { marshal: 0, options: [{ value: false, label: '否' }, { value: true, label: '是', }] },


                layout: '1/3',
            }, {
                "key": "pregnancyInfo.smoke__",
                "label": "吸烟",
                "inputType": "MC",
                "inputProps": { marshal: 1, options: '否,是i', sp: [{ label: '否', value: false }, { value: true, label: '是', suffix: '支/天' },] },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.alcohol__",
                "label": "饮酒",
                "inputType": "MC",
                "inputProps": { marshal: 1, options: '否,是i', sp: [{ label: '否', value: false }, { value: true, label: '是', suffix: 'ml' },] },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.hazardoussubstances__",
                "label": "接触有害物质",
                "inputType": "MC",
                "inputProps": { marshal: 1, options: '否,是i', sp: [{ label: '否', value: false }, { value: true, label: '是' }] },

                layout: '1/3',
            }, {
                "key": "pregnancyInfo.medicine__",
                "label": "近期是否服药",
                "inputType": "MC",
                "inputProps": { marshal: 1, options: '否,是i', sp: [{ label: '否', value: false }, { value: true, label: '是' }] },

                layout: '1/3',
            }, {
                "key": "pregnancyInfo.radioactivity__",
                "label": "接触放射性",
                "inputType": "MC",
                "inputProps": { marshal: 1, options: '否,是i', sp: [{ label: '否', value: false }, { value: true, label: '是' }] },
                layout: '1/3',
            },
            {
                "key": "pregnancyInfo.pregnancyReaction",
                "label": "妊娠反应",
                "inputType": "MC",
                required: true,
                "inputProps": { options: '无、有', sp: [{ label: '有', inputType: 'MA', props: { options: month1_12 }, suffix: '月' }], marshal: 1 },
                layout: '1/3',
            },

            {
                "key": "pregnancyInfo.fetalMovement",
                "label": "初感胎动",
                "inputType": "MC",
                required: true,
                "inputProps": { options: '无、有', sp: [{ label: '有', inputType: 'MA', props: { options: month1_12 }, suffix: '月' }], marshal: 1 },
                layout: '1/3',
            },

            {
                "key": "pregnancyInfo.virusInfection",
                "label": "病毒感染",
                "inputType": "MC",
                required: true,
                "inputProps": { optionKey: '无有i', marshal: 1 },
                layout: '1/3',
            },
            {
                "key": "pregnancyInfo.oralContraceptive",
                "label": "服避孕药",
                "inputType": "MC",
                required: true,
                "inputProps": { optionKey: '无有i', marshal: 1 },
                layout: '1/3',
            },
            {
                "key": "pregnancyInfo.morningSickness",
                "label": "剧吐",
                "inputType": "MC",
                required: true,
                "inputProps": { optionKey: '无有', marshal: 1 },
                layout: '1/3',
            },
            {
                "key": "pregnancyInfo.vaginalBleeding",
                "label": "阴道出血",
                "inputType": "MC",
                required: true,
                "inputProps": { optionKey: '无有', marshal: 1 },
                layout: '1/3',
            },
            {
                "key": "pregnancyInfo.fever",
                "label": "发热",
                "inputType": "MC",
                required: true,
                "inputProps": { optionKey: '无有', marshal: 1 },
                layout: '1/3',
            },




            {
                "key": "pregnancyInfo.fmh",
                "label": "家族史",
                "inputType": "checkbox_group_object",

                "inputProps": {
                    optionKey: '家族史',
                },
                layout: '1/1',
                "isNewRow": 1,
            },


            {
                "key": "pregnancyInfo.personalBg",
                "label": "女方ABO血型",
                "inputType": "normal_select",

                "specialConfig": { "type": "aboMapping" },
                "inputProps": { "placeholder": "请选择ABO血型" },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.personalRh",
                "label": "女方Rh血型",
                "inputType": "normal_select",

                "specialConfig": { "type": "rhMapping" },
                "inputProps": { "placeholder": "请选择RH血型", "warningOption": 1 },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.partnerBg",
                "label": "男方ABO血型",
                "inputType": "normal_select",

                "specialConfig": { "type": "aboMapping" },
                "inputProps": { "placeholder": "请选择ABO血型" },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.partnerRh",
                "label": "男方Rh血型",
                "inputType": "normal_select",

                "specialConfig": { "type": "rhMapping" },
                "inputProps": { "placeholder": "请选择RH血型", "warningOption": 1 },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.deliveryPoint",
                "label": "定点分娩医院",
                "inputType": "MySelect",

                inputProps: { options: '本院、外院、未确定', marshal: 0 },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.checkAmy",
                "label": "是否检查艾梅乙",
                "inputType": "MC",
                "inputProps": { "options": "有、无", "marshal": 0 },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.checkHospital",
                "label": "艾梅乙检测方",
                "inputType": "MC",
                "inputProps": { "options": '本院,外院i', marshal: 1 },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.hivResult",
                "label": "HIV检测结果",
                "inputType": "MC",
                "inputProps": { "options": "阴性、阳性、未查", "marshal": 0 },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.syphilisResult",
                "label": "梅毒检测结果",
                "inputType": "MC",
                "inputProps": { "options": "阴性、阳性、未查", "marshal": 0 },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.hbvResult",
                "label": "乙肝检测结果",
                "inputType": "MC",
                "inputProps": { "options": "阴性、阳性、未查", "marshal": 0 },
                layout: '1/3',
            }]
    }
    return config
}
const 孕产史_config_建瓯 = () => {

    const config: IMchc_FormDescriptions_Field_Nullable = {
        "name": "孕产史",
        "children": [
            {
                "key": "pregnancymh",
                "label": "",
                "inputType": "pregnancy_history_v2",

                span: 24,
                // layout: '1/1',
            },
            {
                "key": "comorbiditiesHistory",
                "label": "妊娠合并症史",
                "inputType": 'MC',
                inputProps: { options: '无,有i', marshal: 1 },
                // required: true,
                layout: '1/3',
            },
            {
                "key": "complicationHistory",
                "label": "妊娠并发症史",
                "inputType": "MC",
                inputProps: {
                    options: '无,有i', marshal: 1
                },
                // required: true,
                layout: '1/3',
            },
            {
                "key": "pregnancyHistory",
                "label": "备注",
                "inputType": "text_area",
                // required: true,
                layout: '2/3',
            },
        ]
    }
    return config
}


export default defineFormConfig(
    [
        孕妇基本信息_config_建瓯(),
        丈夫基本信息_config_建瓯(),
        本次孕产信息_config_建瓯(),
        既往史_config_建瓯(),
        孕产史_config_建瓯(),
        高危管理_config(),
        转入登记_config(),
    ]
)
