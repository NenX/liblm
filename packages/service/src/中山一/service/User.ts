import { formatDate, request, getSearchParamsValue } from "@lm_fe/utils"
import { Dayjs } from "dayjs"
import { IFuckPageResponse, IFuckResponse } from "src/types"




export interface IZsy_CtgRecord {
    "id": 1,
    "applyNo": "申请单号.",
    "docNo": "档案流水号",
    "outpatientNo": "门诊号",
    "inpatientNo": "住院号",
    "doctorId": "申请医生工号",
    "doctorName": "申请医生名称",
    "visitDate": "2022-08-04",
    "ctgStartTime": "2022-08-04 02:49:39",
    "ctgEndTime": "2022-08-04 02:49:39",
    "state": 1,
    "diagnosis": "诊断",
    "total": null,
    "bhrvalue": null,
    "bhrscore": null,
    "ltvvalue": null,
    "ltvscore": null,
    "accdurationvalue": null,
    "accdurationscore": null,
    "accamplvalue": null,
    "accamplscore": null,
    "fmvalue": null,
    "fmscore": null,
    "type": null,
    "fetal": null,
    "uctimes": null,
    "ucStrong": null,
    "ucdurationtime": null,
    "uckeeptime": null,
    "edtimes": null,
    "ldtimes": null,
    "vdtimes": null,
    "cst": null,
    "oct": null,
    "nst": null,
    "name": string

    signOriginData: string
    signedData: string


    "accscore": string,
    "accvalue": string,
    "decscore": string,
    "decvalue": string,
    "edscore": string,
    "edvalue": string,
    "ldscore": string,
    "ldvalue": string,
    "sinusoidscore": string,
    "sinusoidvalue": string,
    "stvscore": string,
    "stvvalue": string,
    "vdscore": string,
    "vdvalue": string,
}


const baseURL = '/Obcloud'

export const SZsy_CtgRecord = {
    count: 0,
    async findRecordsPage(q: { pageCurrent: number, pageSize: number, state?: number, startDate?: Dayjs, endDate?: Dayjs }) {
        const visitDateStart = q.startDate ? formatDate(q.startDate) : undefined
        const visitDateEnd = q.endDate ? formatDate(q.endDate) : undefined
        const res = await request.get<IFuckPageResponse<IZsy_CtgRecord>>(`/api/ctg/findRecords`, {
            params: { ...q, visitDateStart, visitDateEnd },
            baseURL,
            headers: { doctorno: getSearchParamsValue('doctorno')! }
        })
        return res.data.data
    },
    async getRecordHistory(recordId: number) {
        const res = await request.get<IFuckResponse<IZsy_CtgRecord[]>>(`/api/ctg/getRecordHistory/${recordId}`, { baseURL })
        return res.data.data
    },
    // async findRecords(a: number) {
    //     return new Promise((res, rej) => {
    //         res({ data: { data: 9527 } })
    //     })
    // },

    async getSliceImages(recordId: number) {
        const res = await request.get<IFuckResponse<string[]>>(`/api/ctg/getSliceImages`, { params: { recordId }, baseURL })
        return res.data.data
    },
    async getReport(id: number, type: 'recordId' | 'recordHistoryId' = 'recordId') {

        const res = await request.get<IFuckResponse<string>>(`/api/ctg/getReport`, { params: { [type]: id }, baseURL })
        return res.data.data
    },

    async saveRecord(data: IZsy_CtgRecord) {
        const res = await request.post<IFuckResponse<IZsy_CtgRecord>>(`/api/ctg/saveRecord`, data, { baseURL })
        return res.data.data
    },
    async getQrCode(doctorNo: string) {
        const res = await request.post<IFuckResponse<{ qrCodeExpireDate: number, qrCodeIdentity: string, qrCodeBase64: string }>>(`/api/ctg/sign/qrCode/create`, { doctorNo }, { baseURL })
        return res.data.data
    },
    async confirmQrCode(qrCodeIdentity: string) {
        const res = await request.post<IFuckResponse<{ verifyStatus: -1 | 0 | 1, userToken: null, errorMsg: null }>>(`/api/ctg/sign/qrCode/confirm`, { qrCodeIdentity }, { baseURL })
        return res.data.data
    },
    async sign(data: { userToken: string, data: string }) {
        const res = await request.post<IFuckResponse<string>>(`/api/ctg/sign/signData`, data, { baseURL })
        return res.data.data
    },


}




