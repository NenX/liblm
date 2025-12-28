import { getPresetOptions, mchcEnv } from "@lm_fe/env";
import { IMchc_FormDescriptions_Field_Nullable } from "@lm_fe/service";

const trueFalseOptions = [{ value: false, label: '否', }, { value: true, label: '是', inputType: 'Input' }]



export function 既往史_pack(isPure = false, needOther = false) {
    const required = isPure && !mchcEnv.in(['广州市八'])
    const res = [
        {
            "key": `${isPure ? '' : 'pregnancyInfo.'}hypertension__`,
            "label": "高血压",
            "inputType": "MC",
            required: required,
            "inputProps": { marshal: 1, options: trueFalseOptions },

            layout: '1/3',
        },
        {
            // "key": "pregnancyInfo.diabetes__",
            "key": `${isPure ? '' : 'pregnancyInfo.'}diabetes__`,
            required: required,

            "label": "糖尿病",

            "inputType": "MC",
            "inputProps": { marshal: 1, options: trueFalseOptions },

            layout: '1/3',
        },
        {
            // "key": "pregnancyInfo.cardiacDisease__",
            "key": `${isPure ? '' : 'pregnancyInfo.'}cardiacDisease__`,

            required: required,

            "label": "心脏病",
            "inputType": "MC",
            "inputProps": { marshal: 1, options: trueFalseOptions },

            layout: '1/3',
        },
        nurse_既往史_结核(isPure),
        nurse_既往史_肝炎(isPure),
        nurse_既往史_肾病(isPure),
        nurse_既往史_甲亢(isPure),
        nurse_既往史_性病(isPure),
        {
            // "key": "pregnancyInfo.infection__",
            "key": `${isPure ? '' : 'pregnancyInfo.'}infection__`,

            "label": "传染病",
            required: required,
            isActive: mchcEnv.in(['广三']),

            "inputType": "MC",
            "inputProps": { marshal: 1, options: trueFalseOptions },

            layout: '1/3',
        },
        {
            // "key": "pregnancyInfo.operationmh__",  
            "key": `${isPure ? '' : 'pregnancyInfo.'}${isPure ? 'operationHistory__' : 'operationmh__'}`,

            "label": "手术史",
            required: required || mchcEnv.in(['广三']),

            "inputType": "MC",
            "inputProps": { marshal: 1, options: trueFalseOptions },

            layout: '1/3',
        },
        {
            // "key": "pregnancyInfo.transfusionHistory__",
            "key": `${isPure ? '' : 'pregnancyInfo.'}transfusionHistory__`,

            "label": "输血史",

            "inputType": "MC",
            required: required,

            "inputProps": { marshal: 1, options: trueFalseOptions },

            layout: '1/3',
        },
        {
            // "key": "pregnancyInfo.amh__", 
            "key": `${isPure ? '' : 'pregnancyInfo.'}${isPure ? 'allergy__' : 'amh___'}`,

            required: required || mchcEnv.in(['广三']),

            "label": "过敏史",
            "inputType": "MC",

            "inputProps": {
                marshal: 1, options: '无,药物i,食物i,其他i,不详', type: 'multiple',
                sp: [{
                    label: '药物', inputType: 'Select', props: {
                        mode: 'multiple',
                        marshal: 0,
                        options: getPresetOptions('过敏药物s')
                    }
                }]
            },
            layout: '1/1',
        },
    ]
    if (needOther) {
        res.push(nurse_既往史_其他(isPure))
    }
    return res
}






export function nurse_既往史_结核(isPure = false): IMchc_FormDescriptions_Field_Nullable {
    return {
        // "key": "pregnancyInfo.tuberculosis__",
        "key": `${isPure ? '' : 'pregnancyInfo.'}tuberculosis__`,
        isActive: mchcEnv.in(['广三']),
        required: isPure,
        "label": "结核",

        "inputType": "MC",
        "inputProps": { marshal: 1, options: trueFalseOptions },

        layout: '1/3',
    }
}
export function nurse_既往史_肝炎(isPure = false): IMchc_FormDescriptions_Field_Nullable {
    return {
        // "key": "pregnancyInfo.hepaticDisease__",
        "key": `${isPure ? '' : 'pregnancyInfo.'}hepaticDisease__`,

        "label": "肝炎",
        required: isPure,
        isActive: mchcEnv.in(['广三']),

        "inputType": "MC",
        "inputProps": { marshal: 1, options: trueFalseOptions },

        layout: '1/3',
    }
}
export function nurse_既往史_肾病(isPure = false): IMchc_FormDescriptions_Field_Nullable {
    return {
        // "key": "pregnancyInfo.nephropathy__",
        "key": `${isPure ? '' : 'pregnancyInfo.'}nephropathy__`,
        required: isPure,

        "label": "肾病",
        isActive: mchcEnv.in(['广三']),

        "inputType": "MC",
        "inputProps": { marshal: 1, options: trueFalseOptions },

        layout: '1/3',
    }
}
export function nurse_既往史_甲亢(isPure = false): IMchc_FormDescriptions_Field_Nullable {
    return {
        // "key": "pregnancyInfo.thyroidDisease__",
        "key": `${isPure ? '' : 'pregnancyInfo.'}thyroidDisease__`,
        required: isPure,

        "label": "甲亢",
        isActive: mchcEnv.in(['广三']),

        "inputType": "MC",
        "inputProps": { marshal: 1, options: trueFalseOptions },

        layout: '1/3',
    }
}
export function nurse_既往史_性病(isPure = false): IMchc_FormDescriptions_Field_Nullable {
    return {
        // "key": "pregnancyInfo.std__",
        "key": `${isPure ? '' : 'pregnancyInfo.'}std__`,
        required: isPure,

        "label": "性病",
        isActive: mchcEnv.in(['广三']),

        "inputType": "MC",
        "inputProps": { marshal: 1, options: trueFalseOptions },

        layout: '1/3',
    }
}

export function nurse_既往史_其他(isPure = false): IMchc_FormDescriptions_Field_Nullable {
    return {

        // "key": "pregnancyInfo.otherNote",
        "key": `${isPure ? '' : 'pregnancyInfo.'}otherNote`,


        "label": "其他",
        "inputType": 'text_area',
        isNewRow: 1,
        layout: '2/3',
    }
}
