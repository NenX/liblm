import { BF_Wrap2, MyBaseList } from '@lm_fe/pages'
import { mchcLogger } from "@lm_fe/env"
import { formatDate, getMomentRange, request } from "@lm_fe/utils"
import { Button } from "antd"
import React from "react"
import { defineFormConfig } from '@lm_fe/service'
import { Follow_up_btn } from "./.随访"
import { BASE_URL } from './const'
export default function BreastCancerDataReport(prop: any) {

    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: '孕前检查-阳性随访列表',
            name: BASE_URL,
            searchConfig: defineFormConfig([
                { label: '门诊号', name: 'outpatientNO', inputType: 'Input' },
                { label: '姓名', name: 'name', inputType: 'Input' },
                { label: '证件号码', name: 'idNO', inputType: 'Input' },
                { label: '检查日期', name: 'filingDay', inputType: 'rangeDate' },
            ]),
            tableColumns: defineFormConfig(
                [
                    { title: '门诊号', dataIndex: 'outpatientNO', layout: '1/3' },
                    { title: '姓名', dataIndex: 'name', layout: '1/3' },
                    { title: '年龄', dataIndex: 'age', layout: '1/3' },
                    { title: '电话', dataIndex: 'telephone', layout: '1/3' },
                    { title: '证件号码', dataIndex: 'idNO', layout: '1/3' },
                    { title: 'hbcab', dataIndex: 'hbcab', inputType: 'MA', inputProps: { options: '阴性,阳性,不详' }, layout: '1/3' },
                    { title: 'hbsag', dataIndex: 'hbsag', inputType: 'MA', inputProps: { options: '阴性,阳性,不详' }, layout: '1/3' },
                    { title: 'hbeag', dataIndex: 'hbeag', inputType: 'MA', inputProps: { options: '阴性,阳性,不详' }, layout: '1/3' },
                    { title: 'hbeab', dataIndex: 'hbeab', inputType: 'MA', inputProps: { options: '阴性,阳性,不详' }, layout: '1/3' },
                    { title: 'hbcab', dataIndex: 'hbcab', inputType: 'MA', inputProps: { options: '阴性,阳性,不详' }, layout: '1/3' },
                    { inputType: 'check_invert_button', hidden: true, layout: '1/3' },
                    { title: '身份证地址', dataIndex: 'permanentResidenceAddress', inputType: 'MyAddress', layout: '1/1' },

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


            searchConfig={config?.searchConfig}

            // showAction={false}
            showExport
            tableColumns={config?.tableColumns}
        // genColumns={({ handleSearch, tableColumns }) => {
        //     return [
        //         ...tableColumns,
        //         {
        //             title: '操作', dataIndex: 'pathologyResult', render(a, rowData) {
        //                 return <Follow_up_btn handleSearch={handleSearch} rowData={rowData} />
        //             }
        //         },

        //     ]
        // }}
        />
    </Wrap>
}

