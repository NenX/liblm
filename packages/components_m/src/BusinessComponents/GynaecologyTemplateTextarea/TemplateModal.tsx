import React from 'react';
import { Modal, Button,  message, Popconfirm, Row, Col, Layout } from 'antd';
import { map, get, set, isEmpty, keyBy, indexOf, keys, compact, isNil, concat, size, filter } from 'lodash';
import { transferTemplates } from './methods';
import EditModal from './EditModal';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  createResources,
  deleteResourcesByID,
  getResources,
  getResourcesByID,
  updateResources,
} from '../../utils/defaultMethod';
import styles from './index.module.less';
import { DEFAULT_URL, MODAL_NAVS, NurseTypesMapping, needUserIDTypes } from './utils';

import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

const { Sider, Content } = Layout;
interface IProps {
  patientId: any;
  depid?: any;
  user?: any;
}
interface IState {
  selectedRowKeys: Array<number | string>;
  editModalVisible: boolean;
  result: any;
  templateType: number;
  activeTemplate: object;
  splitTemplatesMapping: object;
}
export class TemplateModal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      result: [],
      labexams: [],
      allLabexams: [],
      selectedRowKeys: [],
      selectedRows: [],
      editModalVisible: false,
      templateType: 1,
      activeTemplate: {},
      splitTemplatesMapping: {},
      diagnosisList: [],
      surgicalTemplate: [],
      surgicalSelected: [],
    };
  }

  async componentDidMount() {
    let surgicalTemplate: any = [];
    await this.getTemplateList();

    //手术模板
    map(NurseTypesMapping, (item, index) => {
      surgicalTemplate.push({
        title: item.name,
        key: item.name,
      });
    });
    this.setState({ surgicalTemplate });
  }

  transferLabexamsList = (result) => {
    return map(result, (item) => {
      const temp = { ...item, children: [], val: get(item, 'title'), isLeaf: true };
      if (!isEmpty(get(item, 'items'))) {
        set(temp, 'children', this.transferLabexamsList(get(item, 'items')));
        set(temp, 'isLeaf', false);
      }
      return temp;
    });
  };

  transferAllLabexamsList = (labexams) => {
    let allLabexams: any = [];
    map(labexams, (labexam) => {
      let tempLabexams = [];
      if (!isEmpty(get(labexam, 'children'))) {
        tempLabexams = this.transferAllLabexamsList(get(labexam, 'children'));
        allLabexams = concat(allLabexams, tempLabexams);
      } else {
        allLabexams.push(labexam);
      }
    });
    return allLabexams;
  };

  getTemplateList = async () => {
    const { templateType } = this.state;
    const { user, depid = 1, patientId, admissionId, pregnancyId } = this.props;
    if (templateType === 3) {
      // const result = await getResources(`/api/getLabExamImportTreeByPrenatal?prenatalPatientId=${patientId}`);
      const result = await getResources(
        `/api/getLabExamImportTree?pregnancyId=${pregnancyId}&admissionId=${admissionId}`,
      );
      const labexams = this.transferLabexamsList(result);
      const allLabexams = this.transferAllLabexamsList(labexams);
      this.setState({
        labexams,
        allLabexams,
      });
    } else if (templateType === 4) {
      // const result = await getResources(`/api/getImageExamImportTreeByPrenatal?prenatalPatientId=${patientId}`);
      const result = await getResources(
        `/api/getImageExamImportTree?pregnancyId=${pregnancyId}&admissionId=${admissionId}`,
      );
      const labexams = this.transferLabexamsList(result);
      const allLabexams = this.transferAllLabexamsList(labexams);
      this.setState({
        labexams,
        allLabexams,
      });
    } else if (templateType === 5) {
      // const result = await getResources(`/api/findDiagnosisByDateVisitType/${patientId}`);
      const result = await getResources(`/api/findDiagnosisByDateVisitType/${admissionId}`);
      this.setState({ diagnosisList: result });
    } else {
      const result = await getResources(DEFAULT_URL, {
        'depid.equals': depid,
        'type.equals': templateType,
        'userid.equals':
          needUserIDTypes.indexOf(templateType) > -1 && get(user, 'basicInfo.id') ? get(user, 'basicInfo.id') : null,
        size: 99999,
        page: 0,
      });
      const templates = transferTemplates(result);
      // 拆分为多个树
      const splitTemplates = compact(
        map(templates, (template) => {
          if (get(template, 'pid') === 0) {
            return {
              ...template,
              children: [],
            };
          }
        }),
      );
      const splitTemplatesMapping = keyBy(splitTemplates, 'id');
      map(result, (template) => {
        const templatePid = get(template, 'pid');
        if (indexOf(keys(splitTemplatesMapping), String(templatePid)) > -1) {
          splitTemplatesMapping[templatePid]['children'].push(template);
        }
      });
      this.setState({
        splitTemplatesMapping,
        result,
      });
    }
  };

  handleAddTemplate = (e) => {
    e.stopPropagation();
    this.setState({
      editModalVisible: true,
      activeTemplate: {},
    });
  };

  handleHideEditModal = () => {
    this.setState({
      editModalVisible: false,
      activeTemplate: {},
    });
  };

  closeModal = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
    this.setState({ splitTemplatesMapping: {} });
  };

  handleSubmitEditModal = async (data) => {
    const { templateType, activeTemplate } = this.state;
    const { user, depid = 1 } = this.props;
    if (templateType === 2) {
      set(data, 'userid', get(user, 'basicInfo.id'));
    }
    if (!isEmpty(activeTemplate)) {
      await updateResources(DEFAULT_URL, {
        ...activeTemplate,
        ...data,
        depid,
      });
    } else {
      await createResources(DEFAULT_URL, { ...data, depid });
    }
    this.setState({
      editModalVisible: false,
      activeTemplate: {},
    });
    message.success('提交模板成功');
    this.getTemplateList();
  };

  handleEditTemplate = (template) => async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const activeTemplate = await getResourcesByID(DEFAULT_URL, get(template, 'id'));
    this.setState({
      editModalVisible: true,
      activeTemplate,
    });
  };

  handleConfirmDelete = (template) => async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    await deleteResourcesByID(DEFAULT_URL, get(template, 'id'));
    message.success('删除模板成功');
    this.getTemplateList();
  };

  handleSelectTemplates = (checked, e) => {
    const { selectedRowKeys } = this.state;
    this.setState({
      selectedRowKeys: Array.from(new Set([...selectedRowKeys, ...checked])),
      selectedRows: e.checkedNodes,
    });
  };

  getproposalTemp = (data: any, info: any) => {
    this.setState({ surgicalSelected: data });
  };

  handleOk = () => {
    const { onOk } = this.props;
    const { selectedRowKeys, result, templateType, allLabexams, selectedRows, surgicalSelected } = this.state;
    let content = '';
    let addList = [];
    let treeData = result;
    if (templateType === 3 || templateType === 4) {
      treeData = allLabexams;
    }
    const treeDataMapping = keyBy(treeData, 'id');
    map(selectedRowKeys, (selectedKey) => {
      const item = get(treeDataMapping, selectedKey);
      if (!isEmpty(item) && get(item, 'isLeaf')) {
        content += `${get(treeDataMapping, `${selectedKey}.val`)}；`;
      }
    });

    if (templateType === 5) {
      addList = filter(selectedRows, (item) => !item.type);
      if (size(addList) > 0) {
        map(addList, (item) => {
          delete item.id;
        });
      }
      onOk && onOk(addList);
      return;
    }

    for (let i = 0; i < surgicalSelected.length; i++) {
      content += `${surgicalSelected[i]}；`;
    }

    onOk && onOk(content);
  };

  handleChangeTemplateType = (nav) => async () => {
    this.setState(
      {
        templateType: nav.type,
      },
      () => {
        this.getTemplateList();
      },
    );
  };

  transferTemplateData = (data: any) => {
    const treeData: any = [];
    map(data, (item: any, index) => {
      if (item.date) {
        item.title = `${item.date} ${item.type}`;
        item.key = index;
        let diags = [];
        if (size(item.pds) > 0) {
          diags = item.pds;
        } else {
          diags = item.ods;
        }
        item.children = this.transferTemplateData(diags);
      } else {
        item.title = item.diagnosis;
        item.key = String(item.id);
      }
      if (isEmpty(item.children)) {
        item.isLeaf = true;
      } else {
        item.isLeaf = false;
      }
      treeData.push(item);
    });
    return treeData;
  };

  renderDiagnosisHistory = () => {
    const { diagnosisList } = this.state;
    const treeData = this.transferTemplateData(diagnosisList);
    return (
      size(treeData) > 0 && <Tree checkable defaultExpandAll onCheck={this.handleSelectTemplates} treeData={treeData} />
    );
  };

  renderLabexams = () => {
    const { labexams } = this.state;
    return (
      <Tree checkable defaultExpandAll onCheck={this.handleSelectTemplates}>
        {this.renderTreeNode(labexams)}
      </Tree>
    );
  };

  renderTreeNode = (templatesTree) => {
    const { templateType } = this.state;
    return map(templatesTree, (template) => {
      if (!isEmpty(get(template, 'children')) && !isNil(get(template, 'children'))) {
        return (
          <Tree.TreeNode
            title={
              <div className={styles["template-list-item"]}>
                <div>&nbsp;{get(template, 'val')}&nbsp;</div>
                {(templateType === 1 || templateType === 2) && (
                  <div className={styles["template-list-item__actions"]}>
                    <PlusCircleOutlined className={styles["template-list-item__actions-icon"]} onClick={this.handleAddTemplate} />
                    <EditOutlined
                      className={styles["template-list-item__actions-icon"]}
                      onClick={this.handleEditTemplate(template)}
                    />
                    <Popconfirm title="确定要删除这个模板吗？" onConfirm={this.handleConfirmDelete(template)}>
                      <DeleteOutlined className={styles["template-list-item__actions-icon"]} />
                    </Popconfirm>
                  </div>
                )}
              </div>
            }
            key={get(template, 'id')}
          >
            {this.renderTreeNode(get(template, 'children'))}
          </Tree.TreeNode>
        );
      }
      return (
        <Tree.TreeNode
          title={
            <div className={styles["template-list-item"]}>
              <div>{get(template, 'val')}</div>
              {(templateType === 1 || templateType === 2) && (
                <div className={styles["template-list-item__actions"]}>
                  <PlusCircleOutlined className={styles["template-list-item__actions-icon"]} onClick={this.handleAddTemplate} />
                  <EditOutlined
                    className={styles["template-list-item__actions-icon"]}
                    onClick={this.handleEditTemplate(template)}
                  />
                  <Popconfirm title="确定要删除这个模板吗？" onConfirm={this.handleConfirmDelete(template)}>
                    <DeleteOutlined className={styles["template-list-item__actions-icon"]} />
                  </Popconfirm>
                </div>
              )}
            </div>
          }
          key={get(template, 'id')}
        />
      );
    });
  };

  renderModal = () => {
    const { depid } = this.props;
    const { editModalVisible, templateType, activeTemplate, splitTemplatesMapping, surgicalTemplate } = this.state;
    return (
      <Layout>
        <Content style={{ background: '#fff', paddingLeft: '10px', overflow: 'auto', maxHeight: '520px' }}>
          <div className={styles["textarea-with-template__modal-nav"]}>
            <div>
              {map(MODAL_NAVS, (nav, key) => {
                return (
                  <Button
                    className={styles["textarea-with-template__modal-nav__items"]}
                    type={templateType === nav.type ? 'primary' : 'default'}
                    key={key}
                    onClick={this.handleChangeTemplateType(nav)}
                  >
                    {nav.label}
                  </Button>
                );
              })}
            </div>
            {(templateType === 1 || templateType === 2) && (
              <Button onClick={this.handleAddTemplate} style={{ marginRight: 10 }}>
                添加模板
              </Button>
            )}
          </div>
          <Row className={styles["textarea-with-template__modal-body"]}>
            {(templateType === 1 || templateType === 2) && (
              <>
                {map(splitTemplatesMapping, (templateTree) => {
                  return (
                    <Col span={12}>
                      <Tree checkable defaultExpandAll onCheck={this.handleSelectTemplates}>
                        {this.renderTreeNode([templateTree])}
                      </Tree>
                    </Col>
                  );
                })}
              </>
            )}
            {(templateType === 3 || templateType === 4) && this.renderLabexams()}
            {templateType === 5 && this.renderDiagnosisHistory()}
          </Row>
          {editModalVisible && (
            <EditModal
              templateType={templateType}
              userid={get(this.props, 'user.basicInfo.id')}
              visible={editModalVisible}
              data={activeTemplate}
              depid={depid}
              onCancel={this.handleHideEditModal}
              onSubmit={this.handleSubmitEditModal}
            />
          )}
        </Content>
        {/* <Sider
          width={400}
          style={{ borderLeft: '1px solid #ccc', paddingRight: '10px', overflow: 'auto', maxHeight: '520px' }}
        >
          <div className={styles["title"]} style={{ fontSize: 18, fontWeight: 600, color: '#0e318d', marginLeft: 10 }}>
            手术模板
          </div>
          <div style={{ margin: '10px 0' }}>
            <Tree checkable onCheck={this.getproposalTemp} treeData={surgicalTemplate} />
          </div>
        </Sider> */}
      </Layout>
    );
  };

  render() {
    return (
      <Modal
        {...this.props}
        className={styles["textarea-with-template__modal"]}
        title="模板导入"
        width={1100}
        onCancel={this.closeModal}
        onOk={this.handleOk}
      >
        {this.renderModal()}
      </Modal>
    );
  }
}
export default TemplateModal
