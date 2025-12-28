
import { DeleteOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { BaseListOld, LazyAntd, PDFPreview_View } from '@lm_fe/components_m';
import { Button, Divider, Modal, Popconfirm } from 'antd';
import classnames from 'classnames';
import React from 'react';
import Query from './components/Query';
import ATable from './components/Table';
import { tableColumns } from './config/table';
import './index.less';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

const errorMessage = Modal.error;

let hostUrl = process.env.NODE_ENV === 'production' ? '' : 'http://120.79.170.18:8904';
class List extends BaseListOld {
  staticDefaultQuery = {
    page: 0,
    size: 20,
    sort: 'reportDate,DESC',
    'type.in': '1,2,3',
  };

  static defaultProps = {
    baseUrl: '/api/outer-reports',
    baseTitle: '外院报告管理',
    needPagination: true,
    showQuery: true,
    showAdd: true,
    showAction: true,
    tableColumns,
    rowKey: 'id',
    Table: ATable,
    Query,
  };

  state = {
    ...this.state,
    total: 0,
    dataSource: [],
    visible: false,
    editable: false,
    id: undefined,
    editKey: undefined,
    loading: true,
    // 本页面使用
    base64: '',
    base64loading: false, // pdf加载

    current: 1,
  } as any;

  async componentDidUpdate() {

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
    const { visible, pathArr, current } = this.state;
    if (visible) {
      // api/getOutReportFile?path=xxx
      let imgArr: any = [];
      pathArr.map((path: string, index: number) => {
        let isShow = index == current - 1;
        if (path.indexOf('.pdf') > -1) {
          imgArr.push(
            <div
              className={classnames('hideContent', {
                isShow: isShow,
              })}
              key={path}
            >
              <PDFPreview_View key={path} file={`${hostUrl}${path}`} />
            </div>,
          );
        } else {
          imgArr.push(
            <img
              key={path}
              className={classnames('hideContent', {
                isShow: isShow,
              })}
              alt="out-pic"
              src={`${hostUrl}${path}`}
            />,
          );
        }
      });
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
          <div className="img-container">{imgArr}</div>
          <Pagination
            current={current}
            total={pathArr.length}
            pageSize={1}
            onChange={(current) => this.setState({ current: current })}
          />

          {/* {currentRow.fileType === 'pdf' && <View file={`data:application/pdf;base64,${base64}`} />}
          {currentRow.fileType === 'jpg' && <img alt="out-pic" src={`data:image/jpg;base64,${base64}`} />} */}
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
      current: 1,
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
    let pathArr = row.path.split('`#');
    console.log(pathArr);
    this.setState({ id: row.id, visible: true, pathArr: pathArr });
    return;
    // try {
    //   const result = await request.get(`/api/getOutReportFileBase64?path=${row.path}`);
    //   if (!result) {
    //     this.setState({ id: undefined, base64loading: false });
    //     return errorMessage({
    //       title: '温馨提示',
    //       content: '资源加载错误或资源不存在',
    //       maskClosable: true,
    //       centered: true,
    //       closable: true,
    //     });
    //   }
    //   return this.setState({ base64: result, visible: true, base64loading: false });
    // } catch (error) {
    //   errorMessage({
    //     title: '温馨提示',
    //     content: '资源加载错误或资源不存在',
    //     maskClosable: true,
    //     centered: true,
    //     closable: true,
    //   });
    //   this.setState({ id: undefined, base64loading: false });
    // }
  };

  add = () => { };
}

export default List
