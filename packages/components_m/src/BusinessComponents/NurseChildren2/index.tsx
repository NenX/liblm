import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { safe_json_parse } from '@lm_fe/utils';
import { Col, Row, Space } from 'antd';
import { get, isEmpty, map, set } from 'lodash';
import { Component } from 'react';
import BaseFormComponent from '../../BaseFormComponent';
import styles from './index.less';
import React from 'react';
export default class NurseChildren extends Component {
  state = {
    childrens: [{}],
    outData: {},
  };
  componentDidMount() {
    if (this.props.value && !isEmpty(this.props.value.gnaFetuses)) {

      this.setState({
        childrens: this.props.value.gnaFetuses,
      });
    }
  }

  handleAdd = () => {
    const { childrens } = this.state;
    this.setState({
      childrens: [...childrens, {}],
    });
  };
  handleRm = (idx: number) => {
    const { childrens } = this.state;
    childrens.splice(idx, 1)
    this.setState({
      childrens: [...childrens],
    });
  };
  handleChange = (callbackData, name, index) => {
    const { onChange } = this.props;
    const { outData, childrens } = this.state;
    if (name === 'fetalHeartRate' || name === 'fetalPosition' || name === 'presentation') {
      set(childrens[index], name, callbackData);
      this.setState(
        {
          outData: {
            ...this.props.value,
            ...outData,
            gnaFetuses: childrens,
          },
          childrens: childrens,
        },
        () => {

          onChange && onChange(this.state.outData);
        },
      );
    } else {
      this.setState(
        {
          outData: {
            ...this.props.value,
            ...outData,
            [name]: callbackData,
          },
        },
        () => {
          onChange && onChange(this.state.outData);
        },
      );
    }
  };

  renderFieldItem = ({
    name,
    value,
    label,
    inputType,
    labelSpan = 6,
    wrapperSpan = 16,
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
        <div style={{ paddingLeft: 30 }}>
          <span>胎儿{index + 1}：</span>
          <Space>

            <PlusCircleOutlined onClick={this.handleAdd} />
            <MinusCircleOutlined onClick={() => this.handleRm(index)} />
          </Space>
        </div>
        <Row>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'fetalHeartRate',
              value: get(value, `gnaFetuses[${index}].fetalHeartRate`),
              label: '胎心率',
              inputType: 'MyCheckbox',
              inputProps: {
                // marshal: false,
                options: [
                  { value: 1, label: '齐', inputType: 'MyInput', props: { style: { width: 64 } } },
                  { value: 2, label: '不齐', inputType: 'MyInput', props: { style: { width: 64 } } },
                ]
              },
            })}
          </Col>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'fetalPosition',
              value: get(value, `gnaFetuses[${index}].fetalPosition`),
              label: '胎方位',
              inputType: 'MySelect',
              inputProps: {
                optionKey: '胎方位22',
                // marshal:false
              },
            })}
          </Col>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'presentation',
              value: get(value, `gnaFetuses[${index}].presentation`),
              label: '宫口开张',
              inputType: 'MyCheckbox',
              inputProps: {
                // type: 'checkbox',
                options: [
                  { value: 1, label: '未查' },
                  { value: 2, label: '未开' },
                  { value: 3, label: '开大', inputType: 'MyInput', sufix: 'cm', props: { style: { width: 32 } } },
                ]
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
