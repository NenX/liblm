import React, { useState, useEffect } from 'react'
import { Checkbox, Row, Col, Input, InputNumber } from 'antd'
import { get, filter, indexOf, isEmpty, set, cloneDeep } from 'lodash'
interface IProps {
    selectValue?: any
    options?: any
    onChange?: any
    type?: 'single' | 'multiple'
    disabled?: boolean
    span?: number
}
export default (props: IProps) => {
    const { options = [], type = 'single', selectValue, onChange, disabled = false, span = 4 } = props
    const [data, setData] = useState({})
    useEffect(() => {
        !isEmpty(selectValue) && !disabled && setData(selectValue)
        !isEmpty(selectValue) && !disabled && onChange && onChange(selectValue)
    }, [selectValue])

    useEffect(() => {
        if (disabled) {
            setData({})
            onChange && onChange({})
        }
    }, [disabled])

    const handleCheckBoxChange = (checkedValues: any) => {
        const tempData = cloneDeep(data)
        const oldCheckedValues = get(data, 'checkedValues')
        let newCheckedValues = checkedValues

        if (type === 'single') {
            newCheckedValues = filter(checkedValues, (item) => indexOf(oldCheckedValues, item) === -1)
            //set(tempData, 'withInputValues', {});
        }
        // data[key] = val;
        set(tempData, 'checkedValues', newCheckedValues)
        setData(tempData)
        onChange && onChange(tempData)
    }

    const inputChange = (value: any, option: any) => {
        const tempData = cloneDeep(data)
        const inputValue = value
        set(tempData, `withInputValues.${get(option, 'value')}`, {
            key: get(option, 'value'),
            value: {
                0: inputValue,
            },
        })
        setData(tempData)
        onChange && onChange(tempData)
    }

    return (
        <Checkbox.Group
            disabled={disabled}
            value={!disabled && get(data, 'checkedValues')}
            onChange={handleCheckBoxChange}
            style={{ paddingTop: 6 }}
        >
            {options.map((item: any) => {
                return (
                    <React.Fragment key={item.value}>
                        <div className="single-checkbox">
                            <Checkbox value={item.value}>{item.label}</Checkbox>

                            {!disabled &&
                            get(item, 'withInput') &&
                            indexOf(get(data, 'checkedValues'), item.value) > -1 ? (
                                <React.Fragment>
                                    <div className="with-input" style={{ marginLeft: 24 }}>
                                        <span style={{ color: '#FE547B' }}>号源:</span>
                                        <InputNumber
                                            style={{ ...get(item, 'style') }}
                                            onChange={(value) => inputChange(value, item)}
                                            value={get(data, `withInputValues.${item.value}.value.0`)}
                                            placeholder={get(item, 'inputPlaceholder') || '请输入'}
                                            min={0}
                                        />
                                        <span style={{ color: '#FE547B' }}>个</span>
                                    </div>
                                </React.Fragment>
                            ) : (
                                <div className="with-input-null" style={{ height: '24.6px' }}></div>
                            )}
                        </div>
                    </React.Fragment>
                )
            })}
        </Checkbox.Group>
    )
}
