import { LoadingPlaceholder, MyFormSectionForm, OkButton, PanelTitle } from '@lm_fe/components_m';
import { IMchc_FormDescriptions_Field_Nullable, SLocal_State } from '@lm_fe/service';
import {
    formatDate,
    getSearchParamsAll,
    getSearchParamsValue,
    //  fubaoRequest as
    request,
    sleep
} from '@lm_fe/utils';
import { Button, Form, Result } from 'antd';
import { get, set } from 'lodash';
import React, { useEffect, useState } from 'react';
import { load_form_config_women_exam_records } from '../form_config';
import { mchcLogger } from '@lm_fe/env';
import { BF_Wrap2, mchcModal__ } from '@lm_fe/pages';
import { 知情同意书_tab } from '../form_config/common';



export default (props: any) => {
    const id = getSearchParamsValue('id')
    const patientId = getSearchParamsValue('patientId')
    const [form] = Form.useForm()
    const [data, setData] = useState<any>()
    // const [config, setConfig] = useState<IMchc_FormDescriptions_Field_Nullable[]>()
    const [loading, setLoading] = useState(false)

    const { Wrap, config } = BF_Wrap2({ default_conf: { title: '妇女档案-健康检查', tableColumns: load_form_config_women_exam_records } })
    console.log('config', { config })
    async function fetch_data() {
        mchcLogger.log({ id, patientId })
        if (patientId) {
            return {
                gynecologicalPatient: (await request.get(`/api/gynecological-patients/${patientId}`)).data,
                archivistNo: SLocal_State.userData.id,
                archivist: SLocal_State.userData.firstName,
            }
        }
        if (id) {
            return (await request.get(`/api/gynecological-visits/${id}`)).data
        }
        if (__DEV__) {
            await sleep(2)
            return null
        }
        let login_res = await request.post<{ gynecologicalVisit: any }>(`/api/gynecological-patients/login`, getSearchParamsAll());
        return login_res.data?.gynecologicalVisit

    }
    useEffect(() => {

        setLoading(true)
        fetch_data()
            .then(async res => {
                mchcLogger.log('fetch', { res, form })
                set(res, 'visitDate', res?.visitDate ?? formatDate())
                set(res, 'doctorName', res?.doctorName ?? SLocal_State.userData?.login)

                setData(res)
                await sleep(1)
                form.setFieldsValue(res)
            })
            .finally(() => setLoading(false))
        return () => {

        }
    }, [])

    const h = [
        { title: '姓名', value: get(data, 'gynecologicalPatient.name') },
        { title: '年龄', value: get(data, 'gynecologicalPatient.age') },
        { title: '门诊号', value: get(data, 'gynecologicalPatient.outpatientNO') },
        // { title: '联系电话', value: get(data, 'gynecologicalPatient.telephone') },
    ]
    const empty_node = loading ? <LoadingPlaceholder /> : <Result status="warning" title="请到护士站报到" />
    return data ? <div style={{ background: '#fff', height: '100%', overflowY: 'scroll' }}>
        <PanelTitle headerItems={h} />
        <Wrap>
            <MyFormSectionForm
                style={{ paddingTop: 0 }}
                // defaultRequired
                form={form}
                formDescriptions={[...(config?.tableColumns ?? []), ...知情同意书_tab.__lazy_config]}
            />
        </Wrap>

        <div style={{ height: 40, margin: 12 }}>
            <Button.Group style={{ float: 'right' }}>
                <OkButton primary size='large'
                    onClick={() => {
                        const values = form.getFieldsValue()
                        const gynecologicalPatient = Object.assign({}, data.gynecologicalPatient, values.gynecologicalPatient)
                        const submitData = Object.assign({}, data, form.getFieldsValue(), { gynecologicalPatient })
                        const p = data?.id
                            ? request.put('/api/gynecological-visits', submitData, { successText: '操作成功！' })
                            : request.post('/api/gynecological-visits', submitData, { successText: '操作成功！' })
                        p.then(res => setData(res.data))

                    }}
                >保存</OkButton>
                <OkButton primary size='large'
                    onClick={() => {
                        mchcModal__.open('print_modal', {
                            modal_data: {
                                requestData: {
                                    url: '/api/gynecological-visits/print',
                                    id: data?.id
                                }
                            }
                        })

                    }}
                >打印</OkButton>
            </Button.Group>
        </div>
    </div> : empty_node
}
