import { DeleteOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Tabs } from 'antd';
import { get, map } from 'lodash';
import { Component } from 'react';
import BaseFormComponent from '../../BaseFormComponent';
import FetusForm from './components';
const TITLE = '胎儿';
export default class NursingFetus extends Component {
  state = {
    tabs: [
      {
        title: `${TITLE}1`,
        key: 'tab1',
        value: {},
      },
    ],
    activeKey: 'tab1',
  };

  formRefs: any = {};

  componentDidMount() {
    this.props.onRef(this);
    const { id, activeItem } = this.props as any;
    if (this.props.value && this.props.value.length > 0) {
      this.setState({
        tabs: map(this.props.value, (item, index) => ({
          title: `${TITLE}${index + 1}`,
          key: `tab${index + 1}`,
          value: item,
        })),
      });
    }
  }

  onChange = (activeKey: any) => {
    this.setState({
      activeKey,
    });
  };

  onEdit = (targetKey: any, action: any) => {
    this[action](targetKey);
  };

  handleClick = () => {
    const { tabs, activeKey } = this.state;
    const activeKeyNew = Math.random().toString();
    const newPanes: any = [...tabs];
    const key = tabs[tabs.length - 1].key;

    //自动打开下一个tab，若没有则新增一个
    if (key === activeKey) {
      newPanes.push({ title: `${TITLE}${tabs.length + 1}`, key: activeKeyNew });
      this.setState({
        tabs: newPanes,
        activeKey: activeKeyNew,
      });
    } else {
      this.setState({
        activeKey: key,
      });
    }

    //回到tab顶部
    const dom = document.getElementById('scroll-top');
    dom && dom.scrollIntoView({ behavior: 'smooth' });
  };

  add = () => {
    const { tabs } = this.state;
    const activeKey = Math.random().toString();
    const newPanes: any = [...tabs];
    newPanes.push({ title: `${TITLE}${tabs.length + 1}`, key: activeKey });
    this.setState({
      tabs: newPanes,
      activeKey,
    });
  };

  remove = (targetKey: any) => {
    if (!confirm('确定删除吗？')) return

    const { tabs, activeKey } = this.state;
    let newActiveKey = activeKey;
    let lastIndex: any;
    tabs.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = tabs.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    this.setState({
      tabs: newPanes,
      activeKey: newActiveKey,
    });
  };

  handleDelete = (tab: any) => () => {
    const targetKey = get(tab, 'key');
    this.remove(targetKey);
  };

  renderFieldItem = ({ inputType, labelSpan = 12, wrapperSpan = 12, inputProps = {} }) => {
    return <BaseFormComponent inputType={inputType} {...inputProps} />;
  };

  render() {
    const { tabs, activeKey } = this.state;
    const { value } = this.props as any;
    return (
      <>
        <div className="base-edit-panel-form_section border" style={{ margin: '16px -16px' }}>
          <span className="base-edit-panel-form_section_title">产程经过</span>
          <Row>
            <Col span={8}>
              <Form.Item label="第一产程" name="firststage" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                {this.renderFieldItem({
                  inputType: 'multiple_input_with_label',
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
              </Form.Item>
            </Col>
          </Row>
          {map(tabs, (tab, index) => {
            return (
              <Row key={tab.key} style={{ alignItems: 'center' }}>
                <Col span={8}>
                  <Form.Item
                    label="第二产程"
                    name={index === 0 ? 'secondstage' : `fetus${index + 1}Secondstage`}
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
                  >
                    {this.renderFieldItem({
                      inputType: 'multiple_input_with_label',
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
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="第三产程"
                    name={index === 0 ? 'thirdstage' : `fetus${index + 1}Thirdstage`}
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
                  >
                    {this.renderFieldItem({
                      inputType: 'multiple_input_with_label',
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
                  </Form.Item>
                </Col>
                <PlusCircleOutlined
                  style={{ display: 'block', marginLeft: 16, cursor: 'pointer' }}
                  onClick={this.add}
                />
                {tabs.length > 1 && index > 0 && (
                  <DeleteOutlined
                    style={{ display: 'block', marginLeft: 16, cursor: 'pointer' }}
                    onClick={this.handleDelete(tab)}
                  />
                )}
              </Row>
            );
          })}
          <Row>
            <Col span={8}>
              <Form.Item label="总产程" name="totalstage" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                {this.renderFieldItem({
                  inputType: 'multiple_input_with_label',
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
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className="base-edit-panel-form_section border" style={{ margin: '16px -16px' }}>
          <span className="base-edit-panel-form_section_title">胎儿相关</span>
          <div style={{ position: 'relative' }}>
            <div id="scroll-top"></div>
            <Tabs
              type="editable-card"
              onChange={this.onChange}
              addIcon={
                <div>
                  <PlusOutlined />
                  增加{TITLE}
                </div>
              }
              activeKey={activeKey}
              onEdit={this.onEdit}
            >
              {map(tabs, (tab, index) => (
                <Tabs.TabPane tab={tab.title} key={tab.key} forceRender closable={index === 0 ? false : true}>
                  <FetusForm
                    ref={(ref) => {
                      this.formRefs[index] = ref;
                    }}
                    data={(value && (value.length > 0 ? value[index] : tab.value)) || tab.value}
                  //onValuesChange={this.handleChange}
                  />
                </Tabs.TabPane>
              ))}
            </Tabs>
            <Button
              size="large"
              style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)' }}
              onClick={this.handleClick}
            >
              + 填写其他胎儿信息
            </Button>
          </div>
        </div>
      </>
    );
  }
}
