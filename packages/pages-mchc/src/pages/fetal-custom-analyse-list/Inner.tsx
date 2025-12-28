import { SimpleForm } from '@lm_fe/components'
import { IZsy_CtgRecord, SZsy_CtgRecord } from '@lm_fe/service'
import { Button, Form, Space } from 'antd'
import { Dayjs } from 'dayjs'
import React, { useEffect, useState } from 'react'
import './index.less'

import { mchcModal__ } from '@lm_fe/pages'
import { HistoryTable } from './HistoryTable'
const contentStyle: React.CSSProperties = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};
interface IProps {
}
export default function Test(props: IProps) {

    const [state, setState] = useState<IZsy_CtgRecord[]>([])
    const [imgArr, setImgArr] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [imgIdx, setImgIdx] = useState(0)
    const [currentPv, setCurrentPv] = useState<IZsy_CtgRecord>()
    const [searchParams, setSearchParams] = useState<{ state?: number, pageCurrent: number, startDate?: Dayjs, endDate?: Dayjs }>({ pageCurrent: 1 })
    const [total, setTotal] = useState(0)
    const limit = 12

    const [visible, setVisible] = useState(false)
    const [form] = Form.useForm()
    function clickHandler(pv: IZsy_CtgRecord) {
        setCurrentPv(pv)
        SZsy_CtgRecord.getReport(pv.id)
            .then((printData) => {
                // mchcEvent.emit('print_modal', { printData: data })
                mchcModal__.open('print_modal', {
                    modal_data: {
                        printData
                    }
                })
            })

        // rawRequest.post<{ data: { pdfdata: string } }>(`/as/exam/pdf/${pv.exam.note}`, {})
        //     .then((r) => {
        //         event.emit('print', { printData: r.data.data.pdfdata })
        //     })
    }

    function fetchData() {
        setLoading(true)
        SZsy_CtgRecord.findRecordsPage({ pageSize: limit, ...searchParams })
            // rawRequest.get<{ data: { result: IZsy_CtgRecord[], total: number } }>('/as/pv/page', { params: { limit, ...searchParams } })
            .then((r) => {
                const { totalRow, pageSize, list } = r
                setTotal(totalRow)
                setState(list)
                setTimeout(() => setLoading(false), 400)
            })


    }

    useEffect(() => {
        fetchData()
    }, [searchParams])
    return <div
        className="site-layout-background"

        style={{
            padding: 12,
            overflowY: 'scroll',
            background: '#fff'
        }}
    >
        <SimpleForm
            form={form}
            onValuesChange={(a, b) => {
                setSearchParams({ ...searchParams, pageCurrent: 1, ...b })
            }}
            blocks={[
                {
                    title: '搜索条件',
                    rows: [
                        {
                            itemsInRow: [
                                { type: 'Input', outerOptions: { name: 'name', label: '姓名' }, innerOptions: {} },
                                { type: 'DatePicker', outerOptions: { name: 'startDate', label: '开始时间' }, innerOptions: {} },

                                { type: 'DatePicker', outerOptions: { name: 'endDate', label: '结束时间' }, innerOptions: {} },

                                { type: 'Select', outerOptions: { name: 'state', label: '判图' }, innerOptions: { options: [{ value: 0, label: '否' }, { value: 1, label: '是' }] } },
                                // {
                                //     type: 'Custom', customNode: <Space style={{ marginLeft: 24, }}>
                                //         <Button type="primary" style={{ padding: '0 24px', }} onClick={e => {
                                //             form.resetFields()
                                //             setSearchParams({ pageCurrent: 1 })
                                //         }}>重置</Button>
                                //         <Button type="primary" style={{ padding: '0 24px', }} onClick={e => {
                                //             fetchData()
                                //         }}>查询</Button>

                                //     </Space>,
                                // },

                            ],
                            layoutType: 6
                        },




                    ]
                }
            ]}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <Space style={{}}>
                <Button type="primary" style={{ padding: '0 24px', }} onClick={e => {
                    form.resetFields()
                    setSearchParams({ pageCurrent: 1 })
                }}>重置</Button>
                <Button type="primary" style={{ padding: '0 24px', }} onClick={e => {
                    fetchData()
                }}>查询</Button>

            </Space>
        </div>
        <HistoryTable loading={loading} pagination={{
            current: searchParams.pageCurrent,
            pageSize: limit,
            total,
            showSizeChanger: false,
            onChange(page) {
                setSearchParams({ ...searchParams, pageCurrent: page },)
            }
        }} dataSource={state} />


    </div>
}
