import React, { Component } from 'react';
import { Tooltip, Button, Modal, Input,  Row, Col } from 'antd';
import { map, isEmpty, forEach, concat, includes, isUndefined } from 'lodash';
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { request } from '@lm_fe/utils';
import styles from './index.less';

import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

const operationMapping = {
  new: '新增模板',
  add: '新增子模板',
  edit: '编辑模板',
  delete: '请注意!',
};
interface IndexProps {
  type: number; // 模板对应的type
  checkable: boolean; // 模板是否支持勾选
  editable?: boolean; // 模板是否支持编辑
  divide?: boolean; // 是否需要左右展示
  onChecked?: Function;
  onSelected?: Function;
  userid?: number;
  depid?: number;
  showIcd?: boolean;
}
interface IndexState {
  templateData: any;
  checkedKeys: string[];
  checkedKeysLeft: string[];
  checkedKeysRight: string[];

  currentArea: any;
  operation: any;
  nodeTreeItem: any;
  modalVisible: boolean;
  newTitle: any;
  addTitle: any;
}
export default class Index extends Component<IndexProps, IndexState> {
  constructor(props: any) {
    super(props);
    this.state = {
      templateData: null,
      checkedKeys: [],
      checkedKeysLeft: [],
      checkedKeysRight: [],

      currentArea: null,
      operation: null,
      nodeTreeItem: null,
      modalVisible: false,
      newTitle: null, // 新增主模板名称
      addTitle: null, // 新增子模板名称
    };
  }

  componentDidMount() {
    this.getTemplateData();
  }

  getTemplateData = async () => {
    const { type, depid, userid } = this.props;
    const paramsArr = { type, depid, userid };
    let paramsStr = '';
    forEach(paramsArr, (value, key) => {
      if (!isUndefined(value)) {
        paramsStr += `${key}.equals=${value}&`;
      }
    });

    let res = await request.get(`/api/template-trees?${paramsStr}page=0&size=500`);
    res = res || [];
    this.setState({ templateData: res });
    this.setState({
      nodeTreeItem: null,
      operation: null,
      newTitle: null,
      addTitle: null,
    });
  };

  handleTreeItem = (operate: string) => {
    this.setState({
      modalVisible: true,
      operation: operate,
    });
  };

  handleTreeSort = async (sort: string) => {
    console.log('移动');
  };

  handleIptChange = (e: any, operation: string) => {
    const { nodeTreeItem } = this.state;
    if (operation === 'new') this.setState({ newTitle: e.target.value });

    if (operation === 'add') this.setState({ addTitle: e.target.value });

    if (operation === 'edit') {
      const data = { title: e.target.value };
      this.setState({
        nodeTreeItem: { ...nodeTreeItem, ...data },
      });
    }
  };

  handleOk = async () => {
    const { type, depid, userid } = this.props;
    const { nodeTreeItem, addTitle, operation, newTitle } = this.state;
    if (operation === 'new') {
      const newItem = { pid: 0, val: newTitle, type, depid, userid };
      await request.post(`/api/template-trees`, newItem);
      this.getTemplateData();
    }

    if (operation === 'add') {
      const addItem = { pid: Number(nodeTreeItem.id), val: addTitle, type, depid, userid };
      await request.post(`/api/template-trees`, addItem);
      this.getTemplateData();
    }

    if (operation === 'edit') {
      const editItem = {
        pid: Number(nodeTreeItem.pid),
        val: nodeTreeItem.title,
        type,
        depid,
        userid,
        id: nodeTreeItem.id,
      };
      await request.put(`/api/template-trees`, editItem);
      this.getTemplateData();
    }

    if (operation === 'delete') {
      await request.delete(`/api/template-trees/${nodeTreeItem.id}`);
      this.getTemplateData();
    }

    this.setState({
      modalVisible: false,
      nodeTreeItem: null,
      operation: null,
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
      nodeTreeItem: null,
      operation: null,
    });
  };

  handleAddBtnClick = () => {
    this.setState({
      operation: 'new',
      modalVisible: true,
    });
  };

  onMouseEnter = ({ event, node }, area: string) => {
    var x = event.currentTarget.offsetLeft + event.currentTarget.clientWidth;
    var y = event.currentTarget.offsetTop;
    this.setState({
      nodeTreeItem: {
        pageX: x,
        pageY: y,
        pid: node.props.pid,
        id: Number(node.props.eventKey),
        title: node.props.title,
        sort: node.props.sort,
      },
      currentArea: area,
    });
  };

  handleCheck = (keys: any) => {
    const { onChecked } = this.props;
    const { templateData, checkedKeys } = this.state;

    this.setState({ checkedKeys: keys });
    forEach(templateData, (item) => {
      if (includes(checkedKeys, `${item.id}`)) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    });
    onChecked && onChecked(templateData);
  };

  handleCheckLeft = (keys: any) => {
    const { onChecked } = this.props;
    const { templateData, checkedKeysRight } = this.state;
    const allCheckedKays = concat(keys, checkedKeysRight);

    this.setState({ checkedKeysLeft: keys });
    forEach(templateData, (item) => {
      if (includes(allCheckedKays, `${item.id}`)) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    });
    onChecked && onChecked(templateData);
  };

  handleCheckRight = (keys: any) => {
    const { onChecked } = this.props;
    const { templateData, checkedKeysLeft } = this.state;
    const allCheckedKays = concat(keys, checkedKeysLeft);

    this.setState({ checkedKeysRight: keys });
    forEach(templateData, (item) => {
      if (includes(allCheckedKays, `${item.id}`)) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    });
    onChecked && onChecked(templateData);
  };

  transferTemplateData = (data: any, pid = 0) => {
    const { showIcd } = this.props;
    const treeData: any = [];
    map(data, (item: any) => {
      if (item.pid === pid) {
        item.title = showIcd && item.code ? `（icd）${item.val}` : item.val;
        item.key = String(item.id);
        item.children = this.transferTemplateData(data, item.id);
        if (isEmpty(item.children)) {
          item.isLeaf = true;
        } else {
          item.isLeaf = false;
        }
        treeData.push(item);
      }
    });
    return treeData;
  };

  handleSelect = (selectedKeys, { node }) => {
    const { onSelected } = this.props;
    onSelected && onSelected(node);
  };

  renderNodeTreeMenu() {
    const { editable } = this.props;
    const { nodeTreeItem } = this.state;
    const { pageX, pageY, pid } = { ...nodeTreeItem };
    const menuStyle = {
      position: 'absolute',
      maxHeight: 40,
      textAlign: 'center',
      left: `${pageX + 10}px`,
      top: `${pageY}px`,
      display: 'flex',
      flexDirection: 'row',
    };

    return nodeTreeItem && editable ? (
      <div style={menuStyle}>
        {pid === 0 ? (
          <div className={styles["handle-icon"]} onClick={() => this.handleTreeItem('add')}>
            <Tooltip placement="bottom" title="添加子模板">
              <PlusCircleOutlined />
            </Tooltip>
          </div>
        ) : null}
        <div className={styles["handle-icon"]} onClick={() => this.handleTreeItem('edit')}>
          <Tooltip placement="bottom" title="修改">
            <EditOutlined />
          </Tooltip>
        </div>
        <div className={styles["handle-icon"]} onClick={() => this.handleTreeItem('delete')}>
          <Tooltip placement="bottom" title="删除">
            <DeleteOutlined />
          </Tooltip>
        </div>
        <div className={styles["handle-icon"]} onClick={() => this.handleTreeSort('DOWN')}>
          <Tooltip placement="bottom" title="上移">
            <ArrowUpOutlined />
          </Tooltip>
        </div>
        <div className={styles["handle-icon"]} onClick={() => this.handleTreeSort('UP')}>
          <Tooltip placement="bottom" title="下移">
            <ArrowDownOutlined />
          </Tooltip>
        </div>
      </div>
    ) : null;
  }

  renderHandleModal() {
    const { modalVisible, nodeTreeItem, addTitle, operation, newTitle } = this.state;
    const title = operationMapping[operation];

    return (
      <Modal title={title} closable visible={modalVisible} onCancel={this.handleCancel} onOk={this.handleOk}>
        {operation === 'new' && (
          <div>
            新增模板名称：
            <Input value={newTitle} onChange={(e) => this.handleIptChange(e, 'new')} style={{ width: '50%' }} />
          </div>
        )}

        {operation === 'add' && (
          <div>
            新增子模板：
            <Input value={addTitle} onChange={(e) => this.handleIptChange(e, 'add')} style={{ width: '50%' }} />
          </div>
        )}

        {operation === 'edit' && (
          <div>
            编辑模板名称：
            <Input
              value={nodeTreeItem.title}
              onChange={(e) => this.handleIptChange(e, 'edit')}
              style={{ width: '50%' }}
            />
          </div>
        )}

        {operation === 'delete' && <div>是否删除模板：{nodeTreeItem.title}</div>}
      </Modal>
    );
  }

  renderTreatment() {
    const { checkable, divide, editable } = this.props;
    const { templateData, checkedKeys, checkedKeysLeft, checkedKeysRight, currentArea, nodeTreeItem } = this.state;
    const treeData = this.transferTemplateData(templateData);

    return (
      <div>
        {editable ? (
          <div className={styles["add-btn"]}>
            <Button size="small" onClick={this.handleAddBtnClick}>
              添加模板
            </Button>
          </div>
        ) : null}
        {divide ? (
          <Row>
            <Col span={12}>
              <Tree
                style={{ maxHeight: '90%' }}
                checkable={checkable}
                defaultExpandAll
                checkedKeys={checkedKeysLeft.length === 0 ? [] : checkedKeysLeft}
                onCheck={this.handleCheckLeft}
                onSelect={this.handleSelect}
                onMouseEnter={(e) => this.onMouseEnter(e, 'treeLeft')}
                treeData={treeData.slice(0, Math.ceil(treeData.length / 2))}
              />
              {nodeTreeItem && currentArea === 'treeLeft' ? this.renderNodeTreeMenu() : null}
            </Col>
            <Col span={12}>
              <Tree
                style={{ maxHeight: '90%' }}
                checkable={checkable}
                defaultExpandAll
                checkedKeys={checkedKeysRight.length === 0 ? [] : checkedKeysRight}
                onCheck={this.handleCheckRight}
                onSelect={this.handleSelect}
                onMouseEnter={(e) => this.onMouseEnter(e, 'treeright')}
                treeData={treeData.slice(Math.ceil(treeData.length / 2))}
              />
              {nodeTreeItem && currentArea === 'treeright' ? this.renderNodeTreeMenu() : null}
            </Col>
          </Row>
        ) : (
          <Row>
            <Col span={24}>
              <Tree
                style={{ maxHeight: '90%' }}
                checkable={checkable}
                defaultExpandAll
                checkedKeys={checkedKeys}
                onCheck={this.handleCheck}
                onSelect={this.handleSelect}
                onMouseEnter={(e) => this.onMouseEnter(e, '')}
                treeData={treeData}
              />
              {nodeTreeItem ? this.renderNodeTreeMenu() : null}
            </Col>
          </Row>
        )}
      </div>
    );
  }

  render() {
    const { templateData } = this.state;
    return (
      <div className={styles["template-tree-wrapper"]}>
        {templateData && this.renderTreatment()}
        {this.renderHandleModal()}
      </div>
    );
  }
}
