import { IMchc_Doctor_Diagnoses } from "./common";
import { IMchc_Doctor_FirstVisitPastmhOutpatient } from "./IMchc_Doctor_FirstVisitPastmhOutpatient";
import { IMchc_Doctor_Pregnancymh } from "./IMchc_Doctor_Pregnancymh";


export interface IMchc_Doctor_FirstVisitInfoOfOutpatient {


    id: number
    presentmh: {
        "id": 1373,
        "lmp": "2022-08-04",
        "edd": "2023-05-11",
        "sureEdd": "2023-05-11",
        "sureEddModify": null,
        "conceiveMode": 1,
        "conceiveModeNote": null,
        "chiefcomplaint": null,
        "presentmhNote": null,
        "yolksac": null,
        "sac": null,
        "ntExams": null,
        "nfExams": null,
        "mlUltrasounds": null
    },
    pastmh: IMchc_Doctor_FirstVisitPastmhOutpatient,
    othermh: {
        "id": 1373,
        "menarche": "2",
        "menstrualCycle": "2",
        "menstrualPeriod": "2",
        "menstrualVolume": "少",
        "dysmenorrhea": false,
        "dysmenorrheaNote": null,
        "maritalStatus": 1,
        "maritalYears": 22,
        "nearRelation": false,
        "pmh": {
            "smoke": false,
            "smokeNote": null,
            "alcohol": false,
            "alcoholNote": null,
            "hazardoussubstances": false,
            "hazardoussubstancesNote": null,
            "radioactivity": false,
            "radioactivityNote": null,
            "medicine": false,
            "medicineNote": null,
            "other": null,
            "otherNote": null
        },
        "fmh": {
            "diabetes": true,
            "diabetesNote": null,
            "hypertension": false,
            "hypertensionNote": " ",
            "birthdefects": true,
            "birthdefectsNote": null,
            "heritableDisease": false,
            "heritableDiseaseNote": " ",
            "other": true,
            "otherNote": "家族史"
        }
    },
    physicalExam: {
        "id": null,
        "physicalBaseExam": {
            MyPressure1__: number[],
            MyPressure2__: number[],
            MyPressure3__: number[],

            "systolic": number,
            "diastolic": number,
            "systolic2": number,
            "diastolic2": number,
            "systolic3": number,
            "diastolic3": number,
            "pulse": 45,
            "weight": number,
            "preheight": number
            "preweight": number
            "bmi": number // 这里倒过来
            preBmi: number // 这里倒过来


        },
        "physicalgeneralExam": {
            "skin": null,
            "skinNote": null,
            "thyroid": null,
            "thyroidNote": null,
            "breast": null,
            "breastNote": null,
            "respiratory": null,
            "respiratoryNote": null,
            "rales": null,
            "ralesNote": null,
            "heartrate": null,
            "heartrhythm": null,
            "heartrhythmNote": null,
            "murmurs": null,
            "murmursNote": null,
            "liver": null,
            "liverNote": null,
            "spleen": null,
            "spleenNote": null,
            "spine": null,
            "spineNote": null,
            "physiologicalreflection": null,
            "physiologicalreflectionNote": null,
            "pathologicalreflection": null,
            "pathologicalreflectionNote": null,
            "edema": null,
            "edemaNote": null,
            "otherNote": null
        }
    },
    pregnancymh: IMchc_Doctor_Pregnancymh[],
    gynecologicalExam: {
        "id": null,
        "gynecologicalMotherExam": null,
        "gynecologicalFetusExam": []
    },
    labExam: null,
    diagnosisAndAdvice: {
        "id": null,
        "diagnoses": IMchc_Doctor_Diagnoses[],
        "advice": {
            "id": 1604,
            "prescription": "456456",
            "exam": null,
            "appointmentCycle": "28",
            "appointmentType": "1",
            "appointmentDate": "2022-10-16",
            "appointmentPeriod": null,
            "visitDate": "2022-09-18",
            "doctorName": "kevin"
        },
        "serialNo": null,
        "pregnancymh": null,
        "personalProfile": null,
        "familyHistory": null,
        "diseaseHistory": null,
        "gravidity": null,
        "currentGestationalWeek": null,
        "parity": null,
        "eddAge": null,
        "age": null,
        "bmi": null,
        "conceiveMode": null,
        "conceiveModeNote": null,
        "isOpenVTETable": null,
        "isOpenSCTable": null,
        "isOpenEclampsiaTable": null,
        "admissionInfoVM": null
    }
}

