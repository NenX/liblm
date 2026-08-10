import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';

import { IMultiTemplate_type, IMultiTemplateProps, MultiTemplateTemplateGroup, MyCheckbox, MyIcon, OkButton } from '@lm_fe/components_m';
import { mchcLogger } from '@lm_fe/env';
import { BF_Wrap2, mchcModal__ } from '@lm_fe/pages';
import { expect_array } from '@lm_fe/utils';
import { SideTemplateItem } from './SideTemplateItem';

interface Iprops {

}
export function SideTemplate({ ...props }: Iprops) {

  const { config, Wrap } = BF_Wrap2(
    { default_conf: { title: '复诊-侧边模板', tableColumns: () => import('./config') } },
    {} // 传递进来的方法
  )
  const [select_type, set_select_type] = useState<IMultiTemplate_type>()
  const templates_props = config?.tableColumns?.[0] as (IMultiTemplateProps | null)
  const all_types = expect_array(templates_props?.MultiTemplate_type)
  mchcLogger.log('SideTemplate config', config)

  useEffect(() => {
    if (!select_type && !isEmpty(all_types)) {
      set_select_type(all_types[0])
    }

    return () => {

    }
  }, [all_types, select_type])
  function open_setting() {
    if (!templates_props) return
    mchcModal__.open('box', {
      width: 1400,
      title: '模板',
      modal_data: {
        content: <MultiTemplateTemplateGroup on_select={() => { }} {...templates_props} maintain_mode />
      },
    })
  }
  return (
    <Wrap >
      {
        !templates_props
          ? '配置错误'
          : <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <MyCheckbox style={{ margin: 6 }} value={select_type?.label} onChange={(t: string) => set_select_type(all_types.find(_ => _.label === t))} marshal={0} options={all_types.map(_ => ({ label: _.label, value: _.label }))} />
              <OkButton style={{ marginRight: 46 }} icon={<MyIcon value='SettingOutlined' />} onClick={open_setting} />
            </div>
            <SideTemplateItem templates_props={templates_props} type={select_type} on_select={t => { }} />
          </>
      }

    </Wrap>
  );
}
