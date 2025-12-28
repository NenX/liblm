import { BaseEditPanelFormFC } from '@lm_fe/components_m';
import React from 'react';
import { form_config } from './form_config';
export default function fileManagementEditOrAdd(props: any) {
  return <div style={{ height: '100%', overflowY: 'scroll' }}>

    <BaseEditPanelFormFC formDescriptions_old={form_config as any} data={{}} />
  </div>
}
