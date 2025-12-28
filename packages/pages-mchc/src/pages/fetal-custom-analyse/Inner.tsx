import { LazyAntd, SimpleForm } from '@lm_fe/components'
import { mchcLogger } from '@lm_fe/env'
import { IZsy_CtgRecord, SZsy_CtgRecord } from '@lm_fe/service'
import { formatDate, getSearchParamsAll, getSearchParamsValue, request } from '@lm_fe/utils'
import { Button, Divider, Empty, Form, Layout, Menu, Spin, Pagination } from 'antd'
import React, { useEffect, useState } from 'react'
import './index.less'
import ATable from './Table'
// const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

const { Header, Content, Sider } = Layout
interface IProps {
}
const PAGE_START = 1
const initParams = { state: 0 }
export default function Test(props: IProps) {
    const [state, setState] = useState<IZsy_CtgRecord[]>([])
    const [imgArr, setImgArr] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [list_loading, setList_Loading] = useState(false)
    const [imgIdx, setImgIdx] = useState(0)
    const [currentPv, setCurrentPv] = useState<IZsy_CtgRecord>()
    const [total, setTotal] = useState(0)
    const [_pageCurrent, set_pageCurrent] = useState(PAGE_START)
    const limit = 16
    const [form] = Form.useForm()

    const outpatientNo = getSearchParamsValue('outpatientNo')
    const inpatientNo = getSearchParamsValue('inpatientNo')
    const all = getSearchParamsAll()
    async function fetchData(_page = _pageCurrent, s: { state?: number, } = form.getFieldsValue(), isLoading = true) {

        if (_pageCurrent !== _page) {
            set_pageCurrent(_page)
        }
        if (isLoading) setList_Loading(true)
        return SZsy_CtgRecord.findRecordsPage({ pageSize: limit, ...s, pageCurrent: _page, ...all })
            .then(r => {
                const { list, pageSize, totalRow, } = r
                setState(list)
                if (currentPv) {
                    const newTarget = list.find(_ => _.id === currentPv.id)
                    if (newTarget)
                        setCurrentPv(newTarget)
                } else {
                    setCurrentPv(list[0])

                }
                setTotal(totalRow)
            })
            .finally(() => setList_Loading(false))

    }
    function clickHandler(pv: IZsy_CtgRecord) {
        setCurrentPv(pv)
        setLoading(true)
        SZsy_CtgRecord.getSliceImages(pv.id)
            .then((r) => {
                setImgArr(r)
                setImgIdx(0)
                setTimeout(() => setLoading(false), 400)
            })

    }
    async function desklogin() {
        mchcLogger.log('desklogin 0')
        const searchData = getSearchParamsAll()
        const { appId, empid, empId, patId, data, timestamp, sign, } = searchData
        if (appId || empId || empid || patId || data || timestamp || sign) {
            try {
                const res = await request.post('/api/desklogin', searchData)
                return res
            } catch (e) {
            }
        }
    }
    useEffect(() => {
        const _init = { ...initParams, inpatientNo, outpatientNo }
        desklogin().then(() => {
            fetchData(PAGE_START, _init)

            form.setFieldsValue(_init,)
        })

    }, [])
    useEffect(() => {
        const id = setInterval(() => {
            fetchData(_pageCurrent, form.getFieldsValue(), false)

        }, 5 * 60 * 1000)
        return () => clearInterval(id)
    }, [_pageCurrent])
    const targetImg = imgArr[imgIdx]
    return <div style={{ height: '100%', display: 'flex', padding: 12, background: '#fff' }}>
        <div>



            <SimpleForm
                form={form}
                // onValuesChange={(a, b) => {
                //     setSearchParams({ ...searchParams, pageCurrent: 1, ...b })
                // }}
                formItems={
                    [
                        { type: 'DatePicker', outerOptions: { name: 'startDate', label: '开始时间' }, innerOptions: { style: { width: 240 } } },

                        { type: 'DatePicker', outerOptions: { name: 'endDate', label: '结束时间' }, innerOptions: { style: { width: 240 } } },

                        { type: 'Select', outerOptions: { name: 'state', label: '判图状态' }, innerOptions: { options: [{ value: 0, label: '否' }, { value: 1, label: '是' }], style: { width: 240 } } },
                        outpatientNo ? { type: 'Input', outerOptions: { name: 'outpatientNo', label: '就诊卡号' }, innerOptions: { style: { width: 240 }, disabled: true } } : null,
                        inpatientNo ? { type: 'Input', outerOptions: { name: 'inpatientNo', label: '住院号' }, innerOptions: { style: { width: 240 }, disabled: true } } : null,

                    ]
                }

            />
            <Button block onClick={() => {
                fetchData(PAGE_START)
            }} type="primary" loading={list_loading}>查询</Button>
            <Divider style={{ margin: '6px 0' }} />


            {
                state?.length ?
                    <Menu activeKey={currentPv?.id?.toString() as any} mode="inline" style={{ width: 320, }}>
                        {
                            state.map(_ => {
                                return <Menu.Item key={_.id} onClick={e => clickHandler(_)} style={{ outline: _.state ? '1px solid #333' : 'unset', margin: '6px 0' }}>
                                    <span style={{ minWidth: 44, display: 'inline-block' }}>{_.name}</span>
                                    <Divider type="vertical" />
                                    {formatDate(_.visitDate)}
                                    <Divider type="vertical" />
                                    {_.docNo}

                                </Menu.Item>
                            })
                        }
                    </Menu> : <Empty />
            }
            <Pagination size="small" showSizeChanger={false} current={_pageCurrent} total={total} pageSize={limit} onChange={(page) => {
                fetchData(page)
            }} style={{ marginTop: 12 }} />

        </div>
        {/* <Counter /> */}

        <Content
            className="site-layout-background"

            style={{
                width: 1200,
                padding: 0,
                overflowY: 'scroll'
            }}
        >

            <Spin tip="Loading..." spinning={loading}>
                {


                    <div style={{}}>

                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <div style={{ padding: 12, margin: 12, background: '#ddd', boxSizing: 'content-box' }}>
                                {

                                    targetImg ? <img src={targetImg} width="100%" height="100%" /> : <Empty style={{ marginTop: 240 }} />


                                }

                            </div>
                            <Pagination showSizeChanger={false} size="small" total={imgArr.length} pageSize={1} current={imgIdx + 1} onChange={(page) => setImgIdx(page - 1)} />

                        </div>
                    </div>


                }
            </Spin>
            {
                currentPv ? <ATable name="xx" pv={currentPv} fetchData={fetchData} /> : null
            }
        </Content>
    </div>
}
