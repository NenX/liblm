import { mchcUtils } from "@lm_fe/env";
import { safe_json_parse_arr } from "@lm_fe/utils";
import { cloneDeep } from "lodash";
import { IFubao_CervicalCancerScreening } from "./type";





export function processTwoCancer_remote(data: IFubao_CervicalCancerScreening) {
    if (!data?.id) return data

    const physicalExamination = data.womenHealthcarePhysicalExamination ?? {}
    const MedicalHistory = data.cervicalCancerMedicalHistory ?? {}

    // 月经史

    let womenHealthcareMenstrualHistory = (['menopause', 'dysmenorrhea'] as const)
        .reduce((obj, k) => {
            return mchcUtils.noteToCommonOption(obj, k)
        }, data.womenHealthcareMenstrualHistory)

    data.womenHealthcareMenstrualHistory = womenHealthcareMenstrualHistory


    //病史情况
    let cervicalCancerMedicalHistory = (['previousCervicalScreening', 'gynecologicalDiseasesHistory'] as const)
        .reduce((obj, k) => {
            return mchcUtils.noteToCommonOption(obj, k)
        }, data.cervicalCancerMedicalHistory)

    data.cervicalCancerMedicalHistory = cervicalCancerMedicalHistory

    //妇科检查
    let cervicalCancerGynecologicExamination = (['vulva', 'secretions', 'vaginal', 'cervix', 'zg', 'appendix'] as const)
        .reduce((obj, k) => {
            return mchcUtils.noteToCommonOption(obj, k)
        }, data.cervicalCancerGynecologicExamination)

    data.cervicalCancerGynecologicExamination = cervicalCancerGynecologicExamination

    //诊断及指导
    data.cervicalCancerDiagnosisAndGuidance = mchcUtils.noteToCommonOption(data.cervicalCancerDiagnosisAndGuidance, 'screeningResults')

    // 体格检查
    physicalExamination.MyPressure__ = [physicalExamination.systolic, physicalExamination.diastolic]
    return data
}
export function processTwoCancer_local(_data: IFubao_CervicalCancerScreening) {
    const data = cloneDeep(_data)

    // 月经史

    let womenHealthcareMenstrualHistory = (['menopause', 'dysmenorrhea'] as const).reduce((obj, k) => {
        return mchcUtils.commonOptionToNote(obj, k)
    }, data.womenHealthcareMenstrualHistory)

    data.womenHealthcareMenstrualHistory = womenHealthcareMenstrualHistory



    //病史情况

    let cervicalCancerMedicalHistory = (['previousCervicalScreening', 'gynecologicalDiseasesHistory'] as const)
        .reduce((obj, k) => {
            return mchcUtils.commonOptionToNote(obj, k)
        }, data.cervicalCancerMedicalHistory)

    data.cervicalCancerMedicalHistory = cervicalCancerMedicalHistory

    //妇科检查
    // let cervicalCancerGynecologicExamination = (['vulva', 'secretions', 'vaginal', 'cervix', 'zg', 'appendix'] as const)
    //     .reduce((obj, k) => {
    //         return mchcUtils.commonOptionToNote(obj, k)
    //     }, data.cervicalCancerGynecologicExamination)

    // data.cervicalCancerGynecologicExamination = cervicalCancerGynecologicExamination

    //诊断及指导
    data.cervicalCancerDiagnosisAndGuidance = mchcUtils.commonOptionToNote(data.cervicalCancerDiagnosisAndGuidance, 'screeningResults')
    // 体格检查
    const physicalExamination = data.womenHealthcarePhysicalExamination ?? {}
    const MyPressure__ = safe_json_parse_arr(physicalExamination.MyPressure__)
    physicalExamination.systolic = MyPressure__[0]
    physicalExamination.diastolic = MyPressure__[1]
    data.womenHealthcarePhysicalExamination = physicalExamination
    return data
}