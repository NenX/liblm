import React, { Component, ReactNode } from 'react';
import { Button, Tooltip, Modal } from 'antd';
import {
  MinusCircleOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import MyCustom from './index';
import './ArrayCustom.less';
import { set } from 'lodash';

/**
 * 传入一个数组
 * 默认会有一条记录
 */
interface ArrayCustomProps {
  onChange: Function;
  dispatch: Function;
  value: Array<any>;
  input_props: any;
  error: any;
  disabled?: boolean
}
interface ArrayCustomState {
  value: Array<any>;
  error: Array<any>;
  visible: boolean;
  deleteIndex: number;
}
export default class ArrayCustom extends Component<ArrayCustomProps, ArrayCustomState> {
  constructor(props: ArrayCustomProps) {
    super(props);
    this.state = {
      value: [],
      error: [],
      visible: false,
      deleteIndex: -1,
    };
  }

  componentDidMount() {
    this.mapPropsToState();
  }

  componentDidUpdate(prevProps: ArrayCustomProps) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      this.mapPropsToState();
    }
  }

  handleChange = (val: any, index: number): void => {
    const { value = [], onChange } = this.props;
    const newValue = JSON.parse(JSON.stringify(value)) || [];
    // newValue[index] = val;
    set(newValue, `[${index}]`, val);
    console.log({ newValue });
    onChange(newValue);
  };

  renderArrayCustomForm = (): ReactNode => {
    const { dispatch, input_props = {} } = this.props;
    const { array_title = '记录', hiddenBtn } = input_props;
    let { value } = this.props;
    if (!value || value.length === 0) {
      // 默认赋值一条数据
      value = [{}];
    }
    return value.map((val: any, index: number) => (
      <div className="array-form" key={`array-custom-${index}`}>
        {/* <div className="array-form-title">
          <div>
            <span>{array_title}{index + 1}</span>
          </div>
        </div> */}
        <div className="array-form-main">
          <div className="array-form-main_title">
            <span>
              {array_title}
              {index + 1}：
            </span>
            <div className="array-form-main_title-handler">
              {!hiddenBtn && (
                <>
                  {/* 第一条记录不可删除 */}
                  {value.length === 1 ? null : (
                    <Tooltip title="删除">
                      <Button
                        size="small"
                        shape="circle"
                        danger
                        type="link"
                        icon={<MinusCircleOutlined />}
                        disabled={this.props.disabled}

                        onClick={() => this.handleDelete(index)}
                      />
                    </Tooltip>
                  )}
                  {/* 最后一条记录才会渲染添加的符号 */}
                  {index !== value.length - 1 ? null : (
                    <Tooltip title="添加">
                      <Button
                        shape="circle"
                        size="small"
                        type="link"
                        icon={<PlusCircleOutlined />}
                        onClick={this.handleAdd}
                        disabled={this.props.disabled}
                      />
                    </Tooltip>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="array-form-main_custom">
            <MyCustom
              onChange={(singleValue: any) => this.handleChange(singleValue, index)}
              dispatch={dispatch}
              input_props={input_props}
              error={null}
              value={val}
              getValidFun={() => { }}
              subscribe={() => { }}
              disabled={this.props.disabled || input_props.disabled}
            />
          </div>
        </div>
      </div>
    ));
  };

  handleAdd = () => {
    let { value = [], input_props = {}, onChange } = this.props;
    const { config = [] } = input_props;
    const emptyItem = {};

    config.forEach((item: any) => {
      const { key }: { key: string } = item;
      const newKey = key.substring(1, key.length);
      // arraySplitKey & objectSplitKey
      const nextSplitKeyIndex = newKey.search(/[\.]|[\_]/);
      if (nextSplitKeyIndex !== -1) {
        emptyItem[newKey.substring(0, nextSplitKeyIndex)] = '';
      } else {
        emptyItem[newKey] = null;
      }
    });
    if (value) {
      value.push(emptyItem);
    } else {
      value = [emptyItem, emptyItem];
    }
    onChange(value);
  };

  handleDelete = (index: number): void => {
    this.setState({ visible: true, deleteIndex: index });
  };

  confirmDelete = () => {
    const { deleteIndex } = this.state;
    const { value, onChange } = this.props;
    value.splice(deleteIndex, 1);
    onChange(value);
    this.setState({ visible: false });
  };

  mapPropsToState = (): void => {
    const { value, error } = this.props;
    this.setState({ value, error });
  };

  render() {
    const { visible } = this.state;
    const { name, value } = this.props;
    return (
      <div className="array-custom" id={name}>
        <div>{this.renderArrayCustomForm()}</div>
        <Modal
          visible={visible}
          closable={false}
          onCancel={() => this.setState({ visible: false })}
          onOk={() => this.confirmDelete()}
          width="350px"
          style={{ top: '40%' }}
        >
          <span>
            <QuestionCircleOutlined style={{ color: '#feaa02' }} />
          </span>
          &nbsp;&nbsp;
          <span>你是否确认删除此记录</span>
        </Modal>
      </div>
    );
  }
}
