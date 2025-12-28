import React from 'react';
import './index.less';
import { Col, Row } from 'antd';
import BaseFormComponent from '../../../BaseFormComponent';
interface IProps {
  label: string;
  name?: string;
  inputType?: string;
  labelSpan?: Number;
  wrapperSpan?: Number;
  inputProps?: object;
}
export default function renderFieldItem({
  name,
  label,
  inputType,
  labelSpan = 12,
  wrapperSpan = 12,
  inputProps = {},
}: IProps) {
  return (
    <Row className="nurse-children__field">
      <Col className="nurse-children__field-label" span={labelSpan}>
        <span>{label}：</span>
      </Col>
      <Col className="nurse-children__field-input" span={wrapperSpan}>
        <BaseFormComponent inputType={inputType} {...inputProps} />
      </Col>
    </Row>
  );
}
