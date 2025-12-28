import { IMchc_FormDescriptions_MIX } from '@lm_fe/service';
import { FormInstance, FormItemProps } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import React from 'react';
import { RenderEditItem } from './utils';

// import commonStyles from '../themes/common.less'
export interface IFormSectionProps {
    onLoad?(): void
    needControl?: boolean
    renderEditItem?: (key: string, ReactNode: React.ReactNode, others?: FormItemProps) => React.ReactNode
    renderEditItemInner?: typeof RenderEditItem
    formDescriptions?: IMchc_FormDescriptions_MIX
    id?: number | string
    formName?: string
    data?: any
    extraData?: any
    form?: FormInstance
    products?: any
    events?: any
    disableAll?: boolean
    defaultOptions?: FormItemProps
    onExtra?: () => void
    registrationEvents?: any
    size?: SizeType
    sectionName?: string
    span?: number
    inline?: boolean
    targetLabelCol?: number
    defaultFormItemLayout?: string
    defaultRequired?: boolean
    requiredKeys?: { [x: string]: boolean }
}


