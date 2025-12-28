import { QuestionCircleOutlined } from '@ant-design/icons';
import { Col, InputNumber, Row, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import styles from './index.less';
export default function InputWithRangTip(props: any) {
  const { tip = '', onChange, value, min, max, ...others } = props;

  const [data, setData] = useState();

  useEffect(() => {
    value && setData(value);
  }, [value]);

  const handleChange = (value: any) => {
    setData(value);
    onChange && onChange(value);
  };

  return (
    <Row
      className={classnames(styles['input-with-range-tip'], {
        'global-issue-range': Number(data) < Number(min) || Number(data) > Number(max),
      })}
    >
      <Col span={22} className={styles["input-with-range-tip__input"]}>
        <InputNumber {...others} value={data} onChange={handleChange} />
      </Col>
      <Col span={2} className={styles["input-with-range-tip__tip"]}>
        <Tooltip title={tip}>
          <QuestionCircleOutlined />
        </Tooltip>
      </Col>
    </Row>
  );
}
