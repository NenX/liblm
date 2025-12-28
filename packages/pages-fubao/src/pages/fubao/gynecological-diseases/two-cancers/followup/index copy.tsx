import { PanelTitleWrapper } from "@lm_fe/components_m"
import { MyBaseList } from "@lm_fe/pages"
import { TIdTypeCompatible } from "@lm_fe/service"
import { getSearchParamsValue, request } from "@lm_fe/utils"
import React, { useEffect, useState } from "react"

interface IData {
    "id": 4,
    "name": "孙文",
    "age": 16,
    "telephone": "15574005542",
    "dob": "2024-09-30",
    "idNO": "450721199806033026",
    "lmd": "2024-09-25",
    "conceived": 1,
    "parity": 1,
    "twoCancerScreeningId": 16,

    "twoCancerFollowupRecordVMList": {
        "id": 1,
        "followUpDate": "2024-10-08",
        "pregnancyEnding": 2,
        "infection": 1,
        "infectionContent": "癌症病",
        "followupContent": "注意一下",
        "followupState": 2,
        "pregnancyStatus": 3
    }[]
}
export default function TowCancerFollowup(props: { id?: TIdTypeCompatible }) {
    const [remote_data, setRemote_data] = useState<IData | undefined>()
    const twoCancerScreeningId = props.id ?? getSearchParamsValue('id')
    useEffect(() => {
        request
            .get('/api/twoCancerScreeningHeader', { ignore_usr: true, unboxing: true, params: { twoCancerScreeningId, } })
            .then(r => {
                setRemote_data(r.data)
            })


        return () => {

        }
    }, [])
    return <>
        <PanelTitleWrapper headerItems={[
            { title: '姓名', value: remote_data?.name },
            { title: '年龄', value: remote_data?.age },
            { title: '证件号', value: remote_data?.idNO },
            { title: '联系电话', value: remote_data?.telephone },
        ]} >
            {
                <MyBaseList
                    name="/api/twoCancerFollowupCase"

                    // showAdd={false}
                    // showAction={false}
                    // dbg_dataSource={list}
                    // create_or_update={async v => {

                    // }}
                    searchParams={{
                        twoCancerScreeningId
                    }}


                    tableColumns={[
                        { title: '疾病', dataIndex: 'infectionContent' },
                        { title: '随访内容', dataIndex: 'followupContent' },
                        { title: '随访状态', inputType: 'MS', dataIndex: 'followupContent', props: { optionKey: '随访状态' } },
                        // {
                        //     title: '操作',
                        //     render(a, record) {
                        //         return <OkButton onClick={() => {

                        //         }}>编辑</OkButton>
                        //     }
                        // }

                    ]}
                />
            }

        </PanelTitleWrapper>

    </>

}