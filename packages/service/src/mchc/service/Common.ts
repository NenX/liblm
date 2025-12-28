import { getSameOptions, ISystemConfig, mchcConfig, mchcConstant, mchcLogger, mchcStore } from "@lm_fe/env"
import { getSearchParamsAll, request, safe_json_parse } from "@lm_fe/utils"
import { get, keyBy } from "lodash"
// import { ISystemConfig } from "../../local"
import { IMchc_Dictionaries, IMchc_Dictionaries_Enumeration, SMchc_Dictionaries } from "./Dictionaries"
import { SMchc_TemplateTrees } from "./TemplateTree"

export interface IMchc_ReferralOrganization {
    "id": 1,
    "grade": 33,
    "gradeName": "三甲医院",
    "gradeNumber": 3,
    "gradeLetter": "甲",
    "name": "广东省中医院",
    "code": "gd_gz_1"
}


export interface IMchc_HighriskGradeConfig extends IMchc_Dictionaries_Enumeration {
    colorText: string
}
export const SMchc_Common = {
    async checkLogin() {
        // const res = await request.post<{ id_token: string }>('/api/abcd', null, { showMsg: false })
        // return res.data.id_token
        return 22
    },
    async fk_login(data: { username: string, password: string }) {
        const res = await request.post<{ id_token: string }>('/api/authenticate', data)
        return res.data.id_token
    },
    async desklogin() {
        const searchData = getSearchParamsAll()
        const { appId, empId, patId, data, timestamp, sign, } = searchData
        if (appId || empId || patId || data || timestamp || sign) {
            const res = await request.post('/api/desklogin', searchData)
            return res
        }
        return Promise.reject()

    },
    async currentTime() {
        const { data } = await request.get<string>(`/api/current-time`);
        return data // "2023-11-12"
    },
    async getCurrReferralOrganization() {
        const { data } = await request.get<IMchc_ReferralOrganization>(`/api/getCurrReferralOrganization`);
        return data
    },
    async getReferralOrganizations(query: { id?: any, name?: any }) {
        const params = { 'id.equals': undefined, 'name.equals': undefined }
        if (query.id) {
            params['id.equals'] = query.id
        }
        if (query.name) {
            params["name.equals"] = query.name
        }
        const organization = await request.get<IMchc_ReferralOrganization[]>(`/api/referral-organizations`, { params })
        return organization.data
    },
    async getHighriskContagionConfig() {
        const type = mchcConfig.get('highriskVersion')
        const arr = await SMchc_Dictionaries.getList({ params: { key: 'highriskContagion', type, module: 'Highrisk' } })
        const item = arr[0]?.enumerations?.[0]
        if (!item) {
            return { color: '', options: [] }
        }
        const res = {
            color: item.note,
            options: getSameOptions(item.label)
        }
        // mchcLogger.log('getHighriskContagionConfig 1', { res })
        return res
    },
    async getHighriskGradeConfig() {
        const type = mchcConfig.get('highriskVersion') as 22
        const colors = mchcConstant.levelOptionsobj[type]
        const arr = await SMchc_Dictionaries.getList({ params: { key: 'highriskGrade', type, module: 'Highrisk' } })
        const item = arr[0]
        if (!item) return []
        const enums: IMchc_HighriskGradeConfig[] = item.enumerations.map(_ => {
            const colorConfig = colors.find(c => c.value === _.label)
            return { ..._, colorText: colorConfig?.label! }
        })

        /**
        *      "id" : 1472,
        *      "label" : "Ⅰ",
        *      "value" : 1,
        *      "note" : "#49c458"
        * 
        */
        return enums
    },
    async getHighriskTree() {
        const type = mchcConfig.get('highriskVersion')

        const treeData = await SMchc_TemplateTrees.getTemplateTree({ type });

        const treeMap = keyBy(treeData, 'id');

        return treeData.map(v => {
            const p = get(treeMap, v.pid)
            const categoryCode = `${p?.val}:${v?.val}`;
            return { ...v, categoryCode: v.pid === 0 ? '' : categoryCode }
        })
    },
    async fetch_system_config() {

        // const list = await SMchc_Dictionaries.getList({ params: { type: 99, } })
        // const first = list[0]
        // const data: Partial<ISystemConfig> = {
        //     id: get(first, 'id'),
        //     ...safe_json_parse(get(first, 'note')),
        // };
        const data = await mchcStore.getSystemConfig()
        return data
    },
    async update_system_config(data: Partial<IMchc_Dictionaries>) {

        return mchcStore.updateSystemConfig(data)

    },

    async get_self_config() {
        const list = await SMchc_Dictionaries.getList({ params: { type: 999, } })
        const item = list[0]
        if (!item?.note) return null
        const data = safe_json_parse(item.note) as ISystemConfig
        return { data }
    },
    async update_self_config(data: Partial<IMchc_Dictionaries>) {

        const list = await SMchc_Dictionaries.getList({ params: { type: 999 } })
        const item = list[0]
        if (!item) return Promise.reject(null)

        return SMchc_Dictionaries.put({ ...item, note: JSON.stringify(data) })
    },



}
