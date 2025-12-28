import React, { useState, useEffect } from 'react';
import { InputNumber, Tooltip } from 'antd';
import classnames from 'classnames';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
interface IProps {
  min?: number;
  max?: number;
  tip?: string;
  value?: any;
  hiddenIpt?: boolean;
  onChange?: any;
  style?: any;
}
export default (props: IProps) => {
  const { onChange, style = {}, value, min, max, hiddenIpt, tip, ...others } = props;
  const [data, setData] = useState('');

  useEffect(() => {
    value && setData(value);
  }, [value]);

  const handleChange = () => (e: any) => {
    setData(e);
    onChange && onChange(e);
  };

  if (hiddenIpt) {
    return (
      <div className={styles["input-with-range"]}>
        <span
          className={classnames({
            [styles['number-issue-range']]: data && (Number(data) < Number(min) || Number(data) > Number(max)),
          })}
        >
          {data}
        </span>
      </div>
    );
  }

  return (
    <div className={styles["input-with-range"]}>
      <InputNumber
        style={style}
        className={classnames('input-with-range_input', {
          [styles['number-issue-range']]: data && (Number(data) < Number(min) || Number(data) > Number(max)),
        })}
        min={0}
        value={data}
        onChange={handleChange()}
        {...others}
      />
      <Tooltip className={styles["input-with-range_tip"]} title={tip}>
        <QuestionCircleOutlined />
      </Tooltip>
    </div>
  );
};
