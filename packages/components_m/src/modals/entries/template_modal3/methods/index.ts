import { IMchc_TemplateTree_Item } from '@lm_fe/service';
import { request } from '@lm_fe/utils';
import { DataNode } from 'antd/lib/tree';
import { map, isEmpty } from 'lodash';
import { DEFAULT_URL } from '../common';
import { MyDataNode } from '../types';



export const getTemplates = async ({ templateType, userid = null }) => {
  let res;
  if (templateType === 2 && userid) {
    res = await request.get(
      `${DEFAULT_URL}?depid.equals=1&type.equals=${templateType}&userid.equals=${userid}&size=999999&page=0`,
    );
  } else {
    res = await request.get(`${DEFAULT_URL}?depid.equals=1&type.equals=${templateType}&size=999999&page=0`);
  }
  return res;
};

export const rootTemplate: MyDataNode = {
  id: 0,
  key: 0,
  value: 0,
  title: '一级模板',
  children: [],
};

export const transferTemplates2 = (templates: Partial<IMchc_TemplateTree_Item>[], pid = 0) => {
  const tree: MyDataNode[] = [];

  const all = templates.map((item) => {
    const isChild = item.pid === pid
    const children = isChild ? transferTemplates(templates, item.id).tree : []
    const i: MyDataNode = { ...item, key: item.id!, value: item.id, title: item.val, children, isLeaf: isEmpty(children) }
    if (isChild) {
      tree.push(i);
    }
    return i
  });
  if (tree.length) {

  }
  return { tree, all };
};



export const transferTemplates = (templates: Partial<IMchc_TemplateTree_Item>[], pid = 0) => {
  const all: MyDataNode[] = templates.map(item => ({ ...item, key: item.id!, value: item.id, title: item.val, children: [], isLeaf: false }))
  all.forEach(_ => {
    const c = all.filter(s => s.pid === _.id)

    _.children = c
    _.isLeaf = c.length ? false : true

  })

  return { tree: all.filter(q => q.pid === 0), all }



};
