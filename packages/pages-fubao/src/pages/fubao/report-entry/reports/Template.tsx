import { BF_Wrap2 } from "@lm_fe/pages"
import React, { useEffect, useState } from "react"
import { IReportType, ITplConf } from "./types"
import { MyFormSectionForm, OkButton } from "@lm_fe/components_m"
import { Button, Col, Empty, Form, FormInstance, Row } from "antd"

export function Template(props: { data?: IReportType, form: FormInstance, disabled?: boolean, deptLink: string }) {
    const { data, form, deptLink, disabled } = props
    if (!deptLink)
        return <span>未能确定 deptLink，请联系管理员</span>
    const conf_fn = () => import('./template_form_config')
    const [cur_tmp, setCur_tmp] = useState<ITplConf>()
    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: `报告录入-模板-${deptLink}`,
            tableColumns: conf_fn,

        }
    })
    const tpl_conf: ITplConf[] = config?.tableColumns ?? []
    useEffect(() => {
        if (data) {
            const cur = tpl_conf.find(_ => _.tpl_values.suitNO === data.suitNO)
            if (cur) {
                cur.tpl_values = data
                pick_tmp(cur)

            }
        } else {
            pick_tmp(tpl_conf[0])

        }
        // if (data && tpl_conf) {
        //     const cur = tpl_conf.find(_ => _.tpl_values.suitNO === data.suitNO)
        //     if (cur) {
        //         cur.tpl_values = data
        //         pick_tmp(cur)

        //     }
        // }

        return () => {

        }
    }, [data, tpl_conf])
    function pick_tmp(c?: ITplConf) {
        if (!c) return
        form.resetFields()
        setCur_tmp(c)
        form.setFieldsValue(c.tpl_values)
    }
    return <Wrap>
        <Row>
            <Col span={2}>请选择组套</Col>
            <Col span={20}>
                {
                    tpl_conf.map(c => {
                        const is_cur = cur_tmp?.tpl_name === c.tpl_name
                        const is_frozen = is_cur ? false : (disabled || !!data?.id)
                        return <Button
                            disabled={is_frozen}
                            size='small'
                            onClick={() => pick_tmp(c)}
                            type={is_cur ? 'primary' : 'dashed'}
                            key={c.tpl_name}
                        >
                            {c.tpl_name}
                        </Button>
                    })
                }
            </Col>
        </Row>
        {
            cur_tmp ? <MyFormSectionForm disableAll={disabled} form={form} formDescriptions={cur_tmp?.tpl_form} /> : <Empty description='请选择模板' />
        }

    </Wrap>
}