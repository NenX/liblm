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
          <Col span={12}>
            {this.renderFieldItem({
              index: index,
              name: 'birthOrder',
              value: get(value, [`${index}`, 'birthOrder']),
              label: '出生次序',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'input_number',
            })}
          </Col>
          <Col span={12}>
            {this.renderFieldItem({
              index: index,
              name: 'gender',
              value: get(value, [`${index}`, 'gender']),
              label: '性别',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'select_with_options',
              inputProps: {
                options: [
                  { value: 1, label: '男' },
                  { value: 2, label: '女' },
                ],
              },
            })}
          </Col>
          <Col span={12}>
            {this.renderFieldItem({
              index: index,
              name: 'weight',
              value: get(value, [`${index}`, 'weight']),
              label: '体重(kg)',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'input_number',
            })}
          </Col>
          <Col span={12}>
            {this.renderFieldItem({
              index: index,
              name: 'height',
              value: get(value, [`${index}`, 'height']),
              label: '身长(cm)',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'input_number',
            })}
          </Col>
          <Col span={12}>
            {this.renderFieldItem({
              index: index,
              name: 'status',
              value: get(value, [`${index}`, 'status']),
              label: '健康状况',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'input_with_label',
            })}
          </Col>
          <Col span={12}>
            {this.renderFieldItem({
              index: index,
              name: 'birthDate',
              value: get(value, [`${index}`, 'birthDate']),
              label: '出生时间',
              labelSpan: 9,
              wrapperSpan: 13,
              inputType: 'single_date_picker',
              inputProps: {
                showTime: true,
                format: 'YYYY-MM-DD HH:mm',
              },
            })}
          </Col>
          <Col span={12}>
            {this.renderFieldItem({
              index: index,
              name: 'name',
              value: get(value, [`${index}`, 'name']),
              label: '新生儿姓名',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'input_with_label',
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
