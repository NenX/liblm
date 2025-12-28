import { ModalProps } from 'antd';
import Modal from 'antd/es/modal';
import 'antd/es/modal/style';
import React from 'react';

export default function LazyInner(props: ModalProps) {
    return <Modal {...props} />
}