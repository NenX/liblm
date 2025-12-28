// import { formatDateTime, getSearchParamsAll, getSearchParamsValue, request } from "@lm_fe/utils";
// import { message, Button, Space } from "antd";
// import React from 'react'
// import { mchcEnv, mchcLogger } from "@lm_fe/env";
// import { SLocal_History } from "@lm_fe/service";


// interface ICtx {
//     message: typeof message
//     request: typeof request
//     mchcEnv: typeof mchcEnv
//     React: typeof React
//     goTo(url: string): void
//     ui: { Button: typeof Button, Space: typeof Space },
//     utils: {
//         formatDateTime: typeof formatDateTime
//         getSearchParamsAll: typeof getSearchParamsAll
//     }

// }


// export function dynamicScriptExecute(cb: (ctx: ICtx) => void, props?: { history?: any }) {
//     try {
//         cb({
//             message,
//             request,
//             mchcEnv,
//             React,
//             utils: { formatDateTime, getSearchParamsAll },
//             goTo(url) {

//                 return SLocal_History.historyPush(url)
//                 // historyPush(url, props)
//             },
//             ui: { Button, Space },
//         })
//     } catch (error: any) {
//         mchcLogger.error('dynamicScriptExecute', { error })
//         message.warning(`脚本错误：${error}`)
//     }

// }

// export function getSymbolFromDynamicScript<T = any>(str: any, props?: { history?: any }) {
//     let ret: T | undefined
//     if (typeof str !== 'string') return ret
//     dynamicScriptExecute((ctx) => {
//         eval(str)
//     }, props)
//     return ret
// }