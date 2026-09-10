import { AnyObject, isString } from "@noah-libjs/utils"








export function getTimeSlice(hour = 24, isShowSecond = false) {
    const hourArr = Array(hour).fill(0) as number[]
    const minuteArr = Array(60).fill(0) as number[]
    return hourArr.reduce((sum, h, hIdx) => {
        return [...sum, ...minuteArr.map((m, mIdx) => `${hIdx}:${mIdx}`)]
    }, [] as string[])
}

export function is_fuck_abnormal(conf?: { isNormal?: 'true' | 'false' | null }) {
    return conf?.isNormal === 'false'
}


export function format_dataIndex<T>(record?: AnyObject) {
  const _dataIndex = record?.dataIndex ?? record?.name ?? record?.key
  if (isString(_dataIndex) && _dataIndex.includes('.')) {
    return _dataIndex.split('.')
  }
  return _dataIndex
}














