import React, { Component } from 'react';
import FetusForm from './components';
import { Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { map, get } from 'lodash';
import { FormInstance } from 'antd/lib/form';
import { toApi, valueToApi } from './config/adapter';
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

  onChange = (activeKey) => {
    this.setState({
      activeKey,
    });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    const { tabs } = this.state;
    const activeKey = Math.random().toString();
    const newPanes = [...tabs];
    newPanes.push({ title: `${TITLE}${tabs.length + 1}`, key: activeKey });
    this.setState({
      tabs: newPanes,
      activeKey,
    });
  };

  remove = (targetKey) => {
    const { tabs, activeKey } = this.state;
    let newActiveKey = activeKey;
    let lastIndex;
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
      activeKey: newActiveKey,
    });
  };

  handleChange = (changedValues, allValues) => {
    const { onChange } = this.props;
    const values = {};
    map(this.formRefs, (item, index) => {
      const form = get(item, 'formRef.form') as FormInstance;
      let formData = form.getFieldsValue();
      formData = valueToApi(formData);
      values[index] = formData;
    });
    const data = toApi(values);
    onChange && onChange(data);
  };

  render() {
    const { tabs, activeKey } = this.state;
    const { value } = this.props;
    return (
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
              onValuesChange={this.handleChange}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    );
  }
}
