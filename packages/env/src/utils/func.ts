import { getSearchParamsValue, safe_json_parse, safe_json_parse_arr } from "@lm_fe/utils";
import { ICommonOption } from "../select_options";
import { ACTION_TYPE } from "src/state/actionType";
import { cloneDeep, isNil } from "lodash";

export function getDoctorEndId(props?: any) {
    // return getSearchParamsValue('id') ?? (window as any)._single_props?.id

    return props?.id ?? getSearchParamsValue('id') ?? (window as any)._single_props?.id
}
export function getActionType(key: keyof typeof ACTION_TYPE) {
    return ACTION_TYPE[key]
}

type TNoteType<T extends string | number> = `${T}Note`
type TOptionType<T extends string | number> = `${T}__`



export function noteToCommonOption<D extends { [x in N | O]: any }, T extends Exclude<keyof D, symbol>, N extends TNoteType<T>, O extends TOptionType<T>>(data: D, key: T, marshal = false) {
    if (!data) return data
    const _data = { ...data }
    const noteKey = `${key}Note` as N
    const __Key = `${key}__` as O
    const options: ICommonOption[] = [{ value: data[key], text: data[noteKey] }]
    _data[__Key] = (marshal ? JSON.stringify(options) : options) as any
    return _data

}
export function commonOptionToNote<D extends { [x in N | O]: any }, T extends Exclude<keyof D, symbol>, N extends TNoteType<T>, O extends TOptionType<T>>(data: D, key: T,) {
    if (!data) return data
    const _data = { ...data }
    const noteKey = `${key}Note` as N
    const __Key = `${key}__` as O
    const __raw_value = data[__Key]
    if (__raw_value === null) {
        _data[key] = null!
        _data[noteKey] = null!
        return _data

    }
    const arr: ICommonOption[] = safe_json_parse_arr(__raw_value)

    if (Array.isArray(arr)) {
        const option = arr[0]
        _data[key] = option?.value
        _data[noteKey] = option?.text
    }



    return _data

}


export function autoCommonOptionToNote<T = any>(data: T) {
    if (isNil(data)) return data
    const _data: any = cloneDeep(data)
    const keys = Object.keys(_data)
        .filter(_ => _.endsWith('__'))
        .map(_ => _.slice(0, -2))
    return (keys)
        .reduce((obj, k) => {
            return commonOptionToNote(obj, k)
        }, _data) as T
}

export function autoNoteToCommonOption<T = any>(data: T) {
    if (isNil(data)) return data
    const _data: any = cloneDeep(data)
    const allKeys = Object.keys(_data)
    const keys = allKeys
        .filter(_ => allKeys.includes(`${_}Note`));
    return (keys)
        .reduce((obj, k) => {
            return noteToCommonOption(obj, k)
        }, _data) as T
}