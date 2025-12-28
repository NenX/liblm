import { BF_Wrap2, MyBaseList } from '@lm_fe/pages'
import { mchcLogger } from "@lm_fe/env"
import { formatDate, getMomentRange, request } from "@lm_fe/utils"
import { Button } from "antd"
import React from "react"
import { defineFormConfig } from '@lm_fe/service'
import { Follow_up_btn } from "./.孕检随访"
export default function BreastCancerDataReport(prop: any) {

    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: '孕前检查-统计',
            name: '/api/statistics/progestation/check/findAll',
            searchConfig: defineFormConfig([
                { label: '门诊号', name: 'outpatientNO', inputType: 'Input' },
                { label: '姓名', name: 'name', inputType: 'Input' },
                { label: '证件号码', name: 'idNO', inputType: 'Input' },
                { label: '检查日期', name: 'checkDate', inputType: 'rangeDate' },
            ]),
            tableColumns: defineFormConfig(
                [
                    { title: '门诊号', dataIndex: 'outpatientNO' },
                    { title: '姓名', dataIndex: 'name' },
                    { title: '年龄', dataIndex: 'age' },
                    { title: '电话', dataIndex: 'telephone' },
                    { title: '证件号码', dataIndex: 'idNO' },
                    { title: '身份证地址', dataIndex: 'residenceAddress' },
                    { title: '检查时间', dataIndex: 'checkDate', },
                    { title: '病理结果', dataIndex: 'pathologyResult', },
                ]
            )
        }
    })

    return <Wrap>
        <MyBaseList
            // apiPrefix="/fb/api"
            name={config?.name}
            searchParams={{
                // 'visitType.equals': 1,
            }}
            needChecked
            useListSourceCount
            initialSearchValue={{
                validateDate: getMomentRange().近一周.map(formatDate)
            }}
            baseTitle="孕前检查统计"

            searchConfig={config?.searchConfig}

            showAction={false}
            showAdd={false}
            showExport

            genColumns={({ handleSearch }) => {
                return [
                    ...(config?.tableColumns ?? []),
                    {
                        title: '操作', dataIndex: 'pathologyResult', render(a, rowData) {
                            return <Follow_up_btn handleSearch={handleSearch} rowData={rowData} />
                        }
                    },

                ]
            }}
        />
    </Wrap>
}

