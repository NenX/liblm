import React from 'react';
import Table from './components/Table';
import { tableColumns } from './config/table';
import { bindLifecycle } from 'react-keep-alive-pro';
import ModalForm from './components/ModalForm';
import { cloneDeep, get } from 'lodash';
import { Button, Divider, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './index.less';
import BaseListOld from 'src/BaseListOld';

// 列表
export class TreatmentProgramTable extends BaseListOld {
  static defaultProps = {
    baseUrl: '',
    baseTitle: '',
    needPagination: false,
    showQuery: false,
    showAdd: true,
    tableColumns,
    rowKey: 'id',
    Table,
    ModalForm,
  };
  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      record: {},
      programDict: {},
    } as any;
  }
  columns = [
    ...(this.props.tableColumns as Array<any>),
    {
      title: '操作',
      showSorter: false,
      showFilter: false,
      fixed: 'right',
      width: 158,
      align: 'center',
      render: (value: any, rowData: any, index: number) => {
        return (
          <>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined className="global-table-action-icon" />}
              onClick={this.handleEdit(rowData)}
            >
              编辑
            </Button>
            {/* <Divider type="vertical" />
            <Popconfirm
              title={`确定要删除这个${get(this.props, 'baseTitle')}吗?`}
              onConfirm={this.handleDelete(rowData, index)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined className="global-table-action-icon" />}>
                删除
              </Button>
            </Popconfirm> */}
          </>
        );
      },
    },
  ];
  async componentDidMount() {
    this.handleSearch();
  }
  componentDidActivate() {}
  handleEdit = (record: any) => () => {
    this.setState({
      visible: true,
      editable: true,
      id: record.id,
      record: record,
    });
  };
  handleAdd = () => {
    const { programData } = this.props as any;
    if (programData.id) {
      this.setState({
        visible: true,
        editable: true,
        record: {},
      });
    } else {
      message.error('添加预约信息需先保存当前的治疗项目');
    }
  };
  // @ts-ignore
  handleDelete = (rowData: any, index: number) => async () => {
    const { dataSource } = this.state;
    const { onChange } = this.props as any;
    let newDataSource = cloneDeep(dataSource);
    newDataSource.splice(index, 1);
    this.setState({
      dataSource: newDataSource,
    });
    onChange && onChange(newDataSource);
  };

  handleSearch = async () => {
    const { value } = this.props as any;
    this.setState({ dataSource: value });
  };

  handleChangeDataSource = async (submitData: any) => {
    const { dataSource = [] } = this.state;
    const { onChange } = this.props as any;
    let newDataSource: any = [];
    // console.log('dataSource', dataSource);
    const newData = submitData;
    if (newData.id) {
      newDataSource = cloneDeep(dataSource);
      dataSource.map((data: any, key) => {
        if (data.id === newData.id) {
          newDataSource[key] = newData;
        }
      });
      this.setState({
        dataSource: [...newDataSource],
      });
    } else {
      newDataSource = [...dataSource, newData];
      this.setState({
        dataSource: newDataSource,
      });
    }
    onChange && onChange(newDataSource);
  };
  renderOthersModal = () => {
    const { ModalForm, programData } = this.props as any;
    const { visible, editable, id, record } = this.state as any;
    return (
      <>
        {visible && (
          <ModalForm
            visible={visible}
            editable={editable}
            id={id}
            record={record}
            treatmentProgramId={programData.id}
            treatmentProgramProjectName={programData.projectName}
            projectId={programData.projectId}
            onCancel={this.handleCancel}
            onSearch={this.handleSearch}
            onChangeDataSource={this.handleChangeDataSource}
          />
        )}
      </>
    );
  };
}
export default bindLifecycle(TreatmentProgramTable);
