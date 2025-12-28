import { RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React from 'react';
import { queryFormDescriptions } from '../config/form';
import { BaseQuery } from '@lm_fe/components_m';

class Query extends BaseQuery {
  state = { queryFormDescriptions };

  componentDidUpdate() {
    const { config = {} } = this.props;
    // 默认不开启websocket
    if (!config.openWebsocket) {
      return;
    }
    let websocketServices = window.websocketServices;
    websocketServices &&
      websocketServices.addEventListener('message', (e: any) => {
        console.log('-----------message ws信息(叶酸管理)-------------', e, e.data);
        let d = {};
        if (e && e.data && !e.data.includes('{')) {
          return message.info(`${e.data}，请重新读卡`);
        }
        if (e && e.data && e.data.includes('{')) {
          d = JSON.parse(e.data);
        }
        if (d.name) {
          const values = { name: d.name };
          this.form.setFieldsValue(values);
          // const params = this.form.getFieldsValue();
          // onSearch && onSearch(values);
          this.handleSearch && this.handleSearch(values);
        }
      });
  }

  readIDCard = () => {
    const websocketServices = window.websocketServices;
    const command = {
      name: 'ReadCard',
      data: {},
    };
    websocketServices.send(JSON.stringify(command));
  };

  renderBtn = () => (
    <React.Fragment>
      <Button icon={<RedoOutlined />} onClick={this.handleReset}>
        重置
      </Button>
      <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
        查询
      </Button>
      {/* <Button
        danger
        type="primary"
        icon={<ApiOutlined />}
        disabled={this.props.socketState !== WEBSOCKET_STATUS['OPEN']}
        onClick={this.readIDCard}
      >
        读取身份证
      </Button> */}
    </React.Fragment>
  );
}

export default Query
