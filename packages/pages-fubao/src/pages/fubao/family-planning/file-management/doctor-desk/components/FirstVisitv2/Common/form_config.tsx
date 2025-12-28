import { IMchc_FormDescriptions_Field_Nullable } from "@lm_fe/service";
const 否是_options = [{ value: 1, label: '否' }, { value: 2, label: '是' },]
export const form_config: IMchc_FormDescriptions_Field_Nullable[] = [{

    "name": "病史情况",
    "sort": 0,



    "fields": [
        // {
        //     
        //     "key": "earlyPregnancyCheckMedicalHistory.familyHistory",
        //     "label": "家族史",

        //     "inputType": "checkbox_with_single_input",

        //     "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '否', 'span': 6, 'withInput': false }, { 'value': 2, 'label': '是', 'withInput': true, 'isIssue': true, 'span': 6, 'inputSpan': 12 }] },
        //     layout: '1/3',


        // },
        {
            "key": "earlyPregnancyCheckMedicalHistory.familyHistory",
            "label": "家族史",

            "inputType": "MC",

            inputProps: { options: 否是_options, marshal: 0 },
            layout: '1/4',

        },
        {
            "key": "earlyPregnancyCheckMedicalHistory.familyHistoryNote",
            "label": "备注",

            "inputType": "input",
            showDeps: {
                'earlyPregnancyCheckMedicalHistory.familyHistory': [2]
            },
            inputProps: {},
            layout: '1/4',

        },
        {
            "key": "earlyPregnancyCheckMedicalHistory.chiefComplaint",
            "label": "主诉",

            "inputType": "gynaecology_template_textarea",

            layout: '1/2',


        },
        {

            "key": "earlyPregnancyCheckMedicalHistory.medicalHistoryNow",
            "label": "现病史",

            "inputType": "MC",

            inputProps: { options: 否是_options, marshal: 0 },
            layout: '1/4',

        },
        {
            "key": "earlyPregnancyCheckMedicalHistory.medicalHistoryNowNote",
            "label": "备注",

            "inputType": "input",
            showDeps: {
                'earlyPregnancyCheckMedicalHistory.medicalHistoryNow': [2]
            },
            inputProps: {},
            layout: '1/4',

        },
        {

            "key": "earlyPregnancyCheckMedicalHistory.personalHistory",
            "label": "个人史",

            "inputType": "MC",

            inputProps: { options: 否是_options, marshal: 0 },
            layout: '1/4',

        },
        {
            "key": "earlyPregnancyCheckMedicalHistory.personalHistoryNote",
            "label": "备注",

            "inputType": "input",
            showDeps: {
                'earlyPregnancyCheckMedicalHistory.personalHistory': [2]
            },
            inputProps: {},
            layout: '1/4',

        },

    ]
}, {

    "name": "体格情况",
    "flag": "专科病例-常规接诊-体格情况",
    "sort": 0,



    "fields": [{

        "key": "womenHealthcarePhysicalExamination.weight",
        "label": "体重(kg)",

        "inputType": "input_number",

        "rules": [{ 'required': true, 'message': '体重(kg)是必填项' }],

        "inputProps": { 'placeholder': '请输入体重', 'style': { 'width': 156 } },
        "span": 8,
        "offset": 0,
        "isNewRow": 0,
        "formItemLayout": { 'labelCol': { 'span': 8 }, 'wrapperCol': { 'span': 16 } },





    }, {

        "key": "womenHealthcarePhysicalExamination.systolic",
        "label": "血压(mmHg)",

        "inputType": "pressure",

        "rules": [{ 'required': true, 'message': '血压(mmHg)是必填项' }],

        "inputProps": { 'style': { 'width': 156 } },
        "span": 8,
        "offset": 0,
        "isNewRow": 0,
        "formItemLayout": { 'labelCol': { 'span': 8 }, 'wrapperCol': { 'span': 16 } },





    }, {

        "key": "womenHealthcarePhysicalExamination.bodyTemperature",
        "label": "体温(°C)",

        "inputType": "input_number",

        "rules": [{ 'required': true, 'message': '体温(°C)是必填项' }],

        "inputProps": { 'placeholder': '请输入体温', 'style': { 'width': 156 } },
        "span": 8,
        "offset": 0,
        "isNewRow": 0,
        "formItemLayout": { 'labelCol': { 'span': 8 }, 'wrapperCol': { 'span': 16 } },





    }]
}, {

    "name": "检验检查",
    "sort": 0,



    "fields": [{

        "key": "earlyPregnancyCheckInspection.checkInspection",
        "label": "检验检查",

        "inputType": "text_area",

        


        "span": 16,
        "offset": 0,
        "isNewRow": 0,
        "formItemLayout": { 'labelCol': { 'span': 4 }, 'wrapperCol': { 'span': 20 } },





    }, {

        "key": "earlyPregnancyCheckInspection.ultrasoundDiagnosis",
        "label": "B超诊断",

        "inputType": "text_area",

        


        "span": 16,
        "offset": 0,
        "isNewRow": 0,
        "formItemLayout": { 'labelCol': { 'span': 4 }, 'wrapperCol': { 'span': 20 } },





    }]
}, {

    "name": "诊断及处理",
    "sort": 0,



    "fields": [{

        "key": "earlyPregnancyCheckDiagnosisAndTreatment.earlyPregnancyCheckDiagnosisInformations",
        "label": "诊断",

        "inputType": "diagnosis_list_v2",

        
        "specialConfig": { 'isShow': true },

        "span": 16,
        "offset": 0,
        "isNewRow": 0,
        "formItemLayout": { 'labelCol': { 'span': 4 }, 'wrapperCol': { 'span': 20 } },





    }, {

        "key": "earlyPregnancyCheckDiagnosisAndTreatment.treatmentMeasures",
        "label": "处理措施",

        "inputType": "gynaecology_template_textarea",

        

        "inputProps": { 'autoSize': { 'minRows': 7, 'maxRows': 7 }, 'placeholder': '请输入处理措施.' },
        "span": 16,
        "offset": 0,
        "isNewRow": 0,
        "formItemLayout": { 'labelCol': { 'span': 4 }, 'wrapperCol': { 'span': 20 } },





    }, {

        "key": "earlyPregnancyCheckDiagnosisAndTreatment.appointmentWeeksLater",
        "label": "预约复诊",

        "inputType": "select_with_options",

        
        "specialConfig": { 'type': 'array', 'mode': 'single', 'options': [{ 'value': 1, 'label': '1周后' }, { 'value': 2, 'label': '2周后' }, { 'value': 3, 'label': '3周后' }] },
        "inputProps": { 'placeholder': '请选择' },
        "span": 8,
        "offset": 0,
        "isNewRow": 1,
        "formItemLayout": { 'labelCol': { 'span': 8 }, 'wrapperCol': { 'span': 16 } },





    }, {

        "key": "earlyPregnancyCheckDiagnosisAndTreatment.appointmentSpecificDate",
        "label": "",

        "inputType": "DatePicker",
        inputProps: { format: 'YYYY-MM-DD' },


        "span": 4,
        "offset": 0,
        "isNewRow": 0,
        "formItemLayout": { 'labelCol': { 'span': 0 }, 'wrapperCol': { 'span': 24 } },





    }, {

        "key": "earlyPregnancyCheckDiagnosisAndTreatment.appointmentMorningOrAfternoon",
        "label": "",

        "inputType": "select_with_options",

        
        "specialConfig": { 'type': 'array', 'mode': 'single', 'options': [{ 'value': '上午', 'label': '上午' }, { 'value': '下午', 'label': '下午' }] },
        "inputProps": { 'placeholder': '请选择' },
        "span": 4,
        "offset": 0,
        "isNewRow": 0,
        "formItemLayout": { 'labelCol': { 'span': 0 }, 'wrapperCol': { 'span': 24 } },





    }, {

        "key": "earlyPregnancyCheckDiagnosisAndTreatment.registrationDate",
        "label": "登记日期.",

        "inputType": 'DatePicker',

        inputProps: { format: 'YYYY-MM-DD' },

        "span": 8,
        "offset": 0,
        "isNewRow": 1,
        "formItemLayout": { 'labelCol': { 'span': 8 }, 'wrapperCol': { 'span': 16 } },





    }, {

        "key": "earlyPregnancyCheckDiagnosisAndTreatment.diagnoseDoctor",
        "label": "接诊医生",

        "inputType": "input",

        


        "span": 8,
        "offset": 0,
        "isNewRow": 0,
        "formItemLayout": { 'labelCol': { 'span': 8 }, 'wrapperCol': { 'span': 16 } },





    }]
}]