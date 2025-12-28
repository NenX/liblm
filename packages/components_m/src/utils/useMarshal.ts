import { safe_json_parse } from "@lm_fe/utils";
import { useEffect, useState } from "react";


export function useMarshal<T = any>(flag?: boolean, _value?: any, _onChange?: (v: any) => void, ...args: any) {
    const [safe_value, set_safe_value] = useState<T>()
    useEffect(() => {
        const d = flag ? safe_json_parse(_value) : _value
        set_safe_value(d)

    }, [_value, flag])

    function onChangeSafeValue(_v: any) {
        const v = flag ? JSON.stringify(_v) : _v

        _onChange?.(v)
    }
    return { safe_value, set_safe_value, onChangeSafeValue }
}