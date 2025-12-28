import { Button } from "antd";
import React, { FC, useEffect, useState } from "react";
import { ReloadOutlined, CoffeeOutlined, GlobalOutlined, QuestionOutlined, SettingOutlined } from '@ant-design/icons';
import styles from './ReloadButton.module.less'
import { mchcConfig, mchcEnv } from "@lm_fe/env";
import { OkButton } from "@lm_fe/components_m";
import { mchcModal__ } from "@lm_fe/pages";
export const ReloadButton: FC = (props) => {
    const [show, setShow] = useState<boolean>()
    const handleOpenModal = (url: string) => {
        mchcModal__.open('modal_page', {
            modal_data: {
                route_conf: { url }
            }
        });
    };
    useEffect(() => {

        setTimeout(() => {
            
            if (mchcConfig.get('顶部工具栏隐藏') || !mchcEnv.token) return

            setShow(true)
        }, 600);
        return () => {

        }
    }, [])

    return <div
        className={styles['wrap']}
        hidden={!show}
    >
        <div className={styles['tools']} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button.Group>
                <OkButton
                    title="系统配置"
                    size='small'
                    type='primary'
                    onClick={() => handleOpenModal('/system-config')}

                    icon={<SettingOutlined />}>
                    系统配置
                </OkButton>
                <OkButton
                    title="刷新缓存"
                    onClick={() => { }}
                    size='small'
                    type='primary'
                    icon={<CoffeeOutlined />}>
                    刷新缓存
                </OkButton>
                <OkButton
                    title="知识库"
                    onClick={() => handleOpenModal('/my-knowledge/list')}
                    size='small'
                    type='primary'
                    icon={<QuestionOutlined size={12} />}>
                    知识库
                </OkButton>
                <OkButton
                    title="孕册管理"
                    onClick={() => handleOpenModal('/prenatal-visit/pregnancy/list')}
                    size='small'
                    type='primary'
                    icon={<GlobalOutlined size={12} />}>
                    孕册管理
                </OkButton>
                <OkButton
                    title="重新进入"
                    onClick={() => mchcEnv.reload()}
                    size='small'
                    type='primary'
                    icon={<ReloadOutlined size={12} />}>
                    重新进入
                </OkButton>


            </Button.Group>

        </div>

        <div className={styles['pull']} style={{}}>
            <span className={styles['pull-icon']} style={{ color: '#fff' }} >
                —
            </span>
        </div>
    </div>

}