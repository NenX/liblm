import React from 'react';
import { Form, Divider, Button } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import { map, get, cloneDeep, set, filter, split, isEmpty } from 'lodash';
import FoetalAppendageFormSection from './FoetalAppendageFormSection';
import DynamicForm from '../../BaseModalForm/DynamicForm';
import { fromApi, toApi } from './config';
import { formDescriptionsWithoutSectionApi } from '../../utils/adapter';
import './index.less';
import { SMchc_FormDescriptions } from '@lm_fe/service';
const TAB_TITLE = '胎儿';
interface IProps {
  value?: any;
}

// 胎儿附属物
class FoetalAppendage extends DynamicForm<IProps> {
  index: number | string;

  nativeFormDescriptions: {};

  constructor(props: any) {
    super(props);
    const data: any = [
      {
        key: '0',
      },
    ];
    this.state = {
      data,
    };
    this.index = 0;
    this.nativeFormDescriptions = {};
  }

  async componentDidMount() {
    const { value } = this.props;
    const data: any = [];
    // 获取原始表单配置
    const formField = await SMchc_FormDescriptions.getModuleParseCache('foetalAppendage');
    this.nativeFormDescriptions = formDescriptionsWithoutSectionApi(formField);
    let result: any = [{}];
    if (!isEmpty(value)) {
      result = fromApi(value, this.nativeFormDescriptions);
    }
    map(result, (item, index) => {
      this.index = index;
      const tempValue = {};
      map(item, (itemValue, key) => {
        key !== 'key' && set(tempValue, `${key}_${index}`, itemValue);
      });
      data.push({
        key: `${index}`,
        ...tempValue,
      });
    });
    this.setState({
      data,
    });
  }

  handleAddFetus = () => {
    const { data } = this.state;
    this.index += 1;
    data.push({
      key: `${this.index}`,
    });
    this.setState({
      data,
    });
  };

  handleRemoveFetus = (removeItem: any) => () => {
    const { data } = this.state;
    const newData = filter(data, (item) => {
      return get(item, 'key') !== get(removeItem, 'key');
    });

    this.setState({
      data: newData,
    });
    this.throwDataByOnChange(newData);
  };

  // 获取表单数据
  handleFieldsChange = (formDescriptionKey: any, callbackData: any) => {
    const { data } = this.state;
    const names = split(formDescriptionKey, '_');
    set(data, `${get(names, '1')}.${formDescriptionKey}`, callbackData);
    this.throwDataByOnChange(data);
    this.setState({
      data,
    });
  };

  throwDataByOnChange = (data: any) => {
    const { onChange } = this.props;
    const tempData = map(data, (item) => {
      const tempItem = {};
      map(item, (itemValue, key) => {
        const names = split(key, '_');
        set(tempItem, get(names, 0), itemValue);
      });
      return tempItem;
    });
    onChange && onChange(toApi(tempData, this.nativeFormDescriptions));
    return data;
  };

  generateRenderEditItem = (formDescriptions: any, options: any = {}) => {
    const { formItemLayout } = options;

    return (key: string, ReactNode: React.ReactNode, others: object = {}) => {
      const config = get(formDescriptions, key) || {};
      const { label, rules } = config;
      return (
        <Form.Item
          {...formItemLayout}
          {...get(others, 'customFormItemLayout')}
          style={{ ...get(others, 'styles') }}
          key={key}
          label={label}
          rules={rules}
        >
          {ReactNode}
        </Form.Item>
      );
    };
  };

  renderContent = (item: any, index: any) => {
    const { data } = this.state;
    const newFormDescriptions = {};
    map(cloneDeep(this.nativeFormDescriptions), (formDescription, formDescriptionKey) => {
      set(formDescription, 'key', `${formDescriptionKey}_${get(item, 'key')}`);
      set(formDescription, 'native_key', formDescriptionKey);
      set(newFormDescriptions, `${formDescriptionKey}_${get(item, 'key')}`, formDescription);
    });
    const renderEditItem = this.generateRenderEditItem(newFormDescriptions);
    return (
      <div className="foetal-panel">
        <div className="foetal-panel-content">
          <Divider orientation="left">
            <span style={{ fontSize: 12 }}>
              {TAB_TITLE}
              {index + 1}
            </span>
          </Divider>
          <FoetalAppendageFormSection
            formDescriptions={newFormDescriptions}
            renderEditItem={renderEditItem}
            onChange={this.handleFieldsChange}
            data={get(data, index)}
          />
        </div>
        <div className="foetal-panel-delete" title="删除" onClick={this.handleRemoveFetus(item)}>
          <MinusCircleOutlined />
        </div>
      </div>
    );
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 24 }}>
          <Button type="primary" onClick={this.handleAddFetus}>
            添加{TAB_TITLE}
          </Button>
        </div>
        {map(data, (item, index) => this.renderContent(item, index))}
      </div>
    );
  }
}
export default FoetalAppendage
