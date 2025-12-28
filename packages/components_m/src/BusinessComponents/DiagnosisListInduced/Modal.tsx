import React, { useState, useEffect } from 'react';
import { Modal, Input, Radio, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash';
import { request } from '@lm_fe/utils';
import styles from './index.less';

import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

export function arrayToTree(array, id = 'id', parentId = 'pid', children = 'children') {
  let result = [];
  const hash = {};
  const data = cloneDeep(array);

  data.forEach((item, index) => {
    hash[data[index][id]] = data[index];
    hash[data[index][id]]['key'] = data[index]['id'];
  });

  data.forEach((_) => {
    const item = _;
    item['key'] = _.id;
    item['isLeaf'] = true;

    const hashParent = hash[item[parentId]];
    if (hashParent) {
      !hashParent[children] && (hashParent[children] = []);
      hashParent[children].push(item);
      hashParent['isLeaf'] = false;
    } else {
      result.push(item);
    }
  });
  return result;
}
function TemplateModal({ user, visible, onCancel, onSelect }: any) {
  const [type, setType] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    getTemplate({ 'type.equals': 1 });
  }, []);

  const getTemplate = async (params: object) => {
    const d = await request.get('/api/template-trees', {
      params: {
        ...params,
        size: 999,
      },
    });
    setDataSource(arrayToTree(d));
  };

  const onSearch = (val: string) => {
    onSelect(val);
    onCancel();
  };

  const onChange = (e) => {
    const val = e.target.value;
    setType(val);
    if (val === 1) {
      // 全部模板
      getTemplate({ 'type.equals': val });
    }
    if (val === 2) {
      // 科室模板
      getTemplate({ 'type.equals': val, 'depid.equals': 2 });
    }
    if (val === 3) {
      // 个人模板
      getTemplate({ 'type.equals': val, 'userid.equals': user && user.id });
    }
  };

  const handleSelect = (keys: React.Key[], info: any) => {
    const { val, isLeaf } = info.node;
    if (isLeaf) {
      // 叶子节点才出发选择函数
      onSelect(val);
      onCancel();
    }
  };

  const treeNode = ({ code, val }) => {
    // console.log('----node data----', val);
    return <span className={styles[""]}>{val}</span>;
  };

  return (
    <Modal
      centered
      className={styles["diagnosis-modal"]}
      title="诊断模板"
      visible={visible}
      width={750}
      onCancel={onCancel}
      footer={null}
    >
      <div className={styles["diagnosis-modal-search"]}>
        <Input.Search
          allowClear
          placeholder="请输入诊断..."
          enterButton="添加诊断"
          onSearch={onSearch}
          style={{ padding: '6px 48px 12px 48px' }}
        />
        <div className={styles["diagnosis-modal-search-tags"]}>
          <Radio.Group value={type} buttonStyle="solid" onChange={onChange}>
            <Radio.Button value={1}>全部</Radio.Button>
            <Radio.Button value={2}>科室</Radio.Button>
            <Radio.Button value={3}>个人</Radio.Button>
          </Radio.Group>
          {type !== 1 && (
            <Button className={styles["diagnosis-modal-search-add"]} icon={<PlusOutlined />}>
              添加模板
            </Button>
          )}
        </div>
      </div>
      <div className={styles["diagnosis-modal-content"]}>
        <Tree.DirectoryTree defaultExpandAll treeData={dataSource} onSelect={handleSelect} titleRender={treeNode} />
      </div>
    </Modal>
  );
}
export default TemplateModal
