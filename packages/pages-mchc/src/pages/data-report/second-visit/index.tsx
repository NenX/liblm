import { MyBaseList } from '@lm_fe/pages'
import { mchcEnv, mchcLogger } from "@lm_fe/env"
import { formatDate, getMomentRange, request } from "@lm_fe/utils"
import { Button, message } from "antd"
import React from "react"
import { HighriskGradeDisplay } from '@lm_fe/components_m'
export default function BreastCancerDataReport(prop: any) {
    return <MyBaseList
        // apiPrefix="/fb/api"
        name="/api/prenatal-visits/upload-logs"
        searchParams={{
            'visitType.equals': 1,
        }}
        needChecked
        useListSourceCount
        initialSearchValue={{
            validateDate: getMomentRange().近一周.map(formatDate)
        }}
        searchConfig={[
            { label: '检查日期', name: 'visitDate', inputType: 'rangeDate' },
            { label: '就诊卡号', name: 'outpatientNO', inputType: 'Input' },
            { label: '姓名', name: 'name', inputType: 'Input' },
            { label: '上报状态', name: 'uploadState', inputType: 'MS', inputProps: { optionKey: '上报状态' } },
        ]}

        showAction={false}
        showAdd={false}
        RenderBtns={(ctx) => {
            const selectRows = ctx.getCheckRows()
            return <Button disabled={!selectRows.length} onClick={async () => {
                const res = await request.post('/api/dataReport/reportRvisit', { ids: selectRows.map(_ => _.id), });
                message.success(res.data)
                ctx.handleSearch()
            }}>上报</Button>
        }}
        tableColumns={[
            // { title: '建档日期', dataIndex: 'validateDate' },
            { title: '检查日期', dataIndex: 'visitDate' },

            { title: '姓名', dataIndex: 'name' },
            { title: '就诊卡号', dataIndex: 'outpatientNO' },
            { title: '身份证号', dataIndex: 'idNO' },
            // { title: '看诊医生', dataIndex: 'doctorName' },
            { title: '审核人', dataIndex: 'auditorName' },
            { label: '记录医生', name: 'doctorName', hidden: !mchcEnv.in(['郫都']) },
            {
                title: '高危等级颜色',
                dataIndex: 'pregnancy.highriskGrade',
                render: (value: any) => <HighriskGradeDisplay type="highriskGrade" data={value} />,
                hidden: !mchcEnv.in(['郫都'])
            },
            { title: '上报状态', dataIndex: 'uploadState', inputType: 'MS', inputProps: { optionKey: '上报状态', marshal: 0 } },
            { title: '手册编号', dataIndex: 'ycfbsh', },
            { title: '上报说明', dataIndex: 'uploadMsg', },
            { title: '上报时间', dataIndex: 'uploadDate', },
        ]}
    />
}

