import { rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
import { AnyObject } from "@lm_fe/utils";
const React = rt_ctx.React
const mchcEnv = rt_ctx.mchcEnv

export default defineFormConfig([
          { label: '分娩日期', name: 'labourDate', inputType: 'rangeDate' },
          { label: '姓名', name: 'admissionCriteria.name', inputType: 'Input' },
          { label: '证件号码', name: 'admissionCriteria.idNO', inputType: 'Input' },
        ])
