import { ExportOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

import { cloneDeep, isNil, map } from 'lodash';
import { queryFormDescriptions } from '../config/form';
import { BaseQuery } from '@lm_fe/components_m';
import { downloadFile, request } from '@lm_fe/utils';

class Query extends BaseQuery {
  state: any = { queryFormDescriptions };

  renderBtn = () => {
    return (
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
  };
  handleExport = async () => {
    const data = await this.form.getFieldsValue();
    const { defaultQuery } = this.props;
    let cloneQuery = cloneDeep(defaultQuery);
    delete cloneQuery.page;
    delete cloneQuery.size;
    let queryParams = {};
    map(data, (value: any, key: any) => {
      console.log('key', key);
      if (!isNil(value)) {
        let filterType = queryFormDescriptions[key].filterType || 'contains';
        if (queryFormDescriptions[key].ignoreFilterType) {
          queryParams = {
            ...queryParams,
            [key]: value,
          };
        } else if (key === 'courseDate') {
          // const startDate = formatTimeToDate(value[0]);
          // const endDate = formatTimeToDate(value[1]);
          // queryParams = {
          //   ...queryParams,
          //   'course.courseDateStart': startDate,
          //   'course.courseDateEnd': endDate,
          // };
          return;
        } else if (key === 'course.name') {
          // const startDate = formatTimeToDate(value[0]);
          // const endDate = formatTimeToDate(value[1]);
          queryParams = {
            ...queryParams,
            'courseName.contains': value
          };
          return;
        } else if (key === 'pregnancy.name') {
          // const startDate = formatTimeToDate(value[0]);
          // const endDate = formatTimeToDate(value[1]);
          queryParams = {
            ...queryParams,
            'pregnancyName.contains': value
          };
          return;
        } else {
          queryParams = {
            ...queryParams,
            [`${key}.${[filterType]}`]: value,
          };
        }
      }
    });
    console.log('queryParams', queryParams);
    const res = await request.get(`/api/universal/query-export/course-reservation/appointment`, {
      params: {
        ...cloneQuery,
        ...queryParams,
      },
    });
    downloadFile(res.data, '课程预约记录表', 'application/vnd.ms-excel', true);
  };
}

export default Query
