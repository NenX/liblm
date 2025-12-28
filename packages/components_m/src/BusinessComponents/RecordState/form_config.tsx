import { IMchc_FormDescriptions, IMchc_FormDescriptions_Field } from "@lm_fe/service";

const deliveryForm = ['deliveryDate', 'deliveryGestationalWeek', 'deliveryMode'];
const terminationForm = ['closingDate', 'closingGestationalWeek', 'closingNote'];
const referralForm = [
    'referralOutReason',
    'referralOutReferralDate',
    'referralOutReferralOrganization',
    'referralOutReferralDept',
    'referralOutReferralDirection',
    'referralOutReferralDoctor',
    'referralOutReferralContactNumber',
    'referralOutRecorder',
];
const allKeys = [...deliveryForm, ...terminationForm, ...referralForm]
const status_map_form = {
    2: deliveryForm,
    3: terminationForm,
    5: referralForm,
}
export function getFormConfigByPeriodState(periodState: '2' | '3' | '5') {
    const keys = status_map_form[periodState]
    if (!keys) return []
    const data = form_config_base[0].fields?.filter(_ => keys.includes(_?.key!)) ?? []
    return data
}
export function getFormConfigFilter() {
    return form_config_base[0].fields?.filter(_ => !allKeys.includes(_?.key!)) ?? []
}
const form_config_base: IMchc_FormDescriptions[] = [{
    "id": 200,
    "moduleName": "record-state-setting",
    "name": "档案状态配置",
    "flag": "产前检查-护士端-结案管理-档案状态配置",
    "fields": [{
        "id": 12592,
        "key": "recordstate",
        "label": "档案状态",
        "inputType": "normal_select",
        "tranferRules": { 'path': 'recordstate' },
        "specialConfig": { 'type': 'recordStateMapping' },
        "span": 8,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 6 }, 'wrapperCol': { 'span': 16 } },
    }, {
        "id": 12593,
        "key": "periodState",
        "label": "孕期状态",
        "inputType": "normal_select",
        "tranferRules": { 'path': 'periodState' },

        "specialConfig": { 'type': 'periodStateMapping' },
        "span": 8,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 6 }, 'wrapperCol': { 'span': 16 } },
    }, {
        "id": 12594,
        "key": "closingDate",
        "label": "终止时间",
        "inputType": "single_date_picker",
        "tranferRules": { 'path': 'closingDate', 'type': 'dayjs()' },

        "span": 8,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 6 }, 'wrapperCol': { 'span': 16 } },
    }, {
        "id": 12595,
        "key": "closingGestationalWeek",
        "label": "终止孕周",
        "inputType": "input",
        "tranferRules": { 'path': 'closingGestationalWeek' },

        "span": 8,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 6 }, 'wrapperCol': { 'span': 16 } },
    }, {
        "id": 12596,
        "key": "closingNote",
        "label": "终止原因",
        "inputType": "input",
        "tranferRules": { 'path': 'closingNote' },

        "span": 8,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 6 }, 'wrapperCol': { 'span': 16 } },
    }, {
        "id": 12597,
        "key": "deliveryDate",
        "label": "分娩时间",
        "inputType": "single_date_picker",
        "tranferRules": { 'path': 'deliveryDate', 'type': 'dayjs()' },
        "inputProps": { 'maxDate': 'now' },
        "span": 8,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 6 }, 'wrapperCol': { 'span': 16 } },
    }, {
        "id": 12598,
        "key": "deliveryGestationalWeek",
        "label": "分娩孕周",
        "inputType": "input",
        "tranferRules": { 'path': 'deliveryGestationalWeek' },

        "span": 8,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 6 }, 'wrapperCol': { 'span': 16 } },
    }, {
        "id": 12599,
        "key": "deliveryMode",
        "label": "分娩方式",
        "inputType": "select_with_options",
        "tranferRules": { 'path': 'deliveryMode' },
        "specialConfig": { 'type': 'string', 'mode': 'multiple', 'options': [{ 'value': '1', 'label': '顺产' }, { 'value': '2', 'label': '剖宫产' }, { 'value': '3', 'label': '钳产' }, { 'value': '4', 'label': '吸引产' }, { 'value': '5', 'label': '臀助产' }] },
        "span": 8,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 6 }, 'wrapperCol': { 'span': 16 } },
    }, {
        "id": 12619,
        "key": "referralOutReason",
        "label": "转出原因",
        "inputType": "text_area",
        "tranferRules": { 'path': 'referralOut.reason' },
        "rules": [{ 'required': true, 'message': '转入原因是必填项' }],
        "span": 16,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 3 }, 'wrapperCol': { 'span': 20 } },
    }, {
        "id": 12620,
        "key": "referralOutReferralDate",
        "label": "转出时间",
        "inputType": "single_date_picker",
        "tranferRules": { 'path': 'referralOut.referralDate' },
        "rules": [{ 'required': true, 'message': '转入时间是必填项' }],
        "span": 8,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 6 }, 'wrapperCol': { 'span': 16 } },
    }, {
        "id": 12621,
        "key": "referralOutReferralOrganization",
        "label": "转至单位",
        "inputType": "referral_organization_select",
        "tranferRules": { 'path': 'referralOut.referralOrganization' },
        "rules": [{ 'required': true, 'message': '转至单位是必填项' }],
        "span": 8,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 6 }, 'wrapperCol': { 'span': 16 } },
    }, {
        "id": 12626,
        "key": "referralOutReferralDept",
        "label": "转至科室",
        "inputType": "input",
        "tranferRules": { 'path': 'referralOut.referralDept' },
        "span": 8,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 6 }, 'wrapperCol': { 'span': 16 } },
    }, {
        "id": 12622,
        "key": "referralOutReferralDirection",
        "label": "转诊类型",
        "inputType": "checkbox_group",
        "tranferRules": { 'path': 'referralOut.referralDirection' },
        "specialConfig": { 'type': 'single', 'options': [{ 'value': 1, 'label': '平级', 'span': 6, 'withInput': false }, { 'value': 2, 'label': '上级', 'withInput': false, 'span': 6 }, { 'value': 3, 'label': '下级', 'withInput': false, 'span': 6 }] },
        "span": 8,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 6 }, 'wrapperCol': { 'span': 16 } },
    }, {
        "id": 12623,
        "key": "referralOutReferralDoctor",
        "label": "申请者",
        "inputType": "input",
        "tranferRules": { 'path': 'referralOut.referralDoctor' },
        "span": 8,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 6 }, 'wrapperCol': { 'span': 16 } },
    }, {
        "id": 12624,
        "key": "referralOutReferralContactNumber",
        "label": "科室联系电话",
        "inputType": "input",
        "tranferRules": { 'path': 'referralOut.referralContactNumber' },
        "span": 8,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 6 }, 'wrapperCol': { 'span': 16 } },
    }, {
        "id": 12625,
        "key": "referralOutRecorder",
        "label": "记录者",
        "inputType": "input",
        "tranferRules": { 'path': 'referralOut.recorder' },
        "rules": [{ 'required': true, 'message': '记录者是必填项' }],
        "span": 8,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 6 }, 'wrapperCol': { 'span': 16 } },
    }]
}]