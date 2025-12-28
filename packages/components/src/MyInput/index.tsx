import React from 'react';
import { Input, message } from 'antd';
import { forwardRef, useState, useEffect } from 'react';
import { IMyInputProps } from './types';
import { mchcEvent, mchcLogger } from '@lm_fe/env';
import { getInputStyle, } from 'src/utils';
export * from './types';
export const MyInput = forwardRef<Input, IMyInputProps>((props, myRef) => {
    const { width, style = {}, placeholder, name, warn = false, form, onBlur, onFocus, value, onChange, ...others } = props
    const [_value, set_value] = useState(value)

    useEffect(() => {
        set_value(value)
    }, [value])
    const _style = getInputStyle(props)
    if (warn) {
        _style.color = 'red'
    }
    return <Input title={JSON.stringify(_style)} ref={myRef} value={_value}
        onChange={e => {
            const v = e.target.value
            set_value(v)
            onChange?.(v)
        }}
 
        onBlur={e => {
            onBlur?.(e)
            mchcEvent.emit('my_form', {
                type: 'onBlur',
                name,
                value,
                form,
            })
        }}
        onFocus={e => {
            onFocus?.(e)
            mchcEvent.emit('my_form', {
                type: 'onFocus',
                name,
                value,
                form,
            })
        }}

        style={_style}
        {...others}
        // placeholder={placeholder ?? '请输入'}
        placeholder={'请输入'}
    />
})


