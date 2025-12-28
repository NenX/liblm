import { mchcUtils } from "@lm_fe/env";
import { IMchc_HusbandBaseInfoOfOutpatient } from "../types";




export function process_husbandBaseInfo_remote(data: IMchc_HusbandBaseInfoOfOutpatient) {
    let partnerInfo = (['smoke', 'alcohol', 'disease'] as const)
        .reduce((obj, k) => {
            return mchcUtils.noteToCommonOption(obj, k)
        }, data)

    return partnerInfo
}
export function process_husbandBaseInfo_local(_data: IMchc_HusbandBaseInfoOfOutpatient) {
    const data = { ..._data }
    let partnerInfo = (['smoke', 'alcohol', 'disease'] as const)
        .reduce((obj, k) => {
            return mchcUtils.commonOptionToNote(obj, k)
        }, data)

    return partnerInfo
}