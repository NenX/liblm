import { ICommonOption, mchcEnv } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
const options_正常异常: ICommonOption[] = [
    { label: '正常', value: 1 },
    { label: '异常', value: 2, warning: true, inputType: 'input' },
]
const options_正常其他: ICommonOption[] = [
    { label: '正常', value: 1 },
    { label: '其他', value: 2, warning: true, inputType: 'input' },
]
const options_无有: ICommonOption[] = [
    { label: '无', value: 1 },
    { label: '有', value: 2, warning: true, inputType: 'input' },
]
export default defineFormConfig(
    [{
        "name": "基础体检",
        "fields": [{
            "key": "weight",
            "label": "体重(kg)",
            "inputType": "input_number",
            "rules": [{ 'required': true, 'message': '体重(kg)是必填项' }],
            "inputProps": { 'placeholder': '请输入体重' },
            layout: '1/3',

        }, {
            "key": "bmi",
            "label": "BMI",
            "inputType": "input_with_range",
            "rules": [{ 'required': true, 'message': 'BMI是必填项' }],
            "specialConfig": { 'tip': 'BMI的正常范围值是18.5~24.9kg/㎡', 'min': 18.5, 'max': 24.9 },
            "inputProps": { 'placeholder': '请输入BMI', 'disabled': true },
            layout: '1/3',

        }, {
            "key": "height",
            "label": "身高(cm)",
            "inputType": "input_number",
            'required': true,
            layout: '1/3',

        }, {
            "key": "systolic_",
            "label": "血压(mmHg)",
            "inputType": "MyPressure",
            'required': true,
            layout: '1/3',
            "inputProps": { marshal: 2, },

        }, {
            "key": "heartRate",
            "label": "心率(次/分钟)",
            "inputType": "input_number",
            required: true,
            layout: '1/3',

        }]
    }, {
        "name": "外科检查",
        "fields": [{
            "key": "intelligence__",
            "label": "智力",
            "inputType": "MC",

            "inputProps": { options: options_正常异常,  },
            layout: '1/3',
        }, {
            "key": "limbsSpinal__",
            "label": "四肢脊柱",
            "inputType": "MC",

            "inputProps": { options: options_正常异常,  },
            layout: '1/3',
        }, {
            "key": "surgicalExaminationOther",
            "label": "其他",
            "inputType": "input",
            layout: '1/3',
        }, {
            "key": "specialBody__",
            "label": "特殊体态",
            "inputType": "MC",

            "inputProps": { options: options_正常异常,  },
            layout: '1/3',
        }, {
            "key": "specialFace__",
            "label": "特殊面容",
            "inputType": "MC",

            "inputProps": { options: options_正常异常,  },
            layout: '1/3',
        }, {
            "key": "mentalState__",
            "label": "精神状态",
            "inputType": "MC",

            "inputProps": { options: options_正常异常,  },
            layout: '1/3',
        }, {
            "key": "skinHair__",
            "label": "皮肤毛发",
            "inputType": "MC",

            "inputProps": { options: options_正常异常,  },
            layout: '1/3',
        },
        {
            "key": "selectBtn",
            "label": "",
            "inputType": "check_invert_button",
            layout: '1/3',
        },
        ]
    }, {
        "name": "内科检查",
        "fields": [{
            "key": "skinMucousMembrane__",
            "label": "皮肤黏膜",
            "inputType": "MC",
            "inputProps": { options: options_正常其他,  },
            layout: '1/3',
        }, {
            "key": "thyroid__",
            "label": "甲状腺",
            "inputType": "MC",

            "inputProps": { options: options_正常其他,  },
            layout: '1/3',
        }, {
            "key": "breast__",
            "label": "乳房乳腺",
            "inputType": "MC",
            "inputProps": { options: options_正常其他,  },
            layout: '1/3',
        }, {
            "key": "breathSounds__",
            "label": "呼吸音",
            "inputType": "MC",

            "inputProps": { options: options_正常其他,  },
            layout: '1/3',
        }, {
            "key": "rale__",
            "label": "啰音",
            "inputType": "MC",


            "inputProps": { options: options_无有,  },
            layout: '1/3',
        }, {
            "key": "physicalExaminationHeartRate",
            "label": "心率(次/分钟)",
            "inputType": "input_number",

            layout: '1/3',

        }, {
            "key": "heartrhythm__",
            "label": "心律",
            "inputType": "MC",
            layout: '1/3',

            "inputProps": {
                options: [
                    { label: '齐', value: 1 },
                    { label: '不齐', value: 2, warning: true, inputType: 'input' },
                ],
                
            },
        }, {
            "key": "noise__",
            "label": "杂音",
            "inputType": "MC",

            "inputProps": { options: options_无有,  },
            layout: '1/3',
        }, {
            "key": "liver__",
            "label": "肝脏",
            "inputType": "MC",
            layout: '1/3',

            "inputProps": {
                options: [
                    { label: '未触及', value: 1 },
                    { label: '可触及', value: 2, warning: true, inputType: 'input' },
                ],
                
            },
        }, {
            "key": "spleen__",
            "label": "脾脏",
            "inputType": "MC",


            "inputProps": {
                options: [
                    { label: '未触及', value: 1 },
                    { label: '可触及', value: 2, warning: true, inputType: 'input' },
                ],
                
            },
            layout: '1/3',
        }, {
            "key": "spine__",
            "label": "脊柱",
            "inputType": "MC",

            "inputProps": { options: options_正常其他,  },
            layout: '1/3',
        }, {
            "key": "physiologicalReflection__",
            "label": "生理反射",
            "inputType": "MC",

            "inputProps": { options: options_正常其他,  },
            layout: '1/3',
        }, {
            "key": "pathologicalReflection__",
            "label": "病理反射",
            "inputType": "MC",

            "inputProps": { options: options_无有,  },
            layout: '1/3',
        }, {
            "key": "lowerLimbEdema__",
            "label": "下肢水肿",
            "inputType": "MC",

            "inputProps": { 'options': mchcEnv.get_other_options('edemaOptions'),  },
            layout: '1/3',

        }, {
            "key": "selectBtn2",
            "label": "",
            "inputType": "check_invert_button",
            "inputProps": { 'type': 'primary', 'size': 'middle' },
            layout: '1/3',

        }, {
            "key": "physicalExaminationOther",
            "label": "其他",
            "inputType": "text_area",

            "inputProps": { 'placeholder': '请输入其他' },
            layout: '1/3',

        }]
    },
    {
        "key": "checkDoctor",
        "label": "检查医生",
        "inputType": "MA",
        inputProps: { memorieskey: '妇保-检查医生' },

        "required": true,
        layout: '1/3',

    },]
)
