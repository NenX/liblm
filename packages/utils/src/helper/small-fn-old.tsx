import { isNumber, isString, split } from "lodash";
import dayjs, { Dayjs } from "dayjs";
import { request } from "./Request";
import { EMPTY_PLACEHOLDER } from "src/constant";

/**
 * 计算BMI
 */
export function getBMI(weight: number, height: number) {
    if (!weight || !height) return 0;
    return ((weight / (height * height)) * 10000).toFixed(2);
}

/**
 * 计算孕周
 * gesDate:预产期-B超
 * date：产检/报告日期
 */
export function getGesWeek(gesDate: string, date: string) {
    const diffDays = 280 - dayjs(gesDate).diff(dayjs(date), 'days');
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    return days === 0 ? `${weeks}` : `${weeks}+${days}`;
}

/**
 * 计算停经孕周
 * @param checkData 当前日期
 * @param lmp 末次月经
 * @returns
 */
export const menopauseWeek = (checkData: string, lmp: string) => {
    const diffDays = dayjs(checkData).diff(dayjs(lmp), 'days');
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    return days === 0 ? `${weeks}` : `${weeks}+${days}`;
};

/**
 * 计算孕周对应的天数
 */
export function getGestationalDays(gestationalWeek: string) {
    const arr = split(gestationalWeek, '+');
    const weeks = Number(arr[0]) || 0;
    const days = Number(arr[1]) || 0;
    return weeks * 7 + days;
}

/**
 * 获取本周五、下周五、下下周五时间
 */
export function getOrderTime(orderDate: '本周五' | '下周五' | '下下周五') {
    if (orderDate === '本周五') {
        return dayjs().day(5);
    } else if (orderDate === '下周五') {
        return dayjs().day(12);
    } else if (orderDate === '下下周五') {
        return dayjs().day(19);
    }
    return dayjs(new Date());
}


/**
 * 根据末次月经计算预产期B超
 */
export function getExpected(date: string) {
    const addDays = 280 - dayjs().diff(dayjs(date), 'days');
    return dayjs().add(addDays, 'days').format('YYYY-MM-DD');
}

/**
 * 计算两个日期相隔的年数
 */
export function getDiffYears(date: string, preDate: string) {
    return dayjs(date).diff(dayjs(preDate), 'years', true);
}


/**
 * 获取两个字符串日期 YYYY-MM-dd 间隔的天数
 * 始终返回一个正数
 */
export const getDays = (str1: string, str2: string): number => {
    const dateReg = /^\d{4}\-\d{2}\-\d{2}$/;
    if (!dateReg.test(str1) || !dateReg.test(str2)) {
        console.warn("Date's format is not YYYY-MM-dd");
        return -1;
    }
    const time1 = new Date(str1).getTime();
    const time2 = new Date(str2).getTime();
    return Math.abs(~~(time2 - time1) / 1000 / 3600 / 24);
};

/**
 * 根据 预产期B超 日期获取孕周
 * 得出 ${孕周周数}+${孕周天数}
 * 预产期B超
 */
export const getGestationalWeekBySureEdd = function (sureEdd: string): string {
    if (!sureEdd) return '';
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${today.getMonth() > 9 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`
        }-${today.getDate() > 9 ? today.getDate() : `0${today.getDate()}`}`;
    const days = getDays(sureEdd, todayStr);
    // 这里会出现孕周为负数的情况
    const gestationalWeek = `${((280 - days) / 7) >>> 0}+${(280 - days) % 7}`;
    return gestationalWeek;
};

/**
 * 根据末次月经计算预产期B超
 */
export function calEddByLmp(lmp: Dayjs) {
    return dayjs(lmp).add(280, 'days');
}



/**根据出生日期计算年龄 */
export function GetAgeByBirthDay(strBirthday: string) {
    if (!isString(strBirthday)) return null;
    var returnAge;
    var strBirthdayArr = strBirthday.split('-');
    var birthYear: any = strBirthdayArr[0];
    var birthMonth: any = strBirthdayArr[1];
    var birthDay: any = strBirthdayArr[2];

    var d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();

    if (nowYear == birthYear) {
        returnAge = 0; //同年 则为0岁
    } else {
        var ageDiff = nowYear - birthYear; //年之差
        if (ageDiff > 0) {
            if (nowMonth == birthMonth) {
                var dayDiff = nowDay - birthDay; //日之差
                if (dayDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    returnAge = ageDiff;
                }
            } else {
                var monthDiff = nowMonth - birthMonth; //月之差
                if (monthDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    returnAge = ageDiff;
                }
            }
        } else {
            returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
        }
    }
    return returnAge; //返回周岁年龄
}


export const getDataSource = async (url: string, params: object, processFromApi?: (v: any) => any) => {
    const response = await request.get(url, {
        params,
    });
    const { data, headers } = response;
    const count = headers['x-total-count'];
    const _data = data.data ?? data

    return {
        count,
        data: processFromApi ? processFromApi(_data) : _data,
    };
};


export function gen_id_form_item_config(name = 'id') {
    return {
        inputType: 'id' as const,
        dataIndex: name,
        name
    }
}


// 末次月经开始算
export const calGestationalWeekByLmp = (lmp: Dayjs, defaultDate = dayjs().endOf('day')) => {
    const diffWeek = defaultDate.diff(lmp, 'week');
    const diffDay = defaultDate.diff(lmp, 'day');

    return `${diffWeek}+${diffDay % 7}`;
};

// 预产期B超开始算
export const calGestationalWeekBySureEdd = (sureEdd: any, defaultDate = dayjs().endOf('day')) => {
    let sureEddMoment = dayjs(sureEdd).startOf('day');
    const startDate = sureEddMoment.subtract(280, 'days');
    const diffWeek = defaultDate.diff(startDate, 'week');
    const diffDay = defaultDate.diff(startDate, 'day');
    if (diffDay % 7 === 0) {
        return diffWeek;
    }
    return `${diffWeek}+${diffDay % 7}`;
};

export function format_gp(data: { gravidity?: any, parity?: any }): string {
    const { gravidity, parity } = data

    if (!isNumber(gravidity) || !isNumber(parity)) return EMPTY_PLACEHOLDER

    return `${gravidity}/${parity}`
}
export function unmarshalGestationWeek(weekStr?: string) {
    const result = {
        week: 0,
        day: 0
    }
    if (!weekStr) return result
    const arr = weekStr.split('+')
    result.week = parseInt(arr[0] || '0')
    result.day = parseInt(arr[1] || '0')
    return result
}

export function marshalGestationWeek(week?: string | number, day?: string | number) {
    if (!week && !day) {
        return '0'
    }
    week = week ?? '0'
    day = day ? `+${day}` : ''
    return `${week}${day}`
}