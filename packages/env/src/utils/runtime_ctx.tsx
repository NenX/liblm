import { AnyObject, format_gp, formatDate, formatDateTime, formatDateTimeNoSecond, getSearchParamsAll, request, transmit_happy_pre } from "@lm_fe/utils";
import { Button, message, Space, Tag, Switch } from "antd";
import React from 'react';
import { mchcEnv } from "../env";
import { getGlobalHistory } from "./state";

function Array_(arr: string[], isTag = false) {
    if (!arr) return null
    if (!Array.isArray(arr)) return <span>非数组：{JSON.stringify(arr)}</span>
    if (isTag) return <div>{arr.map(i => <Tag>{i}</Tag>)}</div>
    return <ul>
        {arr.map(i => <li>{i}</li>)}
    </ul>
}

const const_ctx: IRTCtx = {
    required: true,
    message,
    request,
    mchcEnv,
    React,
    utils: { formatDateTime, formatDateTimeNoSecond, getSearchParamsAll, formatDate, format_gp, transmit_happy_pre },
    ui: { Button, Space, Tag, Switch, render_arr: Array_ },
    goTo: function (url: string): void {
        throw new Error("Function not implemented.");
    },
    safeTo: function (url_conf: string, params?: AnyObject): void {
        throw new Error("Function not implemented.");
    },
    type: "default"
}
function gen_rt_ctx_helper(g: (p: IRTCtx) => IRTCtx): IRTCtx {
    return g(const_ctx)
}
export interface IRTCtx {
    type: string,
    props?: any,
    required: true,
    message: typeof message
    request: typeof request
    mchcEnv: typeof mchcEnv
    React: typeof React
    goTo(url: string): void
    safeTo(url_conf: string, params?: AnyObject): void
    ui: { Button: typeof Button, Space: typeof Space, Tag: typeof Tag, Switch: typeof Switch, render_arr: typeof Array_ },
    utils: {
        formatDateTime: typeof formatDateTime
        formatDateTimeNoSecond: typeof formatDateTimeNoSecond
        formatDate: typeof formatDate
        getSearchParamsAll: typeof getSearchParamsAll,
        format_gp: typeof format_gp,
        transmit_happy_pre: typeof transmit_happy_pre
    }

}

export function gen_rt_ctx(type: string, ctx_props?: any) {
    return gen_rt_ctx_helper((ctx) => ({
        ...ctx,
        type,
        props: ctx_props,
        safeTo(url_conf, params) {
            if (!window.safe_navigate) {
                message.warning('找不到全局跳转函数')
                return
            }
            window.safe_navigate(url_conf, ctx_props, params)
        },
        goTo(url) {
            const history = getGlobalHistory()

            const isSp = mchcEnv.isSp
            if (isSp) {
                const isIncludeMask = url?.includes?.('?')
                const _url = isIncludeMask ? `${url}&sp=1` : `${url}?sp=1`

                window.open(_url)
            } else {
                window.mchc_modal?.destroyAll?.()
                return history.push(url)
            }

        },
    }))
}
export const rt_ctx = gen_rt_ctx('global_ctx', { global_ctx: true })