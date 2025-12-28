import { MchcTypes } from "@lm_fe/env";
import { IMchc_Admission_Document } from "./Document";
import _, { isEmpty } from "lodash";
import { AnyObject } from "@lm_fe/utils";

export function processDocument<T extends MchcTypes>(doc: IMchc_Admission_Document<T>) {
    doc_sort(doc)
    doc_formatArr(doc)
    doc_setDefault(doc)
    return doc
}


export function doc_sort<T extends MchcTypes>(doc: IMchc_Admission_Document<T>) {
    doc.neonateCareDocument = __orderByDatetime(doc.neonateCareDocument, 'recordTime')
    doc.urinaryRetentionDocument = __orderByDatetime(doc.urinaryRetentionDocument, 'recordTime')
    doc.oxytocinRecordDocument = __orderByDatetime(doc.oxytocinRecordDocument, 'recordTime')
    doc.postnatalCareRecord = __orderByDatetime(doc.postnatalCareRecord, 'recordTime')
    doc.predeliveryDocument = __orderByDatetime(doc.predeliveryDocument, 'recordTime')
    doc.bloodTransfusionDocument = __orderByDatetime(doc.bloodTransfusionDocument, 'recordTime')
    doc.labourStageRecordDocument = __orderByDatetime(doc.labourStageRecordDocument, 'recordTime')
    doc.tocolysisDocument = __orderByDatetime(doc.tocolysisDocument, 'recordTime')
    doc.magnesiumDocument = __orderByDatetime(doc.magnesiumDocument, 'recordTime')
    doc.neonateScaleDocument = (doc.neonateScaleDocument ?? []).map(_ => ({ ..._, details: __orderByDatetime(_.details, 'recordTime') }))
    doc.oxytocinRecordDocumentList = (doc.oxytocinRecordDocumentList ?? []).map(_ => ({ ..._, oxytocinRecord: __orderByDatetime(_.oxytocinRecord, 'recordTime') }))
}

function doc_formatArr<T extends MchcTypes>(doc: IMchc_Admission_Document<T>) {
    doc.neonateDocument = __setOneIfArrEmpty(doc.neonateDocument)
    doc.newbornBirthRecord = __setOneIfArrEmpty(doc.newbornBirthRecord)
    doc.oxytocinRecordDocumentList = __setOneIfArrEmpty(doc.oxytocinRecordDocumentList)
}

function doc_setDefault<T extends MchcTypes>(doc: IMchc_Admission_Document<T>) {
    const neonateDocument = doc.neonateDocument ?? []
    doc.newbornBirthRecord = doc.newbornBirthRecord.map((_: any, idx) => ({ ..._, appgar: neonateDocument[idx] ?? {}, }))
    doc.neonateDocument = neonateDocument.map(_ => (
        {
            ..._,

            apgar: Object.keys(_).reduce((sum, k) => {
                return k.startsWith('apgar') ? { ...sum, [k]: _[k] } : sum
            }, {})
        }
    ))
}


function __setOneIfArrEmpty<T>(arr: T[]) {
    // return isEmpty(arr) ? [{} as T] : arr
    return isEmpty(arr) ? [] : arr
}

function __orderByDatetime<T extends AnyObject>(data: T[], key: keyof T) {
    const res = (data ?? []).map(_ => ({ ..._, disabled: __DEV__ ? false : (_.disabled || !_.editFlag) }))
    return res.sort((a, b) => +new Date(a[key]) - +new Date(b[key]))
}
