import React from 'react';
import { Input, InputNumber, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { get } from 'lodash';
import classnames from 'classnames';
import styles from './index.module.less';
import { AnyObject, EMPTY_PLACEHOLDER } from '@lm_fe/utils';
import { TCommonComponent } from 'src/FU_components/types';
interface ValueType {
  "id": 274,
  "height": null,
  "weight": null,
  "systolic": 1,
  "diastolic": 11,
  "systolic2": 2,
  "diastolic2": 22,
  "systolic3": 3,
  "diastolic3": 33,
  "temperature": null,
  "pulse": null,
  "type": null,
  "remark": null
}
interface IProps {
  hiddenIpt?: boolean,
  disabled?: boolean,
  pressure_key1?: keyof ValueType
  pressure_key2?: keyof ValueType
}
// 此组件 value 为
const PressureInput: TCommonComponent<IProps, Partial<ValueType>> = function PressureInput(props) {
  const { onChange, value = {}, hiddenIpt, disabled, pressure_key1 = 'systolic', pressure_key2 = 'diastolic' } = props;
  const data = {
    ...value,
    [pressure_key1]: get(value, pressure_key1) || null,
    [pressure_key2]: get(value, pressure_key2) || null,
  };

  const handleChange = (type: keyof ValueType) => (value: any) => {
    data[type] = value;
    onChange && onChange(data);
  };

  const systolic = get(value, pressure_key1) || 0;
  const diastolic = get(value, pressure_key2) || 0;

  if (hiddenIpt) {
    return !systolic && !diastolic ? (
      <div className={styles["pressure-input-wrapper"]}>-- / --</div>
    ) : (
      <div className={styles["pressure-input-wrapper"]}>
        <span
          className={classnames({
            [styles['pressure-input_issue']]: systolic < 90 || systolic > 130,
          })}
        >
          {systolic}
        </span>
        <span className={styles["pressure-input_split"]}>/</span>
        <span
          className={classnames({
            [styles['pressure-input_issue']]: diastolic < 60 || diastolic > 90,
          })}
        >
          {diastolic}
        </span>
      </div>
    );
  }

  return (
    <Input.Group compact className={styles["pressure-input-wrapper"]}>
      <InputNumber
        disabled={disabled}
        className={classnames(styles['pressure-input'], {
          [styles['pressure-input_issue']]: systolic < 90 || systolic > 130,
        })}
        min={0}
        max={1000}
        placeholder="收缩压"
        value={systolic}
        onChange={handleChange(pressure_key1)}
      />
      <Input title={JSON.stringify(props)} className={styles["input-split"]} placeholder="/" disabled />
      <InputNumber
        disabled={disabled}

        className={classnames(styles['pressure-input'], {
          [styles['pressure-input_issue']]: diastolic < 60 || diastolic > 90,
        })}
        min={0}
        max={1000}
        placeholder="舒张压"
        value={diastolic}
        onChange={handleChange(pressure_key2)}
      />
      <Tooltip className={styles["pressure-input_tip"]} title={`收缩压的正常范围值是90~130mmHg，舒张压的正常范围值是60~90mmHg`}>
        <QuestionCircleOutlined />
      </Tooltip>
    </Input.Group>
  );
};
PressureInput.DisplayFC = (props) => {
  const { value, pressure_key1 = 'systolic', pressure_key2 = 'diastolic' } = props;

  return <div title={JSON.stringify(props)}>
    {value?.[pressure_key1] ?? EMPTY_PLACEHOLDER}
    /
    {value?.[pressure_key2] ?? EMPTY_PLACEHOLDER}

  </div>
}
export default PressureInput
