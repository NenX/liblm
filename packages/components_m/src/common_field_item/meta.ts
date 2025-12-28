import { getPresetOptions } from '@lm_fe/env'
import { IMchc_FormDescriptions_Field } from '@lm_fe/service'
import { formatDateTime } from '@lm_fe/utils'
import { IMyBaseList_ColumnType } from 'src/FU_components/MyBaseList/types'
export type TCommonFieldLabel = keyof typeof mapLabelToFieldName

function getTtype(params: IMchc_FormDescriptions_Field) {
    return params
}

const mapLabelToFieldName = {
    姓名: getTtype({ name: 'name', inputType: 'MyInput', inputProps: {} }),
    年龄: getTtype({ name: 'age', inputType: 'InputNumber', inputProps: {} }),
    性别: getTtype({ name: 'gender', inputType: 'MyCheckbox', inputProps: { marshal: 0, optionKey: '性别3' } }),
    联系电话: getTtype({ name: 'telephone', inputType: 'MyInput', inputProps: {} }),
    出生日期: getTtype({ name: 'dob', inputType: 'DatePicker', inputProps: {} }),
    证件类型: getTtype({ name: 'idType', inputType: 'MyInput', inputProps: {} }),
    证件号码: getTtype({ name: 'idNO', inputType: 'MyInput', inputProps: {} }),
    身份证: getTtype({ name: 'idNO', inputType: 'MyInput', inputProps: {} }),
    户口地址: getTtype({ name: 'permanentResidenceAddress', inputType: 'address', inputProps: {} }),
    居住地址: getTtype({ name: 'residenceAddress', inputType: 'address', inputProps: {} }),
    职业: getTtype({ name: 'occupation', inputType: 'MyCheckbox', inputProps: { options: getPresetOptions('职业'), marshal: 0 } }),
    文化程度: getTtype({ name: 'education', inputType: 'MyCheckbox', inputProps: { options: getPresetOptions('文化程度'), marshal: 0 } }),
    婚姻状况: getTtype({ name: 'maritalStatus', inputType: 'MyCheckbox', inputProps: { options: getPresetOptions('婚姻'), marshal: 0 } }),
    籍贯: getTtype({ name: 'dataIndex', inputType: 'MyInput', inputProps: {} }),
    国籍: getTtype({ name: 'dataIndex', inputType: 'MyInput', inputProps: {} }),
    工作单位: getTtype({ name: 'workplace', inputType: 'MyInput', inputProps: {} }),
    民族: getTtype({ name: 'ethnic', inputType: 'MyCheckbox', inputProps: { options: getPresetOptions('民族10'), marshal: 0 } }),
    床号: getTtype({ name: 'dataIndex', inputType: 'MyInput', inputProps: {} }),
    孕周: getTtype({ name: 'gestationalWeek', inputType: 'MyInput', inputProps: { unit: '周' } }),
    分娩孕周: getTtype({ name: 'deliveryGestationalWeek', inputType: 'MyInput', inputProps: { unit: '周' } }),
    分娩日期: getTtype({ name: 'deliveryDate', inputType: 'DatePicker', inputProps: {} }),
    分娩时间: getTtype({ name: 'deliveryTime', inputType: 'DatePicker', inputProps: { format: formatDateTime.format } }),
    孕次: getTtype({ name: 'gravidity', inputType: 'InputNumber', inputProps: {} }),
    产次: getTtype({ name: 'parity', inputType: 'InputNumber', inputProps: {} }),
    产检次数: getTtype({ name: 'prenatalVisitCount', inputType: 'InputNumber', inputProps: { unit: '次' } }),
    胎数: getTtype({ name: 'fetalcount', inputType: 'InputNumber', inputProps: {} }),
    末次月经: getTtype({ name: 'lmp', inputType: 'DatePicker', inputProps: {} }),
    预产期: getTtype({ name: 'edd', inputType: 'MyInput', inputProps: {} }),
    修订预产期: getTtype({ name: 'sureEdd', inputType: 'MyInput', inputProps: {} }),
    住院号: getTtype({ name: 'inpatientNO', inputType: 'MyInput', inputProps: {} }),
    门诊号: getTtype({ name: 'outpatientNO', inputType: 'MyInput', inputProps: {} }),
    出生体重: getTtype({ name: 'birthWeight', inputType: 'InputNumber', inputProps: { unit: 'g' } }),
    出生身长: getTtype({ name: 'birthLengthHeight', inputType: 'InputNumber', inputProps: { unit: '厘米' } }),

}

export function createFormItem<T>(label: TCommonFieldLabel): IMchc_FormDescriptions_Field {
    const name = mapLabelToFieldName[label].name
    const inputType = mapLabelToFieldName[label]?.inputType as any
    const inputProps = mapLabelToFieldName[label]?.inputProps as any
    return { label, name, inputType, inputProps }
}
export function createColumn<T>(title: TCommonFieldLabel): IMyBaseList_ColumnType {
    const dataIndex = mapLabelToFieldName[title]?.name
    const inputType = mapLabelToFieldName[title]?.inputType
    const inputProps = mapLabelToFieldName[title]?.inputProps
    return { title, dataIndex, inputType, align: 'center', inputProps }
}




