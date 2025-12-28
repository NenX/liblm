import { FormConfig } from '@lm_fe/components_m';
import { mchcEnv, otherOptions as Options, rt_ctx } from '@lm_fe/env';
import { defineFormConfig } from '@lm_fe/service';

const ctx = rt_ctx
export default function () {
    return defineFormConfig([
        { key: 'id', form_hidden: true },
        { key: 'serialNo', form_hidden: true },
        {
            "key": "advice.disclosure",
            "label": "病情告知",
            "inputType": "textareaWithTemplate",
            "isActive": mchcEnv.is('广州市八'),
            "inputProps": {
                rows: 6,
                "TemplateTextarea_type": [
                    { "title": "科室", "type": 18 },
                    { "title": "个人", "type": 19 }
                ]
            },
            layout: '1/1',

        },
        // {
        //     "key": "advice.prescription",
        //     "label": "处理措施",
        //     "inputType": "textareaWithTemplate",
        //     'required': true,
        //     "inputProps": { 'minRows': 2, 'maxRows': 5, 'title': '处理措施模板', 'departmentTempalteType': 6, 'personalTempalteTType': 7, 'departmentId': 2, 'showAdvise': true },
        //     layout: '1/1',
        // },

        {
            "key": "advice.prescription",
            "label": "处理措施",
            "inputType": "textareaWithTemplate",
            layout: '1/1',
            "inputProps": {
                "TemplateTextarea_type": [
                    { "title": "科室", "type": 6, "depid": 2 },
                    { "title": "个人", "type": 7 },

                ]
            }
        },

        {
            "key": "advice.exam",
            "label": "辅助检查",
            "inputType": "textareaWithTemplate",
            // "inputProps": { 'minRows': 2, 'maxRows': 5, 'title': '辅助检查模板', 'departmentTempalteType': 13, 'personalTempalteTType': 14, 'departmentId': 2 },
            "inputProps": {
                "TemplateTextarea_type": [
                    { "title": "科室", "type": 13, "depid": 2 },
                    { "title": "个人", "type": 14 },
                ]
            },
            "isActive": !mchcEnv.is('广州市八'),
            layout: '1/1',
        },

        {
            "key": "advice.appointmentType",
            "label": "下次复诊",
            "inputType": 'node',
            "inputProps": { node: null },
            "span": 2,
            labelCol: 23,
            wrapperCol: 0
        },
        {
            "key": "advice.appointmentType",
            "inputType": "MS",
            "isActive": !mchcEnv.is('广州市八'),
            'required': true,
            "inputProps": { 'uniqueKey': 'PrenatalVisit.appointmentType', marshal: 0 },
            "span": 3,
        },
        {
            "key": "advice.appointmentCycle",

            "inputType": "MS",
            "inputProps": { 'options': ctx.mchcEnv.get_other_options('appointmentCycleOptions'), marshal: 0 },
            "span": 3,
        },
        {
            "key": "advice.appointmentDate",
            "inputType": "date",
            "span": 3,
        },
        {
            "key": "advice.appointmentPeriod",
            "inputType": "MS",
            "isActive": !mchcEnv.is('广州市八'),
            "inputProps": { 'options': ctx.mchcEnv.get_other_options('appointmentPeriodOptions'), marshal: 0 },
            "span": 3,
        },
        {
            "key": "advice.visitDate",
            "label": "初诊日期",
            "inputType": "date",
            "isNewRow": 1,
            layout: '1/3',
        },
        {
            "key": "advice.doctorName",
            "label": "初诊医生",
            "inputType": "input",
            showDeps(f) {
                return !!ctx.utils.getSearchParamsAll().serialNo || !!f.getFieldValue('serialNo')
            },
            "inputProps": { 'disabled': true },
            layout: '1/3',
        }
    ])
}
