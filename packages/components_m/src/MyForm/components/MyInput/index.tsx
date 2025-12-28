import React from 'react';
import { get, forEach } from 'lodash';
import { Input, InputNumber, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './index.less';
import { isIE } from '@lm_fe/utils';
interface MyInputProps {
  onChange: Function;
  onClick: Function;
  dispatch?: Function;
  value: any;
  input_props: any;
  editing: boolean;
  label: string;
  validate: any;
  error: any;
  unit: any;
  step?: string;
  disabled?: boolean
}
interface MyInputState {
  value: any;
}
export default class MyInput extends React.Component<MyInputProps, MyInputState> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: '',
    };
  }

  handleClick = () => {
    const { onClick } = this.props;
    if (onClick) onClick();
  };

  handleChange = (e: any) => this.props.onChange(e.target.value);

  handleNumberChange = (value: any) => this.props.onChange(value);

  /**
   * TODO:
   * 下面的方法原本是用于判断输入法的开始与结束
   * 可以用于减少onChange的次数达到性能的优化
   * 但是Ant-design的Input没有提供相关的接口
   *
   * 可以考虑的一个解决方案就是把这两个方法放置与Input的父元素
   * 因为时间关系没有做
   */

  handleKeyDown = (e: any) => {
    e.target.keyEvent = true;
  };

  handleKeyUp = (e: any) => {
    const flag = e.target.isNeedPrevent;
    if (flag) return;
    this.props.onChange(this.state.value);
    e.target.keyEvent = false;
  };

  handleCompositionStart = (e: any) => {
    e.target.isNeedPrevent = true;
  };

  handleCompositionEnd = (e: any) => {
    e.target.isNeedPrevent = false;
  };
  renderInput = () => {
    const { input_props = {}, editing, value, label, validate, unit, error, ...rest } = this.props;
    const { max } = input_props;

    let rangItem = {};
    forEach(validate, (item) => {
      if (get(item, 'type') === 'rang') {
        rangItem = item;
      }
    });
    const minVal = get(rangItem, 'min');
    const maxVal = get(rangItem, 'max');

    if (input_props) {
      if (input_props.type === 'textarea') {
        return <Input.TextArea {...rest} {...input_props} value={value} title={value} onChange={this.handleChange} />;
      } else if (input_props.type === 'password') {
        return <Input.Password {...rest} {...input_props} value={value} onChange={this.handleChange} />;
      } else if (input_props.type === 'text') {
        return <Input {...rest} {...input_props} value={value} title={value} onChange={this.handleChange} />;
      } else if (input_props.type === 'number') {
        return (
          <div className="input-with-rang">
            {isIE() ? (
              <Input {...rest} {...input_props} value={value} title={value} onChange={this.handleChange} />
            ) : (
              <InputNumber
                min={0}
                max={max}
                {...rest}

                autoFocus={editing}
                title={value}
                value={value}
                onChange={this.handleNumberChange}
              />
            )}

            {/\*/.test(error) && value ? (
              <Tooltip className="rang_tip" title={`${label}的正常范围值是${minVal}~${maxVal}${unit}`}>
                <QuestionCircleOutlined />
              </Tooltip>
            ) : null}
          </div>
        );
      }
    }

    return (
      <Input
        {...rest}

        autoFocus={editing}
        value={value === ' ' ? null : value}
        title={value}
        onClick={this.handleClick}
        onChange={this.handleChange}
      />
    );
  };

  render() {
    return this.renderInput();
  }
}
