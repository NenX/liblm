import { formatDate, request } from "@lm_fe/utils";
import dayjs, { Dayjs } from 'dayjs'
import { TIdTypeCompatible } from "src/types";




export const SLocal_Calculator = {

    async lmp_计算_edd_gestationalWeek(_lmp: string) {
        const lmp = formatDate(_lmp)!;

        const value = await SLocal_Calculator.calcEddBasedOnLmp(lmp);

        return {
            edd: value,
            sureEdd: value,
            gestationalWeek: SLocal_Calculator.calGestationalWeekBySureEdd(value),
        }
    },
    // 根据末次月经计算预产期B超
    async calcEddBasedOnLmp(lmp: string) {
        const { data } = await request.get<string>(`/api/pregnancyCalc-calcEddByLmp?lmp=${lmp}`);
        return formatDate(data) //2023-11-12
    },
    // 根据IVF计算预产期B超
    async calcEddBasedOnIVF(移植时间: string, 天数: number) {
        const 孕0 = dayjs(移植时间).subtract(14 + 天数, 'days')
        const 预产期B超时间 = 孕0.add(280, 'days')

        return formatDate(预产期B超时间)
    },

    // 末次月经开始算
    calGestationalWeekByLmp(lmp: Dayjs, defaultDate = dayjs().endOf('day')) {
        const diffWeek = defaultDate.diff(lmp, 'week');
        const diffDay = defaultDate.diff(lmp, 'day');

        return `${diffWeek}+${diffDay % 7}`;
    },

    // 预产期B超开始算
    calGestationalWeekBySureEdd(sureEdd: any, defaultDate = dayjs().endOf('day')) {
        let sureEddMoment = dayjs(sureEdd).startOf('day');
        const startDate = sureEddMoment.subtract(280, 'days');
        const diffWeek = defaultDate.diff(startDate, 'week');
        const diffDay = defaultDate.diff(startDate, 'day');
        if (diffDay % 7 === 0) {
            return diffWeek + '';
        }
        return `${diffWeek}+${diffDay % 7}`;
    },
    async calcGesWeek(data: { date: string, sureEdd?: string, id: TIdTypeCompatible }) {
        const r = await request.put<{ gestationalWeek: string }>(`/api/doctor/getGestationalWeek`, data)
        return r.data
    },

}