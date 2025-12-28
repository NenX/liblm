import { request } from '@lm_fe/utils';
import { DataNode } from 'antd/lib/tree';
import { map, isEmpty } from 'lodash';
import { IMchc_TemplateTree_Item } from '@lm_fe/service'
const DEFAULT_URL = '/api/template-trees';

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

export const rootTemplate = {
  id: 0,
  key: 0,
  value: 0,
  title: '顶级',
  children: [],
};

export const transferTemplates = (templates: IMchc_TemplateTree_Item[], pid = 0) => {
  const temp: (DataNode & { value?: any })[] = [];
  map(templates, (item) => {
    const t: (DataNode & { value?: any }) = { key: item.id }
    if (item.pid === pid) {
      t.key = item.id;
      t.value = item.id;
      t.title = item.val;
      t.children = transferTemplates(templates, item.id);
      if (isEmpty(t.children)) {
        t.isLeaf = true;
      } else {
        t.isLeaf = false;
      }
      temp.push(t);
    }
  });
  return temp;
};
