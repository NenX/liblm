import React, { FC, useState } from 'react';
import { Button, FormInstance, message } from 'antd';
import { event } from '@lm_fe/utils'
import { isArray, isObject, set } from 'lodash';
import { mchcLogger } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field_Nullable } from '@lm_fe/service';
import { get_check_invert_values } from '../CheckboxWithInput_gold/utils';
const CheckAndCancelButton: FC<any> = function CheckAndCancelButton({
  name,
  type = 'primary',
  check_invert_values,
  form,
  size = 'middle',
  value = true,
  onChange,
  onClick,
  siblings,
  input_props
}: { [x: string]: any, form?: FormInstance, check_invert_values?: { [x: string]: [any, any] }, siblings?: IMchc_FormDescriptions_Field_Nullable[] }) {
  const [isCheck, setIsCheck] = useState(value);
  // const [type, setType] = useState('primary');  //更改type,样式未生效
  const [backgroundColor, setBackgroundColor] = useState('#0E318D');
  const [color, setColor] = useState('#fff');

  const handleClick = () => {
    setIsCheck(!isCheck);
    onChange?.(isCheck)
    // setType('default');   //更改type,样式未生效

    if (isCheck) {
      setBackgroundColor('#fff');
      setColor('#0E318D');
    }
    if (!isCheck) {
      setBackgroundColor('#0E318D');
      setColor('#fff');
    }

    onClick?.(name, isCheck);
    event.emit(CheckAndCancelButton.displayName!, `${name}`, isCheck)
    // mchcLogger.log('CheckAndCancelButton 111', { check_invert_values, form, isCheck })
    if (!form) {
      message.warning('请设置 form !')
      return
    }
    const checkValues = isObject(check_invert_values)
      ? check_invert_values
      : isArray(siblings)
        ? get_check_invert_values(siblings)
        : null
    if (checkValues) {
      const keys = Object.keys(checkValues)
      const old = form.getFieldsValue()

      keys.forEach((k, idx) => {
        const v = checkValues[k]
        const checkValue = isCheck ? v?.[0] : v?.[1]
        set(old, k, checkValue)
      })
      // mchcLogger.log('CheckAndCancelButton 222', { check_invert_values, old })
      form.setFieldsValue(old)
    }

  };

  return (
    <Button type={type} size={size} onClick={handleClick} {...input_props} style={{ backgroundColor, color }}>
      {isCheck ? '一键勾选' : '一键取消'}
    </Button>
  );
}
CheckAndCancelButton.displayName = 'CheckAndCancelButton'
export default CheckAndCancelButton