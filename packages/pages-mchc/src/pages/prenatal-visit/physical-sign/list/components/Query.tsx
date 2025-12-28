import React from 'react';
import { Button, Space } from 'antd';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { queryFormDescriptions } from '../config/form';
import { pickBy, identity } from 'lodash';
import { BaseQuery, formatTimeToDate } from '@lm_fe/components_m';

export default class Query extends BaseQuery {
  state = { queryFormDescriptions };

  handleView = (item) => {
    const values = this.form.getFieldsValue();
    const { onSearch } = this.props;
    const { queryFormDescriptions } = this.state;
    // 过滤无效数据
    const vals = pickBy(values, identity);
    let newValues = {};
    // 按照JPA CriteriaQuery规范处理查询条件
    for (var key in vals) {
      const filterType = queryFormDescriptions[key]['filterType'] || 'contains';
      const inputType = queryFormDescriptions[key]['inputType'];
      const paramType = queryFormDescriptions[key]['paramType'];
      // 时间组件处理
      if (inputType === 'date') {
        newValues = {
          ...newValues,
          [`${key}.${filterType}`]: formatTimeToDate(vals[key]),
        };
      } else if (inputType === 'rangeDate') {
        if (paramType === 'startAndEnd') {
          newValues = {
            ...newValues,
            startDate: formatTimeToDate(vals[key][0]),
            endDate: formatTimeToDate(vals[key][1]),
          };
        } else {
          newValues = {
            ...newValues,
            [`${key}.greaterOrEqualThan`]: formatTimeToDate(vals[key][0]),
            [`${key}.lessOrEqualThan`]: formatTimeToDate(vals[key][1]),
          };
        }
      } else {
        newValues = {
          ...newValues,
          [`${key}.${filterType}`]: vals[key],
        };
      }
    }
    // 区分首测与复测的入参
    if (item === 'firstView') {
      newValues = {
        ...newValues,
        'InitMeasure.equals': true,
      };
    } else if (item === 'review') {
      newValues = {
        ...newValues,
        'measureAgain.equals': true,
      };
    }

    onSearch && onSearch(newValues);
  };

  handleFirstView = () => {
    this.handleView('firstView');
  };

  handleReview = () => {
    this.handleView('review');
  };

  renderBtn = () => (
    <React.Fragment>
      <Button icon={<RedoOutlined />} onClick={this.handleReset}>
        重置
      </Button>
      <Space>
        <Button type="primary" icon={<SearchOutlined />} style={{ borderRadius: '0px 4px 4px 0' }} htmlType="submit">
          查询
        </Button>
        {/* <Button
          type="primary"
          icon={<SearchOutlined />}
          style={{ marginLeft: 1, borderRadius: 4 }}
          onClick={this.handleFirstView}
        >
          查询首测
        </Button>
        <Button type="primary" icon={<SearchOutlined />} style={{ borderRadius: 4 }} onClick={this.handleReview}>
          查询复测
        </Button> */}
      </Space>
    </React.Fragment>
  );
}
