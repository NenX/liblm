import { IMchc_FormDescriptions_Field, IMchc_FormDescriptions_Field_Nullable, SMchc_FormDescriptions } from "@lm_fe/service";
import { IMyBaseList_ColumnType, MyBaseListProps } from "./types";
import { get, isFunction, isNil, isObject, isString } from "lodash";
import { AnyObject, expect_array, safe_async_call, safe_json_parse, safe_json_parse_arr } from "@lm_fe/utils";
import { ICommonOption } from "@lm_fe/env";
import { useEffect, useState } from "react";
export function formatProps(props: MyBaseListProps) {
  const _props = { ...props }

  return _props
}

export function tranformQueryData(values: AnyObject, searchConfig: IMchc_FormDescriptions_Field_Nullable[] = [], isFuck = false) {
  const newValues = { ...values }

  const kvArr = searchConfig
    .filter(_ => _)
    .map(conf => {
      // const k = _?.name!
      const k = SMchc_FormDescriptions.get_form_item_name_str(conf)
      const v = get(newValues, k)
      return [k, v, conf] as const
    })
  return kvArr.reduce((sum, [k, v, conf]) => {

    if (isFuck) return { ...sum, [k]: v }
    const res = conf ? calcKeyByType(k, v, conf) : { [k]: v }
    return { ...sum, ...res }
  }, {})

}
function calcKey(k: string, v: any, searchConfig: IMchc_FormDescriptions_Field_Nullable[] = [],) {
  const config = searchConfig?.find(_ => _?.name === k)
  if (config) {
    return calcKeyByType(k, v, config)
  }


  return {}
}
function calcKeyByType(k: string, v: any, config: IMchc_FormDescriptions_Field) {



  const input_type = config.inputType! ?? 'input'
  const filterType = config.filterType?.split?.(',') ?? []

  const type = config.inputProps?.type
  const is_multiple = type === 'multiple' || type === 'tags'

  const f1 = filterType[0]
  const f2 = filterType[1]
  if (['input', 'Input', 'MyInput', 'address', 'MyAddress'].includes(input_type)) {
    return { [`${k}.${f1 || 'contains'}`]: v }
  }
  if (['input_number', 'InputNumber', 'DatePicker'].includes(input_type)) {
    return { [`${k}.${f1 || 'equals'}`]: v }
  }
  if (['select', 'Select', 'MySelect', 'MS'].includes(input_type)) {
    const obj = safe_json_parse(v, v)
    if (Array.isArray(obj)) {



      const arr = obj.map(_ => isObject(_) ? (_ as ICommonOption).value : _)

      const _v = arr.length > 1 ? arr.join(',') : arr[0]

      const has_comma = isString(_v) && _v.includes(',')

      const _df = (is_multiple || has_comma) ? 'in' : 'equals'

      return { [`${k}.${f1 || _df}`]: _v }

    } else {
      const has_comma = isString(v) && v.includes(',')

      const _df = (is_multiple || has_comma) ? 'in' : 'equals'
      return { [`${k}.${f1 || _df}`]: v }

    }
  }
  if (['RangePicker', 'rangeDate', 'MyRangeDate', 'rangeDateTime', 'MyRangeDateTime','ArrayInput'].includes(input_type)) {
    const value = safe_json_parse_arr(v)
    return {
      [`${k}.${f1 || 'greaterOrEqualThan'}`]: value[0],
      [`${k}.${f2 || 'lessOrEqualThan'}`]: value[1],

    }
  }

  return f1 ? { [`${k}.${f1}`]: v } : { [k]: v }
}
export function get_dataIndex<T>(record?: IMyBaseList_ColumnType) {
  const _dataIndex = record?.dataIndex ?? record?.name ?? record?.key
  if (isString(_dataIndex) && _dataIndex.includes('.')) {
    return _dataIndex.split('.')
  }
  return _dataIndex
}
export function get_title<T>(record?: IMyBaseList_ColumnType) {
  const _title = record?.title ?? record?.label ?? record?.name

  return _title
}
export function use_my_baselist<T>(props: MyBaseListProps) {
  const { tableColumns } = props
  const [table_columns, set_table_columns] = useState<IMyBaseList_ColumnType<T>[]>([])

  useEffect(() => {

    // if (isFunction(tableColumns)) {
    //   safe_async_call(tableColumns).then(data => {
    //     if (Array.isArray(data)) {
    //       set_table_columns(data.filter(_ => !isNil(_)))

    //     } else {
    //       set_table_columns(data.default.__lazy_config.filter(_ => !isNil(_)))

    //     }
    //   })
    // } else {
    //   set_table_columns((tableColumns ?? []).filter(_ => !isNil(_)))

    // }
    SMchc_FormDescriptions.extract_form_config(tableColumns)
      .then(conf => {
        set_table_columns(

          expect_array(conf)
            .filter(_ => !isNil(_))
          // .filter(_ => !_.hidden) // 不能在这过滤否则弹窗表单有问题

        )

      })

    return () => {

    }
  }, [tableColumns])


  return { table_columns }
}