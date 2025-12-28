import { SLocal_State, SMchc_TemplateTrees } from '@lm_fe/service';

import { DataNode } from 'antd/lib/tree';
import { useEffect, useState } from 'react';
import { rootTemplate, transferTemplates } from '../methods';
import { needUserIDTypes } from '../common';
import { ITemplateType } from '../types';

import { LazyAntd } from '@lm_fe/components';

const TreeSelect = LazyAntd.TreeSelect


export default function TemplateSelect(props: any) {
  const user = SLocal_State.getUserData()
  const userid = user?.id
  const { onChange, } = props;
  const [value, setValue] = useState(props.value || 0);
  const [options, setOptions] = useState<DataNode[]>([]);
  const templateType = props.templateType as ITemplateType

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    SMchc_TemplateTrees.getTemplateTree({
      depid: templateType.depid,
      type: templateType.type,
      userid: needUserIDTypes.indexOf(templateType.type) > -1 && userid ? userid : undefined,
    }).then((res) => {
      setOptions([
        {
          ...rootTemplate,
          children: transferTemplates(res).tree,
        },
      ]);
    });
  }, []);

  const handleChange = (data: any) => {
    setValue(data);
    onChange && onChange(data);
  };

  return <TreeSelect getPopupContainer={props.getPopupContainer} treeDefaultExpandAll value={value} treeData={options} onChange={handleChange} />;
}
