import React, { useState, useEffect } from 'react';
import { map, omit } from 'lodash';
import { request } from '@lm_fe/utils';
import { DataNode } from 'antd/lib/tree';

import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


export default (props: any) => {
  const [menus, setMenus] = useState<DataNode[]>([]);

  const transferMenus = (menus: any, parentid = 0) => {
    const temp: any = [];
    map(menus, (item) => {
      if (item.parentid === parentid) {
        item.title = item.name;
        item.value = item.id;
        item.children = transferMenus(menus, item.id);
        temp.push({ ...omit(item, 'key') });
      }
    });
    return temp;
  };

  useEffect(() => {
    (async () => {
      const newMenus = transferMenus(await request.get('/api/permissions?type.equals=menu&size=500'));
      setMenus([{ id: 0, value: 0, title: '无父级', children: newMenus } as any]);
    })();
  }, []);

  return (
    <TreeSelect
      treeDefaultExpandAll
      placeholder="请选择父级菜单"
      allowClear
      treeData={menus}
      dropdownMatchSelectWidth={300}
      {...props}
    />
  );
};
