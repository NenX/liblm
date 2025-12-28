import { mchcStore, rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";


const ctx = rt_ctx
const React = rt_ctx.React
export const search_config = defineFormConfig([
    { label: '评定日期', name: 'eventDate', inputType: 'rangeDate' },
    { label: '预产期', name: 'edd', inputType: 'rangeDate' },
    { label: '预产期B超', name: 'sureEdd', inputType: 'rangeDate' },

    {
        label: '孕期状态', name: 'periodState', inputType: 'MS',
        inputProps: { optionKey: '孕期状态' }
    },
    {
        label: '高危等级', name: 'highriskGrade', inputType: 'MS',
        inputProps: {
            type: 'tags',
            options: mchcStore.highriskGradeConfig.map(_ => ({ label: _.colorText, value: _.label }))
        }
    },
    {
        label: '传染病', name: 'infectionNote', inputType: 'MS',
        inputProps: {
            type: 'tags',
            options: mchcStore.highriskContagionConfig.options
        }
    },


    { label: '高危因素', name: 'highriskNote', inputType: 'Input' },

    { label: '姓名', name: 'name', inputType: 'Input' },
    { label: '居住地址', name: 'permanentResidenceAddress', inputType: 'Input' },
])