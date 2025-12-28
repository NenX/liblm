import { Button, Form } from 'antd';
import React, { useEffect } from 'react';
import { useMarshal } from '../../utils/useMarshal';
// import FormSection, { IFormSectionProps } from '../../BaseModalForm/FormSection';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { IMchc_FormDescriptions_Field, SMchc_FormDescriptions } from '@lm_fe/service';
import { cloneDeep } from 'lodash';

import { MyFormSection } from '../FormSection';
import { IFormSectionProps } from '../FormSection/types';
import { TCommonComponent } from '../types';
interface IProps extends IFormSectionProps {
    defaultData?: any
    config: IMchc_FormDescriptions_Field
    marshal?: boolean
}
export const MyFormList_必须搭配Form使用: TCommonComponent<IProps, string | any[]> = (props) => {
    const {
        defaultData = {},
        config,
        disabled,
        formDescriptions = [],
    } = props


    useEffect(() => {

    }, [])

    return <div>

        <Form.List name={config?.name!}>
            {(fields, { add, remove }) =>
                <>
                    {
                        fields.map(field => {
                            const { name, key } = field
                            const configs = cloneDeep(formDescriptions)
                            const arr = configs.map(f => {
                                if (!f) return f!
                                const nArr = SMchc_FormDescriptions.parse_form_item_name(f)
                                const k1 = nArr[0]
                                if (!isNaN(Number.parseInt(k1)))
                                    return f
                                nArr.unshift(name)
                                SMchc_FormDescriptions.set_form_item_name(f, nArr)
                                return f

                            })

                            return (
                                <div style={{ display: 'flex' }}>
                                    <div style={{ flex: 1 }}>
                                        <MyFormSection key={key} disableAll={disabled} formDescriptions={arr} />
                                    </div>
                                    <div style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MinusCircleOutlined rev={''} onClick={() => remove(name)} />
                                    </div>
                                </div>
                            )
                        }
                        )
                    }
                    <Form.Item>
                        <Button type="dashed" onClick={() => add(defaultData)} block icon={<PlusOutlined rev={''} />}>

                        </Button>
                    </Form.Item>
                </>
            }

        </Form.List>


    </div>
}
MyFormList_必须搭配Form使用.DisplayFC = (props) => {
    const {
        formDescriptions = [],
        targetLabelCol = 4,
        span = 6,
        value,
        defaultData,
        onChange,
        marshal = true,
        ...others
    } = props


    const { safe_value = [], set_safe_value, onChangeSafeValue } = useMarshal<any[]>(marshal, value ?? [], onChange)

    return <div>

        {/* {
            safe_value.map(_ => {
                if (fd) {
                    return _[_fd.key!]
                } else {
                    return ''
                }
            }).filter(_ => _).join(',')
        } */}
        {safe_value.length}项
    </div>
}