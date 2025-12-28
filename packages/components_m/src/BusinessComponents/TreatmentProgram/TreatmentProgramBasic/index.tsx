import React, { Component } from 'react';
import ProgramForm from './components/index';
import { Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { map, get, set, keys, cloneDeep } from 'lodash';
import { FormInstance } from 'antd/lib/form';
import { toApi, valueToApi } from './config/adapter';
import { getTreatmentProgramDict } from '../utils';
const TITLE = '治疗项目';
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
    programDict: {},
  };

  formRefs: any = {};

  async componentDidMount() {
    const { value } = this.props as any;
    // console.log('value', value);
    if (value && value.length > 0) {
      this.setState({
        tabs: map(value, (item, index) => ({
          title: `${TITLE}${index + 1}`,
          key: `tab${index + 1}`,
          value: item,
        })),
      });
    }
    const programDict = await getTreatmentProgramDict();
    this.setState({ programDict });
  }

  onChange = (activeKey: any) => {
    this.setState({
      activeKey,
    });
  };

  onEdit = (targetKey: any, action: any) => {
    this[action](targetKey);
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
    const { value, onChange } = this.props as any;
    const values = cloneDeep(value);
    let newActiveKey = activeKey;
    let lastIndex: any;
    console.log(targetKey, 'targetKey');
    tabs.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
        // console.log(i, 'is');
        // console.log(values[i]);
        if (values[i] && values[i].id) {
          // 判断项目是否已经添加成功
          values.splice(i, 1);
          onChange && onChange(values);
        }
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
    // console.log(newPanes, newActiveKey);
    this.setState({
      tabs: newPanes,
      activeKey: newActiveKey,
    });
  };

  handleChange = (changedValues: any, allValues: any) => {
    const { value, onChange } = this.props as any;
    const { programDict } = this.state;

    const values = cloneDeep(value);
    const changedField = get(keys(changedValues), '0');
    // console.log('changedValues', changedValues);
    // console.log('changedField', changedField);
    map(this.formRefs, (item, index) => {
      const form = get(item, 'formRef.form') as FormInstance;
      let formData = form.getFieldsValue();
      formData = valueToApi(formData);
      values[index] = { ...values[index], ...formData };
      if (changedField === 'totalNumbe' || changedField === 'treamentNumbe') {
        let totalNumbe = form.getFieldValue('totalNumbe') || 0;
        let treamentNumbe = form.getFieldValue('treamentNumbe') || 0;
        form.setFieldsValue({ residueNumber: totalNumbe - treamentNumbe });
        set(values[index], 'residueNumber', totalNumbe - treamentNumbe);
      }
    });
    const data = toApi(values, programDict);
    // console.log('data', data);
    onChange && onChange(data);
  };

  render() {
    const { tabs, activeKey } = this.state;
    const { value } = this.props as any;
    return (
      <Tabs
        type="editable-card"
        onChange={this.onChange}
        addIcon={
          <div>
            <PlusOutlined />
            添加{TITLE}
          </div>
        }
        activeKey={activeKey}
        onEdit={this.onEdit}
      >
        {map(tabs, (tab, index) => (
          <Tabs.TabPane tab={tab.title} key={tab.key} forceRender closable={index === 0 ? false : true}>
            <ProgramForm
              ref={(ref) => {
                this.formRefs[index] = ref;
              }}
              // @ts-ignore
              data={(value && (value.length > 0 ? value[index] : tab.value)) || tab.value}
              onValuesChange={this.handleChange}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    );
  }
}
