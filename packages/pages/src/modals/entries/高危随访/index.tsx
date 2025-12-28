import { IGlobalModalProps } from '@lm_fe/components';
import { TIdTypeCompatible } from '@lm_fe/service';
import { request } from '@lm_fe/utils';
import { Form, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { form_config } from './form_config';
import { mchcLogger } from '@lm_fe/env';
import { MyFormSectionForm } from '@lm_fe/components_m';
interface IProps {
    pregnancyId: TIdTypeCompatible
}
export default function Test({ modal_data, visible, onCancel, close, ...others }: IGlobalModalProps<IProps>) {
    const { pregnancyId, } = modal_data

    const [form] = Form.useForm()
    const [recordData, setRecordData] = useState()

    useEffect(() => {
        if (pregnancyId) {
            request.get(`/api/highrisk/getFollowupCaseByPregnancyId?pregnancyId=${pregnancyId}`, { unboxing: true }).then(r => {
                mchcLogger.log('高危随访', r.data)

                setRecordData(r.data)
            })
        }

        return () => {

        }
    }, [pregnancyId])







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
                const data: any = Object.assign({ pregnancyId }, recordData, values)
                mchcLogger.log('高危随访', data)

                try {
                    if (data.id) {
                        await request.put(`/api/highrisk/updateFollowupCase`, data, { successText: '操作成功' })
                    } else {
                        close?.(true)
                        await request.post(`/api/highrisk/addFollowupCase`, data, { successText: '操作成功' })
                    }
                    close?.(true)

                } catch (error) {

                }




            }}
            title="高危随访"


        >
            <MyFormSectionForm
                formName='高危随访'
                size='small'
                style={{ paddingBottom: 128 }}
                data={recordData}
                form={form}
                targetLabelCol={3}
                onValuesChange={(a, b) => {
                    mchcLogger.log('高危随访', a, b)
                }}
                formDescriptions={form_config}
            />
        </Modal>
    );

};