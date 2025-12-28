export * from './types'

import { cache_fetch, expect_array, formatDate } from '@lm_fe/utils'
import { Dayjs } from 'dayjs'
import { ModelService } from '../../../ModelService'
import { IMchc_Questionnaire, IMchc_QuestionWrite, IMchc_WriteRecord } from './types'
import { IMchc_Pregnancy } from '../Pregnancy'
import { ICommonOption } from '@lm_fe/env'



interface IFuck_Option { questionId: number, questionType: number, optionIndex: string }

interface IFuck_ParamVO {
    outpatientNo: string,
    questionnaireId: number
    beginTime: string  //开始填写时间
    endTime: string  //提交填写时间
    beginFillDate: string  //检索开始提交日期
    endFillDate: string  //检索结束提交日期
    beginTotalScore: number //检索开始总得分
    endTotalScore: number //检索结束总得分
    questionOptionList: IFuck_Option[]


}




export function makeGoodQuestionnaire(remoteData: IMchc_Questionnaire) {
    const questionList = remoteData.questionList || []
    const indexList = questionList.map(_ => _.questionIndex)
    const groups = remoteData.groupVOList || []
    remoteData.questionList = questionList.filter(q => groups.some(grp => grp.questionIndexList.includes(q.questionIndex)))
    remoteData.groupVOList = groups.map(grp => ({ ...grp, questionIndexList: grp.questionIndexList.filter(idx => indexList.includes(idx)) }))
    return remoteData
}

export const SMchc_Questionnaire = new
    (class extends ModelService<IMchc_Questionnaire> {
        async fk_list() {
            const res = await this._request<any>({ method: 'GET', url: '/api/propaganda/questionnaire/getQuestionnaire/page', params: { size: 9999 }, ignore_usr: true })
            const data = res.data?.list as IMchc_Questionnaire[]
            return data || []
        }
        async to_options() {
            const data = await cache_fetch('questionnaire', () => this.fk_list());
            return expect_array(data).map(q => ({ label: q.questionnaireTitle, value: q.id }) as ICommonOption)
        }
        async fk_byId(id: number) {
            const res = await this._request<IMchc_Questionnaire>({ method: 'GET', url: '/api/propaganda/questionnaire/getQuestionnaireById', params: { id } })
            const data = res.data || {}
            const list = data.questionList || []

            data.questionList = list.map(_ => ({ ..._, questionOptionList: _.questionOptionList?.sort((a, b) => a.optionIndex - b.optionIndex) }))
            return makeGoodQuestionnaire(data)
        }
        async fk_save(data: Omit<Partial<IMchc_QuestionWrite & { questionnaireId: number }>, 'questionnaire'>,) {
            const res = await this._request<any>({ method: 'POST', url: '/api/propaganda/questionnaire/saveWriter', data })
            return res.data
        }
        async fk_getResult(reqData: Omit<Partial<IFuck_ParamVO>, 'beginFillDate' | 'endFillDate'> & { fillDate: Moment[] }, page = 0, size = 9999) {
            const { fillDate = [], questionOptionList, ...others } = reqData
            const paramVO: Partial<IFuck_ParamVO> = { ...others }

            paramVO.beginFillDate = fillDate[0] && formatDate(fillDate[0])!
            paramVO.endFillDate = fillDate[1] && formatDate(fillDate[1])!
            paramVO.questionOptionList = questionOptionList?.filter(_ => _.optionIndex) || []

            const res = await this._request<{ writerVOList: IMchc_QuestionWrite[] }>({ method: 'POST', url: '/api/propaganda/questionnaire/getQuestionnaireResult', data: { page, size, paramVO } })
            const data = res.data
            return data?.writerVOList || []
        }
        async fk_downloadResult(reqData: Omit<Partial<IFuck_ParamVO>, 'beginFillDate' | 'endFillDate'> & { fillDate: Moment[] }, page = 0, size = 9999) {
            const { fillDate = [], questionOptionList, ...others } = reqData
            const paramVO: Partial<IFuck_ParamVO> = { ...others }

            paramVO.beginFillDate = fillDate[0] && formatDate(fillDate[0])!
            paramVO.endFillDate = fillDate[1] && formatDate(fillDate[1])!
            paramVO.questionOptionList = questionOptionList?.filter(_ => _.optionIndex) || []

            const res = await this._request<Blob>({ method: 'POST', url: '/api/propaganda/questionnaire/exportQuestionnaireResult', data: paramVO, responseType: 'blob' })
            return res.data
        }

        async fk_getResultById(id: number) {
            const res = await this._request<IMchc_QuestionWrite>({ url: '/api/propaganda/questionnaire/getWriterRecordsDetailById', params: { id } })
            return res.data
        }
        async fk_getWriterRecords(preg: Partial<IMchc_Pregnancy> = {},) {
            const { outpatientNO, id, idNO, telephone, inpatientNO } = preg
            const res = await this._request<{ list: IMchc_WriteRecord[] }>({ url: '/api/propaganda/questionnaire/getWriterRecords', params: { inpatientNO, outpatientNO, idNO, id, telephone, page: 0, size: 9999 } })
            return res.data.list
        }
    })
    ({
        n: 'Questionnaire',
        prePath: '/api/propaganda/questionnaire',
        apiPrefix: '',
        // apiPrefix: '/api2'
    })
