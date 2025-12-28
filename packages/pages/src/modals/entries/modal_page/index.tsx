import { CloseOutlined, ExportOutlined, FullscreenOutlined } from '@ant-design/icons';
import { IGlobalModalProps } from '@lm_fe/components';
import { MyLazyComponent } from '@lm_fe/components_m';
import { mchcEnv, mchcLogger, mchcRouterContainer__ } from '@lm_fe/env';
import { AnyObject, getHappyConfig, sleep } from '@lm_fe/utils';
import { Button, message, Modal } from 'antd';
import React, { ReactNode, useEffect, useRef, useState, } from 'react';
import styles from './index.module.less';
export interface Iprops {
    content?: ReactNode
    iframe_url?: string
    route_conf?: { url: string, params?: AnyObject }
}
export default function Modal_Page({ modal_data, close, ...others }: IGlobalModalProps<Iprops>) {
    const { content, iframe_url, route_conf, } = modal_data
    const [visible, setVisible] = useState(false)
    const el = useRef<HTMLDivElement>(null)

    useEffect(() => {

        (async () => {
            await sleep(.8)
            setVisible(true)
        })()

        return () => {

        }
    }, [])
    useEffect(() => {

        mchcLogger.log('moda_page', modal_data)


        if (route_conf?.url) {
            const happy_conf = getHappyConfig(route_conf.url!)
            mchcEnv.push_global_cache('happy_conf', happy_conf || { usr1: 'unset' })

        }

        return () => {
            if (route_conf?.url) {
                mchcEnv.pop_global_cache('happy_conf')
            }
        }
    }, [])

    async function fullscreen() {
        message.info('按 Esc 退出全屏');
        await sleep(.6)
        el.current?.requestFullscreen?.()
    }

    function render_content() {
        if (content) return content

        if (route_conf) {
            const params = route_conf.params || {}
            const C = mchcRouterContainer__.get_addon_component(route_conf.url)
            if (!C)
                return <div style={{ textAlign: 'center', lineHeight: '48px', height: 48 }}>{route_conf.url} 该页面不支持弹窗访问，请返回！ </div>

            return <C {...params} is_modal />
        }

        if (iframe_url) {
            return <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <iframe width="100%" height="100%" style={{ border: 'none', padding: 0, margin: 0 }} src={iframe_url} />
                <Button style={{ position: 'absolute', right: 24, bottom: 24, boxShadow: '#444 4px 4px 12px 2px' }} size='large' type="primary" shape='circle' icon={<ExportOutlined />} onClick={() => mchcEnv.open(iframe_url)} />
            </div>
        }
        return <div style={{ textAlign: 'center', lineHeight: '48px', height: 48 }}>请设置 content、route_conf 或者 iframe_url</div>
    }
    const node = render_content()
    return (
        <Modal
            // className={styles['modal-page']}
            wrapClassName={styles['modal-page']}
            title="页面1"
            width={'90vw'}
            footer={null}
            style={{ top: '4px' }}
            destroyOnClose

            bodyStyle={{ height: '88vh', background: '#fff', padding: 0 }}
            {...others}
            maskClosable

        >
            <>
                <Button.Group size='large' className={styles['btn-containner']}>
                    <Button title='全屏' icon={<FullscreenOutlined />} onClick={fullscreen} />
                    <Button title='关闭' icon={<CloseOutlined />} onClick={(e) => close?.(true)} />
                </Button.Group >
                <MyLazyComponent>
                    <div ref={el} style={{ background: '#fff', height: '100%', padding: 8 }}>
                        {
                            node
                        }
                    </div>
                </MyLazyComponent>
            </>

        </Modal>
    );
};