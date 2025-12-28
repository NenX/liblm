import { request } from "@lm_fe/utils";
export default {
  /** 获取孕妇BMI数据 */
  getBmi: (pregnancyId: number, queryType: number) =>
    request.get(`/api/curve/bmi?pregnancyId=${pregnancyId}&queryType=${queryType}`).then(r => r.data),

  /** 获取孕妇宫高数据 */
  getFundalHeight: (pregnancyId: number) => request.get(`/api/curve/fundalHeight?pregnancyId=${pregnancyId}`).then(r => r.data),

  /** 获取胎儿生长数据 */
  getGrowth: (pregnancyId: number) =>
    request.get(`/api/curve/growth?pregnancyId=${pregnancyId}`, { headers: { isLoading: false } }).then(r => r.data),

  /** 更新胎儿超声数据 */
  updateUltrasounds: (data: any) => request.put(`/api/ultrasounds`, data, { headers: { isLoading: false } }).then(r => r.data),

  /** 添加胎儿超声数据 */
  createUltrasounds: (data: any) => request.post(`/api/ultrasounds`, data).then(r => r.data),

  /** 删除胎儿超声数据 */
  deleteUltrasounds: (id: number) => request.delete(`/api/ultrasounds/${id}`).then(r => r.data),
};
