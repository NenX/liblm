import { IGlobalModalProps } from '@lm_fe/components';
import { TIdTypeCompatible } from '@lm_fe/service';
import { request, safe_async_call } from '@lm_fe/utils';
import { Form, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { form_config } from './form_config';
import { mchcLogger } from '@lm_fe/env';
import { MyFormSectionForm, OkButton } from '@lm_fe/components_m';
import { mchcModal__ } from '@lm_fe/pages';
interface IProps {
    twoCancerScreeningId: TIdTypeCompatible
}


function Test({ modal_data, visible, onCancel, close, ...others }: IGlobalModalProps<IProps>) {
    const { twoCancerScreeningId, } = modal_data

    const [form] = Form.useForm()
    const [recordData, setRecordData] = useState()

    useEffect(() => {
        if (twoCancerScreeningId) {
            request.get(`/api/two/cancer/followup/getTwoCancerFollowupCaseByTwoCancerId?twoCancerScreeningId=${twoCancerScreeningId}`, { unboxing: true, ignore_usr: true })

                .then(r => {
                    mchcLogger.log('两癌随访', r.data)

                    setRecordData(r.data)
                })
        }

        return () => {

        }
    }, [twoCancerScreeningId])







    return (
        <Modal
            {...others}

            visible={visible}
            width={'80%'}
            onCancel={onCancel}
            style={{ top: '20px' }}
            bodyStyle={{ height: '80vh', overflowY: 'scroll' }}
            destroyOnClose
            className="diag-record-modal"
            onOk={async () => {
                const values = form.getFieldsValue()
                const data: any = Object.assign({ twoCancerScreeningId }, recordData, values)

                try {
                    if (data.id) {
                        await request.put(`/api/two/cancer/followup/twoCancerFollowupCase`, data, { successText: '操作成功', ignore_usr: true })
                    } else {
                        close?.(true)
                        await request.post(`/api/two/cancer/followup/twoCancerFollowupCase`, data, { successText: '操作成功', ignore_usr: true })
                    }
                    close?.(true)

                } catch (error) {

                }




            }}
            title="两癌随访"


        >
            <MyFormSectionForm
                formName='两癌随访'
                size='small'
                style={{ paddingBottom: 128 }}
                data={recordData}
                form={form}
                targetLabelCol={3}
                onValuesChange={(a, b) => {
                    mchcLogger.log('两癌随访', a, b)
                }}
                formDescriptions={form_config}
            />
        </Modal>
    );

};


const opt_url = '/api/two/cancer/followup/twoCancerFollowupCase'

export function Follow_up_btn(props: { handleSearch: () => void, rowData: any }) {
    const { handleSearch, rowData = {} } = props
    const { id, } = rowData

    async function showView() {
        let record = await request.get(`/api/two/cancer/followup/getTwoCancerFollowupCaseByTwoCancerId`,
            { params: { twoCancerScreeningId: id, }, unboxing: true, ignore_usr: true }
        )

        mchcModal__.open('modal_form', {
            modal_data: {
                formDescriptions: form_config,
                getInitialData() {
                    return record.data
                },
                async onSubmit(data) {
                    let fn = data.id ? request.put : request.post
                    await fn(opt_url, data, { successText: '操作成功', ignore_usr: true })

                    safe_async_call(handleSearch)


                },
            }
        })
    };

    return <OkButton size="small" onClick={showView}>随访</OkButton>
}
