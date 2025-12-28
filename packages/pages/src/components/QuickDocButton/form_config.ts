import { rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
const ctx = rt_ctx
export default defineFormConfig(
    [
        { label: '证件类型', name: 'idType', required: () => ctx.required, inputType: 'MS', inputProps: { optionKey: '证件类型', marshal: 0 }, layout: '1/3' },
        { label: '证件号码', name: 'idNO', required: () => ctx.required, inputType: 'Input', inputProps: {}, layout: '1/3' },
        { label: '就诊卡号', name: 'outpatientNO', required: () => ctx.required, inputType: 'Input', inputProps: {}, layout: '1/3' },
        { label: '姓名', name: 'name', required: () => ctx.required, inputType: 'Input', inputProps: {}, layout: '1/3' },
        { label: '手机号码', name: 'telephone', required: () => ctx.required, inputType: 'Input', inputProps: {}, layout: '1/3' },
        { label: '末次月经', name: 'lmp', required: () => ctx.required, inputType: 'DatePicker', inputProps: {}, layout: '1/3' },
        { label: '预产期-日期', name: 'edd', required: () => ctx.required, inputType: 'DatePicker', inputProps: {}, layout: '1/3' },
        { label: '预产期-B超', name: 'sureEdd', required: () => ctx.required, inputType: 'DatePicker', inputProps: {}, layout: '1/3' },
        { label: '孕周', name: 'gestationalWeek', required: () => ctx.required, inputType: 'Input', inputProps: {}, layout: '1/3' },
        { label: '分娩日期', name: 'deliveryDate', inputType: 'DatePicker', inputProps: {}, layout: '1/3' },
        { label: 'appId', name: 'appId', inputType: 'Input', inputProps: { disabled: true }, layout: '1/3', form_hidden: true },
        { label: 'empId', name: 'empId', inputType: 'Input', inputProps: { disabled: true }, layout: '1/3', form_hidden: true },
        { label: 'patId', name: 'patId', inputType: 'Input', inputProps: { disabled: true }, layout: '1/3', form_hidden: true },
    ]

)