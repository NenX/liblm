import { Radio } from 'antd'
import React, { useEffect, useState } from 'react'
import { SZsy_CtgRecord } from '@lm_fe/service'
import './index.less'
import Analyse from '../fetal-custom-analyse'
import List from '../fetal-custom-analyse-list'
interface IProps {
    data: any
}
type TTabType = '判图' | '历史'
export default function Test(props: IProps) {

    const [tabType, setTabType] = useState<TTabType>('判图')


    const [searchParams, setSearchParams] = useState<{ state?: number, pageCurrent: number }>({ pageCurrent: 1 })
    const limit = 16

    function fetchData() {
        return SZsy_CtgRecord.findRecordsPage({ pageSize: limit, ...searchParams }).then(r => {
   
        })

    }

    useEffect(() => {
        fetchData()
    }, [searchParams])
    return <div style={{ height: '100%', }}>
        <Radio.Group optionType='button' style={{margin:'10px'}} onChange={e=>setTabType(e.target.value)}  value={tabType} buttonStyle='solid' size='small' options={['判图', '历史'].map(label => ({ label, value: label }))} />
        <div style={{ height: 'calc(100% - 50px)' }}>
            {
                tabType === '判图' ?
                    <Analyse /> :
                    <List />
            }
        </div>
    </div>
}