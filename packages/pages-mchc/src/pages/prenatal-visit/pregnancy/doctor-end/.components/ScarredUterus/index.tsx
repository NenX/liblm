import { changeTolac } from '@/actions/prenatal-visit';
import { api } from '@/pages/prenatal-visit/pregnancy/doctor-end/api';
import { Button, Modal, Space } from 'antd';
import { filter, forEach, get, includes, isEmpty, size } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactToPrint from 'react-to-print';
import './index.less';
import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


class Index extends Component {
  state = {
    treeToalc: null,
    toalcKeys: [],
  };
  printTableRef: any = React.createRef();

  async componentDidMount() {
    const { pregnancyData } = this.props;
    const pregnancyId = get(pregnancyData, 'id');
    const treeToalc = await api.components.getTemplateTree(33);
    const selecteToalc = await api.components.findAlertAssessment(33, pregnancyId);

    const toalcValue = get(selecteToalc, 'value') || [];
    const toalcKeys: any[] = [];
    forEach(toalcValue, (item) => toalcKeys.push(String(item.id)));
    this.setState({ treeToalc, toalcKeys });
  }

  handleCheck = (keys: any) => {
    const { treeToalc } = this.state;
    forEach(treeToalc, (item: any) => {
      if (keys.includes(String(item.id))) {
        item.selected = true;
      } else {
        item.selected = null;
      }
    });
    this.setState({ toalcKeys: keys, treeToalc });
  };

  handleCancel = () => {
    const { changeTolac } = this.props;
    changeTolac(false);
  };

  handleOk = async () => {
    const { treeToalc, toalcKeys } = this.state;
    const { changeTolac, onClose, pregnancyData, handleSubmit } = this.props;
    const pregnancyId = get(pregnancyData, 'id');

    const filterData = filter(treeToalc, (item: any) => includes(toalcKeys, String(item.id)));
    const data = { pregnancyId, type: 33, value: filterData, templateId: null };
    // console.log('filterData',filterData);
    let dat = { pregnancyId, type: 33, templateId: null };
    if (filterData.length == 0) {
      await api.components.deleteHighrisk(dat);
      // await api.components.saveAlertAssessment(dat);
      // await api.components.saveAlertAssessment(data);

      handleSubmit && handleSubmit();
    } else {
      await api.components.saveAlertAssessment(data);
      handleSubmit && handleSubmit();
    }

    if (size(toalcKeys) > 0) onClose('tolacColorsVisible', true);
    changeTolac(false);
  };

  transferTemplateData = (data: any, pid = 0) => {
    const treeData: any = [];
    forEach(data, (item: any) => {
      if (item.pid === pid) {
        if (item.pid === 0) item.className = 'tree-title';
        item.title = item.val;
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
  renderFooter() {
    return (
      <Space style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button key="back" onClick={this.handleCancel}>
          取消
        </Button>
        <Button key="submit" type="primary" onClick={this.handleOk}>
          确定
        </Button>
        <ReactToPrint
          trigger={() => (
            <div>
              <Button type="primary">打印</Button>
            </div>
          )}
          /*为了获取更新数据后的页面*/
          onBeforeGetContent={async () => {
            setTimeout(() => {}, 100);
          }}
          content={() => this.printTableRef}
        />
      </Space>
    );
  }

  render() {
    const { toalcKeys, treeToalc } = this.state;
    const { isShowTolac } = this.props;
    const treeData = this.transferTemplateData(treeToalc);
    return (
      <Modal
        className="tolac-modal"
        title="瘢痕子宫阴道试产表"
        visible={isShowTolac && treeData.length > 0}
        width={800}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        maskClosable={false}
        footer={this.renderFooter()}
      >
        {treeToalc && (
          <Tree checkable defaultExpandAll checkedKeys={toalcKeys} onCheck={this.handleCheck} treeData={treeData} />
        )}
        <div style={{ display: 'none' }}>
          <div style={{ marginTop: '28px' }} ref={(refs) => (this.printTableRef = refs)} className="printtoalc">
            <h2 style={{ textAlign: 'center' }}>瘢痕子宫阴道试产表</h2>
            <Tree checkable defaultExpandAll checkedKeys={toalcKeys} treeData={treeData} onCheck={this.handleCheck} />
          </div>
        </div>
      </Modal>
    );
  }
}
const mapDisPathchToProps = { changeTolac };
export default connect(null, mapDisPathchToProps)(Index);
