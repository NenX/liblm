import { BF_Wrap2, MyBaseList } from '@lm_fe/pages';
import React from 'react';
import './index.less';


export default function BirthRegistrationList(props: any) {

  const handleAdd = () => {

  }

  const { config, Wrap } = BF_Wrap2({
      default_conf: {
        title: '产科住院-出生登记表',
        name: "/api/neonateEnterRecord",
        tableColumns: () => import('./config/table'),
        searchConfig: () => import('./config/form'),
        searchParams: () => ({ 'deleteFlag.equals': 0, sort: 'id,desc', }),
        showRowExportBtn: true,
      }
    }, props)

  return (
    <Wrap>
      <MyBaseList bf_conf={config} showRowExportBtn />
    </Wrap>
  )
}
