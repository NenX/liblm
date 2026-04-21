import { safe_evaluate_context } from "@lm_fe/utils";
import { gen_rt_ctx } from "./runtime_ctx";






export function getSymbolFromDynamicScript<T = any>(str: any, props?: any, default_v?: T) {
    const { is_err, data } = safe_evaluate_context(str, () => gen_rt_ctx('instance_ctx', props))
    if (is_err) return default_v
    return data
}

