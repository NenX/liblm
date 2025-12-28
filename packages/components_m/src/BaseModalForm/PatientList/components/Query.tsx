import React from 'react';
import BaseQuery from '../../../BaseQuery';
import { Form, Button, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { queryFormDescriptions } from '../config/form';
export const queryValues = ['name', 'outpatientNO', 'idNO'];
export default class Query extends BaseQuery {
  state = { queryFormDescriptions };

  renderBtn = () => (
    <Form.Item>
      <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
        查询
      </Button>
    </Form.Item>
  );

  render() {
    const { queryRef, ...rest } = this.props;

    return (
      <div ref={queryRef} className="global-query-form">
        <Form
          style={{ padding: 0, margin: 0 }}
          ref={this.formRef}
          layout="inline"
          onFinish={this.handleSearch}
          wrapperCol={{ span: 24 }}
          {...rest}
        >
          <Row style={{ width: '100%' }}>
            <Col span={14} offset={2}>
              {this.renderContent()}
            </Col>
            <Col span={7} offset={1}>
              {this.renderBtn()}
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
