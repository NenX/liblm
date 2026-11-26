import { IMchc_FormDescriptions_Field_Nullable, SMchc_Admission } from "@lm_fe/service"
import { AnyObject, ICommonOption } from "@lm_fe/utils"
import { ButtonProps, FormInstance, PopconfirmProps, TablePaginationConfig, message } from "antd"
import { FC } from "react"

export interface IRenderOtherActionsProps {
    isEditing: boolean,
    disabled?: boolean,
    handleSave: () => void,
    handleEdit: () => void,
    handleCancel: () => void,
    handleDelete: () => Promise<void>,
    selectedRowKeys: any[],
}
export interface IEditInTable_Row_Append_Config {
    fds: IMchc_FormDescriptions_Field_Nullable[],
    processDataAsync?(rowData: any, listData: any[]): Promise<any>
    process_url?: string,
    process_args?: AnyObject,
    btnProps?: ButtonProps
    popProps?: PopconfirmProps
}
export interface IEditInTable_InnerProps {
    tableColumns: any[]
    fds: any[]
    changeImmediate?: boolean
    RenderOtherActions?: FC<IRenderOtherActionsProps>
    value: { id: any, key: any, editFlag: boolean, deleteFlag: boolean }[]
    disabled?: boolean
    onChange?(...v: any[]): any
    defaultInputData?: any
    default_page_size?:number
    type?: 'modal' | 'inner'
    pagination?: TablePaginationConfig
    formInstance?: FormInstance
    EditInTable_beforeAdd?(newRow: any, rows: any[]): any
    fd_append_row?: IEditInTable_Row_Append_Config[]
    sp: ICommonOption[]
}

async function calcInputAndOutput(data: any[], startKey: string, endKey: string, isShowCalcInputOutput: boolean) {

    if (!isShowCalcInputOutput) return data

    if (startKey && endKey) {
        const startIdx = data.findIndex(d => d.key === startKey)
        const endidx = data.findIndex(d => d.key === endKey)

        const res = await SMchc_Admission.calculateTotalInputAndOutput(data.slice(startIdx, endidx + 1))
        return res
    } else {
        message.warning('请先选定一条记录以计算出入量！');
        return null
    }

}