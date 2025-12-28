import React, { Component } from 'react';
import { BaseTable as Table } from '../../../BaseTable';
import { Button, InputNumber, Form, Row, Col } from 'antd';
import { isEmpty, isNil, map } from 'lodash';
export default class BaseTable extends Component {
  renderOtherActions = () => {
    const { selectedRowKeys, isEditing, onDelete, onEdit, onSave, onCancel, disabled, value } = this.props;
    let total = 0;
    map(value, (item) => {
      if (item.dosage) {
        total = total + item.dosage;
      }
    });
    return (
      <>
        {isEditing ? (
          <Button style={{ margin: '0 16px' }} onClick={onSave}>
            预览
          </Button>
        ) : (
          <Button disabled={disabled} style={{ margin: '0 16px' }} onClick={onEdit}>
            编辑
          </Button>
        )}
        {/* <Button
          type="primary"
          danger
          onClick={onDelete}
          disabled={disabled || isNil(selectedRowKeys) || isEmpty(selectedRowKeys)}
        >
          删除
        </Button> */}
        {isEditing ? (
          <Button onClick={onCancel}>取消</Button>
        ) : (
          <Button
            type="primary"
            danger
            onClick={onDelete}
            disabled={disabled || isNil(selectedRowKeys) || isEmpty(selectedRowKeys)}
          >
            删除
          </Button>
        )}
        <div
          className="normal-nursing__table-actions"
          style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="胎数" name="fetalCount" initialValue={Number(sessionStorage.getItem('fetalCount'))}>
                <InputNumber disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              催产素使用总量：<span>{total} U</span>
            </Col>
          </Row>
        </div>
      </>
    );
  }
  render(): React.ReactNode {
    return <Table renderOtherActions={this.renderOtherActions} {...this.props} />
  }
}
