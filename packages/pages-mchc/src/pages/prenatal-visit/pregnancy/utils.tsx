import { rt_ctx } from "@lm_fe/env";
import { IMchc_FormDescriptions_Field } from "@lm_fe/service";
const ctx = rt_ctx
export const 门诊_胎儿_form: IMchc_FormDescriptions_Field = {

    "name": "fetusExam",
    "label": "",
    "inputType": "ArrayPanel",
    processRemote(v, form) {
        if (!Array.isArray(v) || v.length === 0) return [{}]
        return v
    },
    inputProps: {
        marshal: 0,
        targetLabelCol: 2,
        tip: '胎儿',
        formDescriptions: [
            // { layout: '1/5', inputType: 'MA', label: '胎动', name: 'fetalMovement', inputProps: { options: '正常,减少,增多,无,有,—', memorieskey: '' } },
            { layout: '1/5', inputType: 'MA', label: '胎动', name: 'fetalMovement', inputProps: { memorieskey: '胎动' } },
            { layout: '1/5', inputType: 'input_number', label: '胎心率', name: 'fetalHeartRate', inputProps: {} },
            { layout: '1/5', inputType: 'MA', label: '位置', name: 'position', inputProps: { options: ctx.mchcEnv.get_other_options('positonOptions') } },
            {
                layout: '1/5', inputType: 'MA', label: '胎方位', name: 'fetalPosition',
                inputProps: {
                    // optionKey: '胎方位22s'
                    memorieskey: '胎方位',
                }
            },
            { layout: '1/5', inputType: 'MA', label: '先露', name: 'presentation', inputProps: { optionKey: '先露s' } },
        ]
    },
    layout: '1/1',

}