import { BF_Wrap2, MyBaseList } from '@lm_fe/pages'
import { formatDate, getMomentRange } from "@lm_fe/utils"
import React from "react"
import { Follow_up_btn } from "./.婚检随访"
import { defineFormConfig } from '@lm_fe/service'


interface IData {
    "id": 3,
    "premaritalCheckArchivesId": 2,
    "filingDay": "2024-10-07",
    "fileType": 1,
    "name": "笋稳",
    "age": 20,
    "idNO": "430621200109250090",
    "telephone": "15574005568",
    "permanentResidenceAddress": "福建省,南平市,建瓯市,芝山街道,青云社区居委会&详细地址1号",
    "followupDate": "2024-10-16",
    "followupContent": "去西藏玩了",
    "infection": 1,
    "followupState": 1,
    "infectionContent": "111",
    "pregnancyEnding": 1,
    "pregnancyStatus": 1
}
export default function BreastCancerDataReport(prop: any) {
    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: '婚前检查-统计',
            name: '/api/statistics/premarital/check/findAll',
            searchConfig: defineFormConfig([
                { label: '门诊号', name: 'outpatientNO', inputType: 'Input' },
                { label: '姓名', name: 'name', inputType: 'Input' },
                { label: '证件号码', name: 'idNO', inputType: 'Input' },
                { label: '梅毒', name: 'syphilis', inputType: 'MS', inputProps: { options: '阴性,阳性' } },
                { label: 'HIV', name: 'hiv', inputType: 'MS', inputProps: { options: '阴性,阳性' } },
                { label: '淋球菌', name: 'gonococcus', inputType: 'MS', inputProps: { options: '阴性,阳性' } },
                { label: '档案类型', name: 'fileType', inputType: 'MS', inputProps: { optionKey: '性别2' } },
            ]),
            tableColumns: defineFormConfig(
                [
                    { title: '档案类型', dataIndex: 'fileType', inputType: 'MS', inputProps: { optionKey: '性别2' } },
                    { title: '门诊号', dataIndex: 'outpatientNO' },

                    { title: '姓名', dataIndex: 'name' },
                    { title: '年龄', dataIndex: 'age' },
                    { title: '电话', dataIndex: 'telephone' },
                    { title: '证件号码', dataIndex: 'idNO' },
                    { title: '地址', dataIndex: 'permanentResidenceAddress' },


                    { title: '随访时间', dataIndex: 'followupDate', },
                    { title: '随访内容', dataIndex: 'followupContent', },
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
                filingDay: getMomentRange().近一周.map(formatDate)
            }}
            baseTitle="婚前检查统计"

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

