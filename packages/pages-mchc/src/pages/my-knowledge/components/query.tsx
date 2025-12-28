import { RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { queryFormDescriptions } from './../config/query-form';
import { BaseQuery } from '@lm_fe/components_m';

class Query extends BaseQuery {
  state = { queryFormDescriptions };
  renderBtn = () => (
    <React.Fragment>
      <Button icon={<RedoOutlined />} onClick={this.handleReset}>
        重置
      </Button>
      <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
        查询
      </Button>
    </React.Fragment>
  );
}

export default Query;
