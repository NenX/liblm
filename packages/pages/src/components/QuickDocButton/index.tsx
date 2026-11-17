import { MyIcon, OkButton } from '@lm_fe/components_m'
import { mchcEnv } from '@lm_fe/env'
import { IMchc_Pregnancy, SLocal_Calculator } from '@lm_fe/service'
import { getSearchParamsAll, request } from '@lm_fe/utils'
import { ButtonProps } from 'antd'
import { get, keys } from 'lodash'
import React from 'react'
import { mchcModal__ } from 'src/modals'
import { form_config, fubao_form_config } from './form_config'

type TPageType = '单页' | '妇保单页' | '非单页'

export interface QuickDocButtonProps extends Omit<ButtonProps, 'form'> {
    page_type: TPageType
}

export function quick_doc(page_type: TPageType, onSubmit = (data: IMchc_Pregnancy) => {}) {
    const single = page_type === '单页'

    mchcModal__.open('modal_form', {
        title: `${page_type}快捷建档`,
        modal_data: {
            bf_title: `门诊-快捷建档${single ? '' : '非单页'}`,
            async getInitialData() {
                if (!single) return {}
                const res = await request.post('/api/doctor/initPregnancyForQuickDocument', getSearchParamsAll(), {
                    unboxing: true,
                })
                return res.data
            },
            async onValuesChange(changedValues, values, form) {
                // const __key = keys(changedValues)[0]
                // const is末次月经 = __key === 'lmp'
                // if (is末次月经) {
                //     const lmp = get(changedValues, 'lmp');
                //     const { edd, sureEdd, gestationalWeek } = await SLocal_Calculator.lmp_计算_edd_gestationalWeek(lmp);
                //     console.log({ edd, sureEdd, gestationalWeek })
                //     form.setFieldsValue({
                //         edd,
                //         sureEdd,
                //         gestationalWeek,
                //     });
                // }
            },
            async onSubmit(v) {
                const data = Object.assign(v, {
                    fileType: single ? 1 : 2,
                })
                const res = await request.post('/api/pregnancies', data, { successText: '操作成功' })
                if (single) {
                    setTimeout(mchcEnv.reload, 1000)
                } else {
                    onSubmit(res.data)
                    return true
                }
            },
            formDescriptions: form_config,
        },
    })
}

export function quick_doc_fubao(page_type: TPageType, onSubmit = (data: IMchc_Pregnancy) => {}) {
    const single = page_type === '妇保单页'
    const title = '妇女月经病'

    mchcModal__.open('modal_form', {
        title: `${title}快捷建档`,
        width: '1200px',
        okText: "保存并审核改档案",
        modal_data: {
            bf_title: `${title}-快捷建档`,
            async getInitialData() {
                if (!single) return {}
                const res = await request.post('/api/doctor/initPregnancyForQuickDocument', getSearchParamsAll(), {
                    unboxing: true,
                })
                return {
                    ...res.data,
                    outpatientNo: get(res, 'data.outpatientNO'),
                }
            },
            async onValuesChange(changedValues, values, form) {
                // const __key = keys(changedValues)[0]
                // const is末次月经 = __key === 'lmp'
                // if (is末次月经) {
                //     const lmp = get(changedValues, 'lmp');
                //     const { edd, sureEdd, gestationalWeek } = await SLocal_Calculator.lmp_计算_edd_gestationalWeek(lmp);
                //     console.log({ edd, sureEdd, gestationalWeek })
                //     form.setFieldsValue({
                //         edd,
                //         sureEdd,
                //         gestationalWeek,
                //     });
                // }
            },
            async onSubmit(v) {
                const data = Object.assign(v, {
                    fileState: 1,
                })

                // await request.post('/api/family/planning/addFamilyPlanningFile', submit_values)
                const res = await request.post('/api/family/planning/addFamilyPlanningFile', data, {
                    successText: '操作成功',
                })
                if (single) {
                    setTimeout(mchcEnv.reload, 1000)
                } else {
                    onSubmit(res.data)
                    return true
                }
            },
            formDescriptions: fubao_form_config,
        },

    })
}

export function QuickDocButton(props: QuickDocButtonProps) {
    const { page_type } = props

    const handleOk = () => {
        if (page_type === '妇保单页') {
            return quick_doc_fubao(page_type)
        }
        quick_doc(page_type)
    }

    return (
        <OkButton primary icon={<MyIcon value="UserAddOutlined" />} {...props} onClick={handleOk}>
            快捷建档
        </OkButton>
    )
}
