import { mchcEnv } from "@lm_fe/env";
import { useEffect } from "react";
import { useKeepAliveEffect } from "react-keep-alive-pro";
const useMyEffect = mchcEnv.isSp ? useEffect : useKeepAliveEffect

const useMyEffectSafe = (props: any) => {
    if (mchcEnv.is_single || props.is_modal) {
        return useEffect
    }
    return mchcEnv.isSp ? useEffect : useKeepAliveEffect
}


export { useMyEffect, useMyEffectSafe };
