import { defineFormConfig, parseFormDescriptions } from "@lm_fe/service";
export const form_config = defineFormConfig([
    {


        "name": "女方信息.",


        "children": [{

            "key": "womanName",
            "label": "姓名",

            "inputType": "input",
            "rules": [{ 'required': true, 'message': '姓名是必填项' }],
            layout: '1/3',
        }, {

            "key": "womanOutpatientNo",
            "label": "门诊号",

            "inputType": "input",
            "rules": [{ 'required': true, 'message': '门诊号是必填项' }],
            layout: '1/3',
        },
        {
            "key": "__obdriver_read",
            "inputType": 'IdNOButton',
            label: '外设读取',
            layout: '1/3',
        },

        {

            "key": "womanTelephone",
            "label": "电话号码",

            "inputType": "input",
            "rules": [{ 'required': true, 'message': '电话号码是必填项' }, { 'type': 'string', 'min': 11, 'message': '请输入11位手机号码' }, { 'max': 11, 'message': '请输入正确的手机号码格式' }],
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.idType",
            "label": "证件类型",

            "inputType": "normal_select",
            "tranferRules": { 'type': 'IDCardMapping' },
            "rules": [{ 'required': true, 'message': '证件类型是必填项' }],
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.idNO",
            "label": "证件号码",

            "inputType": "input",
            "rules": [{ 'required': true, 'message': '证件号码是必填项' }],
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.dob",
            "label": "出生日期",

            "inputType": "single_date_picker",
            "tranferRules": { 'type': 'dayjs()' },
            "rules": [{ 'required': true, 'message': '出生日期是必填项' }],
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.ethnic",
            "label": "民族",

            "inputType": "MS",
            required: true,
            "specialConfig": { 'type': 'ethnicMapping' },
            "inputProps": { marshal: 0, optionKey: '民族s' },
            layout: '1/3',
        }, {

            "key": "womanAge",
            "label": "年龄",

            "inputType": "input_number",
            "rules": [{ 'required': true, 'message': '年龄是必填项' }],
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.permanentResidence",
            "label": "籍贯",

            "inputType": "normal_select",
            "rules": [{ 'required': true, 'message': '籍贯是必填项' }],
            "specialConfig": { 'type': 'provinceMapping' },
            "inputProps": { 'placeholder': '请输入籍贯' },
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.education",
            "label": "文化程度",

            "inputType": "MS",
            "specialConfig": { 'type': 'cultureMapping' },
            "inputProps": { marshal: 0, optionKey: '文化程度s' },
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.profession",
            "label": "职业",

            "inputType": "MS",
            "specialConfig": { 'type': 'jobMapping' },
            "inputProps": { marshal: 0, optionKey: '职业s' },
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.nationality",
            "label": "国籍",

            "inputType": "country_select",
            "rules": [{ 'required': true, 'message': '国籍是必填项' }],
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.menarche",
            "label": "初潮(岁)",

            "inputType": "input_number",
            "rules": [{ 'required': true, 'message': '初潮(岁)是必填项' }],
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.menstrualCycle",
            "label": "月经周期(天)",

            "inputType": "input_number",
            "rules": [{ 'required': true, 'message': '月经周期(天)是必填项' }],
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.menstrualPeriod",
            "label": "月经持续天数",

            "inputType": "input_number",
            "rules": [{ 'required': true, 'message': '月经持续天数是必填项' }],
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.menstrualVolume",
            "label": "经量",

            "inputType": "checkbox_group",
            "rules": [{ 'required': true, 'message': '经量是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': '多', 'label': '多', 'withInput': false, 'span': 6 }, { 'value': '中', 'label': '中', 'withInput': false, 'span': 6 }, { 'value': '少', 'label': '少', 'withInput': false, 'span': 6 }] },
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.dysmenorrhea",
            "label": "痛经",

            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '痛经是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '无', 'span': 6, 'withInput': false }, { 'value': 2, 'label': '有', 'withInput': true, 'isIssue': true, 'span': 6, 'inputSpan': 12 }] },
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.gravidity",
            "label": "孕次",

            "inputType": "input_number",
            "rules": [{ 'required': true, 'message': '孕次是必填项' }],
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.parity",
            "label": "产次",

            "inputType": "input_number",
            "rules": [{ 'required': true, 'message': '产次是必填项' }],
            layout: '1/3',
        },
        {
            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.whetherPregnancy",
            "label": "是否怀孕",

            "inputType": "MC",

            "inputProps": { 'placeholder': '请输入是否怀孕', options: '否,是', marshal: 0 },
            layout: '1/3',
        },
        {
            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.lmd",
            "label": "末次月经",

            "inputType": "single_date_picker",

            showDeps: {
                'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.whetherPregnancy'(v) { return v }
            },
            layout: '1/3',
        },
        {

            "key": "grs",
            "label": "个人史",

            "inputType": "title",

            "inputProps": { 'type': 'text', 'size': 'large', 'style': { 'fontSize': 16, 'fontWeight': 600 } },
            "span": 24,
            "offset": 0,
            "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.previousHistory",
            "label": "既往史",

            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '既往史是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '无', 'span': 6, 'withInput': false }, { 'value': 2, 'label': '有', 'withInput': true, 'isIssue': true, 'span': 6, 'inputSpan': 12 }] },
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.surgeryHistory",
            "label": "手术史",

            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '手术史是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '无', 'span': 6, 'withInput': false }, { 'value': 2, 'label': '有', 'withInput': true, 'isIssue': true, 'span': 6, 'inputSpan': 12 }] },
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.presentIllness",
            "label": "现病史",

            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '现病史是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '无', 'span': 6, 'withInput': false }, { 'value': 2, 'label': '有', 'withInput': true, 'isIssue': true, 'span': 6, 'inputSpan': 12 }] },
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.contactHazardousSubstances",
            "label": "接触有害物质",

            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '接触有害物质是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '无', 'span': 6, 'withInput': false }, { 'value': 2, 'label': '有', 'withInput': true, 'isIssue': true, 'span': 6, 'inputSpan': 12 }] },
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.contactRadioactiveRays",
            "label": "接触放射线",

            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '接触放射线是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '无', 'span': 6, 'withInput': false }, { 'value': 2, 'label': '有', 'withInput': true, 'isIssue': true, 'span': 6, 'inputSpan': 12 }] },
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.personalOther",
            "label": "其他",

            "inputType": "input",

            layout: '1/3',
        }, {

            "key": "jzs",
            "label": "家族史",

            "inputType": "title",


            "inputProps": { 'type': 'text', 'size': 'large', 'style': { 'fontSize': 16, 'fontWeight': 600 } },
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.familyHeritableDisease",
            "label": "遗传疾病",

            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '遗传疾病是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '无', 'span': 8, 'withInput': false }, { 'value': 2, 'label': '有', 'withInput': true, 'isIssue': true, 'span': 8, 'inputSpan': 8 }] },
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.familyPsychosis",
            "label": "精神病",

            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '精神病是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '无', 'span': 8, 'withInput': false }, { 'value': 2, 'label': '有', 'withInput': true, 'isIssue': true, 'span': 8, 'inputSpan': 8 }] },
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.birthDefects",
            "label": "先天畸形",

            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '先天畸形是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '无', 'span': 8, 'withInput': false }, { 'value': 2, 'label': '有', 'withInput': true, 'isIssue': true, 'span': 8, 'inputSpan': 8 }] },
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.familyHistoryOther",
            "label": "其他",

            "inputType": "input",

            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.permanentResidenceAddress",
            "label": "户口地址",

            "inputType": "MyAddress",
            required: true,

            "isNewRow": 1,
            layout: '2/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.residenceAddress",
            "label": "居住地址",

            "inputType": "MyAddress",
            required: true,
            "inputProps": {
                addressBtns: [
                    { name: 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.permanentResidenceAddress', label: '同上' },
                ]
            },
            "isNewRow": 1,
            layout: '2/3',
        }]
    },
    {


        "name": "女方体格检查",


        "children": [{

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.weight",
            "label": "体重(kg)",
            "inputType": "input_number",

            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.height",
            "label": "身高(cm)",
            "inputType": "input_number",

            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.bmi",
            "label": "BMI",
            "inputType": "input_with_range",

            "specialConfig": { 'tip': 'BMI的正常范围值是18.5~24.9kg/㎡', 'min': 18.5, 'max': 24.9 },
            "inputProps": { 'placeholder': '请输入BMI', 'disabled': true },
            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.systolic",
            "label": "血压(mmHg)",
            "inputType": "pressure",

            layout: '1/3',
        }, {

            "key": "womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.heartRate",
            "label": "心率(次/分钟)",
            "inputType": "input_number",

            layout: '1/3',
        }]
    },
    {


        "name": "男方信息",


        "children": [{

            "key": "manName",
            "label": "姓名",
            "inputType": "input",
            required: true,
            layout: '1/3',
        }, {

            "key": "manOutpatientNo",
            "label": "门诊号",
            "inputType": "input",
            required: true,
            layout: '1/3',
        }, {

            "key": "manTelephone",
            "label": "电话号码",
            "inputType": "input",
            "rules": [{ 'required': true, 'message': '电话号码是必填项' }, { 'type': 'string', 'min': 11, 'message': '请输入11位手机号码' }, { 'max': 11, 'message': '请输入正确的手机号码格式' }],
            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.idType",
            "label": "证件类型",
            "inputType": "normal_select",
            required: true,
            "specialConfig": { 'type': 'IDCardMapping' },
            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.idNO",
            "label": "证件号码",
            "inputType": "input",
            required: true,
            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.dob",
            "label": "出生日期",
            "inputType": "single_date_picker",
            required: true,
            "specialConfig": { 'type': 'dayjs()' },
            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.ethnic",
            "label": "民族",
            "inputType": "MS",
            required: true,
            "specialConfig": { 'type': 'ethnicMapping' },
            "inputProps": { marshal: 0, optionKey: '民族s' },
            layout: '1/3',
        }, {

            "key": "manAge",
            "label": "年龄",
            "inputType": "input_number",
            "rules": [{ 'required': true, 'message': '年龄是必填项' }],
            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.permanentResidence",
            "label": "籍贯",
            "inputType": "normal_select",
            "rules": [{ 'required': true, 'message': '籍贯是必填项' }],
            "specialConfig": { 'type': 'provinceMapping' },
            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.education",
            "label": "文化程度",
            "inputType": "MS",
            "specialConfig": { 'type': 'cultureMapping' },
            "inputProps": { marshal: 0, optionKey: '文化程度s' },
            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.profession",
            "label": "职业",
            "inputType": "MS",
            "specialConfig": { 'type': 'jobMapping' },
            "inputProps": { marshal: 0, optionKey: '职业s' },
            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.nationality",
            "label": "国籍",
            "inputType": "country_select",

            layout: '1/3',
        }, {

            "key": "grs2",
            "label": "个人史",
            "inputType": "title",

            "inputProps": { 'type': 'text', 'size': 'large', 'style': { 'fontSize': 16, 'fontWeight': 600 } },
            "span": 24,
            "offset": 0,
            "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.previousHistory",
            "label": "既往史",
            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '既往史是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '无', 'span': 6, 'withInput': false }, { 'value': 2, 'label': '有', 'withInput': true, 'isIssue': true, 'span': 6, 'inputSpan': 12 }] },
            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.surgeryHistory",
            "label": "手术史",
            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '手术史是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '无', 'span': 6, 'withInput': false }, { 'value': 2, 'label': '有', 'withInput': true, 'isIssue': true, 'span': 6, 'inputSpan': 12 }] },
            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.presentIllness",
            "label": "现病史",
            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '现病史是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '无', 'span': 6, 'withInput': false }, { 'value': 2, 'label': '有', 'withInput': true, 'isIssue': true, 'span': 6, 'inputSpan': 12 }] },
            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.contactHazardousSubstances",
            "label": "接触有害物质",
            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '接触有害物质是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '无', 'span': 6, 'withInput': false }, { 'value': 2, 'label': '有', 'withInput': true, 'isIssue': true, 'span': 6, 'inputSpan': 12 }] },
            "inputProps": { 'placeholder': '请输入接触有害物质' },
            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.contactRadioactiveRays",
            "label": "接触放射线",
            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '接触放射线是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '无', 'span': 6, 'withInput': false }, { 'value': 2, 'label': '有', 'withInput': true, 'isIssue': true, 'span': 6, 'inputSpan': 12 }] },
            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.personalOther",
            "label": "其他",
            "inputType": "input",

            layout: '1/3',
        }, {

            "key": "jzs2",
            "label": "家族史",
            "inputType": "title",

            "inputProps": { 'type': 'text', 'size': 'large', 'style': { 'fontSize': 16, 'fontWeight': 600 } },
            "span": 24,
            "offset": 0,
            "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.familyHeritableDisease",
            "label": "遗传疾病",
            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '遗传疾病是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '无', 'span': 8, 'withInput': false }, { 'value': 2, 'label': '有', 'withInput': true, 'isIssue': true, 'span': 8, 'inputSpan': 8 }] },
            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.familyPsychosis",
            "label": "精神病",
            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '精神病是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '无', 'span': 8, 'withInput': false }, { 'value': 2, 'label': '有', 'withInput': true, 'isIssue': true, 'span': 8, 'inputSpan': 8 }] },
            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.birthDefects",
            "label": "先天畸形",
            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '先天畸形是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '无', 'span': 8, 'withInput': false }, { 'value': 2, 'label': '有', 'withInput': true, 'isIssue': true, 'span': 8, 'inputSpan': 8 }] },
            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.familyHistoryOther",
            "label": "其他",
            "inputType": "input",

            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.permanentResidenceAddress",
            "label": "户口地址",
            "inputType": "MyAddress",
            required: true,
            "inputProps": {
                addressBtns: [
                    { name: 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.permanentResidenceAddress', label: '同女方' },
                ]
            },
            "isNewRow": 1,
            layout: '2/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.residenceAddress",
            "label": "居住地址",
            "inputType": "MyAddress",
            required: true,
            "inputProps": {
                addressBtns: [
                    { name: 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.permanentResidenceAddress', label: '同女方' },
                ]
            },
            "isNewRow": 1,
            layout: '2/3',
        }]
    },
    {


        "name": "男方体格检查",


        "children": [{

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.weight",
            "label": "体重(kg)",
            "inputType": "input_number",

            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.height",
            "label": "身高(cm)",
            "inputType": "input_number",

            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.bmi",
            "label": "BMI",
            "inputType": "input_with_range",

            "specialConfig": { 'tip': 'BMI的正常范围值是18.5~24.9kg/㎡', 'min': 18.5, 'max': 24.9 },
            "inputProps": { 'placeholder': '请输入BMI', 'disabled': true },
            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.systolic",
            "label": "血压(mmHg)",
            "inputType": "pressure",

            layout: '1/3',
        }, {

            "key": "manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.heartRate",
            "label": "心率(次/分钟)",
            "inputType": "input_number",

            layout: '1/3',
        }]
    },
    {


        "name": "其他信息",


        "children": [{

            "key": "nearRelation",
            "label": "近亲结婚",
            "inputType": "checkbox_with_single_input",
            "rules": [{ 'required': true, 'message': '近亲结婚是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '否', 'span': 6, 'withInput': false }, { 'value': 2, 'label': '是', 'withInput': true, 'isIssue': true, 'span': 6, 'inputSpan': 12 }] },
            layout: '1/3',
        }, {

            "key": "filingDay",
            "label": "建档日期",
            "inputType": "single_date_picker",
            "rules": [{ 'required': true, 'message': '建档日期是必填项' }],
            layout: '1/3',
        }, {

            "key": "auditor",
            "label": "审核人",
            "inputType": "input",
            "rules": [{ 'required': true, 'message': '审核人是必填项' }],
            layout: '1/3',
        },
            // {
            //     "key": "fileStatus",
            //     "label": "审核状态",
            //     "inputType": "MS",
            //     inputProps: { options: '未审核,已审核', marshal: 0 },
            //     layout: '1/3',
            // },

        ]
    }
],
    //  { containerType: 'tabs' }
)