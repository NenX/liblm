import React, { Component, Suspense } from 'react';
import dayjs from 'dayjs';
import { get } from 'lodash';
import MyComponent from '../index';
import './index.less';
interface EditableCellProps {
  value: any;
  onChange: Function;
  editor: any;
  rowItem?: any;
  dispatch?: Function;
  disabled?: boolean
}
export default class EditableCell extends Component<EditableCellProps> {
  state = {
    editing: false,
    value: '',
  };

  componentDidMount() {
    this.mapPropsToState();
  }

  componentDidUpdate(prevProps: EditableCellProps): void {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      this.mapPropsToState();
    }
  }

  handleChange = (val: any) => {
    this.setState({ value: val }, () => {
      // 也可以在这里做 响应会快一点
      this.props.onChange(this.state.value);
    });
  };

  handleClick = (e: any) => {
    if (this.props.editor) {
      this.setState({ editing: true });
    }
  };

  handleDBClick = () => {
    const { rowItem, dispatch } = this.props;
    dispatch && dispatch('rowDBClick', rowItem);
  };

  handleBlur = () => {
    this.setState({ editing: false }, () => {
      // this.props.onChange(this.state.value);
    });
  };

  mapPropsToState(): void {
    this.setState({
      value: this.props.value,
      // editing: this.props.value === undefined || this.props.value === null,
    });
  }

  render() {
    const { editing, value = '' } = this.state;
    const { editor } = this.props;
    let RenderComponent = null;
    if (editor) {
      RenderComponent = MyComponent[editor.input_type];
    }
    /**
     * 6/22 当 select支持自定义输入后，option中会找不到opt
     */
    const getLabel = () => {
      // value值判断应该做成一个方法
      if (editor.input_type === 'select' && value !== undefined && value !== null && value !== '') {
        const options = editor.input_props.options;
        let opt;
        if (editor.input_props.type === 'multiple') {
          opt = options.filter((item: any) => value[item.value]).pop() || { label: '', value: '' };
        } else {
          opt = options.filter((item: any) => item.value === value).pop() || { label: value, value };
        }
        return opt.label;
      }
      if (editor.input_type === 'date' && get(editor, 'input_props.format')) {
        return value ? dayjs(value).format(get(editor, 'input_props.format')) : '';
      }
      if (editor.input_type == 'checkbox') {
        return value ? '√' : value;
      }
      return value;
    };
    return (
      <div
        onClick={this.handleClick}
        onDoubleClick={this.handleDBClick}
        onBlur={this.handleBlur}
        className="table-editable-cell"
      >
        {/* {(editing || editor.input_type === 'checkbox') && !editor.unEditable ? ( */}
        {/* editor.unEditable !== false */}
        {editor.unEditable !== false ? (
          <Suspense fallback={<span>...</span>}>
            <RenderComponent
              editing={editing}
              {...editor}
              disabled={this.props.disabled}
              onChange={(val: any) => this.handleChange(val)}
              value={this.state.value}
            />
          </Suspense>


        ) : (
          // 如value为空，渲染为"-"
          <span className="table-item" title={getLabel()}>
            {getLabel()}
          </span>
        )}
      </div>
    );
  }
}
