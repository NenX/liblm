import { IGlobalModalProps } from '@lm_fe/components';
import { IMchc_TableConfig } from '@lm_fe/service';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { BF_Form, IBF_Form_Props } from '../../../components/BF_Form';

export default function FormChrono({ modal_data, visible, onCancel, props, ...others }: IGlobalModalProps<IBF_Form_Props>) {
    const { title, history_args } = modal_data
    const [config, setConfig] = useState<IMchc_TableConfig>()



    useEffect(() => {
        return () => {

        }
    }, [])
    return (
        <Modal

            visible={visible}
            title="Test"
            width={1000}
            footer={null}
            onCancel={onCancel}
            style={{ top: '20px' }}
            destroyOnClose
            {...others}

        >
            <BF_Form title={title} history_args={history_args} />
        </Modal>
    );
};