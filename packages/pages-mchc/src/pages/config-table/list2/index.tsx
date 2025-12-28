import React from "react"
// import { message } from "antd"
import { BF_Wrap2, MyBaseList } from "@lm_fe/pages"
import { get_global_happy_arg } from "@lm_fe/utils"
import { ICommonProps } from "../utils"
import { defineFormConfig } from "@lm_fe/service"
function MyConfigTable2(props: ICommonProps) {

    const title: any = get_global_happy_arg('usr1') ?? props.configId
    if (!title) return <div>请配置title</div>
    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: `动态表格-${title}`, name: '/api/pregnancies',
            showAction: 1,
            initialSearchValue: { nationality: '中' },
            searchParams: { args: 'abcd' },
            searchConfig: defineFormConfig([
                { label: '国籍', name: 'nationality', inputType: 'Input' },
            ]),
            tableColumns: defineFormConfig([
                { label: '姓名', name: 'name', inputType: 'Input', layout: '1/3' },
                { label: '出生日期', name: 'dob', inputType: 'MyDatePicker', layout: '1/3' },
                { label: '胎方位', name: 'fetalPosition', inputType: 'MC', inputProps: { options: '左枕前,左枕后,其他i' }, layout: '1/3' },
                { label: '国籍', name: 'nationality', inputType: 'MA', inputProps: { optionKey: '国家s', }, layout: '1/3' },
                { label: '证件类型', name: 'idType', inputType: 'MS', inputProps: { optionKey: '证件类型', marshal: 1 }, layout: '1/3' },
                { inputType: 'check_invert_button', layout: '1/3',hidden:true },
            ])
        }
    })
    console.log('config', config)
    return <Wrap>
        <MyBaseList
            baseTitle={config?.title as any}
            {...props}
            showExport
            isJSONConfig
            size="small"
            // name="/syphilis-quality-control"
            modalFormConfig={{
                width: '80vw',
                modal_data: {
                    targetLabelCol: 4
                }
            }}
            {...config}
        />

    </Wrap>
}
export default MyConfigTable2