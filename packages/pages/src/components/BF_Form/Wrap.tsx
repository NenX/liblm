import { LazyAntd, LoadingPlaceholder, MyLazyComponent, OkButton } from '@lm_fe/components_m';
import { SLocal_State } from '@lm_fe/service';
import { Menu, Result } from 'antd';
import React, { FC, ReactNode, useMemo } from 'react';
import { ErrorBoundarySmall } from '../exception/ErrorBoundarySmall';
import { IBF_props, use_table_config } from './use_table_config';
import styles from './wrap.module.less';
import { BuildOutlined } from '@ant-design/icons';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


export function BF_Wrap2(setting: IBF_props & {}, props?: any) {

    const { config, edit_config, init_config, loading, recover_config } = use_table_config(setting, props)
    const Wrap = useMemo<FC<{ style?: React.CSSProperties, children?: ReactNode }>>(
        () => ({ children, style = {} }) => {
            if (loading) return <LoadingPlaceholder />
            const menu = (
                <Menu>
                    <Menu.Item onClick={() => edit_config()}>编辑</Menu.Item>
                    <Menu.Item onClick={() => recover_config()}>初始</Menu.Item>
                </Menu>
            )
            const isAdmin = SLocal_State.isAdmin

            return <div style={{ ...style, background: '#fff', position: 'relative', border: isAdmin ? '1px dashed red' : 'none' }}>

                {
                    config

                        // ? <div style={{ minHeight: 256, height: '100%', position: 'relative' }}>
                        ? <>
                            <ErrorBoundarySmall>
                                <MyLazyComponent>
                                    {children}
                                </MyLazyComponent>
                            </ErrorBoundarySmall>

                            {
                                isAdmin
                                    ? <Dropdown.Button
                                        icon={<BuildOutlined />}
                                        className={styles['edit-btn']}
                                        size='small'
                                        overlay={menu}
                                        trigger={['hover']}
                                    >

                                        {/* <div style={{ position: 'absolute', top: 6, right: 6, cursor: 'help' }} ><DownOutlined /></div> */}

                                    </Dropdown.Button>
                                    : null
                            }


                        </>


                        : <Result
                            status="warning"
                            title={`配置缺失`}
                            subTitle={`请联系管理员初始化[${setting.default_conf.title}]`}
                            extra={
                                <OkButton onClick={init_config}>初始化</OkButton>
                            }
                        />


                }
            </div>
        }, [config, loading]
    )
    return {
        config,
        Wrap
    }
};