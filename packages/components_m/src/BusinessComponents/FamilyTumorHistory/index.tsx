import BaseFormComponent from '../../BaseFormComponent';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Col, Row, Space } from 'antd';
import { map, cloneDeep, set, get, isEmpty, isString, isString } from 'lodash';
import React, { Component } from 'react';
import styles from './index.less';
export default class FamilyTumorHistory extends Component<any, any> {
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
      childrens: [...childrens, { patientName: '有' }],
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
    const _valuue = isString(callbackData) ? callbackData : callbackData?.target?.value;
    const { onChange } = this.props;
    const { outData, childrens } = this.state;
    if (name === 'tumorName') {
      const value = _valuue;
      set(childrens[index], name, value);
    } else {
      set(childrens[index], name, _valuue);
    }

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
      <div key={index} style={{ position: 'relative' }}>
        <Row>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'patientName',
              value: get(value, [`${index}`, 'patientName']) || get(children, 'patientName'),
              // label: '家族肿瘤史',
              label: '',
              labelSpan: 0,

              wrapperSpan: 24,
              inputType: 'select_with_options',
              inputProps: {
                placeholder: '请选择',
                options: [
                  { label: '无', value: '无' },
                  { label: '有', value: '有' },
                ],
              },
            })}
          </Col>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'tumorName',
              value: get(value, [`${index}`, 'patientName']) === '无' ? '' : get(value, [`${index}`, 'tumorName']),
              label: '',
              labelSpan: 0,
              wrapperSpan: 24,
              inputType: 'input',
              inputProps: {
                placeholder: '请输入疾病名称',
                disabled: get(value, [`${index}`, 'patientName']) === '无' ? true : false,
              },
            })}
          </Col>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'relationshipWithPatients',
              value:
                get(value, [`${index}`, 'patientName']) === '无'
                  ? ''
                  : get(value, [`${index}`, 'relationshipWithPatients']),
              label: '',
              labelSpan: 0,
              wrapperSpan: 8,
              inputType: 'select_with_options',
              inputProps: {
                placeholder: '请选择关系',
                options: [
                  { value: '父母', label: '父母' },
                  { value: '子女', label: '子女' },
                  { value: '兄弟姐妹', label: '兄弟姐妹' },
                ],
                disabled: get(value, [`${index}`, 'patientName']) === '无' ? true : false,
              },
            })}
          </Col>
        </Row>
        <div
          style={{
            paddingLeft: 30,
            color: '#3d8bf7',
            position: 'absolute',
            right: '18%',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
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
