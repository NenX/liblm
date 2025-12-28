import React, { Component } from 'react';
import { get } from 'lodash';
import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd
export default class CustomTreeSelect extends Component {
  handleChange = (data) => {
    const { onChange } = this.props;
    onChange && onChange(data);
  };

  render() {
    const { isMultiple, multiple, options, value, getPopupContainer = () => document.body, ...rest } = this.props;
    return (
      <TreeSelect
        {...rest}
        allowClear
        dropdownMatchSelectWidth={get(this.props, 'dropdownMatchSelectWidth') || 350}
        getPopupContainer={getPopupContainer}
        style={{ width: '100%' }}
        treeData={options}
        multiple={multiple || isMultiple}
        onChange={this.handleChange}
        value={value}
      />
    );
  }
}
