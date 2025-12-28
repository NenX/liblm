import { ICommonOption, mchcEnv, mchcUtils, optionKey不详, optionKey其他, optionKey否 } from "@lm_fe/env";
import { getSearchParamsValue, safe_json_parse_arr } from "@lm_fe/utils";
import { IMchc_Doctor_FirstVisitInfoOfOutpatient, IMchc_Doctor_FirstVisitPastmhOutpatient, IMchc_Doctor_RvisitInfoOfOutpatient } from "./types";

export function processFirstInfoOfOutpatient(data: IMchc_Doctor_FirstVisitInfoOfOutpatient) {
    const serialNo = getSearchParamsValue('serialNo')


    if (mchcEnv.appName === '广三' && serialNo) {
        // data.diagnosisAndAdvice.diagnoses = data.diagnosisAndAdvice.diagnoses.filter(_ => _.serialNo === serialNo)
    }
    return data;
}
export function processRvisitInfoOfOutpatient(data: IMchc_Doctor_RvisitInfoOfOutpatient) {
    const serialNo = getSearchParamsValue('serialNo')


    if (mchcEnv.appName === '广三' && serialNo) {
        // data.diagnoses = data.diagnoses.filter(_ => _.serialNo === serialNo)
        // data.rvisits = data.rvisits.filter(_ => _.serialNo === serialNo)
    }
    return data
}
// 既往史
export function processPastmh_remote(_data: IMchc_Doctor_FirstVisitPastmhOutpatient) {


    const data = mchcUtils.autoNoteToCommonOption(_data)
    console.log('hhx', _data, data)

    data.allergy__ = []
    // const keys = Object.keys(data)
    // const targetKeys = keys.filter(k => {
    //     return keys.includes(`${k}Note`)
    // })
    // targetKeys.forEach(k => {
    //     if (data[k] === undefined) return
    //     data[`${k}__`] = [{ value: Number(data[k]), text: data[`${k}Note`] }]
    // })
    if (data.nothing === true) {
        data.allergy__.push({ value: optionKey否 })
    } else if (data.nothing === false) {
        if (data.allergyDrug) {
            data.allergy__.push({ value: 1, text: data.allergyDrugNote })
        }
        if (data.allergyFood) {
            data.allergy__.push({ value: 2, text: data.allergyFoodNote })
        }
        if (data.allergyOther) {
            data.allergy__.push({ value: optionKey其他, text: data.allergyOtherNote })
        }
        if (data.unknown) {
            data.allergy__.push({ value: optionKey不详, })
        }
    }
    return data
}
export function processPastmh_local(_data: IMchc_Doctor_FirstVisitPastmhOutpatient) {

    const data = mchcUtils.autoCommonOptionToNote(_data)


    const allergy__ = safe_json_parse_arr(data.allergy__)
    let allergyItem: ICommonOption
    // const keys = Object.keys(data)
    // const targetKeys = keys.filter(k => {
    //     return keys.includes(`${k}Note`)
    // })
    // targetKeys.forEach(k => {
    //     const tmpData: ICommonOption = safe_json_parse_arr(data[`${k}__`])[0]

    //     if (tmpData) {
    //         data[k] = !!tmpData.value
    //         data[`${k}Note`] = tmpData.text
    //     } else {
    //         data[k] = undefined
    //         data[`${k}Note`] = undefined
    //     }
    // })

    if (allergy__.find(_ => _.value === optionKey否)) {
        data.nothing = true
        data.allergyDrug = false
        data.allergyFood = false
        data.allergyOther = false
        data.unknown = false


    } else {
        if (allergyItem = allergy__.find(_ => _.value === 1)) {
            data.nothing = false
            data.allergyDrug = true
            data.allergyDrugNote = allergyItem.text
        } else {
            data.allergyDrug = false
        }
        if (allergyItem = allergy__.find(_ => _.value === 2)) {
            data.nothing = false
            data.allergyFood = true
            data.allergyFoodNote = allergyItem.text
        } else {
            data.allergyFood = false
        }
        if (allergyItem = allergy__.find(_ => _.value === optionKey其他)) {
            data.nothing = false
            data.allergyOther = true
            data.allergyOtherNote = allergyItem.text
        } else {
            data.allergyOther = false
        }
        if (allergyItem = allergy__.find(_ => _.value === optionKey不详)) {
            data.nothing = false
            data.unknown = true
        } else {
            data.unknown = false
        }
    }
    return data
}
// 其他病史
export function processOther_remote(_data: IMchc_Doctor_FirstVisitInfoOfOutpatient['othermh']) {

    const data = mchcUtils.autoNoteToCommonOption(_data)
    data.pmh = mchcUtils.autoNoteToCommonOption(_data.pmh)
    data.fmh = mchcUtils.autoNoteToCommonOption(_data.fmh)
    return data
}
export function processOther_local(_data: IMchc_Doctor_FirstVisitInfoOfOutpatient['othermh']) {

    const data = mchcUtils.autoCommonOptionToNote(_data)
    data.pmh = mchcUtils.autoCommonOptionToNote(_data.pmh)
    data.fmh = mchcUtils.autoCommonOptionToNote(_data.fmh)
    return data
}

export function processLabExamOfOutpatient_local(_data: any) {
    const data = mchcUtils.autoCommonOptionToNote(_data)
    return data

}
export function processLabExamOfOutpatient_remote(_data: any) {
    const data = mchcUtils.autoNoteToCommonOption(_data)
    return data
}
export function processPhysicalExamOfOutpatient_local(_data: IMchc_Doctor_FirstVisitInfoOfOutpatient['physicalExam']) {
    const data = mchcUtils.autoCommonOptionToNote(_data)

    const { MyPressure1__ = [], MyPressure2__ = [], MyPressure3__ = [] } = _data.physicalBaseExam


    data.physicalBaseExam = {

        ...data.physicalBaseExam,
        systolic: MyPressure1__[0],
        diastolic: MyPressure1__[1],
        systolic2: MyPressure2__[0],
        diastolic2: MyPressure2__[1],
        systolic3: MyPressure3__[0],
        diastolic3: MyPressure3__[1],

    }


    data.physicalgeneralExam = mchcUtils.autoCommonOptionToNote(_data.physicalgeneralExam)
    return data

}
export function processPhysicalExamOfOutpatient_remote(_data: IMchc_Doctor_FirstVisitInfoOfOutpatient['physicalExam']) {
    const data = mchcUtils.autoNoteToCommonOption(_data)



    data.physicalBaseExam = {
        ..._data.physicalBaseExam,
        MyPressure1__: [_data.physicalBaseExam.systolic, _data.physicalBaseExam.diastolic],
        MyPressure2__: [_data.physicalBaseExam.systolic2, _data.physicalBaseExam.diastolic2],
        MyPressure3__: [_data.physicalBaseExam.systolic3, _data.physicalBaseExam.diastolic3],
    }
    data.physicalgeneralExam = mchcUtils.autoNoteToCommonOption(_data.physicalgeneralExam)
    return data
}