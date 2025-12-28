import { ExclamationCircleOutlined, TableOutlined } from '@ant-design/icons';
import { mchcEnv, mchcEvent } from '@lm_fe/env';
import { Button, Divider, Space } from 'antd';
import classnames from 'classnames';
import React, { useEffect } from 'react';
import styles from './index.module.less';
import { highRiskTablePopup, isShowPopupRemind, TPopupRemindkey, IHighRiskTableEntryProps } from './utils';
function _HighRiskTableEntry(props: IHighRiskTableEntryProps) {
    const { headerInfo, data } = props
    useEffect(() => {


        return () => {

        }
    }, [])
    return <div>
        <Space >
            {
                mchcEnv.is('广三') || <Button
                    className={classnames(styles['his-btn'], { [styles['btn-risk']]: isShowPopupRemind('瘢痕子宫', headerInfo, data) })}
                    type="dashed"
                    icon={<TableOutlined />}
                    onClick={() => {
                        mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '瘢痕子宫阴道试产表' })

                    }}
                >
                    瘢痕子宫阴道试产表
                    {showRisk('瘢痕子宫', props)}
                </Button>
            }
            <Button
                className={classnames(styles['his-btn'], { [styles['btn-risk']]: isShowPopupRemind('子痫', headerInfo, data) })}
                type="dashed"
                icon={
                    <TableOutlined />
                }
                onClick={() => {
                    mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '子痫前期风险评估表' })

                }}
            >
                子痫前期风险评估表
                {showRisk('子痫', props)}
            </Button>
            <Button
                className={classnames(styles['his-btn'], { [styles['btn-risk']]: isShowPopupRemind('VTE', headerInfo, data) })}
                type="dashed"
                icon={<TableOutlined />}
                onClick={() => {
                    mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '深静脉血栓高危因素孕期用药筛查表' })
                }}
            >
                VTE预防用药筛查表
                {showRisk('VTE', props)}
            </Button>
        </Space>
    </div>
}
function showRisk(type: TPopupRemindkey, props: IHighRiskTableEntryProps) {
    return isShowPopupRemind(type, props.headerInfo, props.data,) ? (
        <>
            <Divider type="vertical" />
            <span style={{}}>存在风险 </span>
            <ExclamationCircleOutlined style={{ fontSize: '14px' }} />
        </>
    ) : null;
}
type TExportType = typeof _HighRiskTableEntry & { highRiskTablePopup: typeof highRiskTablePopup }
export const HighRiskTableEntry: TExportType = Object.assign(_HighRiskTableEntry, { highRiskTablePopup })