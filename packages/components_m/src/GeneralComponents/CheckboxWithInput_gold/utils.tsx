import { ICommonOption, getDualModeOptions, getPresetOptions, getSimpleOptions, mchcUtils } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field_Nullable, SMchc_FormDescriptions } from '@lm_fe/service';
import { safe_json_parse_arr } from '@lm_fe/utils';
import { isNil, isString } from 'lodash';

import { ICheckboxWithInputOption, ICheckboxWithInputProps } from './types';
export function parseValue(value?: string | number | ICommonOption[], marshal?: number, type?: 'single' | 'multiple'): ICommonOption[] {
  if (isNil(value))
    return []

  const isString = typeof value === 'string'
  const isArr = Array.isArray(value)
  if (marshal) {
    const arr = (isString || isArr) ? safe_json_parse_arr(value) : []
    // return arr.map(_ => isObject(_) ? _ : { value: _ })
    return arr
  } else {
    if (type === 'multiple') {
      return isString
        ? (
          value?.split?.(',')
            ?.filter?.(_ => !isNil(_))
            ?.map?.(value => {
              // const nValue = isNaN(Number(value)) ? value : Number(value)
              return ({ value: value })
            })
          ?? []
        )
        : []
    } else {


      return [{ value }]

    }

  }
}


function parse_MC_string_options(props: ICheckboxWithInputProps) {
  if (!props) return []
  const _options = props.options
  if (!isString(_options)) return _options
  const sp = props.sp ?? []

  const input_type = props.config?.inputType ?? 'MC'
  const multiple = props.type === 'multiple'
  const marshal = getMarshal(props, props.value)

  const options = getDualModeOptions(_options, { sp, useString: multiple && !marshal, start: props.startIndex })

  return input_type === 'MA' ? options[1] : options[0]

}
export function parse_MC_option(props: ICheckboxWithInputProps) {
  if (!props) return []
  const marshal = props.marshal ?? 1
  const optionKey: any = props.optionKey
  const uniqueKey: any = props.uniqueKey
  const preOptions = optionKey ? getPresetOptions(optionKey, marshal === 0) : null
  const dicOptions = uniqueKey ? mchcUtils.getDictionariesEnumerations(uniqueKey) : null
  const options = preOptions ?? dicOptions ?? parse_MC_string_options(props) ?? []
  return options as ICheckboxWithInputOption[]
}
export function displayValue(_options: ICheckboxWithInputOption[], value: ICommonOption[]) {
  const _value = _options.filter(o => value.find(v => v.value == o.value))
  return _value.map(_ => _.label).join(',')

}
export function getMarshal(props: ICheckboxWithInputProps, value: any) {
  const _marshal = props.marshal ?? 1
  if (typeof _marshal === 'number')
    return _marshal
  const marshal = typeof value !== 'number' && (_marshal ?? true)
  return Number(marshal)
}
export function parse_MC_value(props: ICheckboxWithInputProps, changedValue: ICommonOption[]) {
  if (props.config?.inputType === 'MA') return changedValue?.[0]?.value;
  const marshal = getMarshal(props, changedValue)
  const type = props.type
  if (!changedValue.length)
    return null

  if (marshal)
    return marshal === 2 ? changedValue : JSON.stringify(changedValue,)

  if (type === 'multiple')
    return changedValue.map(_ => _.value).join(',')
  return changedValue[0]?.value
}


export function get_check_invert_values(configs: IMchc_FormDescriptions_Field_Nullable[]) {
  if (!Array.isArray(configs)) return {}
  const children = configs.filter(_ => ['MC', 'MA'].includes(_?.inputType!) || Array.isArray(_?.children))

  const check_invert_values = children
    .filter(_ => !_?.disabled_check)
    .reduce((a, item, idx) => {
      const name = SMchc_FormDescriptions.get_form_item_name_raw(item)
      const props = { ...(item?.inputProps! ?? {}), config: item } as any
      const options = parse_MC_option(props)
      const firstOption = options[0]
      const cArr = item?.children
      let cObj = {}
      if (Array.isArray(cArr)) {
        cObj = get_check_invert_values(cArr)
        return { ...a, ...cObj }
      } else {
        return { ...a, [`${name}`]: [parse_MC_value(props, [firstOption]), null, { props, options }], }
      }
    }, {} as { [x: string]: any[] })
  return check_invert_values
}