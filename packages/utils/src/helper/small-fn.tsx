







export function getTimeSlice(hour = 24, isShowSecond = false) {
    const hourArr = Array(hour).fill(0) as number[]
    const minuteArr = Array(60).fill(0) as number[]
    return hourArr.reduce((sum, h, hIdx) => {
        return [...sum, ...minuteArr.map((m, mIdx) => `${hIdx}:${mIdx}`)]
    }, [] as string[])
}



















