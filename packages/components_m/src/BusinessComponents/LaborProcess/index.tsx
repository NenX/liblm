import { PlusCircleOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { filter, get, isEmpty, map } from 'lodash';
import { Component } from 'react';
import BaseFormComponent from '../../BaseFormComponent';
interface IProps {
  label: string;
  name?: string;
  value?: string;
  inputType?: string;
  labelSpan?: Number;
  wrapperSpan?: Number;
  inputProps?: object;
}
export default class LaborProcess extends Component {
  state = {
    firstProcess: undefined,
    sumProcess: undefined,
    secondAndThirdProcess: [
      {
        key: Math.random(),
        secondProcess: undefined,
        thridProcess: undefined,
      },
    ],
    outData: {},
  };

  componentDidMount() {
    const { secondAndThirdProcess } = this.state;
    const value = get(this.props, 'value');
    if (!isEmpty(value)) {
      if (!isEmpty(value.fetus2Secondstage) || !isEmpty(value.fetus2Thirdstage)) {
        secondAndThirdProcess.push({
          key: Math.random(),
          secondProcess: undefined,
          thridProcess: undefined,
        });
      }
      if (!isEmpty(value.fetus3Secondstage) || !isEmpty(value.fetus3Thirdstage)) {
        secondAndThirdProcess.push({
          key: Math.random(),
          secondProcess: undefined,
          thridProcess: undefined,
        });
      }
      if (!isEmpty(value.fetus4Secondstage) || !isEmpty(value.fetus4Thirdstage)) {
        secondAndThirdProcess.push({
          key: Math.random(),
          secondProcess: undefined,
          thridProcess: undefined,
        });
      }
      if (!isEmpty(value.fetus5Secondstage) || !isEmpty(value.fetus5Thirdstage)) {
        secondAndThirdProcess.push({
          key: Math.random(),
          secondProcess: undefined,
          thridProcess: undefined,
        });
      }
      if (!isEmpty(value.fetus6Secondstage) || !isEmpty(value.fetus6Thirdstage)) {
        secondAndThirdProcess.push({
          key: Math.random(),
          secondProcess: undefined,
          thridProcess: undefined,
        });
      }
    }
    this.setState({ secondAndThirdProcess });
  }

  handleAdd = () => {
    const { secondAndThirdProcess } = this.state;
    this.setState({
      secondAndThirdProcess: [
        ...secondAndThirdProcess,
        {
          key: Math.random(),
          secondProcess: undefined,
          thridProcess: undefined,
        },
      ],
    });
  };

  handleDelete = (data) => () => {
    const { secondAndThirdProcess } = this.state;
    this.setState({
      secondAndThirdProcess: filter(secondAndThirdProcess, (item) => get(data, 'key') !== get(item, 'key')),
    });
  };
  renderFieldItem = ({ name, value, label, inputType, labelSpan = 12, wrapperSpan = 12, inputProps = {} }: IProps) => {
    return (
      <Row className="nurse-children__field">
        <Col className="nurse-children__field-label" span={labelSpan}>
          <span>{label}：</span>
        </Col>
        <Col className="nurse-children__field-input" span={wrapperSpan}>
          <BaseFormComponent
            name={name}
            value={value}
            inputType={inputType}
            {...inputProps}
            onChange={(e) => {
              this.handleChange(e, name);
            }}
          />
        </Col>
      </Row>
    );
  };
  handleChange = (e: any, name: any) => {
    const { onChange } = this.props as any;
    const { outData } = this.state;
    let value = e;
    if (value.indexOf('{') > -1) {
      value = JSON.parse(value);
      const arr = [get(value, '0'), get(value, '1')];
      value = arr;
    }
    this.setState(
      {
        outData: {
          ...this.props.value,
          ...outData,
          [name]: value,
        },
      },
      () => {
        onChange && onChange(this.state.outData);
      },
    );
  };

  render() {
    const { secondAndThirdProcess } = this.state;
    const { value } = this.props;

    return (
      <div>
        <Row>
          <Col span={8}>
            {this.renderFieldItem({
              label: '第一产程',
              inputType: 'multiple_input_with_label',
              name: 'firststage',
              value: get(value, 'firststage'),
              inputProps: {
                config: {
                  special_config: JSON.stringify({
                    type: 'number',
                    options: [
                      { min: 0, labelBefore: '', labelAfter: '时', maxValue: 15 },
                      { min: 0, max: 59, labelBefore: '', labelAfter: '分' },
                    ],
                  }),
                },
              },
            })}
          </Col>
        </Row>
        {map(secondAndThirdProcess, (item, index) => {
          return (
            <Row key={item.key} style={{ alignItems: 'center' }}>
              <Col span={8}>
                {this.renderFieldItem({
                  label: '第二产程',
                  inputType: 'multiple_input_with_label',
                  name: index === 0 ? 'secondstage' : `fetus${index + 1}Secondstage`,
                  value: index === 0 ? get(value, 'secondstage') : get(value, `fetus${index + 1}Secondstage`),
                  inputProps: {
                    config: {
                      special_config: JSON.stringify({
                        type: 'number',
                        options: [
                          { min: 0, labelBefore: '', labelAfter: '时', maxValue: 2 },
                          { min: 0, max: 59, labelBefore: '', labelAfter: '分' },
                        ],
                      }),
                    },
                  },
                })}
              </Col>
              <Col span={8}>
                {this.renderFieldItem({
                  label: '第三产程',
                  inputType: 'multiple_input_with_label',
                  name: index === 0 ? 'thirdstage' : `fetus${index + 1}Thirdstage`,
                  value: index === 0 ? get(value, 'thirdstage') : get(value, `fetus${index + 1}Thirdstage`),
                  inputProps: {
                    config: {
                      special_config: JSON.stringify({
                        type: 'number',
                        options: [
                          { min: 0, labelBefore: '', labelAfter: '时', maxValue: 0 },
                          { min: 0, max: 59, labelBefore: '', labelAfter: '分', maxValue: 29 },
                        ],
                      }),
                    },
                  },
                })}
              </Col>
              <PlusCircleOutlined
                style={{ display: 'block', marginLeft: 16, cursor: 'pointer' }}
                onClick={this.handleAdd}
              />
              {/* {secondAndThirdProcess.length > 1 && (
                <DeleteOutlined
                  style={{ display: 'block', marginLeft: 16, cursor: 'pointer' }}
                  onClick={this.handleDelete(item)}
                />
              )} */}
            </Row>
          );
        })}
        <Row>
          <Col span={8}>
            {this.renderFieldItem({
              label: '总产程',
              inputType: 'multiple_input_with_label',
              name: 'totalstage',
              value: get(value, 'totalstage'),
              inputProps: {
                config: {
                  special_config: JSON.stringify({
                    type: 'number',
                    options: [
                      { labelBefore: '', labelAfter: '时' },
                      { labelBefore: '', labelAfter: '分' },
                    ],
                  }),
                },
              },
            })}
          </Col>
        </Row>
      </div>
    );
  }
}
