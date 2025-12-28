import { defineFormConfig } from "@lm_fe/service";


import { IMchc_FormDescriptions_Field, IMchc_FormDescriptions_Field_Nullable } from "@lm_fe/service";

import { get_check_invert_values } from "@lm_fe/components_m";
import { rt_ctx } from "@lm_fe/env";
const isRequired = false
const ctx = rt_ctx;
const React = ctx.React;
function 辅助检查_config_建瓯(): IMchc_FormDescriptions_Field_Nullable[] {
    let cache1: IMchc_FormDescriptions_Field_Nullable
    let cache2: IMchc_FormDescriptions_Field_Nullable
    let cache3: IMchc_FormDescriptions_Field_Nullable
    return [

        cache1 = {
            "label": "乳腺彩色超声检查",
            "children": [
                {
                    "label": "左乳",
                    children: [
                        {
                            label: '囊肿',
                            key: 'breastCancerAuxiliaryExamination.leftCyst',
                            inputType: 'MC',
                            required: isRequired,
                            inputProps: {
                                marshal: 0,
                                options: '无,有'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '囊肿类型',
                            key: 'breastCancerAuxiliaryExamination.leftCystOption',
                            inputType: 'MC',
                            required: isRequired,
                            inputProps: {
                                // marshal: 0,
                                options: '单纯囊肿i,复杂囊肿i'
                            },
                            showDeps: {
                                'breastCancerAuxiliaryExamination.leftCyst': [1]
                            },
                            layout: '1/2',
                        },
                        {
                            label: '实性肿块',
                            key: 'breastCancerAuxiliaryExamination.leftSolidMass',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '无,有'
                            },
                            layout: '1/2',

                        },
                        {
                            label: '肿块类型',
                            key: 'breastCancerAuxiliaryExamination.leftSolidMassOption',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '单发,多发'
                            },
                            showDeps: {
                                'breastCancerAuxiliaryExamination.leftSolidMass': [1]
                            },
                            layout: '1/2',

                        },
                        {
                            label: '部位',
                            key: 'breastCancerAuxiliaryExamination.leftPosition',
                            required: isRequired,
                            inputType: 'Input',
                            layout: '1/3',
                            showDeps: {
                                'breastCancerAuxiliaryExamination.leftSolidMass': [1]
                            }
                        },
                        {
                            label: '象限法(可触及者)',
                            key: 'breastCancerAuxiliaryExamination.leftQuadrantMethod',
                            inputType: 'MC',
                            inputProps: {
                                options: '1,2,3,4',
                                type: 'multiple'
                            },
                            layout: '1/3',
                            showDeps: {
                                'breastCancerAuxiliaryExamination.leftSolidMass': [1]
                            }
                        },
                        {
                            label: '时钟法(不可触及者)',
                            key: 'breastCancerAuxiliaryExamination.leftClockMethod',
                            inputType: 'Input',
                            layout: '1/3',
                            showDeps: {
                                'breastCancerAuxiliaryExamination.leftSolidMass': [1]
                            }
                        },
                        {
                            label: '大小',
                            key: 'breastCancerAuxiliaryExamination.leftSize',
                            inputType: 'MArr',
                            required: isRequired,
                            inputProps: {
                                separator: 'x',
                                options: [
                                    { inputType: 'Input', suffix: 'mm' },
                                    { inputType: 'Input', suffix: 'mm' },
                                ]
                            },
                            layout: '1/3',
                            showDeps: {
                                'breastCancerAuxiliaryExamination.leftSolidMass': [1]
                            }
                        },
                        {
                            label: '形态',
                            key: 'breastCancerAuxiliaryExamination.leftForm',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '椭圆形,圆形,不规则,浅分叶'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '方向',
                            key: 'breastCancerAuxiliaryExamination.leftDirection',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '纵横比>=1,纵横比<1'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '边缘',
                            key: 'breastCancerAuxiliaryExamination.leftEdge',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '清晰,不清晰'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '肿块周围晕环',
                            key: 'breastCancerAuxiliaryExamination.leftPeripheralHalo',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '无,规则低回声,不规则高回声晕'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '内部回声性质',
                            key: 'breastCancerAuxiliaryExamination.leftInternalEchoProperty',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '低,等,高,极低回声'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '内部回声分布',
                            key: 'breastCancerAuxiliaryExamination.leftInternalEchoDistribution',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '均匀,不均匀'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '后方回声',
                            key: 'breastCancerAuxiliaryExamination.leftRearEcho',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '无变化,增强,侧方声影,衰减'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '肿块内钙化',
                            key: 'breastCancerAuxiliaryExamination.leftMassCalcificationNote',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                type: 'multiple',
                                options: '无,棒状,环状,沙粒状,簇状'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '血流',
                            key: 'breastCancerAuxiliaryExamination.leftBloodFlow',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '无,少许,丰富'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '腋淋巴结描述',
                            key: 'breastCancerAuxiliaryExamination.leftLymphDesc',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '无,正常影像,异常影像'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '分类',
                            key: 'breastCancerAuxiliaryExamination.leftClassify',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '0类,1类,2类,3类,4类,5类'
                            },
                            layout: '1/2',
                        },
                    ]
                },
                {
                    "label": "右乳",
                    children: [
                        {
                            label: '囊肿',
                            key: 'breastCancerAuxiliaryExamination.rightCyst',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '无,有'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '囊肿类型',
                            key: 'breastCancerAuxiliaryExamination.rightCystOption',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                // marshal: 0,
                                options: '单纯囊肿i,复杂囊肿i'
                            },
                            showDeps: {
                                'breastCancerAuxiliaryExamination.rightCyst': [1]
                            },
                            layout: '1/2',
                        },
                        {
                            label: '实性肿块',
                            key: 'breastCancerAuxiliaryExamination.rightSolidMass',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '无,有'
                            },
                            layout: '1/2',

                        },
                        {
                            label: '肿块类型',
                            key: 'breastCancerAuxiliaryExamination.rightSolidMassOption',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '单发,多发'
                            },
                            showDeps: {
                                'breastCancerAuxiliaryExamination.rightSolidMass': [1]
                            },
                            layout: '1/2',

                        },
                        {
                            label: '部位',
                            key: 'breastCancerAuxiliaryExamination.rightPosition',
                            required: isRequired,
                            inputType: 'Input',
                            layout: '1/3',
                            showDeps: {
                                'breastCancerAuxiliaryExamination.rightSolidMass': [1]
                            }
                        },
                        {
                            label: '象限法(可触及者)',
                            key: 'breastCancerAuxiliaryExamination.rightQuadrantMethod',
                            inputType: 'MC',
                            inputProps: {
                                options: '1,2,3,4',
                                type: 'multiple'
                            },
                            layout: '1/3',
                            showDeps: {
                                'breastCancerAuxiliaryExamination.rightSolidMass': [1]
                            }
                        },
                        {
                            label: '时钟法(不可触及者)',
                            key: 'breastCancerAuxiliaryExamination.rightClockMethod',
                            inputType: 'Input',
                            layout: '1/3',
                            showDeps: {
                                'breastCancerAuxiliaryExamination.rightSolidMass': [1]
                            }
                        },
                        {
                            label: '大小',
                            key: 'breastCancerAuxiliaryExamination.rightSize',
                            required: isRequired,
                            inputType: 'MArr',
                            inputProps: {
                                separator: 'x',
                                options: [
                                    { inputType: 'Input', suffix: 'mm' },
                                    { inputType: 'Input', suffix: 'mm' },
                                ]
                            },
                            layout: '1/3',
                            showDeps: {
                                'breastCancerAuxiliaryExamination.rightSolidMass': [1]
                            }
                        },
                        {
                            label: '形态',
                            key: 'breastCancerAuxiliaryExamination.rightForm',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '椭圆形,圆形,不规则,浅分叶'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '方向',
                            key: 'breastCancerAuxiliaryExamination.rightDirection',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '纵横比>=1,纵横比<1'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '边缘',
                            key: 'breastCancerAuxiliaryExamination.rightEdge',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '清晰,不清晰'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '肿块周围晕环',
                            key: 'breastCancerAuxiliaryExamination.rightPeripheralHalo',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '无,规则低回声,不规则高回声晕'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '内部回声性质',
                            key: 'breastCancerAuxiliaryExamination.rightInternalEchoProperty',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '低,等,高,极低回声'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '内部回声分布',
                            key: 'breastCancerAuxiliaryExamination.rightInternalEchoDistribution',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '均匀,不均匀'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '后方回声',
                            key: 'breastCancerAuxiliaryExamination.rightRearEcho',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '无变化,增强,侧方声影,衰减'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '肿块内钙化',
                            key: 'breastCancerAuxiliaryExamination.rightMassCalcificationNote',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                type: 'multiple',
                                options: '无,棒状,环状,沙粒状,簇状'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '血流',
                            key: 'breastCancerAuxiliaryExamination.rightBloodFlow',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '无,少许,丰富'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '腋淋巴结描述',
                            key: 'breastCancerAuxiliaryExamination.rightLymphDesc',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '无,正常影像,异常影像'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '分类',
                            key: 'breastCancerAuxiliaryExamination.rightClassify',
                            required: isRequired,
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '0类,1类,2类,3类,4类,5类'
                            },
                            layout: '1/2',
                        },
                    ]
                },

                {

                    "key": "breastCancerAuxiliaryExamination.other",
                    "label": "其他",
                    "inputType": "input",
                    layout: '1/1',
                },
                {
                    label: '建议',
                    key: 'breastCancerAuxiliaryExamination.suggestNote',
                    required: isRequired,
                    inputType: 'MC',
                    inputProps: {
                        type: 'multiple',
                        options: '定期检查,乳腺x线检查,活检'
                    },
                    layout: "1/2",
                },
                {
                    "label": "一键勾选",
                    "inputType": "check_invert_button",
                    inputPropsFn() {
                        return {
                            check_invert_values: get_check_invert_values([cache1])
                        }
                    },
                    layout: "1/2",
                }
            ]
        },
        cache2 = {

            "label": "乳腺x线检查",
            "children": [
                {
                    "label": "左乳",
                    children: [
                        {
                            label: '肿块',
                            key: 'breastCancerAuxiliaryExamination.leftPhyma',
                            inputType: 'MC',
                            inputProps: {
                                options: '无,有',
                                marshal: 0,
                            },
                            layout: '1/2',

                        },

                        {
                            label: '大小',
                            key: 'breastCancerAuxiliaryExamination.leftPhymaNote',
                            inputType: 'MArr',
                            inputProps: {
                                separator: 'x',
                                options: [
                                    { inputType: 'Input', suffix: 'mm' },
                                    { inputType: 'Input', suffix: 'mm' },
                                ]
                            },
                            layout: '1/2',
                            showDeps: {
                                'breastCancerAuxiliaryExamination.leftPhyma': [1]
                            }
                        },
                        {
                            label: '恶性或可疑钙化',
                            key: 'breastCancerAuxiliaryExamination.leftMalSusCalc',
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '无,有'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '结构紊乱',
                            key: 'breastCancerAuxiliaryExamination.leftStructuralDisorder',
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '无,有'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '部位',
                            key: 'breastCancerAuxiliaryExamination.leftOther',
                            inputType: 'MC',
                            inputProps: {
                                type: 'multiple',
                                options: '外上,外下,内上,内下象限,中央区,乳晕后,其他i'
                            },
                            layout: '1/1',
                        },
                        {
                            label: '分类',
                            key: 'breastCancerAuxiliaryExamination.leftXRaysClassify',
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '0类,1类,2类,3类,4类,5类'
                            },
                            layout: '1/1',
                        },
                    ]
                },
                {
                    "label": "右乳",
                    children: [
                        {
                            label: '肿块',
                            key: 'breastCancerAuxiliaryExamination.rightPhyma',
                            inputType: 'MC',
                            inputProps: {
                                options: '无,有',
                                marshal: 0,
                            },
                            layout: '1/2',

                        },

                        {
                            label: '大小',
                            key: 'breastCancerAuxiliaryExamination.rightPhymaNote',
                            inputType: 'MArr',
                            inputProps: {
                                separator: 'x',
                                options: [
                                    { inputType: 'Input', suffix: 'mm' },
                                    { inputType: 'Input', suffix: 'mm' },
                                ]
                            },
                            layout: '1/2',
                            showDeps: {
                                'breastCancerAuxiliaryExamination.rightPhyma': [1]
                            }
                        },
                        {
                            label: '恶性或可疑钙化',
                            key: 'breastCancerAuxiliaryExamination.rightMalSusCalc',
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '无,有'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '结构紊乱',
                            key: 'breastCancerAuxiliaryExamination.rightStructuralDisorder',
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '无,有'
                            },
                            layout: '1/2',
                        },
                        {
                            label: '部位',
                            key: 'breastCancerAuxiliaryExamination.rightOther',
                            inputType: 'MC',
                            inputProps: {
                                type: 'multiple',
                                options: '外上,外下,内上,内下象限,中央区,乳晕后,其他i'
                            },
                            layout: '1/1',
                        },
                        {
                            label: '分类',
                            key: 'breastCancerAuxiliaryExamination.rightXRaysClassify',
                            inputType: 'MC',
                            inputProps: {
                                marshal: 0,
                                options: '0类,1类,2类,3类,4类,5类'
                            },
                            layout: '1/1',
                        },
                    ]
                },
                {
                    label: '建议',
                    key: 'breastCancerAuxiliaryExamination.xraysSuggestNote',
                    inputType: 'MC',
                    layout: "2/3",
                    inputProps: {
                        type: 'multiple',
                        options: '定期检查,短期随访(6个月后复查乳腺x线),活检,其他i'
                    },
                },
                {
                    "label": "一键勾选",
                    "inputType": "check_invert_button",
                    inputPropsFn() {
                        return {
                            check_invert_values: get_check_invert_values([cache2])
                        }
                    },
                    layout: "1/3",
                }
            ]
        },
        cache3 = {

            "label": "组织病理学检查",
            "children": [

                {
                    label: '结果',
                    key: 'breastCancerAuxiliaryExamination.pathologyResultNote',
                    required: isRequired,
                    inputType: 'MC',
                    layout: "1/1",
                    inputProps: {
                        options: '未见异常,异常<良性疾病、不典型增生、小叶原位癌、导管原位癌、浸润性导管癌、浸润性小叶癌、其他乳腺恶性肿瘤>c',
                        sp: [{ label: '未见异常', exclusive: true }]
                    },
                },

            ]
        },
    ]
}

export function 乳房触检_config_建瓯() {
    const cache: IMchc_FormDescriptions_Field[] = [
        {

            "name": "乳房触检",
            "children": [
                {
                    label: '左乳',
                    children: [
                        {
                            "key": "breastCancerBreastPalpation.leftBreastSymptomsNote",
                            "label": "症状",
                            required: isRequired,
                            "inputType": "MC",
                            inputProps: {
                                inputWidth: 120,

                                options: '无,有',
                                sp: [{ label: '有', "inputType": "MC", parentheses: true, props: { type: 'multiple', options: '乳腺疼痛<周期性、非周期性>a,乳头溢液<血性、浆液性、其它>a' } }]
                            },
                            layout: '1/1',

                        },
                        {
                            "key": "breastCancerBreastPalpation.leftBreastSignsNote",
                            "label": "体征",
                            required: isRequired,
                            "inputType": "MC",
                            inputProps: {
                                type: 'multiple',
                                options: '未见异常,乳房肿块或团块i,不对称性增厚或结节,皮肤改变i,腋淋巴结肿大,其他i',
                                sp: [{ label: '未见异常', exclusive: true }, { label: '乳房肿块或团块', parentheses: true, prefix: '最大径', suffix: 'CM' }]
                            },
                            layout: '1/1',
                        },

                    ]
                },
                {
                    label: '右乳',
                    children: [
                        {
                            "key": "breastCancerBreastPalpation.rightBreastSymptomsNote",
                            "label": "症状",
                            required: isRequired,
                            "inputType": "MC",
                            inputProps: {
                                inputWidth: 120,

                                options: '无,有',
                                sp: [{ label: '有', "inputType": "MC", parentheses: true, props: { type: 'multiple', options: '乳腺疼痛<周期性、非周期性>a,乳头溢液<血性、浆液性、其它>a' } }]
                            },
                            layout: '1/1',
                        },
                        {
                            "key": "breastCancerBreastPalpation.rightBreastSignsNote",
                            required: isRequired,
                            "label": "体征",
                            "inputType": "MC",
                            inputProps: {
                                type: 'multiple',
                                options: '未见异常,乳房肿块或团块i,不对称性增厚或结节,皮肤改变i,腋淋巴结肿大,其他i',
                                sp: [{ label: '未见异常', exclusive: true }, { label: '乳房肿块或团块', parentheses: true, prefix: '最大径', suffix: 'CM' }]
                            },
                            layout: '1/1',
                        },


                    ]
                },

                {
                    "key": "breastCancerBreastPalpation.other",
                    "label": "临床检查结果",
                    required: isRequired,
                    "inputType": "MC",
                    inputProps: { options: '未见异常(阴性),阳性i' },
                    layout: '1/1',
                },
                {
                    "key": "breastCancerBreastPalpation.furtherExaminationNote",
                    "label": "进一步检查",
                    required: isRequired,
                    "inputType": "MC",
                    inputProps: { options: '否,是<乳腺彩超检查、乳腺x线检查、乳腺彩超和乳腺x线联合筛查、组织病理检查、其他i|1|multiple>c' },
                    layout: '1/1',
                },
                {
                    "label": "一键勾选",
                    inputType: 'check_invert_button',
                    inputPropsFn() {
                        return {
                            check_invert_values: get_check_invert_values(cache)
                        }
                    }
                }
            ]
        },
    ]
    return cache
}

function 病史情况_config_建瓯() {
    const isRequired = true

    const cache: IMchc_FormDescriptions_Field[] = [
        {
            label: '编号',
            key: 'breastCancerRecordNo',
            inputProps: {
                disabled: true
            },
            layout: '1/2',
        },
        {

            "name": "病史情况",
            "children": [
                {
                    "key": "breastCancerMedicalHistory.previousBreastScreening__",
                    "label": "既往接受乳腺癌筛查",
                    "inputType": "MC",
                    required: isRequired,
                    inputProps: {
                        // marshal: 0,
                        options:
                            [
                                { label: '否', value: 1 },
                                {
                                    label: '是', value: 2, inputType: 'MArr', props: {
                                        options: [
                                            { label: '最近一次筛查时间', inputType: 'DatePicker' },
                                            { label: '检查内容', inputType: 'MC', props: { options: '手诊,超声,x线,其他i,不详', type: 'multiple' } },
                                        ]
                                    }
                                }
                            ],
                    },
                    // layout: '1/1',
                },
                {
                    "key": "breastCancerMedicalHistory.breastSurgeryOrBiopsy__",
                    "label": "乳腺手术或活检史",
                    required: isRequired,
                    "inputType": "MC",
                    inputProps: {
                        options: [
                            { label: '无', value: 1 },
                            {
                                label: '有', value: 2, inputType: 'MArr', props: {
                                    options: [
                                        { inputType: 'Input', suffix: '次' },
                                        { inputType: 'MC', prefix: '病理结果', props: { options: '良性,恶性', marshal: 0 } },
                                    ]
                                }
                            }
                        ]
                    },
                    // layout: '1/1'
                },
                {
                    "key": "breastCancerMedicalHistory.hormoneReplacementTherapyHistory__",
                    "label": "激素替代治疗史",
                    "inputType": "MC",
                    required: isRequired,
                    inputProps: { options: [{ label: '无', value: 1 }, { label: '有', value: 2, inputType: 'Input', prefix: '用药时间', suffix: '年', parentheses: true }] },
                    // "specialConfig": { "type": "single", "options": [{ "value": 1, "label": "无", "span": 4, "withInput": false }, { "value": 2, "label": "有", "withInput": true, "isIssue": true, "span": 4, "inputSpan": 12, "placeholder": "请输入用药时长" }] },
                    // layout: '1/1',

                },

                {
                    "key": "breastCancerMedicalHistory.breastCancer",
                    "label": "乳腺癌家族史",
                    "inputType": "MC",
                    required: isRequired,
                    inputProps: {
                        options: '无,有<母亲、女儿、亲姐妹、其他i|1|multiple>c',
                        sp: [
                            {
                                label: '有',
                                prefix: '患者与自己的关系:',
                            }
                        ]
                    },
                    // layout: '1/1'
                },
                {
                    "key": "breastCancerMedicalHistory.ovarianCancer",
                    "label": "卵巢癌家族史",
                    "inputType": "MC",
                    required: isRequired,
                    inputProps: {
                        options: '无,有<母亲、女儿、亲姐妹、其他i|1|multiple>c',
                        sp: [
                            {
                                label: '有',
                                prefix: '患者与自己的关系:',
                            }
                        ]
                    },
                    // layout: '1/1'
                },
                {
                    inputType: 'check_invert_button',
                    label: '一键勾选',
                    inputPropsFn() {
                        return {
                            check_invert_values: get_check_invert_values(cache)
                        }
                    }
                }

            ]
        },

    ]
    return cache
}

function 诊断及指导_config_建瓯(): IMchc_FormDescriptions_Field[] {
    return [
        {
            "name": "最后诊断",
            "children": [
                {
                    label: '最后诊断',
                    key: 'breastCancerDiagnosisAndGuidance.finalDiagnosisNote',
                    inputType: 'MC',
                    required: isRequired,
                    inputProps: {
                        type: 'multiple',
                        options: '未见异常,良性疾病,不典型增生,小叶原位癌,导管原位癌,浸润癌<浸润性导管癌、浸润性小叶癌>c,其他恶性肿瘤i,部位<左、右>c',
                        sp: [{ label: '未见异常', exclusive: true }]
                    }
                },
                {
                    label: 'TNM分期',
                    children: [
                        {
                            label: '临床分期(cTNM)',
                            key: 'breastCancerDiagnosisAndGuidance.cTNM',
                            inputType: 'MC',
                            inputProps: {
                                options: '获得<0期、Ⅰ期、ⅡA期、ⅡB期、Ⅲ期以上|0>s,未获得',

                            }
                        },
                        {
                            label: '病理分期(pTNM)',
                            key: 'breastCancerDiagnosisAndGuidance.pTNM',
                            inputType: 'MC',
                            inputProps: {
                                options: '获得<0期、Ⅰ期、ⅡA期、ⅡB期、Ⅲ期以上|0>s,未获得',
                            }
                        },
                    ]
                }
            ]
        },
        {
            "name": "随访治疗情况",
            "children": [
                {
                    inputType: 'MC',
                    label: '随访情况',
                    key: 'breastCancerDiagnosisAndGuidance.followUpStatus',
                    required: isRequired,
                    inputProps: {
                        marshal: 0,
                        options: '已随访,失访'
                    },
                    layout: '1/2',
                },
                {
                    inputType: 'MC',
                    label: '乳腺癌患者接受治疗情况',
                    required: isRequired,
                    key: 'breastCancerDiagnosisAndGuidance.treatmentStatus',
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

        ...乳房触检_config_建瓯(),

        ...辅助检查_config_建瓯(),
        // ...(mchcEnv.in(['建瓯']) ? 建瓯增加_config() : []),
        ...诊断及指导_config_建瓯(),
    ],
    { remote_filter_key: 'BreastCancerScreening' }

)
