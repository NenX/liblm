import { defineFormConfig } from "@lm_fe/service";


import { mchcEnv, rt_ctx } from "@lm_fe/env";
import { IMchc_FormDescriptions_Field } from "@lm_fe/service";

import { 乳房触检_config_建瓯 } from "../../../MammaryCancer/Screening/form/建瓯";
import { get_check_invert_values } from "@lm_fe/components_m";
import { ROMAN_NUMERALS } from "@lm_fe/utils";
const ctx = rt_ctx;
const React = ctx.React;
const isRequired = false
function 病史情况_config_建瓯(): IMchc_FormDescriptions_Field[] {
    const isRequired = true

    return [
        {
            label: '编号',
            key: 'cervicalCancerRecordNo',
            inputProps: {
                disabled: true
            },
            layout: '1/2',
        },

        {
            "name": "病史情况",
            "children": [
                {
                    "key": "cervicalCancerMedicalHistory.previousCervicalScreening",
                    "label": "既往接受宫颈癌筛查",
                    required: isRequired,
                    inputType: 'MC',
                    inputProps: { options: '否,是', marshal: 0 },
                    layout: '1/3',
                },
                {
                    "key": "cervicalCancerMedicalHistory.lastScreeningTime",
                    "label": "最近一次筛查时间",
                    required: isRequired,
                    inputType: 'DatePicker',
                    inputProps: { "dependency": { "show": { "key": "cervicalCancerMedicalHistory.previousCervicalScreening", "value": [1] } } },
                    layout: '1/3',
                },
                {
                    "key": "cervicalCancerMedicalHistory.threeYearsScreening",
                    "label": "三年前是否接受过筛查",
                    required: isRequired,
                    inputType: 'MC',
                    inputProps: { marshal: 0, options: '否,是', "dependency": { "show": { "key": "cervicalCancerMedicalHistory.previousCervicalScreening", "value": [1] } } },
                    layout: '1/3',
                },
                {
                    "key": "cervicalCancerMedicalHistory.hasPreviousHPVVaccination",
                    "label": "既往是否接种过HPV疫苗",
                    required: isRequired,
                    inputType: 'MC',
                    inputProps: { marshal: 0, options: '否,是' },
                    layout: '1/3',
                },
                {
                    "key": "cervicalCancerMedicalHistory.hpvVaccinationDate",
                    "label": "接种HPV疫苗时间",
                    required: isRequired,
                    inputType: 'DatePicker',
                    inputProps: { "dependency": { "show": { "key": "cervicalCancerMedicalHistory.hasPreviousHPVVaccination", "value": [1] } } },
                    layout: '1/3',
                },
                {
                    "key": "cervicalCancerMedicalHistory.hpvVaccinationTypeNote",
                    "label": "接种HPV疫苗类型",
                    required: isRequired,
                    inputType: 'MC',
                    isNewRow: 1,
                    inputProps: { type: 'multiple', options: '进口二价,进口四价,进口九价,国产二价,其他i', "dependency": { "show": { "key": "cervicalCancerMedicalHistory.hasPreviousHPVVaccination", "value": [1] } } },
                    layout: '1/1',
                },

            ]
        },

    ]
}


function 建瓯增加_config(): IMchc_FormDescriptions_Field[] {
    return [
        {
            "name": "HPV检测",
            "children": [
                {
                    "key": "cervicalCancerInspection.testResult",
                    "label": "HPV检测",
                    required: isRequired,
                    "inputType": "MC",
                    "inputProps": { options: '阴性,阳性', marshal: 0 },
                    layout: "1/3",
                },
                {
                    "key": "cervicalCancerInspection.undeterminedType",
                    required: isRequired,
                    "label": "未分型",
                    "inputType": "MyInput",
                    inputProps: {
                        dependency: {
                            show: {
                                key: 'cervicalCancerInspection.testResult',
                                value: [2]
                            }
                        }
                    },
                    layout: "1/3",
                },
                {
                    "key": "cervicalCancerInspection.positiveTypeNote",
                    "label": "选项",
                    required: isRequired,
                    "inputType": "MC",
                    "inputProps": {
                        options: 'HPV亚型(16),HPV亚型(18),HPV亚型(31),HPV亚型(33),HPV亚型(35),HPV亚型(39),HPV亚型(45),HPV亚型(51),HPV亚型(52),HPV亚型(56),HPV亚型(58),HPV亚型(59),HPV亚型(66),HPV亚型(68),其他i',
                        type: 'multiple',
                        dependency: {
                            show: {
                                key: 'cervicalCancerInspection.testResult',
                                value: [2]
                            }
                        }
                    },
                    layout: "1/1",
                },

                {
                    "key": "cervicalCancerInspection.furtherCheckNote",
                    required: isRequired,
                    "label": "需进一步检查",
                    "inputType": "MC",
                    "inputProps": {
                        options: '是,否',
                        sp: [{
                            label: '是', inputType: 'MC', parentheses: true, props: { options: '宫颈细胞学检查,阴道镜检查', type: 'multiple' }
                        }]
                    },
                    layout: "1/1",
                },
            ]
        },
        {
            "name": "宫颈细胞学检查",
            "children": [
                {
                    "key": "cervicalCancerInspection.cellCollectionMethodNote",
                    "label": "取材方式",
                    required: isRequired,
                    inputType: 'MC',
                    inputProps: { options: '巴氏涂片,液基/薄层细胞学检查,其他i', },
                    layout: '1/1',
                },
                {
                    "key": "cervicalCancerInspection.tbsResult",
                    "label": "TBS分类报告结果",
                    required: isRequired,
                    inputType: 'MC',
                    inputProps: {
                        options: `未见上皮内病变细胞和恶性细胞,未明确意义的不典型鳞状上皮细胞(ASC-US),不典型鳞状上皮细胞-不除外高度鳞状上皮内病变(ASC-H),低度鳞状上皮内病变(LSIL),高度鳞状上皮内病变(HSIL),鳞状细胞癌(SCC),不典型腺上皮细胞(AGC),不典型宫颈管腺细胞倾向瘤变,宫颈管原位腺癌,腺癌`,
                        marshal: 0,
                        // type: 'multiple'
                    },
                    layout: '1/1',
                },
                {
                    "key": "cervicalCancerInspection.vaginoscopyCheck",
                    required: isRequired,
                    "label": "需阴道镜检查",
                    inputType: 'MC',
                    inputProps: { options: '是,否', marshal: 0 },
                    layout: '1/1',
                },
            ]
        },
        {
            "name": "阴道镜检查",
            "children": [
                {
                    "key": "cervicalCancerInspection.preDiagnosisNote",
                    "label": "初步诊断",
                    inputType: 'MC',
                    inputProps: {
                        options: '未见异常,异常,其他i',
                        inputWidth: 120,
                        marshal: 1,
                        sp: [
                            { label: '异常', inputType: 'MC', props: { options: '低度病变,高度病变,可疑癌' } }
                        ]
                    },
                    layout: '1/1',
                },
                {
                    "key": "cervicalCancerInspection.colposcopyAdequacy",
                    "label": "阴道镜检查充分性",
                    inputType: 'MC',
                    inputProps: { options: '充分,不充分', marshal: 0 },
                    layout: '1/2',
                },
                {
                    "key": "cervicalCancerInspection.transitionZoneVisibility",
                    "label": "转化区可见性",
                    inputType: 'MC',
                    inputProps: { options: '完全可见,部分可见,完全不可见', marshal: 0 },
                    layout: '1/2',
                },

                {
                    "key": "cervicalCancerInspection.needTissueCheck",
                    required: isRequired,
                    "label": "需组织病理检查",
                    inputType: 'MC',
                    inputProps: { options: '是,否', marshal: 0 },
                    layout: '1/3',
                },
            ]
        },
        {
            "name": "组织病理检查",
            "children": [
                {
                    "key": "cervicalCancerInspection.organPathologyCheck",
                    "label": "检查结果",
                    required: isRequired,
                    inputType: 'MC',
                    inputProps: { options: '未见异常,异常', marshal: 0 },
                    layout: '1/1',
                },
                {
                    "key": "cervicalCancerInspection.errorTypeNote",
                    "label": "异常类型",
                    required: isRequired,
                    inputType: 'MC',
                    inputProps: {
                        options: `炎症,低级别鳞状上皮内病变(LSIL),高级别鳞状上皮内病变(HSIL),宫颈原位腺癌(AIS),宫颈微小浸润癌(鳞癌/腺癌),宫颈浸润癌(鳞癌/腺癌),其他i`,
                        type: 'multiple',
                    },
                    showDeps: {
                        'cervicalCancerInspection.organPathologyCheck': [2]
                    },
                    layout: '1/1',
                },
            ]
        },

    ]
}


function 妇科检查_config_建瓯() {
    const isRequired = false

    const cache: IMchc_FormDescriptions_Field[] = [
        {
            "name": "妇科检查",
            "children": [{
                "key": "cervicalCancerGynecologicExamination.vulvaNote",
                "label": "外阴",
                "inputType": "MC",
                required: isRequired,

                "inputProps": {
                    options: '正常,白斑,溃疡,疱疹,肿物<左、右>a,其他i',
                    sp: [{ label: '正常', exclusive: true }],
                    type: 'multiple',
                },
                layout: "1/1",
            },
            {
                "key": "cervicalCancerGynecologicExamination.secretionsNote",
                "label": "分泌物",
                required: isRequired,
                "inputType": "MC",
                "inputProps": {
                    options: '正常,异位,血性,脓性,泡沫样,豆腐渣,其他i',
                    sp: [{ label: '正常', exclusive: true }],
                    type: 'multiple',
                },
                layout: "1/1",

            },
            {
                "key": "cervicalCancerGynecologicExamination.vaginalNote",
                "label": "阴道",
                required: isRequired,
                "inputType": "MC",
                "inputProps": {
                    options: '正常,异常,充血,溃疡,湿疣,疱疹,肿物<左、右>a,其他i',
                    sp: [{ label: '正常', exclusive: true }],
                    type: 'multiple',
                },
                layout: "1/1",

            }, {
                "key": "cervicalCancerGynecologicExamination.cervixNote",
                "label": "子宫颈",
                "inputType": "MC",
                required: isRequired,


                "inputProps": {
                    options: '正常,异常,触血,息肉,糜烂样<轻、中、重>a,菜花样,其他i',
                    sp: [{ label: '正常', exclusive: true }],
                    type: 'multiple',
                },
                layout: "1/1",

            }, {
                "key": "cervicalCancerGynecologicExamination.zgNote",
                "label": "子宫",
                required: isRequired,
                "inputType": "MC",
                "inputProps": {
                    type: 'multiple',
                    sp: [{ label: '正常', exclusive: true }],
                    inputWidth: 96,
                    options: `正常,大小<正常、孕周i>c,肿物<左、右>a,脱垂<${ROMAN_NUMERALS[1]}、${ROMAN_NUMERALS[2]}、${ROMAN_NUMERALS[3]}>a,压痛<左、右>a,其他i`,
                },
                layout: "1/1",

            }, {
                "key": "cervicalCancerGynecologicExamination.appendixNote",
                "label": "附件",
                required: isRequired,
                "inputType": "MC",
                "inputProps": {
                    type: 'multiple',
                    options: '正常,压痛,肿物,大小,其他i',
                    sp: [
                        { label: '大小', inputType: 'MC', props: { options: '正常,孕周i' } },
                        { label: '压痛', inputType: 'MA', props: { options: '左,右' } },
                        { label: '正常', exclusive: true },
                        { label: '肿物', inputType: 'MA', props: { options: '左,右' } },
                    ]
                },
                layout: "1/1",

            },
            {
                "key": "cervicalCancerGynecologicExamination.secretionNote",
                "label": "分泌物检查",
                required: isRequired,
                "inputType": "MC",
                "inputProps": {
                    type: 'multiple',
                    options: '正常,清洁度,滴虫,假丝酵母菌,加德纳菌,线索细胞,其他i',
                    sp: [
                        { label: '正常', exclusive: true },
                        { label: '清洁度', inputType: 'MC', props: { options: 'Ⅰ度,Ⅱ度,Ⅲ度,Ⅳ度' } }
                    ]
                },
                layout: "1/1",

            },
            {
                "key": "cervicalCancerGynecologicExamination.diagnosisNote",
                "label": "妇科临床诊断",
                required: isRequired,
                "inputType": "MC",
                "inputProps": {

                    options: '未见异常,异常',
                    sp: [
                        { label: '异常', inputType: 'MC', props: { options: '外生殖器尖锐湿疣,滴虫性阴道炎,外阴阴道假丝酵母菌病,细菌性阴道病,黏液脓性宫颈炎,宫颈息肉,子宫肌瘤,其他i', type: 'multiple', } }
                    ]
                },
                layout: "1/1",
            },



            {
                "label": "一键勾选",
                "inputType": "check_invert_button",
                inputPropsFn() {
                    return {
                        check_invert_values: get_check_invert_values([cache[0]])
                    }
                },
                layout: "1/3",

            }]
        },
        ...乳房触检_config_建瓯()
    ]
    return cache
}

function 诊断及指导_config_建瓯(): IMchc_FormDescriptions_Field[] {
    return [

        {

            "name": '最后诊断',

            "sort": 0,
            "children": [
                {
                    "key": "cervicalCancerDiagnosisAndGuidance.finalDiagnosisErrorType",
                    "label": "筛查结果",
                    required: isRequired,
                    "inputType": "MC",
                    // "inputType": "checkbox_with_single_input",
                    "inputProps": {
                        options: '正常,异常',
                        marshal: 0
                    },
                    layout: '1/1',
                },
                {
                    "key": "cervicalCancerDiagnosisAndGuidance.finalDiagnosisErrorTypeNote",
                    required: isRequired,
                    "label": "异常结果",
                    "inputType": "MC",
                    // "inputType": "checkbox_with_single_input",
                    "inputProps": {
                        type: 'multiple',
                        options: '低级别鳞状上皮内病变(LSIL),高级别鳞状上皮内病变(HSIL),宫颈原位腺癌(ALS),宫颈微小浸润癌<鳞癌、腺癌>c,宫颈浸润癌<鳞癌、腺癌>c,滴虫性阴道炎,外阴阴道假丝酵母菌病,细菌性阴道病,外生殖器尖锐湿疣,子宫肌瘤,粘液脓性宫颈炎,宫颈息肉,其他生殖系统恶性肿瘤i,其他生殖系统良性疾病i,不详',
                    },
                    showDeps: {
                        "cervicalCancerDiagnosisAndGuidance.finalDiagnosisErrorType": [2]
                    },
                    layout: '1/1',
                },


            ]
        },
        {

            "name": '随访治疗情况',

            "sort": 0,
            "children": [
                {
                    inputType: 'MC',
                    label: '随访情况',
                    key: 'cervicalCancerDiagnosisAndGuidance.followUpStatus',
                    inputProps: {
                        marshal: 0,
                        options: '已随访,失访'
                    },
                    layout: '1/2',
                },
                {
                    inputType: 'MC',
                    label: '宫颈病变接受治疗情况',
                    key: 'cervicalCancerDiagnosisAndGuidance.cervicalTreatmentStatus',
                    inputProps: {
                        marshal: 0,
                        options: '是,否'
                    },
                    layout: '1/2',

                },


            ]
        },
    ]

}
export default defineFormConfig(
    [
        ...病史情况_config_建瓯(),
        ...妇科检查_config_建瓯(),

        ...建瓯增加_config(),
        ...诊断及指导_config_建瓯(),
    ],
    { remote_filter_key: 'CervicalCancerScreening' }
)
