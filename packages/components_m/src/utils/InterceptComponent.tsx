import { mchcLogger } from "@lm_fe/env"
import { IMchc_FormDescriptions_Field } from "@lm_fe/service"
import { safe_json_parse } from "@lm_fe/utils"
import { FormInstance } from "antd"
import React, { useEffect, useState } from "react"
import { use_chrono } from "src/FU_components/FormSection/use_chrono"

export function InterceptComponent(props: { [x: string]: any, config: IMchc_FormDescriptions_Field, C: any, form?: FormInstance, formName?: any, value?: any, onChange?: (...v: any[]) => void }) {
    const { config = {}, formName, form, C, ...others } = props
    const { chrono, value, onChange, Wrap } = use_chrono(props)
    const { inputProps, processLocal, processRemote, specialConfig, special_config } = config
    const _inputProps: any = inputProps ?? {}
    const __value = value ?? _inputProps.value
    const _value = processRemote?.(__value, form) ?? __value
    const formDescriptionSpecialConfig = safe_json_parse(specialConfig,) ?? safe_json_parse(special_config, {})

    const _onChange = (...arg: any[]) => {
        arg[0] = processLocal?.(arg[0], form) ?? arg[0]
        if (processLocal) {
            mchcLogger.log('processLocal', { arg })
        }
        onChange?.(...arg) ?? _inputProps.onChange?.(...arg)
    }
    const [warn, set_warn] = useState(false)
    useEffect(() => {

        set_warn(config.checkWarn?.(_value, form) ?? false)
        return () => {

        }
    }, [__value])


    return <Wrap>
        {
            C ? <C
                {...formDescriptionSpecialConfig}
                {...others}
                {...inputProps}
                warn={warn}
                value={_value}
                onChange={_onChange}
                formName={formName}
                name={config.name}
                config={config}
                form={form}
            /> : <></>
        }
    </Wrap>
}

export function InterceptDisplayFC(props: { config: IMchc_FormDescriptions_Field, C: any, value?: any, }) {
    const { config = {}, value, C, ...others } = props
    const { inputProps, processRemote } = config
    const _value = processRemote?.(value) ?? value

    return C.DisplayFC ? <C.DisplayFC  {...inputProps} value={_value} /> : null
}