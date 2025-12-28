import React, { Component } from 'react';
import { Input, InputNumber, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { isEmpty, get } from 'lodash';
import './index.less';
interface BloodPressureProps {
  input_props: any;
  onChange: Function;
  value: any;
  validate: any;
  name: string;
  disabled?: boolean
}
class BloodPressure extends Component<BloodPressureProps> {
  render() {
    const { value, onChange, name, disabled } = this.props;

    let sysKey = '';
    let diaKey = '';
    if (name === 'physicalExam.systolic+diastolic') {
      sysKey = 'systolic';
      diaKey = 'diastolic';
    }
    if (name === 'physicalExam.systolic2+diastolic2') {
      sysKey = 'systolic2';
      diaKey = 'diastolic2';
    }
    if (name === 'physicalExam.systolic3+diastolic3') {
      sysKey = 'systolic3';
      diaKey = 'diastolic3';
    }
    if (name === 'physicalBaseExam.systolic+diastolic') {
      sysKey = 'systolic';
      diaKey = 'diastolic';
    }
    if (name === 'physicalBaseExam.systolic2+diastolic2') {
      sysKey = 'systolic2';
      diaKey = 'diastolic2';
    }
    if (name === 'physicalBaseExam.systolic3+diastolic3') {
      sysKey = 'systolic3';
      diaKey = 'diastolic3';
    }

    const systolic = get(value, sysKey) || '';
    const diastolic = get(value, diaKey) || '';

    const changeVal = (val: number, param: string) => {
      if (param === 'sys') {
        onChange({ [sysKey]: val, [diaKey]: diastolic });
      } else {
        onChange({ [sysKey]: systolic, [diaKey]: val });
      }
    };

    return (
      <Input.Group compact className="blood-pressure-input-group">
        <InputNumber
          min={0}
          disabled={disabled}
          style={{
            color: systolic < 90 || systolic > 130 ? '#ff517d' : '',
          }}
          placeholder="收缩压"
          value={systolic}
          onChange={(val: any) => changeVal(val, 'sys')}
        />
        <Input disabled defaultValue="/" />
        <InputNumber
          disabled={disabled}
          min={0}
          style={{
            color: diastolic < 60 || diastolic > 90 ? '#ff517d' : '',
          }}
          placeholder="舒张压"
          value={diastolic}
          onChange={(val: any) => changeVal(val, 'dia')}
        />
        <Tooltip className="blood-pressure_tip" title={`收缩压的正常范围值是90~130mmHg，舒张压的正常范围值是60~90mmHg`}>
          <QuestionCircleOutlined />
        </Tooltip>
      </Input.Group>
    );
  }
}
export default BloodPressure;
