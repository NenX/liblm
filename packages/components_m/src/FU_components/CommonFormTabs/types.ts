import { ReactNode } from 'react';

import { IMchc_FormDescriptions_Field } from '@lm_fe/service';
import { FormInstance, FormProps } from 'antd';


export interface ICommonFormTabsProps<T = any> {
    value?: T[]
    onTabChange(data: T[]): void
    title?: string,
    renderTabNode?(data: T, index: number): ReactNode
    onIdxChange?(v: number): void
    onChange(data: T[], index: number, changedValues: any): void
    disabled?: boolean
}

export interface IFormTabsProps<T = any> extends ICommonFormTabsProps<T> {
    fds?: IMchc_FormDescriptions_Field[]
    forms?: FormInstance[]
    DisplayFC_render?: (v?: any[]) => any,

    FormSize?: FormProps['size']

}
