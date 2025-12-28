import { ICommonOption, getPresetOptions, getSameOptions } from '@lm_fe/env';
import { SLocal_State } from '@lm_fe/service';
import { getSearchParamsValue, request } from '@lm_fe/utils';
import React, { useEffect, useRef, useState } from 'react';
import { IMemoriseItem, MyAutoCompleteProps } from './types';


const defaultOptions: ICommonOption[] = []

export function useConfig_MyAutoComplete(props: MyAutoCompleteProps) {

    const {
        optionKey,
        options = defaultOptions,
        searchKey,
        value,
        memorable,
        memorieskey,
        memoriesname,
        formName = 'unsetFormName',
        name,
        onChange,
        onBlur,
    } = props;

    const [__options, set__options] = useState<ICommonOption[]>([])
    const [init_value, setInit_value] = useState<string>()

    const _memorieskey = memorieskey ?? `${formName}.${name}`
    // const _memoriesname = memoriesname ?? SLocal_State.getUserData()?.login
    const _memoriesname = memoriesname ?? 'unset'

    const _memorable = memorable || !!memorieskey

    useEffect(() => {
        init()

        return () => { }
    }, [optionKey, options, searchKey])
    useEffect(() => {
        // if (!init_value && value) {
        //     setInit_value(value)
        // }
        setInit_value(value)

        return () => { }
    }, [value])

    function safeOnChange(str?: string) {
        setInit_value(str)
        onChange?.(str)
    }

    function init() {

        const preOptions = optionKey ? getPresetOptions(optionKey as any) : null
        const searchValue = searchKey ? getSearchParamsValue(searchKey) : null

        const _options = preOptions ?? (typeof options === 'string' ? getSameOptions(options) : options.map(o => typeof o === 'string' ? { value: o, label: o } : o))

        if (searchValue) {
            _options.push({ value: searchValue, label: searchValue })
        }
        if (_memorable) {

            request.get<IMemoriseItem[]>(`/api/text-memories?key.equals=${_memorieskey}`, { ignore_usr: true })
                .then(r => {
                    const arr = r.data ?? [];
                    _options.push(...arr.map(_ => ({ label: _.value, value: _.value, id: _.id })))
                    set__options(_options)

                })
        } else {
            set__options(_options)
        }
    }


    function _OnBlur(e: React.FocusEvent<HTMLElement>) {
        onBlur?.(e)
        setTimeout(() => {
            const thisValue = value
            if (!_memorable || !thisValue || __options.some(_ => _.value === thisValue)) return

            request.post<IMemoriseItem>(`/api/text-memories`, { key: _memorieskey, name: _memoriesname, value: thisValue }, { ignore_usr: true })
                .then(init)
        }, 10);
    };

    function remove(item: ICommonOption) {
        request.delete<IMemoriseItem>(`/api/text-memories/${item.id}`, { params: {}, ignore_usr: true })
            .then(r => {
                init()
                if (value === item.label) {
                    safeOnChange('')
                }
            })
    }
    return (
        {
            safeOnChange,
            onBlur: _OnBlur,
            init,
            options: __options,
            remove,
            init_value,
        }

    );
}
