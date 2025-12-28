import { mchcEvent, mchcLogger } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field, IMchc_FormDescriptions_Field_Nullable, IMchc_FormDescriptions_MIX, SMchc_FormDescriptions } from '@lm_fe/service';
import { expect_array, request, safe_json_parse } from '@lm_fe/utils';
import { FormInstance, Tabs, message } from 'antd';
import classnames from 'classnames';
import { isArray, isEmpty, isFunction, isObject, isString } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';


import styles from '../../BaseEditPanel/less/base-edit-panel-form.module.less';
import { IFormSectionProps, } from './types';
import { useReadIdNO } from '../IdNOButton';



export function getFormItemControl(getFieldValue: FormInstance, config: IMchc_FormDescriptions_Field) {
    const dependency = config?.inputProps?.dependency

    if (dependency) {
        return getFormItemControlByDependency(getFieldValue, config)
    } else {
        return getFormItemControlByNew(getFieldValue, config)
    }

}

function getFormItemControlByNew(form_ins: FormInstance, config: IMchc_FormDescriptions_Field) {

    const showDeps = config?.showDeps
    const requiredDeps = config?.requiredDeps
    const disabledDeps = config?.disabledDeps

    const res = {
        isShow: compute_dep_status(form_ins, showDeps, !showDeps),
        isRequired: compute_dep_status(form_ins, requiredDeps),
        isDisabled: compute_dep_status(form_ins, disabledDeps,),
    }
    return res
}
function compute_dep_status(form_ins: FormInstance, dep_config: IMchc_FormDescriptions_Field['showDeps'], default_status = false) {
    if (isFunction(dep_config)) {
        return dep_config(form_ins)
    }
    const config_obj = dep_config ?? {}
    const dep_keys = Object.keys(config_obj)

    return dep_keys.reduce((state, k) => state || getDepStatus(form_ins, k, config_obj[k]), default_status)
}
function getFormItemControlByDependency(form_ins: FormInstance, config: IMchc_FormDescriptions_Field) {
    const dependency = config?.inputProps?.dependency

    return {
        isShow: getDepStatus(form_ins, dependency?.show?.key, dependency?.show?.value),
        isDisabled: getDepStatus(form_ins, dependency?.disabled?.key, dependency?.disabled?.value),
        isRequired: getDepStatus(form_ins, dependency?.required?.key, dependency?.required?.value),
    }
}

function getDepStatus(form_ins: FormInstance, depKey: string | string[] = '', depValue: any[] | ((v: any) => boolean) = []) {





    //key值有.的情况下showKey处理
    if (isString(depKey) && depKey.includes('.')) {
        depKey = depKey.split('.')
    }
    const __showVal = form_ins.getFieldValue(depKey)
    const targetShowVal = getUglyValue(__showVal)

    if (isFunction(depValue))
        return depValue(targetShowVal)

    return depValue.includes(targetShowVal)
}

function getUglyValue(v: any) {
    const __value = safe_json_parse(v, v)

    let checkedValue = __value
    if (isArray(__value)) {
        return getUglyArrValue(__value)
    }
    if (isObject(__value)) {
        // [todo]:如果是多选的情况 如何处理
        return getUglyObjValue(__value)
    }
    return checkedValue
}

function getUglyArrValue(__arr: any) {
    if (!isArray(__arr)) return __arr
    if (__arr.length > 1) {
        return __arr.map(getUglyObjValue).join(',')
    }
    return getUglyObjValue(__arr[0])
}
function getUglyObjValue(__obj: any) {
    return __obj?.value ?? __obj?.key ?? __obj?.checkedValues?.[0]
}

export function RenderTab(props: { fds: IMchc_FormDescriptions_Field_Nullable[], renderContent(arr: IMchc_FormDescriptions_Field_Nullable[]): any, form?: FormInstance }) {
    const { fds, renderContent, form } = props

    const configArr = expect_array(fds)
    const firstTab = configArr[0]
    const FirstTitle = SMchc_FormDescriptions.get_form_item_title_or_Name(firstTab)

    const [activeKey, setActiveKey] = useState(FirstTitle)

    function changeActiveKey(k: string) {
        setActiveKey(k)
        mchcEvent.emit('my_form', {
            type: 'onTabChange',
            activeKey: k,
            oldKey: activeKey,
            form,
        })
    }

    return <Tabs
        size='small'
        tabBarStyle={{ marginBottom: 4 }}
        activeKey={activeKey}
        onChange={k => {
            const items = configArr.find(_ => {
                const title = SMchc_FormDescriptions.get_form_item_title_or_Name(_)
                return title === activeKey
            })
            if (form && items) {
                const arr = items.children ?? []

                const keys = arr.map(_ => SMchc_FormDescriptions.parse_form_item_name(_))
                form.validateFields(keys)
                    .then(
                        () => changeActiveKey(k)
                    )
                    .catch((e) => {

                        const errorFields: any[] = e?.errorFields ?? []
                        const str = errorFields
                            .map(_ => {
                                const errorText = _.errors[0]
                                return errorText as string
                            })
                            .filter(_ => _)
                            .join('、')
                        message.warning(str)

                    })

            } else {
                changeActiveKey(k)
            }
        }}

    >
        {
            configArr.map(_ => {
                const title = SMchc_FormDescriptions.get_form_item_title_or_Name(_)
                const tabConfig = _?.children ?? []


                return <Tabs.TabPane tabKey={title} key={title} tab={<span style={{ textDecorationLine: _?.remote_filter_key ? 'underline' : 'unset' }}>{title}</span>}>

                    {isEmpty(tabConfig) ? `请配置${title}的 children` : renderContent(tabConfig)}

                </Tabs.TabPane>

            })
        }
    </Tabs >
};



export function RenderSection(props: { fd: IMchc_FormDescriptions_Field_Nullable, renderContent(arr: IMchc_FormDescriptions_Field_Nullable[]): React.JSX.Element, form?: FormInstance }) {
    const { fd, renderContent, } = props
    if (!fd) return null
    const { containerType = 'section(default)', children = [], collapsed } = fd
    if (isEmpty(children)) return null
    const title = SMchc_FormDescriptions.get_form_item_title_or_Name(fd)
    const [hidden, setHidden] = useState(collapsed)

    const node = <div hidden={hidden}>{renderContent(children)}</div>
    if (containerType === 'plain')
        return (
            <>
                {/* {this.renderItem({ ...withTitle, inputType: 'title' })} */}
                <div hidden={!title} style={{ padding: '4px 0', fontWeight: 'bold', fontSize: 20, color: '#150f55', borderBottom: '1px dashed #150f55', margin: '6px 0 12px 0', textIndent: 12 }}>
                    {title}
                </div>
                {node}
            </>
        )



    return title
        ? <div className={classnames(styles['base-edit-panel-form_section'], { [styles['border']]: true })} >
            <span className={styles["base-edit-panel-form_section_title"]} style={{ cursor: 'pointer' }} onClick={() => setHidden(!hidden)}>
                {hidden ? '▶ ' : '▼ '}
                <span style={{ textDecorationLine: fd?.remote_filter_key ? 'underline' : 'unset' }}>{title}</span>
            </span>
            {node}
        </div>
        : node
};




export function use_form_config(props: IFormSectionProps) {
    const { formDescriptions } = props
    const form = props.form as FormInstance & { setFieldsValue_old: FormInstance['setFieldsValue'] }
    const value_cache = useRef()

    const { id_NO_msg } = useReadIdNO()

    const [form_config, setForm_config] = useState<IMchc_FormDescriptions_Field_Nullable[]>()


    if (form) {
        if (!form.setFieldsValue_old) {
            form.setFieldsValue_old = form.setFieldsValue
        }

        form.setFieldsValue = (value: any,) => {
            if (!form_config) {
                value_cache.current = value
            } else {
                form.setFieldsValue_old?.(value)
            }
        };
    }
    useEffect(() => {
        return () => {

        }
    }, [])

    useEffect(() => {

        formDescriptions && SMchc_FormDescriptions.filter_form_config(formDescriptions)
            .then(f => {
                setForm_config(f)
                if (value_cache.current) {

                    setTimeout(() => {

                        form?.setFieldsValue(value_cache.current,)
                        value_cache.current = undefined
                    }, 400);
                }
            })

        return () => {

        }
    }, [formDescriptions])

    useEffect(() => {

        if (id_NO_msg?.data && form) {
            form.setFieldsValue(id_NO_msg.data)
        }
    }, [id_NO_msg])

    return [form_config]
}

