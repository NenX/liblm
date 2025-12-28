import { PlusCircleOutlined } from '@ant-design/icons';
import { safe_json_parse } from '@lm_fe/utils';
import { Col, Row } from 'antd';
import { get, isEmpty, map, set } from 'lodash';
import { Component } from 'react';
import BaseFormComponent from '../../BaseFormComponent';
import styles from './index.less';
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
    labelSpan = 9,
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
  renderChildrenItem2 = (value: any) => {
    let embryolemmaValue;
    if (value) {
      embryolemmaValue = get(value, 'embryolemma');
      if (typeof embryolemmaValue === 'string') {
        embryolemmaValue = get(safe_json_parse(embryolemmaValue), 'checkedValues.0');
      }
    }
    return (
      <div>
        <Row>
          <Col span={24}>
            {this.renderFieldItem({
              name: 'uterusSpread',
              value: get(value, 'uterusSpread'),
              label: '宫口开张',
              inputType: 'checkbox_with_input',
              labelSpan: 3,
              wrapperSpan: 21,
              inputProps: {
                config: {
                  special_config: JSON.stringify({
                    options: [
                      {
                        label: '未查',
                        value: 1,
                        span: 3,
                      },
                      {
                        label: '未开',
                        value: 2,
                        span: 3,
                      },
                      {
                        label: '开大',
                        value: 3,
                        span: 3,
                        withInput: true,
                        inputType: 'input',
                        labelAfter: 'cm',
                      },
                    ],
                    type: 'single',
                  }),
                },
              },
            })}
          </Col>
        </Row>
        <Row>
          <Col span={15}>
            {this.renderFieldItem({
              name: 'uterusContraction',
              value: get(value, 'uterusContraction'),
              label: '宫缩',
              inputType: 'checkbox_with_input',
              labelSpan: 5,
              wrapperSpan: 19,
              inputProps: {
                config: {
                  special_config: JSON.stringify({
                    type: 'single',
                    options: [
                      {
                        value: 1,
                        label: '无',
                        withInput: false,
                        along: true,
                        span: 5,
                      },
                      {
                        value: 2,
                        label: '有',
                        withInput: true,
                        span: 5,
                        inputSpan: 14,
                        inputType: 'checkbox',
                        options: [
                          {
                            label: '不规则',
                            value: 1,
                          },
                          {
                            label: '规则',
                            value: 2,
                          },
                        ],
                      },
                    ],
                  }),
                },
              },
            })}
          </Col>
          <Col span={8}>
            {this.renderFieldItem({
              name: 'bellyache',
              value: get(value, 'bellyache'),
              label: '腹痛',
              inputType: 'checkbox_with_input',
              labelSpan: 4,
              wrapperSpan: 16,
              inputProps: {
                config: {
                  special_config: JSON.stringify({
                    type: 'single',
                    options: [
                      {
                        value: 1,
                        label: '无',
                        withInput: false,
                        along: true,
                        span: 8,
                      },
                      {
                        value: 2,
                        label: '有',
                        withInput: true,
                        isIssue: true,
                        span: 8,
                        inputSpan: 8,
                      },
                    ],
                  }),
                },
              },
            })}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {this.renderFieldItem({
              name: 'embryolemma',
              value: get(value, 'embryolemma'),
              label: '胎膜',
              labelSpan: 3,
              wrapperSpan: 21,
              inputType: 'checkbox_with_input',
              inputProps: {
                config: {
                  special_config: JSON.stringify({
                    type: 'single',
                    options: [
                      {
                        value: 1,
                        label: '未破',
                        withInput: false,
                        along: true,
                        span: 3,
                      },
                      {
                        value: 2,
                        label: '已破',
                        withInput: true,
                        span: 3,
                        inputSpan: 8,
                        inputType: 'single_date_picker',
                      },
                    ],
                  }),
                },
              },
            })}
          </Col>
        </Row>
        {embryolemmaValue === 2 && (
          <Row>
            <Col span={24}>
              {this.renderFieldItem({
                name: 'amnioticFluid',
                value: get(value, 'amnioticFluid'),
                label: '羊水性质',
                inputType: 'pure_checkbox',
                labelSpan: 3,
                wrapperSpan: 21,
                inputProps: {
                  config: {
                    special_config: JSON.stringify({
                      options: [
                        {
                          label: '清',
                          value: 1,
                          span: 3,
                        },
                        {
                          label: 'Ⅰ°浑浊',
                          value: 2,
                          span: 3,
                        },
                        {
                          label: 'Ⅱ°浑浊',
                          value: 3,
                          span: 3,
                        },
                        {
                          label: 'Ⅲ°浑浊',
                          value: 4,
                          span: 3,
                        },
                      ],
                      type: 'single',
                    }),
                  },
                },
              })}
            </Col>
          </Row>
        )}

        <Row>
          <Col span={24}>
            {this.renderFieldItem({
              name: 'vaginalBleeding',
              value: get(value, 'vaginalBleeding'),
              label: '阴道流血',
              inputType: 'checkbox_with_input',
              labelSpan: 3,
              wrapperSpan: 21,
              inputProps: {
                config: {
                  special_config: JSON.stringify({
                    type: 'single',
                    options: [
                      {
                        value: 1,
                        label: '无',
                        withInput: false,
                        along: true,
                        span: 3,
                      },
                      {
                        value: 2,
                        label: '有',
                        withInput: true,
                        span: 3,
                        inputSpan: 16,
                        inputType: 'checkbox',
                        options: [
                          {
                            label: '少许',
                            value: 1,
                          },
                          {
                            label: '月经量',
                            value: 2,
                          },
                          {
                            label: '多于月经量',
                            value: 3,
                          },
                        ],
                      },
                    ],
                  }),
                },
              },
            })}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {this.renderFieldItem({
              name: 'vaginaUnusualSecretion',
              value: get(value, 'vaginaUnusualSecretion'),
              label: '阴道异常分泌物',
              inputType: 'checkbox_with_input',
              labelSpan: 3,
              wrapperSpan: 21,
              inputProps: {
                config: {
                  special_config: JSON.stringify({
                    type: 'single',
                    options: [
                      {
                        value: 1,
                        label: '无',
                        withInput: false,
                        span: 3,
                      },
                      {
                        value: 2,
                        label: '血性',
                        withInput: false,
                        isIssue: true,
                        span: 3,
                      },
                      {
                        value: 3,
                        label: '脓性',
                        withInput: false,
                        isIssue: true,
                        span: 3,
                      },
                      {
                        value: 4,
                        label: '水样',
                        withInput: true,
                        isIssue: true,
                        labelBefore: '量：',
                        labelAfter: 'ml',
                        span: 3,
                        inputSpan: 4,
                      },
                      {
                        value: 5,
                        label: '其他',
                        withInput: true,
                        isIssue: true,
                        span: 3,
                        inputSpan: 4,
                      },
                    ],
                  }),
                },
              },
            })}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {this.renderFieldItem({
              name: 'thelarche',
              value: get(value, 'thelarche'),
              label: '乳房发育',
              inputType: 'checkbox_with_input',
              labelSpan: 3,
              wrapperSpan: 21,
              inputProps: {
                config: {
                  special_config: JSON.stringify({
                    type: 'single',
                    options: [
                      {
                        value: 1,
                        label: '正常',
                        withInput: false,
                        span: 3,
                      },
                      {
                        value: 2,
                        label: '异常',
                        withInput: true,
                        span: 3,
                        inputSpan: 8,
                        isIssue: true,
                      },
                    ],
                  }),
                },
              },
            })}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {this.renderFieldItem({
              name: 'feedingKnowledge',
              value: get(value, 'feedingKnowledge'),
              label: '母乳喂养知识',
              inputType: 'checkbox_with_input',
              labelSpan: 3,
              wrapperSpan: 21,
              inputProps: {
                config: {
                  special_config: JSON.stringify({
                    type: 'single',
                    options: [
                      {
                        value: 1,
                        label: '掌握',
                        withInput: false,
                        span: 3,
                      },
                      {
                        value: 2,
                        label: '部分掌握',
                        withInput: false,
                        span: 3,
                      },
                      {
                        value: 3,
                        label: '未掌握',
                        withInput: false,
                        span: 3,
                      },
                      {
                        value: 4,
                        label: '其它',
                        withInput: true,
                        span: 3,
                        inputSpan: 8,
                      },
                    ],
                  }),
                },
              },
            })}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {this.renderFieldItem({
              name: 'other',
              value: get(value, 'other'),
              label: '其它症状和体征',
              inputType: 'template_textarea',
              labelSpan: 3,
              wrapperSpan: 21,
            })}
          </Col>
        </Row>
      </div>
    );
  };
  renderChildrenItem = (children: any, index: any, value: any) => {
    return (
      <div key={index}>
        <div style={{ paddingLeft: 30 }}>
          <span>胎儿{index + 1}：</span>
          <PlusCircleOutlined onClick={this.handleAdd} />
        </div>
        <Row>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'fetalHeartRate',
              value: get(value, `gnaFetuses[${index}].fetalHeartRate`),
              label: '胎心率',
              inputType: 'dictionary_select',
              inputProps: {
                type: 'checkbox',
                mode: 'single',
                uniqueKey: 'GeneralExam.heartrhythm',
                boxSpan: 12,
              },
            })}
          </Col>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'fetalPosition',
              value: get(value, `gnaFetuses[${index}].fetalPosition`),
              label: '胎方位',
              inputType: 'dictionary_select',
              inputProps: {
                mode: 'single',
                uniqueKey: 'NoenateRecord.fetalposition',
                boxSpan: 12,
              },
            })}
          </Col>
          <Col span={8}>
            {this.renderFieldItem({
              index: index,
              name: 'presentation',
              value: get(value, `gnaFetuses[${index}].presentation`),
              label: '先露',
              inputType: 'dictionary_select',
              inputProps: {
                // type: 'checkbox',
                mode: 'single',
                uniqueKey: 'Common.presentation',
                boxSpan: 12,
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
        {this.renderChildrenItem2(value)}
      </div>
    );
  }
}
