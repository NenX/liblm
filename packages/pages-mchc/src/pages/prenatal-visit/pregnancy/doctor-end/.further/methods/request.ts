import { request } from "@lm_fe/utils";

/**获取复诊记录数据 */
async function getRvisitInfoOfOutpatient(id: string) {
  const res = await request.get('/api/doctor/getRvisitInfoOfOutpatient?id=' + id);
  return res.data
}

/** 更新复诊记录数据 */
async function updateRvisitInfoOfOutpatient(data: any) {
  const res = await request.post('/api/doctor/updateRvisitRecordOfOutpatient', data);
  return res.data
}

/**  删除诊断 */
async function deleteDiagnosis(id) {
  const res = await request.delete(`/api/doctor/deleteDiagnosisOfOutpatient/${id}`);
  return res.data
}

/** 排序诊断 */
async function sortDiagnoses(data: any) {
  const res = await request.put('/api/doctor/sortDiagnosesOfOutpatient', data);
  return res.data
}

/**新增修改诊断 新增无id 修改带id*/
async function newAddDiagnosis(data: any) {
  return (await request.post(`/api/doctor/newOrSaveDiagnosisOfOutpatient`, data)).data;
}
export const requestMethods_further = {
  getRvisitInfoOfOutpatient,
  updateRvisitInfoOfOutpatient,
  deleteDiagnosis,
  sortDiagnoses,
  newAddDiagnosis,
};
export default requestMethods_further