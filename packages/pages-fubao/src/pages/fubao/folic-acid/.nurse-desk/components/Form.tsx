
import {
  CloseOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { BaseEditPanelForm, fromApi, LazyAntd, resolveFubaoPath } from '@lm_fe/components_m';
import { mchcUtils } from '@lm_fe/env';
import { SLocal_History } from '@lm_fe/service';
import { request } from '@lm_fe/utils';
import { Button, message, Modal, Space } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { cloneDeep, get, isEmpty, omit, size } from 'lodash';
import React from 'react';
import { tableColumn } from './tableColumn';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

class AdmissionForm extends BaseEditPanelForm {
  state = {
    printModalVisible: false,
    importModalVisible: false,
    renderModal: false,
    importData: [],
    selectRow: {},
    IDCardLoading: false,
  };

  async componentWillMount() {
    //读取身份证
    const { config={} } = this.props;
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
          this.setState({
            IDCardLoading: false,
          });
          return message.info(`${e.data}，请重新读卡`);
        }
        if (e && e.data && e.data.includes('{')) {
          d = JSON.parse(e.data);
          this.setState({
            IDCardLoading: false,
          });
        }
        if (d.name) {
          const values = { name: d.name, idType: 1, idNO: d.idno, age: mchcUtils.checkAge(d.idno) };
          return this.form?.setFieldsValue(values);
        }
      });
    return this.setState({
      IDCardLoading: false,
    });
  }

  getRegistrationEvents = () => ({
    onBlur: get(this.getEvents(), 'handleInputBlur'),
  });

  // 地址组件 触发按钮
  getEvents = () => ({
    //查询门诊号是否存在
    handleInputBlur: async (e: any) => {
      const { data } = this.props;
      const id = get(data, 'id');
      const name = this.form?.getFieldValue('name');

      if (!id && e.target.id == 'name' && name) {
        const param: object = {
          page: 0,
          size: 20,
          sort: 'id,desc', // 基本列表都需要倒序
          'deleteFlag.equals': 0,
          'name.contains': name,
        };
        const data = (
          await request.get('/api/getFolateManagementFile/page', {
            params: param,
          })
        ).data
        if (get(data, 'data.pageData').length > 0) {
          this.setState({ importData: get(data, 'data.pageData'), renderModal: true });
        }
      }
    },
  });

  onOk = () => {
    const { selectRow } = this.state;
    const { formDescriptionsWithoutSection } = this.props;
    const dd = fromApi(cloneDeep(selectRow), formDescriptionsWithoutSection);
    if (isEmpty(selectRow)) {
      message.warning('请选择一份档案信息');
      return;
    }
    const omitDd = omit(dd, ['filingDate']);
    this.form?.setFieldsValue(omitDd);
    this.setState({ renderModal: false });
  };

  renderModal = () => {
    const { renderModal, importData } = this.state;
    return (
      <Modal
        title="导入信息"
        width={520}
        visible={renderModal}
        onOk={this.onOk}
        onCancel={() => {
          this.setState({ renderModal: false });
        }}
      >
        <Table
          rowSelection={{
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({ selectRow: selectedRows[0] });
            },
          }}
          bordered
          rowKey="id"
          columns={tableColumn}
          dataSource={importData}
          pagination={false}
        />
      </Modal>
    );
  };

  // Form onValuesChange
  handleItemChange = async (changedValues: any, allValues: any) => {
    const form = this.form as unknown as FormInstance;

    if (
      get(allValues, 'idType') === 1 &&
      size(get(allValues, 'idNO')) === 18 &&
      (get(changedValues, 'idType') || get(changedValues, 'idNO'))
    ) {
      const idNO = get(allValues, 'idNO');
      const personal = mchcUtils.checkIdNo(idNO)
      if (personal.status) {
        form &&
          form.setFieldsValue({
            dob: personal.birth,
            nationality: personal.nationality,
            nativeplace: personal.province,
            age: personal.age,
          });
      } else {
        message.warning(`${get(personal, 'message')}`);
      }
    }
  };

  handleCancel = async () => {
    const { history, data, deleteTab, routerPath, tabs, keepAliveProviderRef, updateTabs } = this.props as any;
    const form = this.form as unknown as FormInstance;
    if (!get(data, 'id')) form.resetFields();

    //删除keepAliveProvider缓存
    // await updateTabs(get(tabs, `tabsMapping./folic-acid/file-management/list`));
    // routerPath && (await deleteTab(routerPath));
    // history && history.push('/folic-acid/file-management/list');
    // const { path, search } = get(tabs, `tabsMapping.${routerPath}`);
    // keepAliveProviderRef?.current.removeCache(`${path}.name.${search}`);

    SLocal_History.closeAndPush(resolveFubaoPath(`/folic-acid/file-management/list`))

  };
  renderCancelBtn = () => {
    return (
      <Button size="large" icon={<CloseOutlined />} onClick={this.handleCancel}>
        关闭
      </Button>
    );
  };
  renderCheckBtn = () => {
    return (
      <Button
        size="large"
        type="primary"
        icon={<SaveOutlined />}
        htmlType="submit"
        onClick={this.handleFinish}
        disabled={false}
      >
        保存并关闭
      </Button>
    );
  };
  renderBtns = () => {
    const { history } = this.props as any;
    return (
      <Space>
        {history && this.renderCancelBtn()}
        {this.renderCheckBtn()}
      </Space>
    );
  };

  readIDCard = () => {
    const websocketServices = window.websocketServices;
    const command = {
      name: 'ReadCard',
      data: {},
    };
    websocketServices.send(JSON.stringify(command));
    this.setState({
      IDCardLoading: true,
    });
  };

  // renderFreeButton = () => {
  //   const { history, socketState = null } = this.props;
  //   const { IDCardLoading } = this.state;
  //   return (
  //     <div className="base-edit-panel-form_freebtns" style={{ width: '33.3%', marginLeft: 'calc(2 * 100% / 3)' }}>
  //       <Row>
  //         <Col offset={3}>
  //           <Button.Group>
  //             <Button.Group>
  //               <Button
  //                 type="primary"
  //                 icon={IDCardLoading ? <LoadingOutlined /> : <IdcardOutlined />}
  //                 disabled={
  //                   socketState !== WEBSOCKET_STATUS['OPEN'] || !!get(history, 'location.search') || IDCardLoading
  //                 }
  //                 onClick={this.readIDCard}
  //               >
  //                 读取身份证
  //               </Button>
  //             </Button.Group>
  //           </Button.Group>
  //         </Col>
  //       </Row>
  //     </div>
  //   );
  // };
}

export default AdmissionForm
