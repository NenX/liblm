import { LogoutOutlined } from "@ant-design/icons"
import { LazyAntd } from "@lm_fe/components"
import { IMchc_FormDescriptions_Field, IMchc_LabExamReport_Detail } from "@lm_fe/service"
import { request, speculate_on_display } from "@lm_fe/utils"
import { Button, Divider } from "antd"
import { get, isBoolean } from "lodash"
import React, { FC, useMemo, useState } from "react"
import { DoctorEnd_ImageReport_Report, DoctorEnd_SurveyReport_Report } from "src/FB_components"
import { mchcModal } from "src/modals"
import styles from './use_chrone.module.less'
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

interface IChronoConfig {
    "columnCode": "nt",
    "columnValue": "20",
    "isNormal": 'true' | 'false',
    "isOut": 'true' | 'false',
    "reportId": "",
    "chrono": boolean,
    "history": "/api/prenatalExam/column/history/value?recordId=25&columnCode=nt",
    "labReport": "/api/prenatalExam/column/history/value?recordId=25&columnCode=nt",
    "imageReport": "/api/prenatalExam/column/history/value?recordId=25&columnCode=nt",
}
interface IChronoHistory {
    "valueTime": string
    "isNormal": null,
    "reportId": null,
    "labReport": null,
    "imageReport": null,
    "isOut": null,
    "columnValue": string
    "version": number
}
export function use_chrono<V = any>(props: { value?: any, onChange?: (...v: any[]) => void, config?: IMchc_FormDescriptions_Field }) {
    // const _value = props.value ?? xx
    const _value = props.value
    const [chrono_conf, set_chrono_conf] = useState<IChronoConfig>()
    const [value, set_value] = useState<V>()

    const has_chrono = isBoolean(get(_value, 'chrono'))
    const conf = _value
    const __value = has_chrono ? get(_value, 'columnValue') : _value

    function onChange(...arg: any[]) {
        if (has_chrono) {
            return props.onChange?.({ ...conf, columnValue: arg[0] } as IChronoConfig)
        }
        return props.onChange?.(...arg)

    }


    // useEffect(() => {
    //     const has_chrono = isBoolean(get(_value, 'chrono')) && get(_value, 'columnCode')
    //     if (has_chrono) {
    //         set_chrono_conf(_value)
    //         set_value(get(_value, 'columnValue'))
    //     } else {
    //         set_value(_value)
    //     }

    //     return () => {

    //     }
    // }, [_value])
    const Wrap = useMemo<FC<{}>>(() =>
        (props) => {
            const { children } = props
            if (!conf || !conf.chrono) return <>{children}</>
            const chrono_data: IChronoConfig = conf
            const history_url = chrono_data.history
            const report_url = chrono_data.labReport
            const image_url = chrono_data.imageReport
            const menus = <div style={{ padding: 4, background: '#fff', boxShadow: '#999 6px 6px 12px 0', display: 'flex', flexDirection: 'column' }}>
                <Button
                    
                    disabled={!history_url}
                    onClick={() => {
                        request.get<IChronoHistory[]>(history_url)
                            .then(list => {
                                mchcModal.open('test', {
                                    title: '查看历史',
                                    modal_data: {

                                        content: <Table
                                            dataSource={list.data}
                                            columns={[
                                                { title: '历史值', dataIndex: 'columnValue', render(v) { return speculate_on_display(v) } },
                                                { title: '变更时间', dataIndex: 'valueTime' }
                                            ]} />
                                    }
                                })
                            })
                    }}
                >
                    {/* <HistoryOutlined /> */}
                    查看历史

                </Button>
                <Divider style={{ margin: '2px 0' }} />
                <Button
                    
                    hidden={!report_url}
                    onClick={() => {
                        request.get<IMchc_LabExamReport_Detail>(report_url)
                            .then(list => {
                                mchcModal.open('test', {
                                    title: '查看报告',
                                    modal_data: {

                                        content: <DoctorEnd_SurveyReport_Report detailData={list.data} />
                                    }
                                })
                            })
                    }}
                >
                    检验报告

                </Button>
                <Button
                    
                    hidden={!image_url}
                    onClick={() => {
                        request.get<IMchc_LabExamReport_Detail>(image_url)
                            .then(list => {
                                mchcModal.open('test', {
                                    title: '查看报告',
                                    modal_data: {

                                        content: <DoctorEnd_ImageReport_Report tableData={list.data.imageExamList} />
                                    }
                                })
                            })
                    }}
                >
                    影像报告

                </Button>
            </div>
            const abnormal = conf?.isNormal === 'false'
            const is_out = conf?.isOut === 'true'
            return <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }} className={abnormal ? styles['abnormal'] : ''}>{children}</div>
                {/* <Button icon={<HistoryOutlined />} onClick={() => {

                }} /> */}
                <Dropdown
                    trigger={['click']}
                    // icon={< DownOutlined />}
                    overlay={menus}
                >
                    <Button type={abnormal ? 'text' : 'text'} danger={abnormal} icon={is_out ? <LogoutOutlined style={{}} /> : <span style={{fontSize:24,lineHeight:'22px'}}>●</span>} >
                        {/* <Button type='dashed' danger={!is_normal} icon={is_in ? < DownOutlined /> : <LogoutOutlined />} > */}
                    </Button>
                </Dropdown >

            </div>

        }
        , [conf?.history])

    return {
        Wrap,
        chrono_conf: conf,
        value: __value,
        onChange
    }

}

export const ChronoWrapper: FC<any> = (props) => {
    return null
}