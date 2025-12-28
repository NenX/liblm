// export * from './dynamicScriptCtx'

import { mchcEnv } from "@lm_fe/env";
import { SLocal_Calculator, SLocal_History } from "@lm_fe/service";
import { AnyObject, getSearchParamsAll, request } from "@lm_fe/utils";
import { message } from "antd";
import { get, isString, keys } from "lodash";
import { mchcModal__ } from "src/modals";

export function safe_navigate(url_conf: string, props?: AnyObject, params?: AnyObject) {

    if (mchcEnv.is_fullscreen)
        return


    if (props?.is_modal) {
        mchcModal__.open('modal_page', {
            modal_data: { route_conf: { url: url_conf, params } }
        })
        return
    }
    if (location.pathname == url_conf) {
        message.info('已在当前页面')
        return
    }
    return SLocal_History.safe_history_push(url_conf, props);
}

window.safe_navigate = safe_navigate