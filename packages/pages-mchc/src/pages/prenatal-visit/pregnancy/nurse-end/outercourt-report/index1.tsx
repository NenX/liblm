import { DeleteOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { BaseListOld, PDFPreview_View } from '@lm_fe/components_m';
import { SLocal_SystemConfig } from '@lm_fe/service';
import { request } from '@lm_fe/utils';
import { Button, Divider, Modal, Popconfirm } from 'antd';
import React from 'react';
import Table from './components/Table';
import { tableColumns } from './config/table';
import './index.less';
const errorMessage = Modal.error;
class List extends BaseListOld {
  static defaultProps = {
    baseUrl: '/api/outer-reports',
    baseTitle: '外院报告',
    needPagination: true,
    showQuery: false,
    showAdd: true,
    showAction: true,
    tableColumns,
    rowKey: 'id',
    Table,
  };

  constructor(props) {
    super(props);
    const pregnancyData = props.pregnancyData || {};
    this.state = {
      total: 0,
      defaultQuery: {
        page: 0,
        size: 20,
        sort: 'reportDate,DESC',
        'patientNo.equals': pregnancyData.outpatientNO,
      },
      dataSource: [],
      visible: false,
      editable: false,
      id: undefined,
      editKey: undefined,
      loading: true,
      // 本页面使用
      base64: '',
      base64loading: false, // pdf加载
    };
    this.staticDefaultQuery = this.state.defaultQuery;
  }

  componentDidUpdate() {

    const openWebsocket = SLocal_SystemConfig.get('openWebsocket')
    // 默认不开启websocket
    if (!openWebsocket) {
      return;
    }
    let websocketServices = window.websocketServices;
    websocketServices &&
      websocketServices.addEventListener('message', (e: any) => {
        console.log('-----------message ws信息-------------', e.data, JSON.parse(e.data).data);
      });
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
        const { id, base64loading } = this.state;
        return (
          <>
            <Button
              type="link"
              size="small"
              disabled={base64loading}
              icon={
                base64loading && rowData.id === id ? (
                  <LoadingOutlined className="global-table-action-icon" />
                ) : (
                  <EyeOutlined className="global-table-action-icon" />
                )
              }
              onClick={() => this.handleView(value)}
            >
              查看
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              placement="topRight"
              title={`确定要删除这个${this.props.baseTitle}吗?`}
              onConfirm={this.handleDelete(rowData)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" size="small" icon={<DeleteOutlined className="global-table-action-icon" />}>
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  renderOthersModal = () => {
    const { visible, base64, id, dataSource } = this.state;
    const index = dataSource.findIndex((_) => _.id === id);
    const currentRow = dataSource[index];
    if (visible && base64) {
      // api/getOutReportFile?path=xxx
      return (
        <Modal
          centered
          closable
          destroyOnClose
          title="影像图片"
          footer={null}
          visible={visible}
          className="custom-outercourt-modal"
          onCancel={this.handleCancel}
        >
          {currentRow.fileType === 'pdf' && <PDFPreview_View file={`data:application/pdf;base64,${base64}`} />}
          {currentRow.fileType === 'jpg' && <img alt="out-pic" src={`data:image/jpg;base64,${base64}`} />}
        </Modal>
      );
    }
    return <></>;
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      id: undefined,
      base64: '',
    });
  };

  handleView = async (row: any) => {
    if (!row.path) {
      return errorMessage({
        title: '温馨提示',
        content: '资源路径错误或资源不存在',
        maskClosable: true,
        centered: true,
        closable: true,
      });
    }
    this.setState({ id: row.id, base64loading: true });
    try {
      const result = (await request.get(`/api/getOutReportFileBase64?path=${row.path}`)).data;
      if (!result) {
        this.setState({ id: undefined, base64loading: false });
        return errorMessage({
          title: '温馨提示',
          content: '资源加载错误或资源不存在',
          maskClosable: true,
          centered: true,
          closable: true,
        });
      }
      return this.setState({ base64: result, visible: true, base64loading: false });
    } catch (error) {
      errorMessage({
        title: '温馨提示',
        content: '资源加载错误或资源不存在',
        maskClosable: true,
        centered: true,
        closable: true,
      });
      this.setState({ id: undefined, base64loading: false });
    }
  };

  add = () => { };
}
export default List
