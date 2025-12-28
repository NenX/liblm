import { api } from '../../.api';
import { Button, Modal, Tabs } from 'antd';
import { forEach, get, isEmpty } from 'lodash';
import { Component, useEffect, useState } from 'react';
import './index.less';
import { IMchc_Doctor_OutpatientHeaderInfo, IMchc_Pregnancy } from '@lm_fe/service';
import React from 'react';
import { LazyAntd } from '@lm_fe/components';
interface IProps {
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo
  closeModal(v: 'isShowResultImport', b?: string, c?: string): void
  importTitle: string
  isShowResultImport: boolean
}

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

export default function ResultImport(props: IProps) {
  const { headerInfo, closeModal } = props;
  const { isShowResultImport, importTitle } = props;

  const [activeTabKey, set_activeTabKey] = useState('1')
  const [examResult, set_examResult] = useState<any[]>([])
  const [defaultExpandedKey, set_defaultExpandedKey] = useState('')
  const [checkedItems, set_checkedItems] = useState<any[]>([])


  useEffect(() => {
    (
      async () => {
        const examResult = await api.components.getLabExamImportTree(get(headerInfo, 'id'));
        set_examResult(examResult)
        set_defaultExpandedKey(String(get(examResult, '0.id')))

      }
    )()

    return () => {

    }
  }, [])


  function handleCancel() {
    closeModal('isShowResultImport');
  };

  async function handleTabChange(key: string) {
    const { headerInfo } = props;
    let examResult: any = [];
    if (key === '1') {
      examResult = await api.components.getLabExamImportTree(get(headerInfo, 'id'));
    } else {
      examResult = await api.components.getImageExamImportTree(get(headerInfo, 'id'));
    }

    set_activeTabKey(key)
    set_examResult(examResult)
    set_defaultExpandedKey(String(get(examResult, '0.id')))

  };

  function handleOk() {

    let nodeStr = '';
    if (checkedItems.length > 0) {
      forEach(checkedItems, (item) => {
        nodeStr += item + '，';
      });
    }

    nodeStr = nodeStr.substr(0, nodeStr.length - 1);
    closeModal('isShowResultImport', nodeStr, 'inspection');
  };
  // checkedKeys, e:{checked: bool, checkedNodes, node, event, halfCheckedKeys}
  function handleCheck(keys: any, { checkedNodes }) {
    console.log({ checkedNodes });
    const checkedItems: any[] = [];
    forEach(checkedNodes, (item) => {
      checkedItems.push(item.title);
    });
    set_checkedItems(checkedItems)
  };

  function transferTemplateData(data: any, pid = 0) {
    const treeData: any = [];
    const unusualArr = ['↑', '↓'];
    forEach(data, (item) => {
      if (item.pid === pid) {
        item.key = String(item.id);
        item.className = item.unusual === '1' && 'unusual-item';
        item.title = unusualArr.includes(item.unusualDesc) ? `${item.title} ${item.unusualDesc}` : item.title;
        item.children = transferTemplateData(item.items, item.id);
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

  const treeData = transferTemplateData(examResult);

  return (
    <Modal
      className="result-import-modal"
      title={importTitle}
      visible={isShowResultImport}
      width={900}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Tabs defaultActiveKey={activeTabKey} onChange={handleTabChange}>
        <Tabs.TabPane tab={<Button className="list-btn">检验结果</Button>} key="1">
          {!isEmpty(examResult) && activeTabKey === '1' ? (
            <Tree
              checkable
              defaultExpandedKeys={[defaultExpandedKey]}
              onCheck={handleCheck}
              treeData={treeData}
            />
          ) : (
            '暂无数据~'
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab={<Button className="list-btn">超声结果</Button>} key="2">
          {!isEmpty(examResult) && activeTabKey === '2' ? (
            <Tree
              checkable
              defaultExpandedKeys={[defaultExpandedKey]}
              onCheck={handleCheck}
              treeData={treeData}
            />
          ) : (
            '暂无数据~'
          )}
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
}
