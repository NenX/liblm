import { DeleteOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, FormInstance, Row, Tabs } from 'antd';
import { get, map } from 'lodash';
import { Component } from 'react';
import BaseFormComponent from '../../BaseFormComponent';
import FetusForm from './components';
import styles from '../../BaseEditPanel/less/base-edit-panel-form.module.less'
import classnames from 'classnames';
import { ArrayInput, HourMinuteInput } from '../../FU_components';
import { mchcEnv } from '@lm_fe/env';
import React from 'react'
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

  formRefs: any = [];

  componentDidMount() {
    this.props.onRef(this);
    this.setActiveKey('tab1')
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

  setActiveKey = (activeKey: any) => {
    // mchcEnv.setGlobalCache('deliver-activeKey', activeKey)
    this.setState({
      activeKey,
    });
  };

  onEdit = (targetKey: any, action: any) => {
    this[action](targetKey);
  };

  handleClick = () => {
    const { tabs, activeKey } = this.state;
    const key = tabs[tabs.length - 1].key;

    //自动打开下一个tab，若没有则新增一个
    if (key === activeKey) {

      this.add()
    } else {
      this.setActiveKey(key)
    }

    //回到tab顶部
    const dom = document.getElementById('scroll-top');
    dom && dom.scrollIntoView({ behavior: 'smooth' });
  };
  getFuckFormInstance(idx: number) {
    const item = this.formRefs[idx]
    const form = get(item, 'formRef.form') as FormInstance;
    return item ? form : null
  }
  getFuckLastFormValue(key: string) {
    const { tabs } = this.state;
    const lastOneIdx = tabs.findIndex(_ => _.key === this.state.activeKey)
    const form = this.getFuckFormInstance(lastOneIdx)
    return form?.getFieldsValue() ?? {}
  }
  add = () => {
    const { tabs } = this.state;
    const activeKey = Math.random().toString();
    const newPanes: any = [...tabs];
    const v = this.getFuckLastFormValue(this.state.activeKey)
    newPanes.push({ title: `${TITLE}${tabs.length + 1}`, key: activeKey, value: v })
    this.setState({
      tabs: newPanes,

    });
    
      this.setActiveKey(activeKey)
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
    console.log(newPanes, newActiveKey);
    this.setState({
      tabs: newPanes,
    });
    this.setActiveKey(
       newActiveKey
    )
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
        <div className={classnames(styles["base-edit-panel-form_section"], styles['border'])} style={{ margin: '16px -16px' }}>
          <span className={styles["base-edit-panel-form_section_title"]}>产程经过</span>
          <Row>
            <Col span={8}>
              <Form.Item label="第一产程" name="firststage" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>

                <HourMinuteInput />
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
                    <HourMinuteInput />

                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="第三产程"
                    name={index === 0 ? 'thirdstage' : `fetus${index + 1}Thirdstage`}
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
                  >
                    <HourMinuteInput />

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
                <HourMinuteInput />

              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className={classnames(styles["base-edit-panel-form_section"], styles['border'])} style={{ margin: '16px -16px' }}>
          <span className={styles["base-edit-panel-form_section_title"]}>胎儿相关</span>
          <div style={{ position: 'relative' }}>
            <div id="scroll-top"></div>
            <Tabs
              type="editable-card"
              onChange={this.setActiveKey}
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
                    index={index}
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
