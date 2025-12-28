import React, { Component } from 'react';
import { Input } from 'antd';
import styles from './index.module.less';
import { mchcEvent } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field, SMchc_FormDescriptions } from '@lm_fe/service';
// import templateIcon from '@/assets/imgs/template-icon.png';
interface ITextareaWithTemplateProp {
  onChange: Function;
  value: any;
  input_props: any;
  onClick: Function;
  disabled?: boolean
  config?: IMchc_FormDescriptions_Field
}
export default class TextareaWithTemplate extends Component<ITextareaWithTemplateProp, {}> {
  handleClickBtn = () => {
    const { onClick } = this.props;
    onClick?.();
    mchcEvent.emit('my_form', { type: 'onClick', btnName: SMchc_FormDescriptions.get_form_item_name_str(this.props.config!) })
  };

  handleTextareaChange = (e: any) => {
    const { onChange } = this.props;
    onChange(e.target.value);
  };

  render() {
    const { value, input_props = {}, disabled } = this.props;
    const { minRows = 2, maxRows = 5 } = input_props;

    return (
      <div className={styles["template-wrapper"]}>
        <Input.TextArea
          className={styles["template-texarea"]}
          value={value}
          autoSize={{ minRows, maxRows }}
          onChange={this.handleTextareaChange}
          disabled={disabled}
        />
        <div className={styles["template-action"]} onClick={this.handleClickBtn}>
          模
          {/* <img src={templateIcon} style={{ width: '12px', height: '12px' }} /> */}
        </div>
      </div>
    );
  }
}
