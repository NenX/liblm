import { mchcEnv, otherOptions } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
export default defineFormConfig(
    [
        {
            "key": "id",
            form_hidden: true,
        },
        {

            "key": "visitDate",
            "label": "日期",
            "inputType": "DatePicker",
            required: true,
            layout: '1/4',
        },
        {

            "key": "gestationalWeek",
            "label": "孕周",
            "inputType": "input",
            required: true,
            layout: '1/4',
        },
        {

            "key": "physicalExam.height",
            "label": "身高",
            "inputType": "input",
            required: true,
            isActive: mchcEnv.in(['广州市八']),

            isNewRow: true,
            "inputProps": { 'type': 'number', 'unit': 'cm' },

            layout: '1/4',
        },
        {

            "key": "physicalExam.weight",
            "label": "体重",
            "inputType": "input",
            required: true,
            "inputProps": { 'type': 'number', 'unit': 'kg' },

            layout: '1/4',
        },
        {

            "key": "physicalExam.bmi",
            "label": "bmi",
            "inputType": "input",
            required: true,
            "inputProps": { 'type': 'number', },
            isActive: mchcEnv.in(['广州市八']),

            layout: '1/4',
        },
        {

            "key": "physicalExam.MyPressure1__",
            "inputProps": { marshal: 0 },
            isNewRow: true,
            "label": "血压-首测",
            "inputType": "MyPressure",
            required: true,
            layout: '1/4',
        },
        {

            "key": "physicalExam.MyPressure2__",
            "label": "血压-二测",
            "inputProps": { marshal: 0 },
            isActive: !mchcEnv.in(['广州市八']),

            "inputType": "MyPressure",
            layout: '1/4',
        },
        {

            "key": "physicalExam.MyPressure3__",
            "inputProps": { marshal: 0 },
            "label": "血压-三测",
            isActive: !mchcEnv.in(['广州市八']),
            "inputType": "MyPressure",
            layout: '1/4',
        },
        {

            "key": "physicalExam.pulse",
            "label": "脉搏",
            "inputType": "input",
            "inputProps": { 'type': 'number', 'unit': '次/分', },
            layout: '1/4',

        },

        {

            "key": "chiefComplaint",
            "label": "主诉",
            "inputType": "textareaWithTemplate",
            isNewRow: 1,
            inputProps: {
                TemplateTextarea_type: [
                    { title: '科室', type: 16, depid: 2 },
                    { title: '个人', type: 17 },
                ]
            },
            // "inputProps": { 'minRows': 2, 'maxRows': 5, 'title': '主诉模板', 'departmentTempalteType': 16, 'personalTempalteTType': 17, 'departmentId': 2 },
            layout: '1/2',
        }, {

            "key": "phi",
            "label": "现病史",
            "inputType": "textareaWithTemplate",
            // "inputProps": { 'minRows': 2, 'maxRows': 5, 'title': '现病史模板', 'departmentTempalteType': 8, 'personalTempalteTType': 9, 'departmentId': 2 },
            inputProps: {
                TemplateTextarea_type: [
                    { title: '科室', type: 8, depid: 2 },
                    { title: '个人', type: 9 },
                ]
            },
            layout: '1/2',
        }, {

            "key": "gynExam.fundalHeight",
            "label": "宫高",
            "inputType": "input",
            "inputProps": { 'type': 'number', 'unit': 'cm' },
            layout: '1/4',
            "isNewRow": 1,
        }, {

            "key": "gynExam.waistHip",
            "label": "腹围",
            "inputType": "input",
            "inputProps": { 'type': 'number', 'unit': 'cm' },
            layout: '1/4',
        }, {

            "key": "edema",
            "label": "下肢水肿",
            "inputType": "select",
            "inputProps": { 'options': mchcEnv.get_other_options('edemaOptions'), marshal: 0, },
            layout: '1/4',
        }, {

            "key": "gynExam.engagement",
            "label": "衔接",
            "inputType": "select",
            "inputProps": { 'options': mchcEnv.get_other_options('engagementOptions'), marshal: 0, },
            layout: '1/4',
        },

        {

            "key": "fetusExam",
            "label": "",
            "inputType": "ArrayPanel",
            inputProps: {
                marshal: 0,
                targetLabelCol: 2,
                tip: '胎儿',
                formDescriptions: [
                    { layout: '1/5', inputType: 'MA', label: '胎动', name: 'fetalMovement', inputProps: { options: '正常,减少,增多' } },
                    { layout: '1/5', inputType: 'input_number', label: '胎心率', name: 'fetalHeartRate', inputProps: {} },
                    { layout: '1/5', inputType: 'MA', label: '位置', name: 'fetalPosition', inputProps: { options: mchcEnv.get_other_options('positonOptions') } },
                    { layout: '1/5', inputType: 'MA', label: '胎方位', name: 'position', inputProps: { optionKey: '胎方位22s' } },
                    { layout: '1/5', inputType: 'MA', label: '先露', name: 'presentation', inputProps: { optionKey: '先露s' } },
                ]
            },
            layout: '1/1',

            "isNewRow": 1,
        },

        // {

        //     "key": "childUltrasounds",
        //     "label": "",
        //     "inputType": "array-custom",
        //     "inputProps": { 'array_title': '超声', 'config': [{ 'name': 'id', 'key': '.id', 'label': 'id', 'input_type': 'input', 'hidden': true, 'span': 5 }, { 'name': 'bpd', 'key': '.bpd', 'label': 'BPD', 'input_type': 'input', 'span': 6, 'unit': 'mm', 'input_props': { 'type': 'number' } }, { 'name': 'fetalweight', 'key': '.fetalweight', 'label': '胎儿体重', 'input_type': 'input', 'span': 6, 'unit': 'g', 'input_props': { 'type': 'number' } }, { 'name': 'afv', 'key': '.afv', 'label': 'AFV', 'input_type': 'input', 'span': 6, 'unit': 'mm', 'input_props': { 'type': 'number' } }, { 'name': 'ubf', 'key': '.ubf', 'label': '脐血流', 'input_type': 'input', 'span': 6 }] },
        //     "span": 24,
        //     "isNewRow": 1,
        // },
        //  {

        //     "key": "gdm.fbg",
        //     "label": "FBG",
        //     "inputType": "input",
        //     "inputProps": { 'type': 'number', 'unit': 'mmol/L' },
        //     layout: '1/4',
        // }, {

        //     "key": "gdm.pbg2",
        //     "label": "P2BG",
        //     "inputType": "input",
        //     "inputProps": { 'type': 'number', 'unit': 'mmol/L' },
        //     layout: '1/4',
        // }, {

        //     "key": "gdm.hbalc",
        //     "label": "HbA1C",
        //     "inputType": "input",
        //     "inputProps": { 'type': 'number', 'unit': '%' },
        //     layout: '1/4',
        // }, {

        //     "key": "gdm.inslname",
        //     "label": "胰岛素方案",
        //     "inputType": "input",
        //     "span": 18,
        // }, {

        //     "key": "pih.quality",
        //     "label": "尿蛋白-定性",
        //     "inputType": "input",
        //     layout: '1/4',
        //     "isNewRow": 1,
        // }, {

        //     "key": "pih.quantity",
        //     "label": "24H定量",
        //     "inputType": "input",
        //     layout: '1/4',
        // }, {

        //     "key": "pih.medication",
        //     "label": "用药方案",
        //     "inputType": "autoComplete",
        //     "inputProps": { 'options': 'pvPihOptions' },
        //     layout: '1/2',
        // }, 
        {

            "key": "cardiacDisease.otherNote",
            "label": "其他异常特征",
            "inputType": "input",
            layout: '1/1',
        },
        // {

        //     "key": "cardiacDisease.heartrate",
        //     "label": "心率",
        //     "inputType": "input",
        //     "inputProps": { 'type': 'number', 'unit': '次/分' },
        //     layout: '1/4',
        //     "isNewRow": 1,
        // }, 
        // {

        //     "key": "cardiacDisease.medication",
        //     "label": "用药情况",
        //     "inputType": "input",
        //     layout: '1/2',
        // }, 
        // {

        //     "key": "icp.tba",
        //     "label": "TBA",
        //     "inputType": "input",
        //     "inputProps": { 'type': 'number', 'unit': 'umol/L' },
        //     layout: '1/4',
        //     "isNewRow": 1,
        // },
        //  {

        //     "key": "icp.alt",
        //     "label": "ALT",
        //     "inputType": "input",
        //     "inputProps": { 'type': 'number', 'unit': 'U/L' },
        //     layout: '1/4',
        // }, 
        // {

        //     "key": "icp.ast",
        //     "label": "AST",
        //     "inputType": "input",
        //     "inputProps": { 'type': 'number', 'unit': 'U/L' },
        //     layout: '1/4',
        // }, 
        // {

        //     "key": "hypothyroidism.tsh",
        //     "label": "TSH",
        //     "inputType": "input",
        //     "inputProps": { 'type': 'number', 'unit': 'uIU/ml' },
        //     layout: '1/4',
        //     "isNewRow": 1,
        // }, 
        // {

        //     "key": "hypothyroidism.t4",
        //     "label": "游离T4",
        //     "inputType": "input",
        //     "inputProps": { 'type': 'number', 'unit': 'pmol/L' },
        //     layout: '1/4',
        // }, 
        {

            "key": "inspection",
            "label": "检验检查",
            "inputType": "textareaWithBtn",
            isActive: !mchcEnv.in(['广州市八']),
            "inputProps": { 'minRows': 2, 'maxRows': 5, 'disabled': false },
            layout: '1/2',
            "isNewRow": 1,
        }, {

            "key": "exam",
            "label": "辅助检查",
            "inputType": "textareaWithTemplate",
            // "inputProps": { 'minRows': 2, 'maxRows': 5, 'title': '辅助检查模板', 'departmentTempalteType': 13, 'personalTempalteTType': 14, 'departmentId': 2 },
            inputProps: {
                TemplateTextarea_type: [
                    { title: '个人', type: 14 },
                    { title: '科室', type: 13, depid: 2 },
                ]
            },
            layout: '1/2',
        }, {

            "key": "prescription",
            "label": "处理措施",
            "inputType": "textareaWithTemplate",
            inputProps: {
                TemplateTextarea_type: [
                    { title: '个人', type: 7 },
                    { title: '科室', type: 6, depid: 2 },
                ]
            },
            layout: '1/2',
        }, {

            "key": "appointmentType",
            "label": "下次复诊",
            "inputType": "select",
            "inputProps": { 'options': mchcEnv.get_other_options('appointmentTypeOptions'), marshal: 0, },
            layout: '1/4',
            "isNewRow": 1,
        }, {

            "key": "appointmentCycle",
            "label": "",
            "inputType": "select",
            "inputProps": { 'options': mchcEnv.get_other_options('appointmentCycleOptions'), marshal: 0, },


            "span": 2,
        }, {

            "key": "appointmentDate",
            "label": "",
            "inputType": "DatePicker",
            required: true,
            "span": 3,
        }, {

            "key": "appointmentPeriod",
            "label": "",
            isActive: !mchcEnv.in(['广州市八']),

            "inputType": "select",
            "inputProps": { 'options': mchcEnv.get_other_options('appointmentPeriodOptions'), marshal: 0, },
            "span": 2,
        }]
)
