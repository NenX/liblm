import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import ReaultModal from './Modal';
import styles from './index.less';
interface IProps {
  label?: string;
  name?: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  patientId?: string | number;
  placeholder?: string;
  form?: any; // 暂时未用到
}
export default function ResultTextarea({
  label = '',
  name,
  value,
  onChange = () => { },
  disabled,
  patientId,
  placeholder,
  form,
  ...rest
}: IProps) {
  const [visible, setVisible] = useState(false);

  const handleTextareaChange = (val) => {
    onChange(val);
  };

  const handleOk = (val: string) => {
    onChange(val);
    setVisible(false);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <div className={styles["result-textarea-wrapper"]}>
      <Input.TextArea
        title={value}
        value={value}
        autoSize={{ minRows: 3, maxRows: 3 }}
        placeholder={placeholder || `请输入${label}，可点击右下方"导入"按钮导入${label}模板...`}
        onChange={handleTextareaChange}
        className={styles["template-textarea"]}
        {...rest}
      />
      <span className={styles["result-textarea-wrapper-tag"]}>
        <Button type="text" disabled={disabled} onClick={showModal}>
          导入
        </Button>
      </span>
      {visible && (
        <ReaultModal
          title={`导入${label}结果`}
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          defaultValue={value}
        />
      )}
    </div>
  );
}
