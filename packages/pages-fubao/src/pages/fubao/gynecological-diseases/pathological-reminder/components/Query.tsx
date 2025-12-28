import {
  ExportOutlined,
  RedoOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { BaseQuery } from '@lm_fe/components_m';
import { downloadFile, formatDate as formatTimeToDate, fubaoRequest as request } from '@lm_fe/utils';
import { Button, message } from 'antd';
import { isNil, map } from 'lodash';
import React from 'react';
import { queryFormDescriptions } from '../config/form';
export default class Query extends BaseQuery {
  state = { queryFormDescriptions };
  renderBtn = () => (
    <React.Fragment>
      <Button icon={<RedoOutlined />} onClick={this.handleReset}>
        重置
      </Button>
      <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
        查询
      </Button>
      <Button type="primary" icon={<ExportOutlined />} onClick={this.handleExport}>
        导出
      </Button>
    </React.Fragment>
  );

  handleExport = async () => {
    message.info('暂无开放此功能，敬请期待！');
    return;
    const data = await this.form.getFieldsValue();
    let queryData = {};
    map(data, (value: any, key: any) => {
      if (!isNil(value)) {
        if (key === 'reportdate') {
          const startDate = formatTimeToDate(value[0]);
          const endDate = formatTimeToDate(value[1]);
          queryData = {
            ...queryData,
            reportdate: startDate,
            reportdateEnd: endDate,
          };
          return;
        }
        queryData = { ...queryData, [key]: value };
      }
    });
    const res = await request.post('/api/reportQueryExport/admissionAppointmentStatistics', queryData);
    downloadFile(res.data, '病理检查提醒.xls', 'application/vnd.ms-excel', true);

  };
}
