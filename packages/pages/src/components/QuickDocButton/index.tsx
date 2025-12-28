import { UserAddOutlined } from "@ant-design/icons";
import { OkButton, useMyEffectSafe } from "@lm_fe/components_m";
import { mchcDriver, mchcEnv } from "@lm_fe/env";
import { SLocal_Calculator } from "@lm_fe/service";
import { getSearchParamsAll, request, set } from "@lm_fe/utils";
import { ButtonProps } from "antd";
import { get, keys } from "lodash";
import React from "react";
import { mchcModal__ } from "src/modals";

export interface QuickDocButtonProps extends ButtonProps {
    page_type: '单页' | '非单页'
}



export function QuickDocButton(props: QuickDocButtonProps) {
    const { page_type } = props
    const single = page_type === '单页'


    function quick_doc() {
        mchcModal__.open('modal_form', {

            title: `${page_type}快捷建档`,
            modal_data: {

                bf_title: `门诊-快捷建档${single ? '' : '非单页'}`,
                async getInitialData() {
                    if (!single) return {}
                    const res = await request.post('/api/doctor/initPregnancyForQuickDocument', getSearchParamsAll(), { unboxing: true })
                    return res.data
                },
                async onValuesChange(changedValues, values, form) {
                    const __key = keys(changedValues)[0]
                    const is末次月经 = __key === 'lmp'
                    if (is末次月经) {
                        const lmp = get(changedValues, 'lmp');
                        const { edd, sureEdd, gestationalWeek } = await SLocal_Calculator.lmp_计算_edd_gestationalWeek(lmp);
                        console.log({ edd, sureEdd, gestationalWeek })
                        form.setFieldsValue({
                            edd,
                            sureEdd,
                            gestationalWeek,
                        });
                    }
                },
                async onSubmit(v) {

                    await request.post('/api/pregnancies', set(v, 'fileType', single ? 1 : 2), { successText: '操作成功' })
                    if (single) {
                        setTimeout(mchcEnv.reload, 1000)
                    } else {
                        return true
                    }

                },
                formDescriptions: () => import('./form_config')
            }
        })
    };
    return (
        <OkButton primary icon={<UserAddOutlined />} onClick={quick_doc}>快捷建档</OkButton>
    );
}
