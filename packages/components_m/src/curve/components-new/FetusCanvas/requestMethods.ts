import request from '@/lib/request';
/**获取胎儿生长曲线 */
async function getOutpatientFetuGrowsOfOutpatient(id: string) {
  const res = await request.get('/api/doctor/getOutpatientFetuGrowsOfOutpatient?id=' + id);
  return res;
}
/**更新胎儿生长曲线 */
async function updateOutpatientFetuGrowsOfOutpatient(data: any) {
  const res = await request.put('/api/doctor/updateOutpatientFetuGrowsOfOutpatient', data);
  return res;
}

export default {
  getOutpatientFetuGrowsOfOutpatient,
  updateOutpatientFetuGrowsOfOutpatient,
};
