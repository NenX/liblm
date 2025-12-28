import React from 'react';
import { Input, InputNumber, Tooltip, Form } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './index.module.less';
// name --> adPhysicalExam.systolic+diastolic
export default ({ name }: any) => {
  const nameArr = name.split('.');
  const parentKey = nameArr[0];
  const childrenKeys = nameArr[1].split('+');
  // React.useEffect(() => {
  //   const nameArr = name.split('.');
  //   const parentKey = nameArr[0];
  //   const childrenKeys = nameArr[1].split('+');
  //   console.log('--------测试-----', parentKey, childrenKeys);
  // }, []);
  return (
    <Input.Group compact className={styles["pressure-input-wrapper"]}>
      {/* 处理表单配置 key为XX+XX的时候 设置必填项时导致提示必填的问题 */}
      <Form.Item style={{ display: 'none' }} name={[parentKey, nameArr[1]]} initialValue={1}>
        <Input />
      </Form.Item>
      <Form.Item
        noStyle
        rules={[{ required: true, message: '请输入收缩压!' }]}
        label="收缩压"
        name={[parentKey, childrenKeys[0]]}
      >
        <InputNumber className={styles["pressure-input"]} min={0} max={1000} placeholder="收缩压" />
      </Form.Item>

      <Input className={styles["input-split"]} placeholder="/" disabled />
      <Form.Item
        noStyle
        rules={[{ required: true, message: '请输入舒张压!' }]}
        label="舒张压"
        name={[parentKey, childrenKeys[1]]}
      >
        <InputNumber className={styles["pressure-input"]} min={0} max={1000} placeholder="舒张压" />
      </Form.Item>

      <Tooltip className={styles["pressure-input_tip"]} title={`收缩压的正常范围值是90~130mmHg，舒张压的正常范围值是60~90mmHg`}>
        <QuestionCircleOutlined />
      </Tooltip>
    </Input.Group>
  );
};

// diastolic < 60 || diastolic > 90
// systolic < 90 || systolic > 130
