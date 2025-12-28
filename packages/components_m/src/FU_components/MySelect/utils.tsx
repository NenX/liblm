import { getPresetOptions, getSimpleOptions, ICommonOption, mchcUtils, safe_fetch_options } from "@lm_fe/env";
import { IMySelectProps } from "./types";
import { useEffect, useState } from "react";
import { isBoolean, isNumber, isString } from "lodash";
import { numberLikeCompare, safe_json_parse_arr } from "@lm_fe/utils";
export function getMarshal({ uniqueKey, marshal }: IMySelectProps) {

    if (uniqueKey !== undefined) {
        return 0
    }
    if (marshal === undefined) {
        return 1
    }
    return Number(marshal)

}

export function parse_MC_value(props: IMySelectProps, changedValue: ICommonOption[]) {
    const marshal = getMarshal(props,)
    const type = get_mode(props)
    if (!changedValue.length)
        return null

    if (marshal)
        return marshal === 2 ? changedValue : JSON.stringify(changedValue,)

    if (type === 'multiple' || type === 'tags')
        return changedValue.map(_ => _.value).join(',')
    return changedValue[0]?.value
}
export function check_multiple(props: IMySelectProps,) {

    const type = get_mode(props)

    return ['tags', 'multiple'].includes(type!)
}
export function get_mode(props: IMySelectProps,) {

    return props?.mode ?? props.type

}
const defaultOptions: ICommonOption[] = []
export function get_select_opt(props: IMySelectProps) {
    const { optionKey, options, uniqueKey, startIndex, useString } = props
    const preOptions = optionKey ? getPresetOptions(optionKey as any) : null
    const _option = typeof options === 'string' ? getSimpleOptions(options, { start: startIndex, useString }) : options
    const a: ICommonOption[] = preOptions ?? _option ?? (uniqueKey && mchcUtils.getDictionariesEnumerations(uniqueKey) as any) ?? props.options ?? defaultOptions;
    return a
}
export function use_options(props: IMySelectProps) {
    const { fetch_options, optionKey, options: _options, uniqueKey } = props
    const [options, set_options] = useState<ICommonOption[]>([])
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<ICommonOption[]>([]);

    const { value, } = props
    const marshal = getMarshal(props)


    const type = get_mode(props)


    useEffect(() => {
        const safeData = getData(value, options, marshal, type)
        setData(safeData)
    }, [value, options]);


    useEffect(() => {
        if (fetch_options) {
            setLoading(true)
            safe_fetch_options(fetch_options)
                .then(set_options)
                .finally(() => setLoading(false))
        } else {
            set_options(get_select_opt(props))

        }
    }, [fetch_options, optionKey, _options, uniqueKey]);

    return { loading, options, data, setData }
}

function getData(value: any, options: ICommonOption[], marshal: number, type: "multiple" | "tags" | undefined) {
    const unMarshalData = safe_json_parse_arr(value, value)
    const splitValue = () => isString(value) ? value.split(',').filter(_ => _) : []
    const v =
        [1, 2].includes(marshal)
            ? unMarshalData :
            (
                (type === 'multiple' || type === 'tags') && isString(value)

                    ? (
                        splitValue().map(value => options.find(_ => numberLikeCompare(value, _.value)) ?? ({ value, label: value }))
                    )

                    : value
            )
    const safeData = (Array.isArray(v))
        ? v
        : ((isNumber(v) || isString(v) || isBoolean(v))
            // ? options.filter(_ => _.value === v)
            ? options.filter(_ => numberLikeCompare(_.value, v))
            : [])
    // mchcLogger.log('MySelect', value, safeData, options)
    return safeData
}

