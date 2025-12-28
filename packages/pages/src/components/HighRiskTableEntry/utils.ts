import { mchcEvent } from "@lm_fe/env";
import { IMchc_Doctor_OutpatientHeaderInfo, mchcEnums } from "@lm_fe/service";
export interface IHighRiskTableEntryProps {
    headerInfo?: IMchc_Doctor_OutpatientHeaderInfo
    data?: IData
}
export type IData = {
    isOpenVTETable: number;
    isOpenSCTable: number;
    isOpenEclampsiaTable: number;
}



const isPopup = mchcEnums.Doctor.modalPopup.getValue('弹窗')
const isRemid = mchcEnums.Doctor.modalPopup.getValue('提醒')
const isNoop = mchcEnums.Doctor.modalPopup.getValue('无')

export enum remindEnum {
  popup = isPopup,
  remind = isRemid,
  no = isNoop,
}

/**
 * 根据后端逻辑弹出子痫，vte,疤痕提醒
 * @param res
 */
export function highRiskTablePopup(res: IData) {
  const { isOpenSCTable, isOpenEclampsiaTable, isOpenVTETable } = res;
  if (isOpenSCTable == remindEnum.popup) {
    mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '瘢痕子宫阴道试产表' })
  }
  if (isOpenEclampsiaTable == remindEnum.popup) {
    mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '子痫前期风险评估表' })

  }
  if (isOpenVTETable == remindEnum.popup) {
    mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '深静脉血栓高危因素孕期用药筛查表' })

  }
}
export const popupRemindkeyMap = {
  VTE: ['cicatrixLable', 'isOpenVTETable'] as const,
  子痫: ['eclampsiaLable', 'isOpenEclampsiaTable'] as const,
  瘢痕子宫: ['thrombusLable', 'isOpenSCTable'] as const,
}
export type TPopupRemindkey = keyof typeof popupRemindkeyMap
export function isShowPopupRemind(key: TPopupRemindkey, headerInfo?: IMchc_Doctor_OutpatientHeaderInfo, value?: IData,) {
  if (!headerInfo || !value) return false
  const item = popupRemindkeyMap[key]
  const valueOfHeaderinfo = headerInfo[item[0]]
  const valueOfRvisit = value[item[1]]
  return !valueOfHeaderinfo && (valueOfRvisit == remindEnum.popup || valueOfRvisit == remindEnum.remind)
    ? true
    : false;
}

