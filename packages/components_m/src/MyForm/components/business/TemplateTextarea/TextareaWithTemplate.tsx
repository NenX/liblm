import React, { Component } from 'react';
import { Modal, Input, Button,  message, Popconfirm } from 'antd';
import { map, get, set, isEmpty, cloneDeep, keyBy } from 'lodash';
import {
  getTemplates,
  transferTemplates,
  addTemplate,
  deleteTemplate,
  getTemplateDetail,
  rootTemplate,
  updateTemplate,
} from './methods';
import EditModal from './EditModal';
import { MODAL_NAVS } from './common'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './TextareaWithTemplate.module.less';
import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd
interface ITextareaWithTemplateProp {
  onChange: Function;
  value: any;
  input_props: any;
  disabled?: boolean
}
interface ITextareaWithTemplateState {
  list: Array<any>;
  templatesTree: Array<any>;
  modalVisible: boolean;
  selectedRowKeys: Array<number | string>;
  editModalVisible: boolean;
  value: any;
  templateType: number;
  activeTemplate: object;
}
export class TextareaWithTemplate extends Component<ITextareaWithTemplateProp, ITextareaWithTemplateState> {
  constructor(props: ITextareaWithTemplateProp) {
    super(props);
    this.state = {
      list: [],
      modalVisible: false,
      selectedRowKeys: [],
      templatesTree: [],
      editModalVisible: false,
      templateType: 1,
      value: props.value,
      activeTemplate: {},
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState) {
      return {
        value: nextProps.value,
      };
    }
    return null;
  }

  openModal = async () => {
    await this.getTemplateList();
    this.setState({ modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false, list: [] });
  };

  getTemplateList = async () => {
    const { templateType } = this.state;
    const { user } = this.props;
    const list = await getTemplates({ templateType, userid: get(user, 'basicInfo.id') });
    const templatesTree = [
      {
        ...rootTemplate,
        children: transferTemplates(cloneDeep(list)),
      },
    ];
    this.setState({
      templatesTree,
      list,
    });
  };

  handleTextareaChange = (e: any): void => {
    const { onChange } = this.props;
    this.setState({
      value: e.target.value,
    });
    onChange && onChange(e.target.value);
  };

  handleAddTemplate = () => {
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

  handleSubmitEditModal = async (data) => {
    const { templateType, activeTemplate } = this.state;
    const { user } = this.props;
    if (templateType === 2) {
      set(data, 'userid', get(user, 'basicInfo.id'));
    }
    if (!isEmpty(activeTemplate)) {
      await updateTemplate({
        ...activeTemplate,
        ...data,
      });
    } else {
      await addTemplate(data);
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
    const activeTemplate = await getTemplateDetail(template.id);
    this.setState({
      editModalVisible: true,
      activeTemplate,
    });
  };

  handleConfirmDelete = (template) => async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    await deleteTemplate(template.id);
    message.success('删除模板成功');
    this.getTemplateList();
  };

  handleSelectTemplates = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  };

  handleImport = () => {
    const { onChange } = this.props;
    const { selectedRowKeys, list } = this.state;
    let content = '';
    const listMapping = keyBy(list, 'id');
    map(selectedRowKeys, (selectedKey) => {
      if (!isEmpty(get(listMapping, selectedKey))) {
        content += `${get(listMapping, `${selectedKey}.val`)}；`;
      }
    });
    this.setState({
      value: content,
      modalVisible: false,
    });
    onChange && onChange(content);
  };

  handleChangeTemplateType = (nav) => () => {
    this.setState(
      {
        templateType: nav.type,
      },
      () => {
        this.getTemplateList();
      },
    );
  };

  renderTreeNode = (templatesTree) => {
    return map(templatesTree, (template) => {
      if (!isEmpty(template.children)) {
        return (
          <Tree.TreeNode
            title={
              <div className={styles["template-list-item"]}>
                <div>{template.title}</div>
                <EditOutlined className={styles["template-list-item-icon"]} onClick={this.handleEditTemplate(template)} />
                <Popconfirm title="确定要删除这个模板吗？" onConfirm={this.handleConfirmDelete(template)}>
                  <DeleteOutlined className={styles["template-list-item-icon template-list-item-icon__delete"]} />
                </Popconfirm>
              </div>
            }
            key={template.key}
          >
            {this.renderTreeNode(template.children)}
          </Tree.TreeNode>
        );
      }
      return (
        <Tree.TreeNode
          title={
            <div className={styles["template-list-item"]}>
              <div>{template.title}</div>
              <EditOutlined className={styles["template-list-item-icon"]} onClick={this.handleEditTemplate(template)} />
              <Popconfirm title="确定要删除这个模板吗？" onConfirm={this.handleConfirmDelete(template)}>
                <DeleteOutlined className={styles["template-list-item-icon template-list-item-icon__delete"]} />
              </Popconfirm>
            </div>
          }
          key={template.key}
        />
      );
    });
  };

  renderModal = () => {
    const { editModalVisible, templateType, templatesTree, activeTemplate } = this.state;
    return (
      <div>
        <div className={styles["textarea-with-template__modal-nav"]}>
          <div>
            {map(MODAL_NAVS, (nav, key) => {
              return (
                <Button
                  className={styles["textarea-with-template__modal-nav__items"]}
                  type={templateType === nav.type ? 'primary' : 'default'}
                  size="small"
                  key={key}
                  onClick={this.handleChangeTemplateType(nav)}
                >
                  {nav.label}
                </Button>
              );
            })}
          </div>
          <Button size="small" type="primary" onClick={this.handleAddTemplate}>
            添加模板
          </Button>
        </div>
        <div className={styles["textarea-with-template__modal-body"]}>
          <Tree checkable defaultExpandAll onCheck={this.handleSelectTemplates}>
            {this.renderTreeNode(templatesTree)}
          </Tree>
        </div>
        {editModalVisible && (
          <EditModal
            templateType={templateType}
            userid={get(this.props, 'user.basicInfo.id')}
            visible={editModalVisible}
            data={activeTemplate}
            onCancel={this.handleHideEditModal}
            onSubmit={this.handleSubmitEditModal}
          />
        )}
      </div>
    );
  };

  render() {
    const { modalVisible, value } = this.state;
    const { disabled } = this.props
    return (
      <div className={styles["textarea-with-template"]}>
        <Input.TextArea disabled={disabled} value={value} onChange={this.handleTextareaChange} />
        <Button disabled={disabled} onClick={this.openModal}>模板</Button>
        {modalVisible && (
          <Modal
            className={styles["textarea-with-template__modal"]}
            visible={modalVisible}
            title="处理模板"
            width={800}
            onCancel={this.closeModal}
            onOk={this.handleImport}
          >
            {this.renderModal()}
          </Modal>
        )}
      </div>
    );
  }
}
export default TextareaWithTemplate
