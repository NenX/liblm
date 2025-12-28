import { Checkbox } from 'antd';
import classnames from 'classnames';
import { get } from 'lodash';
import { Component } from 'react';
import { FormConfig } from '../../interface';
import MyComponent from '../index';
import './CheckboxWithExtra.less';
interface CheckboxWithExtraProps {
  editors: Array<FormConfig>;
  checkboxValue: boolean;
  editorsValue: Array<any>; // 以 {"0":"", "1": ""} 输入输出
  onChange: Function;
}
export default class CheckboxWithExtra extends Component<CheckboxWithExtraProps> {
  handleChange = (value: any, name: string, index: number) => {
    const { checkboxValue, editorsValue, onChange } = this.props;
    if (name === 'checkboxValue') {
      onChange({
        checkboxValue: value,
        editorsValue,
      });
    } else if (name === 'editorValue') {
      const newEditorsValue = editorsValue.map((editorValue: any) => editorValue);
      newEditorsValue[index] = value;
      onChange({
        checkboxValue,
        editorsValue: newEditorsValue,
      });
    }
  };
  a = {};
  renderExtra = (editorsValue: Array<any>) => {
    const { editors = [] } = this.props;
    if (!editors || editors.length === 0) return null;
    return editors.map((editor, index) => {
      if (!editor.input_type) return null;
      const RenderComponent = MyComponent[editor.input_type];
      const style = get(editor, `style`) || { 'min-width': get(editor, `specialStyle.minWidth`) };
      return (
        <div key={index} className="extra-editors" style={style}>
          {editor.label ? <span className="extra-editors-label">{editor.label}</span> : null}
          <div
            className={classnames('editor', {
              'global-issue-input': get(editors, '0.isIssue'),
            })}
            style={get(editors, '[0]style')}
          >
            <RenderComponent
              value={editorsValue === null ? null : editorsValue[index]}
              {...editor}
              onChange={(value: any) => this.handleChange(value, 'editorValue', index)}
            />
          </div>
          <div className="unit">
            <span>{editor.unit}</span>
          </div>
        </div>
      );
    });
  };

  render() {
    const { checkboxValue, editorsValue, editors } = this.props;
    return (
      <div className="checkox-with-extra">
        <div
          className={classnames('checkbox', {
            'global-issue-checkbox': get(editors, '0.isIssue') && checkboxValue,
          })}
        >
          <Checkbox
            checked={checkboxValue}
            onChange={(e: any) => this.handleChange(e.target.checked, 'checkboxValue', -1)}
          >
            {this.props.children}
          </Checkbox>
        </div>
        {checkboxValue ? this.renderExtra(editorsValue) : null}
      </div>
    );
  }
}
