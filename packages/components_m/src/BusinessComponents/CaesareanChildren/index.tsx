import BaseFormComponent from '../../BaseFormComponent';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Col, Row, Space } from 'antd';
import { map, cloneDeep, set, get, isEmpty } from 'lodash';
import React, { Component } from 'react';
import styles from './index.less';
export default class CaesareanChildren extends Component<any, any> {
  state = {
    childrens: [{}],
    outData: {},
  };
  componentDidMount() {
    if (this.props.value && !isEmpty(this.props.value)) {
      this.setState({
        childrens: this.props.value,
      });
    }
  }

  handleAdd = () => {
    const { childrens } = this.state;
    this.setState({
      childrens: [...childrens, {}],
    });
  };
  handleDelete = (index: any) => {
    const { childrens } = this.state;
    childrens.splice(index, 1);
    this.setState({
      childrens,
    });
  };
  handleChange = (callbackData: any, name: any, index: any) => {
    const { onChange } = this.props;
    const { outData, childrens } = this.state;
    set(childrens[index], name, callbackData);
    this.setState(
      {
        outData: childrens,
        childrens: childrens,
      },
      () => {
        onChange && onChange(this.state.outData);
      },
    );
  };

  renderFieldItem = ({
    name,
    value,
    label,
    inputType,
    labelSpan = 12,
    wrapperSpan = 12,
    inputProps = {},
    index = 0,
  }) => {
    return (
      <Row className={styles["nurse-children__field"]}>
        <Col className={styles["nurse-children__field-label"]} span={labelSpan}>
          <span>{label}：</span>
        </Col>
        <Col className={styles["nurse-children__field-input"]} span={wrapperSpan}>
          <BaseFormComponent
            name={name}
            value={value}
            inputType={inputType}
            {...inputProps}
            onChange={(e) => {
              this.handleChange(e, name, index);
            }}
          />
        </Col>
      </Row>
    );
  };
  renderChildrenItem = (children: any, index: any, value: any) => {
    return (
      <div key={index}>
        <div style={{ paddingLeft: 30, color: '#3d8bf7' }}>
          <span>新生儿{index + 1}：</span>
          <Space>
            <PlusCircleOutlined onClick={this.handleAdd} />
            {this.state.childrens.length > 1 ? (
              <MinusCircleOutlined
                onClick={() => {
                  this.handleDelete(index);
                }}
              />
            ) : null}
          </Space>
        </div>
        <Row>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'fetusDeliveryTime',
              value: get(value, [`${index}`, 'fetusDeliveryTime']),
              label: '胎儿娩出时间',
              labelSpan: 9,
              wrapperSpan: 13,
              inputType: 'single_date_picker',
              inputProps: {
                showTime: true,
                format: 'YYYY-MM-DD HH:mm',
              },
            })}
          </Col>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'placentaDeliveryTime',
              value: get(value, [`${index}`, 'placentaDeliveryTime']),
              label: '胎盘娩出时间',
              labelSpan: 9,
              wrapperSpan: 13,
              inputType: 'single_date_picker',
              inputProps: {
                showTime: true,
                format: 'YYYY-MM-DD HH:mm',
              },
            })}
          </Col>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'gender',
              value: get(value, [`${index}`, 'gender']),
              label: '性别',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'pure_checkbox',
              inputProps: {
                config: {
                  special_config: JSON.stringify({
                    options: [
                      {
                        label: '男',
                        value: 1,
                        span: 8,
                      },
                      {
                        label: '女',
                        value: 2,
                        span: 8,
                      },
                      {
                        label: '未知',
                        value: 3,
                        span: 8,
                      },
                    ],
                    type: 'single',
                  }),
                },
              },
            })}
          </Col>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'weight',
              value: get(value, [`${index}`, 'weight']),
              label: '出生体重',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'input_with_label',
              inputProps: {
                type: 'number',
                labelAfter: 'g',
              },
            })}
          </Col>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'height',
              value: get(value, [`${index}`, 'height']),
              label: '身长',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'input_with_label',
              inputProps: {
                type: 'number',
                labelAfter: 'cm',
              },
            })}
          </Col>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'facadeDeformity',
              value: get(value, [`${index}`, 'facadeDeformity']),
              label: '外观畸形',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'pure_checkbox',
              inputProps: {
                config: {
                  special_config: JSON.stringify({
                    options: [
                      {
                        label: '无',
                        value: 1,
                        span: 8,
                      },
                      {
                        label: '有',
                        value: 2,
                        span: 8,
                      },
                    ],
                    type: 'single',
                  }),
                },
              },
            })}
          </Col>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'apgar1',
              value: get(value, [`${index}`, 'apgar1']),
              label: 'Apgar评分1分钟',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'input_with_label',
              inputProps: {
                type: 'number',
                labelAfter: '分',
              },
            })}
          </Col>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'apgar5',
              value: get(value, [`${index}`, 'apgar5']),
              label: '5分钟',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'input_with_label',
              inputProps: {
                type: 'number',
                labelAfter: '分',
              },
            })}
          </Col>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'apgar10',
              value: get(value, [`${index}`, 'apgar10']),
              label: '10分钟',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'input_with_label',
              inputProps: {
                type: 'number',
                labelAfter: '分',
              },
            })}
          </Col>
        </Row>
      </div>
    );
  };
  render() {
    const { childrens } = this.state;
    const { value } = this.props;
    return (
      <div>
        {map(childrens, (children, index) => {
          return this.renderChildrenItem(children, index, value);
        })}
      </div>
    );
  }
}
