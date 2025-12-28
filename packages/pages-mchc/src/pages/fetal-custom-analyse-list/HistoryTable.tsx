
// import { LazyAntd } from '@lm_fe/components'
import { mchcModal__ } from '@lm_fe/pages'
import { IZsy_CtgRecord, SZsy_CtgRecord } from '@lm_fe/service'
import { Button, TablePaginationConfig, Tag, Table } from 'antd'
import { SizeType } from 'antd/lib/config-provider/SizeContext'
import React from 'react'
import './index.less'
// const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

const contentStyle: React.CSSProperties = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};
interface IProps {
    dataSource: IZsy_CtgRecord[]
    pagination?: TablePaginationConfig
    loading?: boolean
    showOperation?: boolean
    size?: SizeType
    type?: Parameters<typeof SZsy_CtgRecord['getReport']>[1]
}
export function HistoryTable({ dataSource, pagination, loading, size, type }: IProps) {


    function clickHandler(pv: IZsy_CtgRecord) {

        SZsy_CtgRecord.getReport(pv.id, type)
            .then((printData) => {
                // mchcEvent.emit('print_modal', { printData: data })
                mchcModal__.open('print_modal', {
                    modal_data: {
                        printData
                    }
                })
            })


    }




    return <Table size={size} loading={loading} rowKey="id" pagination={pagination} bordered
        style={{ marginTop: 24 }} dataSource={dataSource} columns={[
            { title: '姓名', width: 100, render(a, b) { return b.name } },
            { title: '就诊卡号', width: 60, render(a, b) { return b.outpatientNo } },
            { title: '档案号', width: 200, render(a, b) { return b.docNo } },
            { title: '日期', width: 200, render(a, b) { return b.visitDate } },
            { title: '判图状态', width: 40, ellipsis: true, align: 'center', render(a, b) { return b.state == 1 ? <Tag color="green">已判图</Tag> : <Tag color="yellow">未判图</Tag> } },
            { title: '操作', render(a, b) { return <Button onClick={() => clickHandler(b)}>查看</Button> }, width: 200 },
        ].map(_ => ({ ..._, align: 'center' }))} />


}
