import { MCHC_TYPE_MAP, MchcTypes } from "@lm_fe/env"
import { IMchc_Admission_bloodTransfusionDocumentDocument } from "./IMchc_Admission_bloodTransfusionDocumentDocument"
import { IMchc_Admission_breastMilkDocument } from "./IMchc_Admission_breastMilkDocument"
import { IMchc_Admission_firstCareDocument } from "./IMchc_Admission_firstCareDocument"
import { IMchc_Admission_firstCareSpecialAssessDocument } from "./IMchc_Admission_firstCareSpecialAssessDocument"
import { IMchc_Admission_InpatientEmrBaseInfo } from "./IMchc_Admission_InpatientEmrBaseInfo"
import { IMchc_Admission_LabourDocument } from "./IMchc_Admission_LabourDocument"
import { IMchc_Admission_labourStageRecordDocument } from "./IMchc_Admission_labourStageRecordDocument"
import { IMchc_Admission_magnesiumDocument } from "./IMchc_Admission_magnesiumDocument"
import { IMchc_Admission_neonateCareDocument } from "./IMchc_Admission_neonateCareDocument"
import { IMchc_Admission_NeonateDocument } from "./IMchc_Admission_NeonateDocument"
import { IMchc_Admission_oxytocinRecordDocument } from "./IMchc_Admission_oxytocinRecordDocument"
import { IMchc_Admission_postnatalCareRecord } from "./IMchc_Admission_postnatalCareRecord"
import { IMchc_Admission_predeliveryDocument } from "./IMchc_Admission_predeliveryDocument"
import { IMchc_Admission_productionTimeDocument } from "./IMchc_Admission_productionTimeDocument"
import { IMchc_Admission_tireDischargeRecord } from "./IMchc_Admission_tireDischargeRecord"
import { IMchc_Admission_tocolysisDocument } from "./IMchc_Admission_tocolysisDocument"
import { IMchc_Admission_urinaryRetentionDocument } from "./IMchc_Admission_urinaryRetentionDocument"

export type IMchc_Admission_Document<T extends MchcTypes = MchcTypes> =

    {
        "deleteFlag": boolean,
        "editFlag": boolean,
        "id": number,
        "prenatalVisitId": 1202,
        "type": number,
        "code": string,
        "name": string,
        "date": string
        "inEmrId": T extends MCHC_TYPE_MAP['广三'] ? number : void
        "fetalCount": null,
        "nurse": string,
        "vteAssessDocument": null,
        "morseFallAssessDocument": null,
        "pressureUlcerAssessDocument": null,
        "labourSafetyAssessDocument": null,
        "bloodGlucoseDocument": null,
        "predeliveryDocument": IMchc_Admission_predeliveryDocument[],
        "postpartumCareDocument": null,
        "normalCareDocument": null,
        "specialistCareDocument": null,
        "oxytocinConditionDocument": null,
        "oxytocinRecordDocumentList": {
            "id": number,
            "oxytocinCondition": {
                id: number,
                "cervixDilatation": string
                "cervixShrink": string,
                "cervixHardness": string
                "cervixPosition": string
                "fetalPresentationPosition": string
                "totalSroce": string
                "totalDosage": string
                "deliverytype": string
            }
            "oxytocinRecord": IMchc_Admission_oxytocinRecordDocument[]
        }[]
        "oxytocinRecordDocument": IMchc_Admission_oxytocinRecordDocument[],
        "neonateCareDocument": IMchc_Admission_neonateCareDocument[],
        "cesareanDocument": null,
        "cesareanFetusDocument": null,
        "labourStageDocument": null,
        "labourStageRecordDocument": IMchc_Admission_labourStageRecordDocument[],
        "labourDocument": IMchc_Admission_LabourDocument,
        birthCertificate: {
            "id": 75,
            "name": null,
            "inpatientNO": null,
            "babyInpatientNO": null,
            "gestationalWeek": "34",
            "newbornName1": null,
            "newbornGender1": "女",
            "newbornWeight1": "1850",
            "newbornHeight1": "42",
            "deliverytime1": "2023-03-01T02:18",
            "newbornName2": null,
            "newbornGender2": "男",
            "newbornWeight2": "2270",
            "newbornHeight2": "44",
            "deliverytime2": "2023-03-01T02:20",
            "newbornName3": null,
            "newbornGender3": null,
            "newbornWeight3": null,
            "newbornHeight3": null,
            "deliverytime3": null,
            "newbornName4": null,
            "newbornGender4": null,
            "newbornWeight4": null,
            "newbornHeight4": null,
            "deliverytime4": null,
            "otherNote": null,
            "deliveryNurse": null,
            "deliveryNurse1": null,
            "deliveryDoctor": "曾毅",
            "deliveryDoctor1": null,
            "motherName": "蔡焕真",
            "motherAge": 35,
            "motherNationality": "中国",
            "motherEthnic": null,
            "motherTelephone": "18028171320",
            "motherIdType": null,
            "motherIdNO": "440583198802191029",
            "fatherName": null,
            "fatherAge": null,
            "fatherNationality": null,
            "fatherEthnic": null,
            "fatherTelephone": null,
            "fatherIdType": null,
            "fatherIdNO": null,
            "receiveName": null,
            "relationship": null,
            "receiveIdType": null,
            "receiveIdNO": null,
            "deleteFlag": false
        }[]
        "neonateDocument": IMchc_Admission_NeonateDocument[],
        "bloodTransfusionDocument": IMchc_Admission_bloodTransfusionDocumentDocument[],
        "inductionLabourDocument": null,
        "inductionLabourFetusDocument": null,
        "inductionLabourDiagnosisDocument": null,
        "firstCareDocument": IMchc_Admission_firstCareDocument,
        "firstCareNormalAssessDocument": any,
        "firstCareSpecialAssessDocument": IMchc_Admission_firstCareSpecialAssessDocument,
        "firstCareFetusDocument": null,
        "handoverDocument": null,
        "noenateHandoverDocument": null,
        "vitalSignsDocument": null,
        "pipelineSlippageAssessDocument": null,
        "tocolysisDocument": IMchc_Admission_tocolysisDocument[],
        "magnesiumDocument": IMchc_Admission_magnesiumDocument[],
        "urinaryRetentionDocument": IMchc_Admission_urinaryRetentionDocument[],
        "tireDischargeRecord": IMchc_Admission_tireDischargeRecord,
        "neonateScaleDocument": {
            gender?: number,
            id?: number,
            height?: number
            hc?: number
            noenateRecordId?: number
            details: {
                "id": 227,
                "recordTime": "2023-02-13 16:58:00",
                "weight": 23.0,
                "height": 33.0,
                "hc": 33.0,
                "headAndNeck": "33",
                "abdomen": "33",
                "genital": "33",
                "limb": "333",
                "jaundice": null,
                "sign": "333",
                "signs": null
            }[]
        }[],
        "breastMilkDocument": IMchc_Admission_breastMilkDocument[],
        "productionTimeDocument": IMchc_Admission_productionTimeDocument,
        "postnatalCareRecord": IMchc_Admission_postnatalCareRecord[],
        "newbornBirthRecord": {
            examiningDoctor: string,
            id: number
            identificationBelt: string
            note: string
            sign: string
            transferOutTime: string
        }[],
        "transvaginalDeviceList": null,
        "inpatientEmrBaseInfo": IMchc_Admission_InpatientEmrBaseInfo
    }


export type IMchc_Admission_DocumentListItem<T extends MchcTypes> = {
    "id": number
    "type": number
    "code": string
    "name": string
    "date": string
    "inEmrId": T extends MCHC_TYPE_MAP['广三'] ? number : void
}