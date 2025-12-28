import { RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { identity, map, pickBy } from 'lodash';
import React from 'react';
import DynamicForm from '../BaseModalForm/DynamicForm';
import { formatTimeToDate, formatTimeToUTC, formatTimeToYearMonth } from '../utils/format';
import RenderInputItemComponent from './RenderInputItemComponent';
import './index.less';
import { mchcLogger } from '@lm_fe/env';
interface IState {
  queryFormDescriptions: object;

}
interface IProps {
  onSearch?: (value: any) => void;
  [propsName: string]: any;
}
export default class BaseQuery extends DynamicForm<IProps, IState> {
  state = {
    queryFormDescriptions: {},

  };

  formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  componentDidMount() {
    const defaultValues = this.filterDefaultValues();
    setTimeout(async () => {
      this.form = this.formRef.current;
      this.printTableRef = React.createRef();
      await this.form?.setFieldsValue(defaultValues);
      // 初始化页面请求列表数据
      this.handleSearch(this.form.getFieldsValue());
    }, 100);
  }

  // 提取query默认值
  filterDefaultValues = () => {
    let result = {};
    map(this.state.queryFormDescriptions, (item, key) => {
      if (item.defaultValue) {
        result[key] = item.defaultValue;
      }
    });
    return result;
  };

  renderEditItem = (key: string, ReactNode: React.ReactNode, others?: object) => { };

  renderContent = () => {
    const result = map(this.state.queryFormDescriptions, ({ ignoreFilterType, filterType, format, ...item }, key) => {
      const params = { name: key, ...item };
      if (item.hide) {
        return null;
      }
      return <RenderInputItemComponent key={key} {...params} />;
    });
    return result;
  };

  renderPrintTable = () => { };

  handleFieldsChange = () => { };

  handleReset = () => {
    this.form && this.form.resetFields();
    this.handleSearch(this.form.getFieldsValue());
  };

  handleSearch = (values = {}) => {
    const { onSearch } = this.props;
    let newValues = this.tranformQueryData(values)
    mchcLogger.log('handleSearch', newValues)
    onSearch && onSearch(newValues);
  };
  getFuckQueryParams() {
    const { defaultQuery = {} } = this.props;

    const values = this.form.getFieldsValue()
    const transQueryData = this.tranformQueryData(values)
    return { ...transQueryData, ...defaultQuery }
  }
  tranformQueryData(values: any) {
    const { queryFormDescriptions } = this.state;
    // 过滤无效数据
    const vals = pickBy(values, identity);
    let newValues = {};
    // 按照JPA CriteriaQuery规范处理查询条件
    for (var key in vals) {
      const ignoreFilterType = queryFormDescriptions[key]['ignoreFilterType'];
      const filterType = queryFormDescriptions[key]['filterType'] || 'contains';
      const inputType = queryFormDescriptions[key]['inputType'];
      const paramType = queryFormDescriptions[key]['paramType'];
      // 参数处理
      let keyArr = [key];
      if (!ignoreFilterType) {
        keyArr.push(filterType);
      }
      const keyStr = keyArr.join('.');
      // 提交时间格式处理
      const format = queryFormDescriptions[key]['format'] || 'normalDate';
      const transformFun = format === 'normalDate' ? formatTimeToDate : formatTimeToUTC;

      // 时间组件处理
      if (inputType === 'date') {
        newValues = {
          ...newValues,
          [keyStr]: transformFun(vals[key]),
        };
      } else if (inputType === 'rangeDate') {
        if (paramType === 'startAndEnd') {
          newValues = {
            ...newValues,
            startDate: transformFun(vals[key][0]),
            endDate: transformFun(vals[key][1]),
          };
        } else if (paramType === 'regStartAndEnd') {
          newValues = {
            ...newValues,
            regStartTime: transformFun(vals[key][0]),
            regEndTime: transformFun(vals[key][1]),
          };
        } else {
          newValues = {
            ...newValues,
            [`${key}.greaterOrEqualThan`]: transformFun(vals[key][0]),
            [`${key}.lessOrEqualThan`]: transformFun(vals[key][1]),
          };
        }
      } else if (inputType === 'rangeDateTime') {
        if (paramType === 'startAndEnd') {
          newValues = {
            ...newValues,
            startDate: formatTimeToYearMonth(vals[key][0]),
            endDate: formatTimeToYearMonth(vals[key][1]),
          };
        } else if (paramType === 'sendStartAndEnd') {
          newValues = {
            ...newValues,
            sendStartTime: formatTimeToYearMonth(vals[key][0]),
            sendEndTime: formatTimeToYearMonth(vals[key][1]),
          };
        } else {
          newValues = {
            ...newValues,
            [`${key}.greaterOrEqualThan`]: formatTimeToYearMonth(vals[key][0]),
            [`${key}.lessOrEqualThan`]: formatTimeToYearMonth(vals[key][1]),
          };
        }
      } else if (inputType === 'rangeInputNumber') {
        newValues = {
          ...newValues,
          [`${key}.greaterOrEqualThan`]: vals[key][0],
          [`${key}.lessOrEqualThan`]: vals[key][1],
        };
      } else {
        newValues = {
          ...newValues,
          [keyStr]: vals[key],
        };
      }
    }
    return newValues;
  }
  renderOthersBtn = () => (
    <span></span>
  );
  public renderBtn() {
    return (
      <React.Fragment>
        <Button icon={<RedoOutlined />} onClick={this.handleReset}>
          重置
        </Button>
        <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
          查询
        </Button>
        {
          this.renderOthersBtn()
        }
      </React.Fragment>
    );
  }





  render() {
    const { queryRef } = this.props;
    return (
      <div ref={queryRef} className="global-query-form">
        <Form
          autoComplete="off"
          ref={this.formRef}
          layout="inline"
          onFinish={this.handleSearch}
          onFieldsChange={this.handleFieldsChange}
        >
          {this.renderContent()}
          <Form.Item colon={false} label="" style={{ marginLeft: 12 }}>
            <Button.Group>{this.renderBtn()}</Button.Group>
          </Form.Item>
        </Form>
        {this.renderPrintTable()}
      </div>
    );
  }
}
