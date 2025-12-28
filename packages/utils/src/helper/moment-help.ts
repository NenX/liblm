
import { formatDate, formatDateTime } from '@noah-libjs/utils'
import { Dayjs } from 'dayjs'


function formatRangeMoment(data: { [x: string]: Dayjs[] | null }, formater: (v: Dayjs) => string | null, cKeys: string[],) {
    const entries = Object.entries(data)
    return entries.reduce((a, [k, v], idx) => {
        if (!v) return a
        return {
            ...a,
            [`${k}.${cKeys[0]}`]: formater(v[0]),
            [`${k}.${cKeys[1]}`]: formater(v[1]),
        }
    }, {} as { [x: string]: string | null })
}
export function formatRangeDate(data: { [x: string]: Dayjs[] | null }, cKeys = ['greaterOrEqualThan', 'lessOrEqualThan']) {
    return formatRangeMoment(data, formatDate, cKeys)
}
export function formatRangeDateTime(data: { [x: string]: Dayjs[] | null }, cKeys = ['greaterOrEqualThan', 'lessOrEqualThan']) {
    return formatRangeMoment(data, formatDateTime, cKeys)
}



