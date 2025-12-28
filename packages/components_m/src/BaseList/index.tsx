import React, { useEffect } from 'react';
import { get, isFunction, map, set, isNil, pick, isArray, join, cloneDeep } from 'lodash';
import { message, Popconfirm, Button, Form, Divider, TableProps } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { isMoment } from '@lm_fe/utils';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { BaseTable } from '../BaseTable';
import { formatDateTime, getMomentObj, request } from '@lm_fe/utils';
import BaseFormComponent from '../BaseFormComponent';
import { getDataSource } from './methods';
import './index.module.less';
import { useState } from 'react';
import { useRef } from 'react';
import { ColumnType } from 'antd/lib/table';
interface MyColumnType<T> extends ColumnType<T> {
  formType?: any

  // 兼容
  inputType?: string
  showSorter?: boolean
  showFilter?: boolean
  editable?: boolean
  children?: MyColumnType<T>[]
}
export interface IProps<T = any> {
  // 接口 URL
  baseUrl: string;
  // 唯一 key，通常取 id
  rowKey: string;
  // 左上角标题
  baseTitle: string;
  // 列表配置
  tableColumns: MyColumnType<T>[];
  // Table 组件
  Table: typeof BaseTable;
  // 是否需要分页
  needPagination?: boolean;
  // 需要 多选
  needChecked?: boolean;
  // selectionType
  selectionType?: 'checkbox' | 'radio';
  // 表格是否可编辑
  needEditInTable?: boolean;
  // 展示添加按钮
  showAdd?: boolean;
  // add文本
  addText?: string;
  // 是否展示编辑列
  showAction?: boolean;
  // 当 BaseList 作为子组件的时候，可能需要使用，参考 nursing-record
  asChildComponentQueryLabel?: string;
  // 展示搜索功能，如果为 true，则必须传 Query 组件
  showQuery?: boolean;
  // 传入的 ID
  id?: string | number;
  // 从接口获取数据，过滤函数
  processFromApi?: (data: object[]) => object[];
  // 提交data时，处理过滤符合api接口的数据格式
  toApi?: (data: object) => object;
  // 其它表格属性
  otherTableProps?: TableProps<any>;
  // 弹窗表单
  ModalForm?: any;
  // 搜索组件
  Query?: any;
  // 页脚表单区域
  ExtraFooter?: any;
  // 新增、编辑、详情信息显示模式-->modal/drawer/inline
  editMode?: 'modal' | 'drawer' | 'inline';
  className?: any;
  handleAdd?(): void;
  handleDoubleClickRow?(rowData: T): void;
  handleClickRow?(rowData: T): void;
  showTitle?: boolean
  containerProps?: any
  history?: any
}
export interface IState {
  total: number;
  dataSource: any[];
  defaultQuery?: {
    page?: number;
    size?: number;
    sort?: string;
    [propName: string]: any;
  };
  visible: boolean;
  editable: boolean;
  loading: boolean;
  id: any;
  editKey: any;
  selectedRowKeys: any[];
  selectedRows?: any[];
  tableProps?: TableProps<any>;
  [propName: string]: any;
}
export const DEFAULT_HEADER_HEIGHT = 37;
export const SHOW_SERIAL = true;
const staticDefaultQuery = {
  page: 0,
  size: 20,
  sort: 'id,desc', // 基本列表都需要倒序
};
export function BaseList<T = any>(props: IProps<T>) {

  const [total, setTotal] = useState(0)
  const [defaultQuery, setDefaultQuery] = useState(staticDefaultQuery)
  const [dataSource, setDataSource] = useState<any[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [visible, setVisible] = useState(false)
  const [editable, setEditable] = useState(false)
  const [id, setId] = useState()
  const [editKey, setEditKey] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [isSearchColumnModal, setIsSearchColumnModal] = useState(false)
  const [tableProps, setTableProps] = useState<TableProps<any>>({})
  const {
    baseTitle,
    needPagination,
    rowKey,
    Query,
    ExtraFooter,
    Table = BaseTable,
    showQuery,
    otherTableProps = {},
    needEditInTable,
    needChecked = false,
    showTitle,
    containerProps = {},
    history,
    addText,
    selectionType = 'checkbox',
    className,
  } = props;
  useEffect(() => {
    if (!showQuery) {
      handleSearch();
    }
  }, [])
  const showAdd = props.showAdd ?? !!props.handleAdd

  const ordinal = {
    title: 'No.',
    width: 40,
    align: 'center',
    className: 'ant-table-ordinal',
    render: (text: any, record: any, index: any) => `${index + 1}`,
    fixed: 'left',
  };

  /* istanbul ignore next */
  const actionCol: MyColumnType<T> = {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 132,
    align: 'center',
    showSorter: false,
    showFilter: false,
    render: (value: any, rowData: any, index: number) => {
      const { needEditInTable } = props;
      const editable = isEditing(rowData);
      if (needEditInTable && editable) {
        return (
          <>
            <Button size="small" className="table-action-btn" onClick={handleItemSave(rowData)}>
              保存
            </Button>
            <Button size="small" className="table-action-btn" onClick={handleItemCancel(rowData)}>
              取消
            </Button>
          </>
        );
      }

      return (
        <>
          <Button type="link" size="small" onClick={handleEdit(rowData)}>
            <EditOutlined className="global-table-action-icon global-table-action-view" />
            编辑
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title={`确定要删除这个${get(props, 'baseTitle')}吗?`}
            onConfirm={handleDelete(rowData)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small">
              <DeleteOutlined className="global-table-action-icon" />
              删除
            </Button>
          </Popconfirm>
        </>
      );
    },
  };

  const columns = !props.showAction ? [...props.tableColumns] : [...props.tableColumns, actionCol];

  const formRef = useRef<FormInstance | null>(null);



  const isEditing = (rowData: any) => (get(rowData, 'editKey') || get(rowData, 'id')) === editKey;

  const handleDelete = (rowData: any) => async () => {
    const { baseUrl, baseTitle } = props;
    await request.delete(`${baseUrl}/${get(rowData, 'id')}`);
    message.success(`删除${baseTitle}成功`);
    handleSearch();
  };

  const handleItemSave = (rowData: any) => async () => {
    const { baseUrl, baseTitle, toApi, needEditInTable, showAdd } = props;

    const form = formRef.current;
    await form?.validateFields();
    const formData = form?.getFieldsValue() ?? {};
    map(formData, (data, key) => {
      if (isMoment(data)) {
        formData[key] = formatDateTime(data);
      }
    });
    let method = 'put';
    let title = `编辑${baseTitle}成功`;
    if (!id && showAdd && needEditInTable) {
      method = 'post';
      title = `新增${baseTitle}成功`;
    }
    await request[method](
      baseUrl,
      isFunction(toApi)
        ? toApi({
          ...rowData,
          ...formData,
        })
        : {
          ...rowData,
          ...formData,
        },
    );
    formRef.current?.resetFields();
    setId(undefined)
    setEditKey(undefined)

    message.success(title);
    await handleSearch();
  };

  const handleItemCancel = (rowData: any) => () => {

    const form = formRef.current;
    form?.resetFields();
    setId(undefined)
    setEditKey(undefined)
    setDataSource(typeof editKey === 'string' ? dataSource.slice(1, dataSource.length) : dataSource)

  };

  const handleEdit = (record: any) => () => {
    console.log('record', record)
    const { needEditInTable, tableColumns } = props;
    if (needEditInTable) {
      const form = formRef.current;

      // TODO: 通过 tableColumns 判断字段是否为时间格式，如果是，需要转换为 dayjs()。(是否可以优化？)
      // map(rowData, (item, dataIndex) => {
      //   const inputType = get(keyBy(tableColumns, 'dataIndex'), `${dataIndex}.inputType`);
      //   if (['single_date_picker', 'single_time_picker'].indexOf(inputType) > -1) {
      //     set(rowData, dataIndex, dayjs()Date(item));
      //   }
      // });
      map(tableColumns, (item) => {
        const inputType = item.inputType;
        const _dataIndex = item.dataIndex
        if (['single_date_picker', 'single_time_picker'].indexOf(inputType!) > -1 && _dataIndex) {
          const dataIndex = Array.isArray(_dataIndex)
            ? _dataIndex.join('.')
            : _dataIndex

          const m = getMomentObj(get(record, dataIndex))

          set(record, dataIndex, m.isValid() ? m : null);
        }
      });

      form?.setFieldsValue(record);
      setId(record.id)
      setEditKey(record.editKey || record.id)

    } else {
      setId(record.id)
      setVisible(true)
      setEditable(true)

    }
  };

  // 单击某条记录触发相应事件
  const handleClickRow = (record: any, event: any) => {
    if (props.handleClickRow) {
      props.handleClickRow(record)
    }
  };

  // 双击某条记录触发相应事件
  const handleDoubleClickRow = (record: any) => {
    if (props.handleDoubleClickRow) {
      props.handleDoubleClickRow(record)
    }
  };

  const handleAdd = () => {
    if (props.handleAdd) {
      return props.handleAdd()
    }
    const { needEditInTable, showAdd } = props;

    if (needEditInTable && showAdd) {
      if (!isNil(editKey)) {
        message.error('请先保存上一条记录');
        return;
      }
      const mockKey = new Date().toString();
      setEditKey(mockKey)
      setDataSource([
        {
          editKey: mockKey,
        },
        ...dataSource,
      ])

    } else {
      setVisible(true)
      setEditable(true)

    }
  };

  const handleCancel = () => {

    setVisible(false)
    setEditable(false)
    setId(undefined)

  };

  const getQuerySearchData = () => { };

  const handleFieldsChange = () => { };

  const handleQuerySearch = async (data: object = {}) => {
    const q = { ...staticDefaultQuery, ...data }
    setDefaultQuery(q)

    handleSearch(q);
  };

  const formatQuery = (queryParams: object) => {
    const { asChildComponentQueryLabel = '', id: propsId } = props;

    const query = {
      ...defaultQuery,
      ...queryParams,
      sort: 'id,desc',

    }
    // TODO: 有可能作为页面的子组件， propsId 是 BaseList 作为子组件从 props 传入的
    if (propsId) {
      propsId[asChildComponentQueryLabel] = propsId
    }


    return query;
  };

  async function handleSearch(q = {}) {

    const { baseUrl, processFromApi } = props;
    if (!baseUrl) {
      return;
    }
    if (!isNil(editKey)) {
      message.error('请保存未保存的记录');
      return;
    }
    setLoading(true)
    let dataSource = [];
    let total = 0;
    const query = formatQuery({ ...defaultQuery, q });
    const { data, count } = await getDataSource(baseUrl, query, processFromApi);
    if (data && isArray(data)) {
      dataSource = data;
    }
    if (count) {
      total = Number(count);
    }
    setDataSource(dataSource)
    setTotal(total)
    setLoading(false)
    return dataSource;
  };

  const handlePageChange = (page: any, pageSize: any) => {
    const q = {
      ...defaultQuery,
      page: page - 1,
      size: pageSize,
    }
    setDefaultQuery(q)
    handleSearch(q)
  };

  const handleRowSelected = (selectedRowKeys: any, selectedRows: any): any => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRows(selectedRows)

  };

  const getColumns = () => {
    const { needEditInTable } = props;
    const c = SHOW_SERIAL ? [...columns] : [...columns];
    return map(c, (col) => {
      if (needEditInTable && col.editable) {
        if (col.children) {
          let childrenCell: any[] = [];
          col.children.map((child: any) => {
            childrenCell.push({
              ...child,
              onCell: (rowData: any) => {
                return {
                  ...pick(child, ['inputType', 'inputProps', 'dataIndex', 'title', 'rules']),
                  record: rowData,
                  editing: isEditing(rowData),
                };
              },
            });
          });
          return {
            ...col,
            children: childrenCell,
          };
        }
        return {
          ...col,
          onCell: (rowData: any) => {
            return {
              ...pick(col, ['inputType', 'inputProps', 'dataIndex', 'title', 'rules']),
              record: rowData,
              editing: isEditing(rowData),
            };
          },
        };
      }
      return col;
    });
  };

  const renderEditableCell = (cell: any) => {
    const {
      editing,
      dataIndex,
      title,
      inputType = 'input',
      inputProps,
      rules,
      record,
      index,
      children,
      inputConfig,
      ...restProps
    } = cell;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            className="editing"
            name={dataIndex}
            style={{ margin: 0 }}
            rules={getDefaultRequiredRules(rules, title || dataIndex)}
          >
            <BaseFormComponent {...inputProps} inputType={inputType} config={inputConfig ?? cell} />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const renderOthersModal = () => {
    const { ModalForm } = props;

    if (!visible) {
      return;
    }
    return (
      <ModalForm
        visible={visible}
        editable={editable}
        id={id}
        onCancel={handleCancel}
        onSearch={handleSearch}
      />
    );
  };

  // 剩余react 都没渲染

  // 新增点击搜索列弹出Modal
  const renderSearchColumnModal = () => { };

  // 点击编辑时，该行背景色加深
  // 子类这样写:
  //  setRowClassName = (record) => {
  //   return record.id === state.id ? 'editRowStyle' : '';
  // }

  // setRowClassName = () => {
  //   return '';
  // }

  const searchColumnModalVisible = () => {
    setIsSearchColumnModal(true)
  };

  const renderHiddenItem = () => <></>;
  const setRowClassName = (record: any) => {
    return record.id === id ? 'clickRowStyl' : '';
  };
  const mergerTableProps = () => {

    let mergeTablePros = {
      ...otherTableProps,
      ...tableProps,
    };
    return mergeTablePros as TableProps<any>;
  }
  /* istanbul ignore next */


  const mergedColumns = getColumns();
  const mergeTablePros = mergerTableProps();
  return (
    <div className={`base-list ${className}`} style={{ background: 'yellow' }}>
      <Form
        ref={formRef}
        component={false}
        onFieldsChange={handleFieldsChange}
      >
        {renderHiddenItem()}
        <Table
          otherTableProps={mergeTablePros}

          onRow={(record: object) => {
            const canClick = !editKey;
            if (!canClick) {
              return {};
            }
            return {
              onClick: (event: any) => handleClickRow(record, event),
              onDoubleClick: !editKey ? handleDoubleClickRow(record) : undefined,
            };
          }}
          containerProps={containerProps}
          // loading={loading} // TODO: 已经做全局 loading，表格内 loading 是否不再需要
          pagination={
            needPagination ? {
              position: ['bottomCenter'],
              total,
              showTotal: () => {
                const min = defaultQuery.page * defaultQuery.size + 1;
                const max = (defaultQuery.page + 1) * defaultQuery.size;
                return `第 ${min}~${max < total ? max : total} 条 / 共 ${total} 条`;
              },
              pageSize: defaultQuery.size,
              current: defaultQuery.page + 1,
              pageSizeOptions: [10, 20, 30, 40, 50, 100].map(_ => _.toString()),
              onChange: handlePageChange,
              onShowSizeChange: handlePageChange,
              showQuickJumper: true,
              showSizeChanger: true,
            } : undefined
          }
          components={
            needEditInTable
              ? {
                body: {
                  cell: renderEditableCell,
                },
              }
              : {}
          }
          columns={mergedColumns}
          dataSource={dataSource}
          defaultQuery={defaultQuery}
          onAdd={showAdd ? handleAdd : undefined}
          addText={addText}
          baseTitle={baseTitle}
          rowKey={rowKey}
          onSearch={handleQuerySearch}
          getQuerySearchData={getQuerySearchData}
          showQuery={showQuery}
          toQueryMethods={searchColumnModalVisible}
          showTitle={showTitle}
          Query={Query}
          ExtraFooter={ExtraFooter}
          needChecked={needChecked}
          selectedRowKeys={selectedRowKeys}
          selectedRows={selectedRows}

          rowSelection={
            needChecked ? {
              type: selectionType,
              onChange: handleRowSelected,
            } : undefined
          }
          history={history}
          rowClassName={setRowClassName}
        />
      </Form>
      {renderOthersModal()}
      {renderSearchColumnModal()}
    </div>
  );
}
function getDefaultRequiredRules(rules: any[], title: string) {
  return map(rules, (rule) => {
    if (get(rule, 'required')) {
      return {
        required: true,
        message: `${title}是必填项`,
      };
    }
    return rule;
  });
};
