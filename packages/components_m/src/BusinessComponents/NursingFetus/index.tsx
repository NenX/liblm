import React, { Component } from 'react';
import FetusForm from './components';
import { Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { map, get, set, isEmpty, isObject, isNil, omit, pickBy } from 'lodash';
import { FormInstance } from 'antd/lib/form';
import { toApi } from './config/adapter';
import { safe_json_parse } from '@lm_fe/utils';
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
    const { id, activeItem } = this.props;
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
    const { tabs } = this.state;
    const values = {};
    map(this.formRefs, (item, index) => {
      const form = get(item, 'formRef.form') as FormInstance;
      let formData = form.getFieldsValue();
      let formDataCopy = {};
      const appgar = formData.appgar;
      map(formData, (data, key) => {
        if (!isNil(data)) {
          if (isObject(data)) {
            if (data.hasOwnProperty('key')) {
              set(formDataCopy, `${key}`, get(data, 'key'));
              set(formDataCopy, `${key}Note`, get(data, 'keyNote'));
            } else {
              set(formDataCopy, `${key}`, data);
            }
          } else {
            if (key != 'process') {
              if (
                ['clavicleFracture', 'ph', 'feces', 'amnioticFluid', 'urination', 'referPaediatrics', 'skin'].includes(
                  key,
                )
              ) {
                const valueJson = safe_json_parse(data);
                set(formDataCopy, `${key}`, get(valueJson, 'checkedValues.0'));
                set(
                  formDataCopy,
                  `${key}Note`,
                  get(valueJson, `withInputValues.${get(valueJson, 'checkedValues.0')}.value.0`),
                );
              } else if (['hbig', 'hepatitisBvaccin'].includes(key)) {
                const valueJson = safe_json_parse(data);
                set(formDataCopy, `${key}`, get(valueJson, 'checkedValues.0'));
                set(formDataCopy, `${key}Time`, get(valueJson, 'withInputValues.1.value.0'));
              } else {
                set(formDataCopy, `${key}`, data);
              }
            } else {
              if (key === 'process') {
                if (data) {
                  const valueJson = JSON.parse(data);
                  set(formDataCopy, `gravidity`, Number(get(valueJson, '0')));
                  set(formDataCopy, `parity`, Number(get(valueJson, '1')));
                }
              }
            }
          }
        }
      });
      if (get(tabs[index].value, 'id')) {
        formDataCopy = { id: get(tabs[index].value, 'id'), ...omit(formDataCopy, ['appgar']), ...appgar };
      } else {
        formDataCopy = { ...omit(formDataCopy, ['appgar']), ...appgar };
      }
      values[index] = formDataCopy;
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
