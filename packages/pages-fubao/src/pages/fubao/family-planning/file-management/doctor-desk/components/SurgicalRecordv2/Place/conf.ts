import { rt_ctx } from "@lm_fe/env";
import { IBF_Default } from "@lm_fe/pages";
import { AnyObject } from "@lm_fe/utils";
const ctx = rt_ctx
export const conf_宫内避孕器放置术: IBF_Default = {
    tableColumns: () => import('./form_config'),
    beforeSubmit(_data: AnyObject,) {
        if (!ctx.utils.get(_data, 'familyPlanningId')) {
            _data.familyPlanningId = ctx.props.familyPlanningId
        }
        _data.progressStatus = 4
        return _data
    },
    handleBeforePopup(_data: AnyObject) {
        const data = _data || {}
        const name = ctx.mchcEnv.user_data.firstName
        if (!ctx.utils.get(data, 'operationName')) data['operationName'] = '宫内避孕器放置术'
        if (!ctx.utils.get(data, 'surgicalDate')) data['surgicalDate'] = ctx.utils.formatDate()
        if (!ctx.utils.get(data, 'appointmentPeople')) data['appointmentPeople'] = name
        if (!ctx.utils.get(data, 'surgicalDoctor')) data['surgicalDoctor'] = name
        return data
    }
}