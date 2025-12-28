import React, { Component } from 'react';
import { AutoComplete, Row, Col, Divider } from 'antd';
import { isArray, map, concat } from 'lodash';
import { request } from '@lm_fe/utils';
const { Option } = AutoComplete;
export default class AsyncAutoComplete extends Component {
  state = {
    options: [],
    scrollPage: 0,
  };

  handleFocus = () => {
    const { options } = this.state;
    const { value } = this.props;
    if (options && options.length > 0) {
      return;
    }
    this.fetchOptions(value);
  };

  handleSearch = (value: string) => {};

  handleSelect = (value, option) => {
    console.log('--------', value, option);
  };

  handlePopupScroll = (e) => {
    e.persist();
    const target = e.target;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      const { scrollPage } = this.state;
      console.log('----scrollPage----', scrollPage);
      this.fetchOptions(this.props.value, scrollPage);
    }
  };

  fetchOptions = (value: string, page: number = 0) => {
    const { api, valueKey } = this.props;
    const { options, scrollPage } = this.state;
    request
      .get(api, {
        params: {
          size: 10,
          page,
          [`${valueKey}.contains`]: value,
        },
      })
      .then((r) => {
        const newOptions = concat(options, r);
        this.setState({ options: newOptions, scrollPage: scrollPage + 1 });
      });
  };

  render() {
    const { options } = this.state;
    const { valueKey, columns } = this.props;
    return (
      <AutoComplete
        dropdownMatchSelectWidth={false}
        onSearch={this.handleSearch}
        onPopupScroll={this.handlePopupScroll}
        onFocus={this.handleFocus}
        onSelect={this.handleSelect}
        placeholder="请输入"
      >
        {isArray(options) &&
          options.map((option: any) => (
            <Option key={`${option?.id}`} value={option[valueKey]}>
              <Row gutter={6}>
                {map(columns, (column) => {
                  return (
                    <React.Fragment key={column.key}>
                      <Col className="text-overflow" style={{ width: column?.width || 56 }}>
                        {option[column?.key]}
                      </Col>
                      <Divider type="vertical" />
                    </React.Fragment>
                  );
                })}
              </Row>
            </Option>
          ))}
      </AutoComplete>
    );
  }
}
