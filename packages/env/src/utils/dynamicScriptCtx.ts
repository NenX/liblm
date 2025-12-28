import { mchcLogger } from "../logger";
import { gen_rt_ctx, IRTCtx } from "./runtime_ctx";




export function dynamicScriptExecute(cb: (ctx: IRTCtx) => void, props?: any): boolean {
    try {
        cb(gen_rt_ctx('instance_ctx', props))
        return false
    } catch (error: any) {
        mchcLogger.error('dynamicScriptExecute', { error })
        return true
    }

}

export function getSymbolFromDynamicScript<T = any>(str: any, props?: any, default_v?: T) {
    let ret: T | undefined
    if (typeof str !== 'string') return ret
    const is_err = dynamicScriptExecute((ctx) => {
        eval(str)
    }, props)
    if (is_err) {
        ret = default_v
    }
    return ret
}
