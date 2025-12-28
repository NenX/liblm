import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, TIdTypeCompatible } from '@lm_fe/service';
import './index.less';
export interface IDiagnosesprops {
  // changeDiagnosesTemplate(b: boolean): void,
  changeScreening(b: boolean): void,
  changeSyphilis(b: boolean): void,
  // getDiagnosesList(): void,
  saveHeaderInfo(h: IMchc_Doctor_OutpatientHeaderInfo): void,
  setDiagnosesList(list: IMchc_Doctor_Diagnoses[]): void,
  setDiagnosesWord(t: string): void,
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo
  diagnosesList: IMchc_Doctor_Diagnoses[]
  // isShowDiagnosesTemplate: boolean
  noshowlist: boolean
  // isShowDiagnosesTemplatets: boolean
  isAllPregnancies: boolean
  page: '' | 'return'

  diagnosesWord: string
  getHighriskDiagnosis(v: TIdTypeCompatible): void
  serialNo: string


  



  // diagnosesWord,
  // noshowlist,
  // isAllPregnancies,
  // diagnosesList = [],
  // headerInfo,
  // saveHeaderInfo,
  // setDiagnosesList,
  // changeSyphilis,
  // changeScreening,
  // page,
  // serialNo,
  // setDiagnosesWord,
  // getHighriskDiagnosis
  
}
