import { request } from "@lm_fe/utils";
import { safe_json_parse as strToJson, safe_json_stringify as jsonToStr, formatDateTime, formatTime } from '@lm_fe/utils';
import { get } from 'lodash'
export const api = {
    /** 获取孕妇BMI数据 */
    getBmi: async (pregnancyId: number, queryType: number) =>
        (await request.get(`/api/curve/bmi?pregnancyId=${pregnancyId}&queryType=${queryType}`)).data,

    /** 获取孕妇宫高数据 */
    getFundalHeight: async (pregnancyId: number) => (await request.get(`/api/curve/fundalHeight?pregnancyId=${pregnancyId}`)).data,

    /** 获取胎儿生长数据 */
    getGrowth: async (pregnancyId: number) =>
        (await request.get(`/api/curve/growth?pregnancyId=${pregnancyId}`, {})).data,

    /** 更新胎儿超声数据 */
    updateUltrasounds: async (data: any) => (await request.put(`/api/ultrasounds`, data, {})).data,

    /** 添加胎儿超声数据 */
    createUltrasounds: async (data: any) => (await request.post(`/api/ultrasounds`, data)).data,

    /** 删除胎儿超声数据 */
    deleteUltrasounds: async (id: number) => (await request.delete(`/api/ultrasounds/${id}`)).data,

    further: {
        getUltrasoundFormConfig: async () => (await request.get(`/api/form-descriptions?moduleName=prenatal-examination-further-ultrasound`)).data,
    },
    curve: {

        /** 获取孕妇BMI数据 */
        getBmi: async (pregnancyId: number, queryType: number) => (await request.get(`/api/curve/bmi?pregnancyId=${pregnancyId}&queryType=${queryType}`)).data,

        /** 获取孕妇宫高数据 */
        getFundalHeight: async (pregnancyId: number) => (await request.get(`/api/curve/fundalHeight?pregnancyId=${pregnancyId}`)).data,

    }
};
