import { Component } from 'react';
import { ICommonOption, mchcUtils, otherOptions } from '@lm_fe/env';
import { cloneDeep, get, isFunction, isString } from 'lodash';
import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

interface DefaultSelectProps {
  onChange: Function;
  value: any;
  options: Array<{
    label: string | number;
    value: string | number;
  }> | string
  multiple: boolean;
  tags: boolean;
  style?: any;
  disabled?: boolean
}

/**
 * 使用multiple 和 tags共同操作select
 * 可以自定义的时候 mode="tags" 然后在handleChange中控制输出
 * multiple - false | tags - false  单选 不可自定义输入
 * multiple - true  | tags - false  多选 不可自定义输入
 * multiple - false | tags - true   单选 可自定义输入
 * multiple - true  | tags - false  多选 可自定义输入
 */
class DefaultSelect extends Component<DefaultSelectProps> {
  handleChange = (val: any) => {
    const { onChange, multiple = false, tags = false } = this.props;
    if (tags) {
      if (multiple) {
        onChange(val);
      } else {
        onChange(val[val.length - 1]);
      }
    } else {
      onChange(val);
    }
  };

  renderOptions = (options: Array<{ label: string | number; value: string | number }>) => {
    return options.map((opt: { label: string | number; value: string | number }) => (
      <Select.Option key={opt.value} value={opt.value}>
        <span style={{ color: get(opt, `warn`) ? 'red' : '' }}>{opt.label}</span>
      </Select.Option>
    ));
  };

  render() {
    const {
      options = [],
      multiple = false,
      tags = false,
      style = {},
      dropdownMatchSelectWidth = true,
      uniqueKey,

    } = this.props;

    let cloneOptions = cloneDeep(options);
    if (isString(cloneOptions)) {
      const a = cloneOptions as keyof typeof otherOptions
      const b = otherOptions[a] as any

      cloneOptions = isFunction(b) ? b() : b
    }
    if (isString(uniqueKey)) cloneOptions = mchcUtils.getDictionariesEnumerations(uniqueKey) || [];

    let { value } = this.props;
    let selectMode: any = undefined;
    if (tags || multiple) {
      value = value !== undefined && value !== null && value !== '' ? value : [];
    } else {
      if (value !== undefined && value !== null && value !== '') {
        const opt = cloneOptions.filter((item: any) => item.value == value).pop();
        if (opt && opt.label) value = opt.value;
      } else {
        value = '';
      }
    }
    if (tags) {
      selectMode = 'tags';
    } else if (multiple) {
      selectMode = 'multiple';
    }
    return (
      <Select
        style={{ width: '100%', ...style }}
        value={value}
        allowClear
        showSearch
        disabled={this.props.disabled}
        mode={selectMode}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        onChange={this.handleChange}
      >
        {this.renderOptions(cloneOptions)}
      </Select>
    );
  }
}
export default DefaultSelect
