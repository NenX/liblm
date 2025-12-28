/*
 * @Descripttion: 项目描述
 * @Author: cjl
 * @Date: 2021-11-05 15:35:39
 * @LastEditTime: 2021-11-05 15:35:40
 */
import { find, get, map } from 'lodash';
import { handleType } from './high-risk-warn';
/**
 *
 * @param data 数据
 * @param tabKey 是否已处置
 * @returns
 */
export const transferData = (data: any, tabKey: any, handleTime?: any, id?: string, ignoreRiskMark?: any[]) => {
  const treeData: any = [];
  const selectkey: any = [];
  const openKey: any = [];
  console.log('123');
  map(data, (item, index: any) => {
    let obj: any = {},
      children: any = [];
    obj.className = 'tree-title';
    let key1: any = item.key || index.toString();
    obj.key = key1;
    obj.title = item.title;
    openKey.push(key1);
    obj.handleTime = handleTime;
    map(item.children, (subItem, ind: any) => {
      let key = (subItem.key || ind.toString()) + '~' + subItem.value;
      let obj2: any = {};
      obj2.key = key;
      obj2.title = subItem.title;
      if (tabKey == handleType.process) {
        obj2.disabled = true;
      }
      if (tabKey == handleType.ignore) {
        const arr =
          get(
            find(ignoreRiskMark, (item) => item.id == id),
            'data.highriskTree',
          ) || [];
        for (let i = 0; i < arr.length; i++) {
          let arritem = arr[i].children || [];
          for (let j = 0; j < arritem.length; j++) {
            let itemchildren = arritem[j];
            if (subItem.title == itemchildren.title && !itemchildren.selected) {
              obj2.disabled = true;
              break;
            }
          }
        }
      }
      if (subItem.selected) selectkey.push(key);
      children.push(obj2);
    });
    obj.children = children;
    treeData.push(obj);
  });
  return { treeData, selectkey, openKey };
};

export const transferdataRemind = (data: any, tabKey: any) => {
  const treeData: any = [];
  const selectkey: any = [];
  const openKey: any = [];
  map(data, (item, index) => {
    let obj: any = { ...item };
    let key1: any = item.data.key + '~' + item.data.content;
    obj.title = item.data.key + '(' + item.data.content + ')';
    obj.key = key1;
    if (item.level == handleType.process) {
      obj.disabled = true;
    }
    treeData.push(obj);
  });
  return treeData;
};
