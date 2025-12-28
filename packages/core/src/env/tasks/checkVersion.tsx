import { SLocal_Version } from '@lm_fe/service';

export function checkVersion() {
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
    import('antd/es/notification').then(res => {
        const notification = res.default

        notification.close(key)
        const btn = (
            <button style={{ cursor: 'pointer' }} onClick={() => location.reload()}>
                确定
            </button>
        );
        notification.success({
            message: '消息通知',
            description:
                '系统检测到新版本🚀，是否立即更新？',
            btn,
            key,
            duration: 2000,
            placement: 'bottomRight',
            onClose: close,
        });
    })

}