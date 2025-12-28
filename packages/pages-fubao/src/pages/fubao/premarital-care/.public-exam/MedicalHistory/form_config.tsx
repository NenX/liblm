import { ICommonOption } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
const options_无有: ICommonOption[] = [
    { label: '无', value: 1 },
    { label: '有', value: 2, warning: true, inputType: 'input' },
]
export default defineFormConfig(
    [{


        "name": "病史情况",
        "children": [{

            "key": "menarche",
            "label": "初潮(岁)",

            "inputType": "input_number",
            "rules": [{ 'required': true, 'message': '初潮(岁)是必填项' }],
            "inputProps": { 'placeholder': '请输入初潮' },
            layout: '1/3',
        }, {

            "key": "menstrualCycle",
            "label": "月经周期(天)",

            "inputType": "input_number",
            "rules": [{ 'required': true, 'message': '月经周期(天)是必填项' }],
            "inputProps": { 'placeholder': '请输入月经周期' },
            layout: '1/3',
        }, {

            "key": "menstrualPeriod",
            "label": "月经持续天数",

            "inputType": "input_number",
            "rules": [{ 'required': true, 'message': '月经持续天数是必填项' }],
            "inputProps": { 'placeholder': '请输入月经持续天数' },
            layout: '1/3',
        }, {

            "key": "menstrualVolume",
            "label": "经量",

            "inputType": "checkbox_group",
            "rules": [{ 'required': true, 'message': '经量是必填项' }],
            "specialConfig": { 'type': 'single', 'options': [{ 'value': '多', 'label': '多', 'withInput': false, 'span': 6 }, { 'value': '中', 'label': '中', 'withInput': false, 'span': 6 }, { 'value': '少', 'label': '少', 'withInput': false, 'span': 6 }] },
            "inputProps": { 'placeholder': '请输入经量' },
            layout: '1/3',
        }, {

            "key": "dysmenorrhea__",
            "label": "痛经",

            "inputType": "MC",
            "rules": [{ 'required': true, 'message': '痛经是必填项' }],
            "inputProps": { options: options_无有 },
            layout: '1/3',
        }, {

            "key": "gravidity",
            "label": "孕次",

            "inputType": "input_number",
            "rules": [{ 'required': true, 'message': '孕次是必填项' }],
            "inputProps": { 'placeholder': '请输入孕次' },
            layout: '1/3',
        }, {

            "key": "parity",
            "label": "产次",

            "inputType": "input_number",
            "rules": [{ 'required': true, 'message': '产次是必填项' }],
            "inputProps": { 'placeholder': '请输入产次' },
            layout: '1/3',
        },
        {

            "key": "whetherPregnancy",
            "label": "是否怀孕",

            "inputType": "MC",

            "inputProps": { 'placeholder': '请输入是否怀孕', options: '否,是', marshal: 0 },
            layout: '1/3',
        },
        {

            "key": "lmd",
            "label": "末次月经",

            "inputType": "single_date_picker",

            showDeps: {
                whetherPregnancy(v) { return v }
            },
            layout: '1/3',
        },
        {

            "key": "marriageBirthHistory",
            "label": "既往婚育史",
            "inputType": "MC",
            inputProps: {

                options: [
                    { value: 0, label: '无', },
                    {
                        value: 1, label: '有', parentheses: true, inputType: 'ArrayInput', props: {
                            inputW: 1,
                            options: [
                                { label: '', inputType: 'MC', props: { options: '丧偶,离异' } },
                                { label: '足月', inputType: 'Input', prefix: '', suffix: '次' },
                                { label: '早产', inputType: 'Input', prefix: '', suffix: '次' },
                                { label: '流产', inputType: 'Input', prefix: '', suffix: '次' },
                                { label: '子女', inputType: 'Input', prefix: '', suffix: '人' },

                            ]
                        }
                    },

                ]
            },

            layout: '1/1',
        }
        ]
    },
    {


        "name": "个人史",
        "children": [{

            "key": "personalHeritableDisease__",
            "label": "遗传疾病",

            "inputType": "MC",

            "inputProps": { options: options_无有 },

            layout: '1/3',
        }, {

            "key": "previousHistory__",
            "label": "既往史",

            "inputType": "MC",
            "rules": [{ 'required': true, 'message': '既往史是必填项' }],
            "inputProps": { options: options_无有 },

            layout: '1/3',
        }, {

            "key": "surgeryHistory__",
            "label": "手术史",

            "inputType": "MC",
            "rules": [{ 'required': true, 'message': '手术史是必填项' }],
            "inputProps": { options: options_无有 },

            layout: '1/3',
        }, {

            "key": "presentIllness__",
            "label": "现病史",

            "inputType": "MC",
            "rules": [{ 'required': true, 'message': '现病史是必填项' }],
            "inputProps": { options: options_无有 },

            layout: '1/3',
        }, {

            "key": "nearRelation__",
            "label": "近亲结婚",

            "inputType": "MC",
            "rules": [{ 'required': true, 'message': '近亲结婚是必填项' }],
            "inputProps": { options: options_无有 },

            layout: '1/3',
        }, {

            "key": "contactHazardousSubstances__",
            "label": "接触有害物质",

            "inputType": "MC",
            "rules": [{ 'required': true, 'message': '接触有害物质是必填项' }],
            "inputProps": { options: options_无有 },

            layout: '1/3',
        }, {

            "key": "contactRadioactiveRays__",
            "label": "接触放射线",

            "inputType": "MC",
            "rules": [{ 'required': true, 'message': '接触放射线是必填项' }],
            "inputProps": { options: options_无有 },
            layout: '1/3',
        }, {

            "key": "personalOther",
            "label": "其他",

            "inputType": "input",

            "inputProps": { 'placeholder': '请输入其他' },
            layout: '1/3',
        }]
    }, {


        "name": "家族史",
        "children": [{

            "key": "familyHeritableDisease__",
            "label": "遗传疾病",

            "inputType": "MC",
            "rules": [{ 'required': true, 'message': '遗传疾病是必填项' }],
            "inputProps": { options: options_无有 },

            layout: '1/3',
        }, {

            "key": "familyPsychosis__",
            "label": "精神病",

            "inputType": "MC",

            "inputProps": { options: options_无有 },

            layout: '1/3',
        }, {

            "key": "birthDefects__",
            "label": "先天畸形",

            "inputType": "MC",
            "inputProps": { options: options_无有 },

            layout: '1/3',
        }, {

            "key": "familyHistoryOther",
            "label": "其他",

            "inputType": "input",

            "inputProps": { 'placeholder': '请输入其他' },
            layout: '1/3',
        }]
    }]
)
