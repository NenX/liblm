import React, { useState, useEffect } from 'react';
import { Modal, Spin } from 'antd';
import { uniq } from 'lodash';
import { transferTemplates, DATA } from './utils';
import styles from './index.less';
import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

export default function ReaultModal({ visible, title, defaultValue, onOk, onCancel }: any) {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedNodes, setCheckedNodes] = useState([]);

  useEffect(() => {
    setTreeData(transferTemplates(DATA));
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);



  const onCheck = (checkedKeys: number[], { checkedNodes }) => {
    setCheckedNodes(checkedNodes);
  };

  const handleOk = () => {
    const leafCheckedNodes = checkedNodes.filter((_) => _.isLeaf);
    let leafCheckedNodesValuesArr = [];
    for (let i = 0; i < leafCheckedNodes.length; i++) {
      const element = leafCheckedNodes[i];
      leafCheckedNodesValuesArr.push(element.title);
    }
    const defaultValueArr = defaultValue ? defaultValue.split('；') : [];
    // leafCheckedNodesValuesArr、defaultValueArr去重
    const value = uniq([...defaultValueArr, ...leafCheckedNodesValuesArr]);
    onOk(value.join('；'));
  };

  return (
    <Modal
      centered
      destroyOnClose
      visible={visible}
      title={title}
      width={750}
      onOk={handleOk}
      onCancel={onCancel}
      className={styles["result-textarea-modal"]}
    >
      {loading ? (
        <Spin tip="数据加载中...">
          <div style={{ height: 128 }} />
        </Spin>
      ) : (
        <Tree checkable defaultExpandAll treeData={treeData} onCheck={onCheck} className={styles["result-textarea-modal-tree"]} />
      )}
    </Modal>
  );
}
