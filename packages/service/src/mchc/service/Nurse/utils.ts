import { ICommonOption, mchcEnv, mchcUtils, optionKey不详, optionKey其他 } from "@lm_fe/env";
import { getSearchParamsValue, safe_json_parse, safe_json_parse_arr } from "@lm_fe/utils";
import { IMchc_Nurse_OutpatientDocument, IMchc_Nurse_OutpatientDocument_physicalExam } from "./types";
import { cloneDeep, isEmpty, isObject, keys, orderBy, values } from "lodash";

const fuckNote = ['dysmenorrhea', 'smoke', 'alcohol', 'hazardoussubstances', 'medicine', 'radioactivity',
    'hypertension', 'diabetes', 'operationmh', 'cardiacDisease', 'transfusionHistory'] as const
export function process_OutpatientDocument_remote(data: IMchc_Nurse_OutpatientDocument) {

    if (mchcEnv.appName === '广三') {
    }
    // 受孕方式 pregnancyInfo
    let pregnancyInfo = data.pregnancyInfo ?? {}
    let conceiveMode = pregnancyInfo.conceiveMode
    let conceiveModeNote = pregnancyInfo.conceiveModeNote
    const old = safe_json_parse(conceiveModeNote) // { 1:{ key:1, value:{ 0:'2023-11-13T07:44:25.095Z', 1:123, 2:123 } } }
    if (old && !isEmpty(old)) {
        if (!Array.isArray(old)) {
            const oldObj = values(old)[0] as { key: number, value: { 0: string, 1: number, 2: number } }
            if (isObject(oldObj) && isObject(oldObj.value)) {
                const oldValue = oldObj.key
                const oldTextObj = oldObj.value

                pregnancyInfo.conceiveMode__ = [{ value: oldValue, text: [oldTextObj[0], oldTextObj[1], oldTextObj[2]], label: '' }]
            }
        }
    } else {
        pregnancyInfo.conceiveMode__ = [{ value: conceiveMode, label: '', text: conceiveModeNote }]
    }


    // pregnancyInfo = fuckNote
    //     .reduce((obj, k) => {
    //         return mchcUtils.noteToCommonOption(obj, k)
    //     }, pregnancyInfo)

    pregnancyInfo = mchcUtils.autoNoteToCommonOption(pregnancyInfo)




    //过敏史
    if (pregnancyInfo.amh) {
        const amh = pregnancyInfo.amh
        const amh__: ICommonOption[] = []
        if (amh.nothing) {
            amh__.push({ value: 0, })
        } else {
            if (amh.drug) {
                amh__.push({ value: 1, text: amh.drugNote })
            }
            if (amh.food) {
                amh__.push({ value: 2, text: amh.foodNote })
            }
            if (amh.other) {
                amh__.push({ value: optionKey其他, text: amh.otherNote })
            }
            if (amh.unknown) {
                amh__.push({ value: optionKey不详 })
            }
        }
        pregnancyInfo.amh___ = amh__
    }

    data.pregnancyInfo = pregnancyInfo

    data.physicalExam = process_OutpatientDocument_physicalExam_remote(data.physicalExam)

    // 孕产史数据排序处理
    const pregnancymh = data.pregnancymh ?? []
    data.pregnancymh = orderBy(pregnancymh, ['gravidityindex'], ['asc'])

    // 丈夫基本信息处理
    // const partnerInfo = data.partnerInfo ?? {}
    // partnerInfo.smoke__ = [{ label: '', value: partnerInfo.smoke, text: partnerInfo.smokeNote }]
    // partnerInfo.alcohol__ = [{ label: '', value: partnerInfo.alcohol, text: partnerInfo.alcoholNote }]
    // partnerInfo.disease__ = [{ label: '', value: partnerInfo.disease, text: partnerInfo.diseaseNote }]
    // data.partnerInfo = partnerInfo

    let partnerInfo = (['smoke', 'alcohol', 'disease'] as const)
        .reduce((obj, k) => {
            return mchcUtils.noteToCommonOption(obj, k)
        }, data.partnerInfo)

    data.partnerInfo = partnerInfo



    return data;
}

export function process_OutpatientDocument_physicalExam_local(physicalExam?: IMchc_Nurse_OutpatientDocument_physicalExam) {
    if (!physicalExam) return {} as IMchc_Nurse_OutpatientDocument_physicalExam
    // 体征数据处理
    const { MyPressure1__ = [], MyPressure2__ = [], MyPressure3__ = [] } = physicalExam
    const _physicalExam = { ...physicalExam }
    _physicalExam.systolic = MyPressure1__[0]
    _physicalExam.diastolic = MyPressure1__[1]
    _physicalExam.systolic2 = MyPressure2__[0]
    _physicalExam.diastolic2 = MyPressure2__[1]
    _physicalExam.systolic3 = MyPressure3__[0]
    _physicalExam.diastolic3 = MyPressure3__[1]
    return _physicalExam
}
export function process_OutpatientDocument_physicalExam_remote(physicalExam?: IMchc_Nurse_OutpatientDocument_physicalExam) {
    if (!physicalExam) return {} as IMchc_Nurse_OutpatientDocument_physicalExam
    // 体征数据处理
    const { systolic, systolic2, systolic3, diastolic, diastolic2, diastolic3 } = physicalExam

    const _physicalExam = { ...physicalExam }
    _physicalExam.MyPressure1__ = [systolic, diastolic]
    _physicalExam.MyPressure2__ = [systolic2, diastolic2]
    _physicalExam.MyPressure3__ = [systolic3, diastolic3]
    return _physicalExam
}

export function process_OutpatientDocument_local(_data: IMchc_Nurse_OutpatientDocument) {
    const data = cloneDeep(_data)
    // 受孕方式 pregnancyInfo
    let pregnancyInfo = data.pregnancyInfo ?? {}
    let conceiveMode__ = safe_json_parse_arr(pregnancyInfo.conceiveMode__)
    const firstOne = conceiveMode__[0]

    if (firstOne) {
        const valueData = firstOne.value ?? undefined
        const firstOneText = safe_json_parse_arr(firstOne.text)
        pregnancyInfo.conceiveMode = valueData
        //@ts-ignore
        pregnancyInfo.conceiveModeNote = firstOneText.length
            ? JSON.stringify({ [valueData]: { key: valueData, value: { 0: firstOneText[0], 1: firstOneText[1], 2: firstOneText[2] } } })
            : firstOne.text

    }


    // pregnancyInfo = fuckNote
    //     .reduce((obj, k) => {
    //         return mchcUtils.commonOptionToNote(obj, k)
    //     }, pregnancyInfo)
    pregnancyInfo = mchcUtils.autoCommonOptionToNote(pregnancyInfo)

    //过敏史
    const amh__ = safe_json_parse_arr(pregnancyInfo.amh___)
    const amh = pregnancyInfo.amh ?? {}
    let target: ICommonOption | undefined
    if (amh__.length) {
        if (amh__.some(_ => _.value === 0)) {
            amh.nothing = true
        } else {
            amh.nothing = false
            if (target = amh__.find(_ => _.value === 1)) {
                amh.drug = true
                amh.drugNote = target.text
            } else {
                amh.drug = false
            }
            if (target = amh__.find(_ => _.value === 2)) {
                amh.food = true
                amh.foodNote = target.text
            } else {
                amh.food = false
            }
            if (target = amh__.find(_ => _.value === optionKey其他)) {
                amh.other = true
                amh.otherNote = target.text
            } else {
                amh.other = false
            }
            if (target = amh__.find(_ => _.value === optionKey不详)) {
                amh.unknown = true
            } else {
                amh.unknown = false
            }
        }
        pregnancyInfo.amh = amh
    }
    data.pregnancyInfo = pregnancyInfo

    // 体征数据处理
    data.physicalExam = process_OutpatientDocument_physicalExam_local(data.physicalExam)

    // 丈夫基本信息处理
    // const partnerInfo = data.partnerInfo ?? {}
    // const { smoke__ = [], alcohol__ = [], disease__ = [] } = partnerInfo
    // partnerInfo.smoke = smoke__[0]?.value
    // partnerInfo.smokeNote = smoke__[0]?.text!
    // partnerInfo.alcohol = alcohol__[0]?.value
    // partnerInfo.alcoholNote = alcohol__[0]?.text!
    // partnerInfo.disease = disease__[0]?.value
    // partnerInfo.diseaseNote = disease__[0]?.text!

    let partnerInfo = (['smoke', 'alcohol', 'disease'] as const)
        .reduce((obj, k) => {
            return mchcUtils.commonOptionToNote(obj, k)
        }, data.partnerInfo)

    data.partnerInfo = partnerInfo


    return data
}