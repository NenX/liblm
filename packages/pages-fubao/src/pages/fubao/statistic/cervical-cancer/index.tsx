import { BF_Wrap2, MyBaseList } from '@lm_fe/pages'
import { mchcLogger } from "@lm_fe/env"
import { formatDate, getMomentRange, request } from "@lm_fe/utils"
import { Button } from "antd"
import React from "react"
export default function BreastCancerDataReport(prop: any) {

    const { Wrap, config } = BF_Wrap2({
        default_conf: {
            title: '两癌筛查-宫颈癌统计',
            name: "/api/statistics/cervical/cancer/findAll",
            tableColumns: [
                { title: '门诊号', dataIndex: 'outpatientNO' },
                { title: '姓名', dataIndex: 'name' },
                { title: '年龄', dataIndex: 'age' },
                { title: '电话', dataIndex: 'telephone' },
                { title: '证件号码', dataIndex: 'idNO' },
                { title: '身份证地址', dataIndex: 'residenceAddress' },
                { title: '检查时间', dataIndex: 'checkDate', },
                { title: '病理结果', dataIndex: 'pathologyResult', },


            ],
            searchConfig: [

                { label: '门诊号', name: 'outpatientNO', inputType: 'Input' },

                { label: '姓名', name: 'name', inputType: 'Input' },
                { label: '证件号码', name: 'idNO', inputType: 'Input' },
                { label: '检查日期', name: 'checkDate', inputType: 'rangeDate' },

                { label: 'HIV检测', name: 'testResult', inputType: 'MS', inputProps: { options: '阴性,阳性' } },
                { label: 'TBS结果', name: 'tbsResult', inputType: 'MS', inputProps: { uniqueKey: 'cancer.exceptionType' } },
                { label: '阴道镜检查', name: 'colposcopyAdequacy', inputType: 'MS', inputProps: { uniqueKey: 'cancer.colposcopyAdequacyType' } },

                { label: '组织病理检查', name: 'organPathologyCheck', inputType: 'MS', inputProps: { uniqueKey: 'cancer.exceptionType' } },

                { label: '登记日期', name: 'registerDate', inputType: 'rangeDate' },
                { label: '身份证地址', name: 'residenceAddress', inputType: 'MyAddress', inputProps: {} },

            ]
        }
    })

    return <Wrap>
        <MyBaseList
            // apiPrefix="/fb/api"
            name={config?.name}
            searchParams={{
                // 'visitType.equals': 1,
            }}
            baseTitle="宫颈癌统计"
            needChecked
            useListSourceCount
            initialSearchValue={{
                validateDate: getMomentRange().近一周.map(formatDate)
            }}

            searchConfig={config?.searchConfig}

            showAction={false}
            showAdd={false}
            showExport

            tableColumns={config?.tableColumns}
        />
    </Wrap>
}

