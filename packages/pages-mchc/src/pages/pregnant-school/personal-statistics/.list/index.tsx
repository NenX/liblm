
import { bindLifecycle } from 'react-keep-alive-pro';
import { Query, Table } from './components/index';
import { tableColumns } from './config/index';
import { BaseListOld } from '@lm_fe/components_m';
// import './index.less';
class List extends BaseListOld {
  static defaultProps = {
    baseUrl: '/api/courses/statistics',
    baseTitle: '个人统计',
    needPagination: true,
    showQuery: true,
    showAdd: false,
    tableColumns: tableColumns, // transformToColumns(columns),
    rowKey: 'id',
    Table,
    Query,
    className: 'personal-statistics-list-container',
  };
}

export default bindLifecycle(List);
