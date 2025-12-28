import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Modal, Tabs, Row, Col, Menu, Empty, message } from 'antd';
const { TabPane } = Tabs;
import { size, filter, map, get, find, join, cloneDeep, includes, set, findIndex } from 'lodash';
import './index.less';
import { formatDate } from '@lm_fe/utils';
interface Iprops {
  websocketData: any;
  closeModal: Function;
  makeSure: Function;
  changeWebsocketData: Function;
}

import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

/**websocket弹窗 */
export default function MessageMultitermModal({ websocketData, closeModal, makeSure, changeWebsocketData }: Iprops) {
  const [selectTreeData, setSelectTreeData] = useState({});
  const [menuId, setMenuId] = useState(null);
  const [tabKey, setTabKey] = useState('1');
  useEffect(() => {
    changMenuId(1);
  }, [websocketData]);
  useEffect(() => {
    changMenuId();
  }, [tabKey]);

  useEffect(() => { }, [selectTreeData]);

  const changMenuId = (level?: number) => {
    if (!level) {
      level = tabKey == '1' ? 1 : 9;
    }
    const arr = filter(websocketData, (item) => item.level == level || item.level == level + 'read');
    const id = get(arr, `[0].id`, null);
    setMenuId(id);
  };

  const handleSure = (type: string) => {
    return () => {
      const selectObj = cloneDeep(find(websocketData, (item) => item.id == menuId));
      set(selectObj, `handleType`, type);
      if (get(selectObj, `type`) == 'DiagnosisRemind') {
        set(selectObj, `level`, 9);
        makeSure(selectObj);
        return false;
      }
      let bool = false;
      map(selectObj.data.highriskTree, (item, value) => {
        map(item.children, (subItem, chindex) => {
          if (get(subItem, `selected`)) {
            bool = true;
          }
        });
      });
      if (!bool) {
        message.info('请先选择标记');
        return;
      }
      set(selectObj, `level`, 9);

      makeSure(selectObj);
    };
  };

  const handelClose = useCallback(() => {
    closeModal();
  }, []);
  const tabsCallback = useCallback((key) => {
    setTabKey(key);
  }, []);
  const handleCheck = (key: string) => {
    return (checkedKeys, { checked, checkedNodes, node, event, halfCheckedKeys }) => {
      console.log({ checkedKeys, checked, checkedNodes, node, event, halfCheckedKeys });
      const newwebsocketData = cloneDeep(websocketData);

      const selectObj = find(newwebsocketData, (item) => item.id == menuId);
      map(selectObj.data.highriskTree, (item, value) => {
        map(item.children, (subItem, chindex) => {
          const value = (subItem.key || chindex.toString()) + '~' + subItem.value;
          if (get(node, `key`) == value) {
            set(subItem, `selected`, checked);
          }
        });
      });
      // console.log({ checkedKeys, checked, selectObj, newwebsocketData });
      changeWebsocketData(newwebsocketData);
    };
  };

  const handleSelect = useCallback(({ key }) => {
    setMenuId(key);
  }, []);

  const buttons = useMemo(() => {
    return (
      <div className="foot">
        <Button className="button-noremind" onClick={handleSure('no')}>
          关闭,不再提醒
        </Button>
        <Button type="primary" onClick={handleSure('yes')}>
          确定
        </Button>
      </div>
    );
  }, [selectTreeData, menuId, websocketData]);

  const memuRender = useCallback(
    (type) => {
      const arr = filter(websocketData, (item) => item.level == type || item.level == type + 'read');
      if (size(arr) == 0) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
      }
      return (
        <Menu mode="inline" selectedKeys={[`${menuId}`]} onSelect={handleSelect} style={{ width: 200 }}>
          {map(arr, (item, index) => {
            const key = item.type == 'DiagnosisRemind' ? `(${item.data.key})` : '';
            return <Menu.Item key={item.id}>{item.title + key}</Menu.Item>;
          })}
        </Menu>
      );
    },
    [websocketData, menuId],
  );

  const renderContent = () => {
    const obj = find(websocketData, (item) => item.id == menuId);
    if (!obj) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
    const type = get(obj, `type`);
    if (type == 'DiagnosisRemind') {
      return (
        <>
          <div className="reminder-msg">
            <span className="reminder-word">{get(obj, `data.content`)}</span>
          </div>
          <div className="reminder-diag">{get(obj, `data.key`)}</div>
          {renderSign(obj)}
        </>
      );
    }
    if (type == 'RiskMark') {
      const { treeData, selectkey, openKey } = transferData(get(obj, `data.highriskTree`));
      if (tabKey == '1') {
        return (
          <>
            <Tree
              treeData={treeData}
              expandedKeys={openKey}
              checkedKeys={selectkey}
              checkable={true}
              onCheck={handleCheck(get(obj, `id`))}
              checkStrictly={true}
            />
            {renderSign(obj)}
          </>
        );
      } else {
        return (
          <>
            <Tree treeData={treeData} expandedKeys={openKey} checkable={true} checkedKeys={selectkey} />
            {renderSign(obj)}
          </>
        );
      }
    }
  };

  const renderSign = (obj: any) => {
    const level = get(obj, `level`);
    if (level == '9' || level == '9read') {
      return (
        <div className="disposition">
          <span>{formatDate(get(obj, `handleTime`))}</span>
          {get(obj, `handleType`) == 'yes' ? '已处置' : '不处置'}
        </div>
      );
    } else {
      return <></>;
    }
  };

  const transferData = (data: any) => {
    const treeData: any = [];
    const selectkey: any = [];
    const openKey: any = [];
    map(data, (item, index: any) => {
      let obj: any = {},
        children: any = [];
      obj.className = 'tree-title';
      let key1: any = item.key || index.toString();
      obj.key = key1;
      obj.title = item.title;
      openKey.push(key1);
      map(item.children, (subItem, ind: any) => {
        let key = (subItem.key || ind.toString()) + '~' + subItem.value;
        let obj2: any = {};
        obj2.key = key;
        obj2.title = subItem.title;
        if (tabKey == '2') {
          obj2.disabled = true;
        }
        if (subItem.selected) selectkey.push(key);
        children.push(obj2);
      });
      obj.children = children;
      treeData.push(obj);
    });
    return { treeData, selectkey, openKey };
  };

  return (
    <Modal
      width={680}
      className="highrisk-multiterm-modal"
      visible={true}
      maskClosable={false}
      onCancel={handelClose}
      footer={null}
    // title="请标记高危因素！"
    >
      <div className="content">
        <Tabs defaultActiveKey="1" onChange={tabsCallback}>
          <TabPane tab="未处置" key="1">
            <div className="tab-content">
              <div className="left-content">{memuRender('1')}</div>
              <div className="right-content">{renderContent()}</div>
            </div>
          </TabPane>
          <TabPane tab="已处置" key="2">
            <div className="tab-content">
              <div className="left-content">{memuRender('9')}</div>
              <div className="right-content">{renderContent()}</div>
            </div>
          </TabPane>
        </Tabs>
        {tabKey == '1' && size(websocketData) > 0 ? buttons : null}
      </div>
    </Modal>
  );
}
