import { ICommonOption } from '@lm_fe/env';
import { AutoCompleteProps } from 'antd';

export interface IMemoriseItem {
    "id": 6591,
    "key": "vitaminSignature",
    "name": "vitamin签名",
    "value": "钟财玉谢谢",
    "sort": null
}

export type MyAutoCompleteProps = Omit<AutoCompleteProps, 'options' | 'onChange'> & {
    onChange?(str?: string): void
    optionKey?: string,
    memorieskey?: string,
    memoriesname?: string,
    memorable?: boolean,
    name?: string,
    formName?: string,
    searchKey?: string,
    width?: any,
    options?: string | (string | ICommonOption)[]
}
