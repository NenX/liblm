import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { IMchc_FormDescriptions_Field } from '@lm_fe/service';
import { uuid } from '@lm_fe/utils';
import { Button, ButtonProps, Divider } from 'antd';
import React, { useEffect, useRef } from 'react';
// import FormSection, { IFormSectionProps } from '../../BaseModalForm/FormSection';
// import { RenderEditItemStandalone, formatFormConfig } from '../../BaseModalForm/utils';
import { useMarshal } from '../../utils/useMarshal';
import { MyFormSection } from '../FormSection';
import { IFormSectionProps } from '../FormSection/types';
import { formatFormConfig, RenderEditItemStandalone } from '../FormSection/utils';
import { TCommonComponent } from '../types';
interface IProps extends IFormSectionProps {
    tip?: string
    defaultData?: any
    addBtnStyle?: ButtonProps
    marshal?: boolean
    actionConfig?: IMchc_FormDescriptions_Field
}
const ArrayPanel: TCommonComponent<IProps, string | any[]> = (props) => {
    const {
        tip,
        disabled,
        actionConfig = {},
        formDescriptions = [],
        targetLabelCol = 4,
        span = 6,
        value,
        defaultData = {},
        onChange,
        marshal = true,
        addBtnStyle = {},
        ...others
    } = props

    const defaultValue = useRef<any[]>([])

    const { safe_value = [], set_safe_value, onChangeSafeValue } = useMarshal<any[]>(marshal, value ?? defaultValue.current, onChange, 'ArrayPanel')
    useEffect(() => {


    }, [])
    function genDefaultData() {
        const _defaultData = defaultData ?? {}
        return { ..._defaultData, key: uuid() }
    }
    function onDel(idx: number) {
        safe_value.splice(idx, 1)
        onChangeSafeValue?.([...safe_value])
    }
    function getKey(item: any) {
        return item?.id ?? item?.key
    }
    function onChangeValue(idx: number, _key: any, _value: any) {
        const old = safe_value[idx]
        safe_value.splice(idx, 1, { ...old, [_key]: _value })
        onChangeSafeValue?.([...safe_value])
    }
    return <div>
        {/* <Button disabled={disabled} onClick={() => onChangeSafeValue?.([...safe_value, genDefaultData()])}>新增</Button>
         */}

        {
            safe_value.map((rowData, idx) => {
                return <div key={idx + getKey(rowData)}>
                    {
                        tip
                            ? <Divider style={{ margin: '4px 0', fontSize: 12, color: '#ccc' }} > {tip}{idx + 1}</Divider>
                            : null
                    }
                    <div style={{ display: 'flex', alignItems: 'center' }}>


                        <div style={{ flex: 1 }}>
                            <MyFormSection disableAll={disabled} key={getKey(rowData)}
                                renderEditItemInner={RenderEditItemStandalone}
                                targetLabelCol={targetLabelCol} span={span} {...others} formDescriptions={[
                                    ...formDescriptions.map(_fd => {
                                        if (!_fd) return _fd!
                                        const fd = formatFormConfig(_fd, targetLabelCol)
                                        const _key = fd.key
                                        const _inputProps = fd?.inputProps
                                        return {
                                            ...fd, inputProps: {
                                                ..._inputProps,
                                                placeholder: '',
                                                value: rowData[_key!],
                                                onChange(_value: any) {
                                                    onChangeValue(idx, _key, _value)
                                                }
                                            }
                                        }
                                    })
                                ]}
                            />
                        </div>
                        <div style={{ width: 32, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <MinusCircleOutlined style={{ color: 'red' }} rev={''} onClick={() => onDel(idx)} />
                        </div>

                    </div>

                </div>
            })
        }
        <Button disabled={disabled} style={{ marginTop: 6 }} type="dashed" block icon={<PlusOutlined rev={''} />} {...addBtnStyle} onClick={() => onChangeSafeValue([...safe_value, genDefaultData()])} >
            新增{tip}
        </Button>

    </div>
}
export default ArrayPanel