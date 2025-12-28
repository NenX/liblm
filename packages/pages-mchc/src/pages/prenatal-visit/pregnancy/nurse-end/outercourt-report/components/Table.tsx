import React from 'react';
import { Button } from 'antd';
import store from 'store';
import { PlusOutlined } from '@ant-design/icons';
import { APP_CONFIG, BaseTableOld } from '@lm_fe/components_m';
import { getSearchParamsValue } from '@lm_fe/utils';
import { SLocal_State } from '@lm_fe/service';
class ProductsTable extends BaseTableOld {
  readSnap = () => {
    const user = SLocal_State.getUserData()
    const pid = getSearchParamsValue('id');
    let websocketServices = window.websocketServices;
    const command = {
      command: 'Snap',
      data: {
        pid, // 患者id
        uid: user.login, // 操作id
      },
      token: `Bearer ${store.get(APP_CONFIG['TOKEN'])}`,
    };
    console.log('=======', this, JSON.stringify(command));
    websocketServices.send(JSON.stringify(command));
  };

  renderAdd = () => {
    return (
      <Button type="primary" icon={<PlusOutlined />} onClick={this.readSnap}>
        报告附加
      </Button>
    );
  };
}
export default ProductsTable