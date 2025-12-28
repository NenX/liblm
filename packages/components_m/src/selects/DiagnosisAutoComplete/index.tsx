import { request } from '@lm_fe/utils';
import { AutoComplete, Col, Row } from 'antd';
import { get, map } from 'lodash';
import { Component } from 'react';
export default class DiagnosisAutoComplete extends Component {
  state = {
    data: undefined,
    options: [],
  };

  componentDidMount() {
    const { value } = this.props;
    this.setState({
      data: value,
    });
  }

  handleGetOptions = async (searchText) => {
    // const options = await getAllResources(`/api/template-trees`, {
    //   'type.equals': 1,
    //   'code.contains': searchText,
    //   'mnemonic.contains': searchText,
    //   'val.contains': searchText,
    // });
    const options = await request.get(
      `/api/template-trees?type.equals=1&code.contains=${searchText}&mnemonic.contains=${searchText}&val.contains=${searchText}&size=999`,
      {
        headers: {
          isLoading: false,
        },
      },
    );
    this.setState({
      options: options.data,
    });
  };

  handleChange = async (data) => {
    const { onChange } = this.props;
    this.setState({
      data,
    });
    onChange && onChange(data);
  };

  render() {
    const { data, options } = this.state;
    return (
      <AutoComplete
        dropdownMatchSelectWidth={800}
        onSearch={this.handleGetOptions}
        onChange={this.handleChange}
        value={data}
      >
        {map(options, (option, index) => {
          return (
            <AutoComplete.Option key={get(option, 'id') || index} value={get(option, 'val')}>
              <Row>
                <Col span={2}>{get(option, 'code') || '--'}</Col>
                <Col span={6} offset={1} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {get(option, 'mnemonic') || '--'}
                </Col>
                <Col span={14} offset={1}>
                  {get(option, 'val') || '--'}
                </Col>
              </Row>
            </AutoComplete.Option>
          );
        })}
      </AutoComplete>
    );
  }
}
