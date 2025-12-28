import { getPresetOptions } from '@lm_fe/env';
import { AutoComplete, SelectProps } from 'antd';
import { get, map } from 'lodash';
import React from 'react';
import { getInputStyle } from '../../utils';
import { LazyAntd } from '@lm_fe/components';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd
interface IProps extends SelectProps<any> {
  type?: any

  showSearch?: boolean;
  autoWrite?: boolean;
  placeholder?: string;
  dropdownMatchSelectWidth?: number | boolean;
}
export default (props: IProps) => {
  const {
    type = 'IDCardMapping',
    showSearch = true,
    autoWrite = false,
    dropdownMatchSelectWidth = true,
    placeholder,
    getPopupContainer = () => document.body,
    // style,
    ...rest
  } = props
  const _style = getInputStyle(props)

  if (autoWrite) {
    const autoParams = {
      dropdownMatchSelectWidth,
      placeholder,
      ...rest,
    };
    const a = getPresetOptions(type as any)
    return (
      <AutoComplete {...autoParams}>
        {map(a, (status) => (
          <AutoComplete.Option key={status.value} value={status.value}>
            {status.label}
          </AutoComplete.Option>
        ))}
      </AutoComplete>
    );
  }
  const a = getPresetOptions(type as any)

  return (
    <Select
      allowClear
      placeholder={placeholder || '请选择'}
      getPopupContainer={getPopupContainer}
      dropdownMatchSelectWidth={dropdownMatchSelectWidth}
      filterOption={(input, option) => {
        const filterData = get(option, 'children') || get(option, 'value');
        return filterData.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }}
      // bordered={false}
      style={{ color: get(rest, `warningOption`) == get(rest, 'value') ? '#ff517d' : '', ..._style }}
      {...rest}
    >
      {map(a, (status) => (
        <Select.Option key={status.value} value={status.value}>
          <span style={{ color: status.warning ? 'red' : '' }}>{status.label}</span>
        </Select.Option>
      ))}
    </Select>
  );
};
