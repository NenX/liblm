import { OkButton } from '@lm_fe/components_m';
import { mchcEnv, mchcEvent } from '@lm_fe/env';
import { SLocal_Version } from '@lm_fe/service';
import React from 'react';

export function checkVersion() {
    if (__DEV__)
        return
    checkVersion_Inner()
}
let failedCount = 0;
let checkVersion_Inner = () => {
    SLocal_Version.checkVersion()
        .then((isNew) => {
            if (isNew) {
                newVersionHandler()
            }
        })
        .catch((e) => {
            if (++failedCount > 2) {
                checkVersion_Inner = () => { }
            }
        })

}
function newVersionHandler() {
    const key = `newVersionHandler`;
    const btn = (
        <OkButton style={{ cursor: 'pointer' }} onClick={() => location.reload()}>
            确定
        </OkButton>
    );
    mchcEvent.emit('notify',
        {
            type: 'success',
            message: '消息通知',
            description:
                '系统检测到新版本🚀，是否立即更新？',
            btn,
            key,
            duration: 2000,
            placement: 'bottomRight',
            onClose: close,
        }
    )



}