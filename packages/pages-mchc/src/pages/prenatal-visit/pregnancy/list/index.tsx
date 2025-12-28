import { BF_Wrap2, MyBaseList } from '@lm_fe/pages';

import React, { useEffect } from 'react';
import { useTableConfig } from './config/useTableConfig';
import './index.less';
function fallback(props: any) {
  const [config] = useTableConfig(props)
  return <MyBaseList {...config} />
}
// export default newList;
export default function Pregnancy_list(props: any) {
  const [conf] = useTableConfig(props)
  const conf_fn = () => import('./config/table')
  const { config, Wrap } = BF_Wrap2({
    default_conf: {
      title: '孕册管理-列表',
      tableColumns: conf_fn,
      searchConfig: () => import('./config/form'),
    },
  }, props)
  useEffect(() => {

    return () => {

    }
  }, [])
  return <Wrap>
    {/* <MyBaseList {...conf} searchConfig={config?.searchConfig} tableColumns={config?.tableColumns} /> */}
    <MyBaseList {...conf} searchConfig={config?.searchConfig} tableColumns={__DEV__ ? conf_fn : config?.tableColumns} />
  </Wrap>
}
