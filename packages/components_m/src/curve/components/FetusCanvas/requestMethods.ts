import { request } from "@lm_fe/utils";

/**获取胎儿生长曲线 */
async function getOutpatientFetuGrowsOfOutpatient(id: string) {
  const res = await request.get('/api/doctor/getOutpatientFetuGrowsOfOutpatient?id=' + id);
  return res.data;
}
/**更新胎儿生长曲线 */
async function updateOutpatientFetuGrowsOfOutpatient(data: any) {
  const res = await request.put('/api/doctor/updateOutpatientFetuGrowsOfOutpatient', data);
  return res.data;
}

export default {
  getOutpatientFetuGrowsOfOutpatient,
  updateOutpatientFetuGrowsOfOutpatient,
};
