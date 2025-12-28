import { Modal } from 'antd';
import React, { ReactNode } from 'react'
import { IGlobalModalProps } from '@lm_fe/components';
export interface Iprops {
    content: ReactNode
}
export default function Test({ modal_data, visible, onCancel, ...others }: IGlobalModalProps<Iprops>) {
    const { content } = modal_data

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
            {content}
        </Modal>
    );
};