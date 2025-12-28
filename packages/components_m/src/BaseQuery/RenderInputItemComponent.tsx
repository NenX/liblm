import React from 'react';
import dayjs from 'dayjs';
import { Input, InputNumber, Checkbox, AutoComplete, Form } from 'antd';
import { AsyncSingleSelector, AsyncMultiSelector, AsyncInputSelector } from '../GeneralComponents/Select';
import CascaderAddress from '../selects/CascaderAddress';
import RangeInputNumber from '../GeneralComponents/RangeInputNumber';
import DataSelect from '../DataSelect';
import PatientAutoComplete from '../selects/PatientAutoComplete'
import { DatePicker_L, LazyAntd, RangePicker_L } from '@lm_fe/components';
import { getMomentRange } from '@lm_fe/utils';
const TreeSelect = LazyAntd.TreeSelect
const tplMap = {
  PatientAutoComplete: (props) => {
    return <PatientAutoComplete allowClear style={{ width: 138 }} {...props} />;
  },
  input: (props) => {
    return <Input allowClear style={{ width: 138 }} {...props} />;
  },
  number: (props) => {
    return <InputNumber {...props} />;
  },
  rangeInputNumber: (props) => {
    return <RangeInputNumber {...props} />;
  },
  select: (props) => {
    return <AsyncSingleSelector style={{ minWidth: 98 }} {...props} />;
  },
  multiselect: (props) => {
    return <AsyncMultiSelector style={{ minWidth: 135 }} {...props} />;
  },
  inputSelect: (props) => {
    return <AsyncInputSelector style={{ minWidth: 135 }} {...props}></AsyncInputSelector>;
  },
  autoComplete: (props) => {
    return <AutoComplete style={{ minWidth: 135 }} {...props} />;
  },
  treeSelect: ({ options, ...rest }) => {
    return (
      <TreeSelect
        allowClear
        // treeDefaultExpandAll
        dropdownMatchSelectWidth={false}
        style={{ minWidth: 135 }}
        treeData={options}
        {...rest}
      />
    );
  },
  checkbox: (props) => {
    return <Checkbox {...props} />;
  },
  date: (props) => {
    return <DatePicker_L allowClear {...props} />;
  },
  address: (props) => {
    return <CascaderAddress id={props.name} {...props} />;
  },
  rangeDate: ({ placeholder, ...rest }) => {
    return (
      <RangePicker_L
        // ranges={getMomentRange(dayjs()) as any}

        format="YYYY-MM-DD"
        style={{ width: 216 }}
        {...rest}
      />
    );
  },
  rangeDateTime: ({ placeholder, ...rest }) => {
    return (
      <RangePicker_L
        // ranges={getMomentRange(dayjs()) as any}

        showTime={{
          defaultValue: [dayjs('00:00', 'HH:mm'), dayjs('23:59', 'HH:mm')],
        }}
        format="YYYY-MM-DD HH:mm"
        style={{ width: 282 }}
        placeholder={['开始时间', '结束时间']}
        {...rest}
      />
    );
  },
  symbol: (props) => {
    return (
      <span style={{ display: 'inline-block', lineHeight: '32px', padding: '0 5px', marginRight: '-12px' }}>
        {props.label || '~'}
      </span>
    );
  },
  dataSelect: (props) => {
    return <DataSelect {...props} style={{ width: '120px' }} />;
  },
};
export default function RenderInputComponent({ inputType = 'input', name, label = '', rules = [], ...rest }: any) {
  const Component = tplMap[inputType];
  let placeholder = ['elect', 'icker'].includes(inputType) ? `请选择${label}` : `请输入${label}`;
  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      noStyle={inputType === 'symbol'}
      valuePropName={inputType === 'checkbox' ? 'checked' : 'value'}
    >
      {Component ? (
        <Component placeholder={placeholder} name={name} {...rest} />
      ) : (
        <span style={{ color: '#999' }}>{`请补充${inputType}组件`}</span>
      )}
    </Form.Item>
  );
}

