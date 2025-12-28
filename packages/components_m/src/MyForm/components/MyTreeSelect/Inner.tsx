import React, { Component, ReactNode } from 'react';
import { get } from 'lodash';
import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

interface MyTreeSelectProps {
  input_props?: any;
  onChange?: Function;
  value?: any;
  [x: string]: any
}

interface MyTreeSelectState {
  options: Array<Option<any>>;
  value: any
}

interface Option<T> {
  value: any;
  label: T;
  children?: Array<Option<T>>;
}

const SPLIT_KEY = ',';

// 判断选择的节点是否为父节点
const isParent = function <T>(options: Array<Option<T>>, value: T): boolean {
  let flag = false;
  for (let i = 0; i < options.length; i++) {
    if (value === options[i].value) {
      flag = options[i].children ? true : false;
      break;
    } else if (options[i].children) {
      flag = isParent<T>(options[i].children, value);
    }
  }
  return flag;
};

export default class MyTreeSelect extends Component<MyTreeSelectProps, MyTreeSelectState> {
  constructor(props: MyTreeSelectProps) {
    super(props);
    this.state = {
      // 因为需要做自定义输入，所有本地存储一下options
      options: props.options ?? props.input_props.options ?? [],
      value: get(props, 'value') || get(props, 'defaultValue'),
    };
  }

  componentDidUpdate(prevProps: MyTreeSelectProps) {
    if (JSON.stringify(this.props.value) !== JSON.stringify(prevProps.value)) {
      this.setState({ options: this.props.options ?? this.props.input_props.options });
    }
  }

  handleChange = (
    _value: any,
    _label: Array<ReactNode>,
    { preValue, selected, triggerValue }: { preValue: Array<any>; selected: boolean; triggerValue: any },
  ) => {
    const { onChange } = this.props;
    const multiple = this.props.multiple ?? this.props.input_props.multiple ?? true
    const { options = [] } = this.state;

    const flag: boolean = isParent(options, triggerValue);
    let data = undefined;
    if (multiple) {
      if (selected) {
        if (!flag) {
          const newPreValue = preValue.map((item: any) => item.value);
          newPreValue.push(triggerValue);
          data = newPreValue.join(SPLIT_KEY);
        }
      } else {
        const i = preValue.findIndex((item: any) => item.value === triggerValue);
        if (i !== -1) {
          preValue.splice(i, 1);
        }
        data = preValue.map((item: any) => item.value).join(SPLIT_KEY);
      }
    } else {
      if (!flag) {
        data = triggerValue;
      }
    }
    this.setState({
      value: data,
    });
    onChange(data);
  };

  handleSearch = (value: string) => {
    // 搜索时改变options
    this.setState((_state: MyTreeSelectState, props: MyTreeSelectProps) => {
      const options = props.options ?? props.input_props.options ?? []

      let newOptions = options.map((v: any) => v);
      newOptions.splice(newOptions.length, 0, { value: value, label: value });
      newOptions = newOptions.filter((v: any) => v.value !== '');
      return { options: newOptions };
    });
  };

  formatValue = (value: any) => {
    const multiple = this.props.multiple ?? this.props.input_props.multiple ?? true

    let val: any;
    if (!Array.isArray(value) && multiple) {
      try {
        val = value.split(SPLIT_KEY);
      } catch (e) {
        val = [];
        console.warn(e + ' from TreeSelect Component');
      }
    } else {
      val = value;
    }
    return val;
  };

  render() {
    let { value } = this.state;

    const radio = this.props.radio ?? this.props.input_props.radio ?? false

    const { options } = this.state;
    if (!value) {
      value = radio ? [] : null;
    }
    const dropdownMatchSelectWidth = this.props.dropdownMatchSelectWidth ?? this.props.input_props.dropdownMatchSelectWidth ??  250
    return (
      <TreeSelect
        {...this.props}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        style={{ width: '100%' }}
        treeData={options}
        multiple={!radio}
        onChange={this.handleChange}
        onSearch={this.handleSearch}
        value={this.formatValue(value)}
      />
    );
  }
}
