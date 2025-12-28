
import { DataNode } from 'antd/lib/tree';
import { find, get, map } from 'lodash';

export interface IFuckHighriskTree {
  "key": null,
  "title": "遗传病史",
  "value": null,
  "level": null,
  "selected": null,
  "children": {
    "key": null, "title": "产前筛查有异常但产前诊断无异常", "value": "遗传病史:产前筛查有异常但产前诊断无异常", "level": "Ⅲ",
    "selected": true, "children": null
  }[]
}
interface FuckWarnData1 {
  "id": number,
  "type": "RiskMark",
  "title": "高危因素标记",
  "level": handleType,
  "handleTime": "2023-04-23 16:24:04",
  "data": {
    "highriskTree": IFuckHighriskTree[]
  },
  "pregnancyId": 2919,
  "doctorId": 509,
  "handleType": "yes",
  "popUp": null,
  "ignores": null
}
interface FuckWarnData2 {
  "id": number,
  "type": "DiagnosisRemind",
  "title": "漏诊提醒",
  "level": handleType,
  "handleTime": null,
  "data": { "content": "HIV阳性，是否添加艾滋病诊断", "key": "艾滋病" },
  "pregnancyId": 2919,
  "doctorId": 509,
  "handleType": null,
  "popUp": null,
  "ignores": null
}
export type FuckWarnTtype = FuckWarnData2 | FuckWarnData1

export enum handleType {
  process = '9',
  noprocess = '1',
  ignore = '0',
}
/**
 *
 * @param data 数据
 * @param tabKey 是否已处置
 * @returns
 */
export const transferData = (data: IFuckHighriskTree[], tabKey: any, handleTime?: any, id?: number, ignoreRiskMark?: FuckWarnTtype[]) => {
  const treeData: DataNode[] = [];
  const selectkey: any = [];
  const openKey: any = [];
  console.log('123');
  data.map((item, index) => {
    let key1: any = item.key || index.toString();

    let obj: DataNode = { key: key1 },
      children: DataNode[] = [];
    obj.className = 'tree-title';
    obj.title = item.title;
    openKey.push(key1);
    obj.handleTime = handleTime;
    item.children.map((subItem, ind) => {
      let key = (subItem.key || ind.toString()) + '~' + subItem.value;
      let obj2: DataNode = { key };
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

export const transferdataRemind = (data: any, tabKey: handleType) => {
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
