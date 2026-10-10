import { BF_Wrap2, IBF_Default } from '@lm_fe/pages';
import React, { useEffect } from 'react';
import { IRenderContentProps, RenderContent } from './RenderContent';
import { AnyObject } from '@lm_fe/utils';
interface IProps extends IRenderContentProps {
    conf: IBF_Default
    familyPlanningId: any
    modName: string
}

// export interface IRenderContentProps {
//     config?: IMchc_TableConfig
//     activeItem?: AnyObject
//     activeTemplate: string
//     onRefresh: () => void
// }
export default function RenderContentWrap(props: IProps) {
    const { activeTemplate, conf, familyPlanningId, modName } = props

    const { config, Wrap } = BF_Wrap2({ default_conf: { title: `妇科专病-${modName}-${activeTemplate}`, ...conf } }, { familyPlanningId })



    useEffect(() => {
        return () => { }
    }, [])



    return <Wrap>
        <RenderContent config={config} {...props} />
    </Wrap>
}
