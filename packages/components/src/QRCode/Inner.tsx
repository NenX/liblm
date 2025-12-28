import { QRCodeCanvas } from 'qrcode.react';
import React from 'react';
import { QRProps } from './types';

export default function QRCode(props: QRProps) {
    const { type = 'canvas', ...others } = props

    return <QRCodeCanvas {...props} />
}