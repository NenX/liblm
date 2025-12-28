import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { connect } from 'react-redux';
import { cloneDeep, set, max, get, size, map, includes, split, join } from 'lodash';
import { setHighriskSign, getPregnancyData } from '@/actions/prenatal-visit';
import { api } from '../../.api';
import './index.less';
import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


class Index extends Component {
  state = {
    treeData: [],
    checkedKeys: [],
    checkedNodes: [],
  };

  componentDidMount() {
    const { highriskSignData } = this.props;
    const data = cloneDeep(highriskSignData);
    this.transferData(data);
  }

  transferData = (data: any) => {
    const treeData: any = [];
    const defaultCheckedKeys: any = [];
    const defaultCheckedNodes: any = [];
    map(data, (item) => {
      item.className = 'tree-title';
      item.key = `title-${item.remind}`;
      item.title = item.remind;
      map(item.content, (subItem) => {
        subItem.key = subItem.name;
        subItem.title = subItem.name;
        subItem.remind = item.remind;
        if (subItem.selected) {
          defaultCheckedKeys.push(subItem.name);
          defaultCheckedNodes.push(subItem);
        }
      });
      item.children = item.content;
      treeData.push(item);
    });
    this.setState({
      checkedKeys: defaultCheckedKeys,
      checkedNodes: defaultCheckedNodes,
      treeData: treeData,
    });
  };

  handelClose = () => {
    const { setHighriskSign } = this.props;
    setHighriskSign([]);
  };

  filterHighriskNote = (arr: string[], str: string) => {
    const newArr: string[] = [];
    map(arr, (item) => {
      if (item.indexOf(str) === -1) {
        newArr.push(item);
      }
    });
    return newArr;
  };

  handleSign = async () => {
    const { checkedNodes } = this.state;
    const { setHighriskSign, pregnancyData, getPregnancyData } = this.props;
    const { id, highriskGrade, highriskNote = '' } = pregnancyData;

    let level = 'Ⅰ';
    let risk = '';
    let noteArr = split(highriskNote, ',');
    map(checkedNodes, (item: any) => {
      if (item.highrisk && !includes(risk, `${item.remind}:`)) {
        level = item.level > level ? item.level : level;
        risk = !!risk ? `${risk},${item.highrisk}` : item.highrisk;
        if (item.exclusion && size(noteArr) > 0) {
          noteArr = this.filterHighriskNote(noteArr, `${item.remind}:`);
        }
      }
    });
    const noteStr = join(noteArr, ',');
    /*更新高危等级、高危因素*/
    const newHighriskGrade = !!highriskGrade ? max([highriskGrade, level]) : level;
    const newHighriskNote = !!noteStr ? `${noteStr},${risk}` : risk;
    const signData = {
      id: id,
      highriskGrade: newHighriskGrade,
      highriskNote: newHighriskNote,
    };
    await api.updatePregnancy(signData);
    await getPregnancyData(id);
    setHighriskSign([]);
    // this.handelNeverShow();
  };

  handelNeverShow = async () => {
    const { setHighriskSign, highriskSignData, pregnancyData } = this.props;
    const { id } = pregnancyData;
    const ignoreData: any = [];

    map(highriskSignData, (item) => {
      const obj = { caseName: item.remind, type: 'ALERT_HIGHRISK', pregnancyId: id };
      ignoreData.push(obj);
    });
    await api.components.saveCaseIgnore(ignoreData);
    setHighriskSign([]);
  };

  handleCheck = (checkedKeys, { checkedNodes }) => {
    this.setState({
      checkedKeys,
      checkedNodes,
    });
  };

  buttons = () => (
    <>
      <Button type="primary" onClick={this.handleSign}>
        确定标记
      </Button>
      <Button onClick={this.handelNeverShow}>关闭，不再提示</Button>
      <Button onClick={this.handelClose}>关闭</Button>
    </>
  );

  render() {
    const { checkedKeys, treeData } = this.state;

    return size(treeData) > 0 ? (
      <Modal
        width={680}
        className="highrisk-sign-modal"
        visible={true}
        maskClosable={false}
        onCancel={this.handelClose}
        footer={this.buttons()}
        title="请标记高危因素！"
      >
        <Tree
          treeData={treeData}
          defaultExpandAll={true}
          checkable={true}
          onCheck={this.handleCheck}
          checkedKeys={checkedKeys}
        />
      </Modal>
    ) : null;
  }
}
const mapDisPathchToProps = { setHighriskSign, getPregnancyData };
export default connect(null, mapDisPathchToProps)(Index);
