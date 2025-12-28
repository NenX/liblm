import { message } from 'antd';
import { Dayjs } from 'dayjs';
import { IModel_FamilyPlanningDefaultSetting } from '.';
import { get } from 'lodash';
import { ModelService } from '../ModelService';
import { IModel_PreoperativeExamination } from './PreoperativeExamination';
import { SLocal_State } from '@lm_fe/service';
export interface IModel_EarlyPregnancyCheckSurgeryType {
  age: number;
  deleteFlag: number;
  diagnoseDoctor: string;
  disposableSurgicalKit: null;
  doctorOrder: string;
  familyPlanningEarlyPregnancyCheckId: number;
  familyPlanningId: number;
  id: number;
  intraoperativeMedication: null;
  intraoperativeMedicationNote: null;
  name: string;
  operationName: any;
  other: null;
  postoperativeUterineCavity: null;
  precautionsAfterOperation: null;
  preoperativeDiagnosis: null;
  preoperativeExamination: IModel_PreoperativeExamination;
  preoperativeUterineCavity: null;
  registrationDate?: Dayjs;
  skinCondition: null;
  skinConditionNote: null;
  specialCases: null;
  status: 0;
  suckOutTheFluff: null;
  surgicalDate: string;
  surgicalDoctor: null;
  surgicalGrade: number;
  surgicalNumber: string;
  surgicalNurse: null;
  surgicalPeople: null;
  telephone: string;
  admissionDoctor: null;
  admissionTime?: Dayjs;
  appointmentNurse: string;
  signInRegistrant: string;
  signInTime: string;
  appointmentDate?: Dayjs;
  appointmentTimeRangeEnd: Dayjs;
  appointmentTimeRangeStart: Dayjs;
  earlyPregnancyCheckSurgeryTypeId: null;
  earlyPregnancySurgicalTemplateId: 1;
  idNO: string;
  informedConsents: {
    archiveTime: string;
    consentName: string;
    id?: number;
    state: number;
  }[];
  operatingRoom: string;
  operationType: string;
  outpatientNo: string;
  preoperativeBodyTemperature: null;
  preoperativeDiastolic: null;
  preoperativeFasting: null;
  preoperativeMissions: null;
  preoperativeMissionsContent: string;
  preoperativeNote: null;
  preoperativeSystolic: null;
  progressStatus: number;
  residenceAddress: string;
  appointmentIndex: number;

  anesthesia: null;
  anesthesiaDoctor: null;
  anesthesiaNote: null;
  appointmentPeople: string;
  appointmentSubsequenVisitDate: '2021-11-26';
  backgroundColor: null;
  bleedingQuantity: null;
  cervicalDilation: 1;
  cervicalDilationNote: null;
  curettageDirection: null;
  curettageDirectionNote: null;
  curettageWeeks: null;
  dilatationAndCurettage: null;
  dilatationAndCurettageNote: null;
  earlyPregnancyCheckPacTrackingFollowUpRecord: null;
  embryoSac: null;
  embryoSacNote: null;
  feelTheResistance: null;
  fontColor: null;
  injectUterineFluid: null;
  intrauterineDevice: null;
  intrauterineDeviceDurableYears: '12';
  intrauterineDevicePlacePeriod: null;
  intrauterineDevicePlacePeriodNote: null;
  intrauterineDeviceSize: null;
  intrauterineDeviceType: '铜固定式IUD';
  intrauterineDeviceTypeNote: null;
  liquidReflux: null;
  liquidRefluxNote: null;
  negativePressure: null;
  operationTimeEnd: '2021-11-26 16:17:21';
  operationTimeStart: '2021-11-26 16:17:20';
  operationTypeDetail: null;
  operativeComplication: 1;
  operativeComplicationNote: null;
  operativeSituation: 1;
  operativeSituationNote: null;
  patientsFeel: null;
  patientsFeelNote: null;
  payment: number;
  postoperationMissions: 1;
  postoperationMissionsContent: '123';
  postoperationMissionsType: null;
  preoperativeFastingNote: null;
  preoperativeMissionsType: null;
  specialCasesNote: null;
  specimen: null;
  specimenNote: null;
  strawNumber: null;
  tailFiber: null;
  takeOutIntrauterineDeviceSituation: '{"checkedValues":[6,1,2],"withInputValues":[null,null,null,null,null,null,{"key":6,"value":{"0":"44"}}]}';
  takeOutReason: 1;
  takeOutReasonNote: '44';
  treatmentAndGuidance: '44';
  treatmentAndGuidanceNote: null;
  uterinePosition: null;
  uterineSize: null;
  villus: null;
  villusNote: null;
  latelyAppointmentDateExplain: string;
  appointmentMorningOrAfternoon: string;
  appointmentTime: string;
}
export interface IModel_EarlyPregnancyCheckSurgeryType_OptionalPregnancy {
  age: number;
  deleteFlag: number;
  dob: string;
  fileState: number;
  householdType: string;
  id: number;
  idNO: string;
  idType: number;
  maritalStatus: number;
  name: string;
  outpatientNo: string;
  permanentResidenceAddress: string;
  registerDate: Dayjs;
  registerPerson: string;
  residenceAddress: string;
  telephone: string;
  testingFacility: string;
}
enum Event_EarlyPregnancyCheckSurgeryType {
  APPOINTMENT_CHANGE = 'APPOINTMENT_CHANGE',
}
class MY_ModelService extends ModelService<IModel_EarlyPregnancyCheckSurgeryType> {
  eventTypeStore = Event_EarlyPregnancyCheckSurgeryType;
  // 这个方法触发 APPOINTMENT_CHANGE 事件
  appointmentSurgery(data: Partial<IModel_EarlyPregnancyCheckSurgeryType>) {
    data.appointmentPeople = data.appointmentPeople || SLocal_State.getUserData().login;
    return this._request<IModel_EarlyPregnancyCheckSurgeryType>({
      url: '/api/family/planning/updateAppointmentSurgery',
      method: 'POST',
      data: this.transferSubmitData(data),
    }).then((r) => {
      message.info(r.msg);
      return this.transferSourceData(r.data);
    });
  }
  cancelAppointmentSurgery(id?: number) {
    return this._request<IModel_EarlyPregnancyCheckSurgeryType>({
      url: `/api/family/planning/cancelAppointmentSurgery/${id}`,
      method: 'DELETE',
    }).then((r) => {
      message.info(get(r, 'data.msg'));
    });
  }
  getOptionalPregnancyList(name?: string) {
    return this._request<IModel_EarlyPregnancyCheckSurgeryType_OptionalPregnancy[]>({
      url: '/api/family/planning/getEarlyPregnancyCheckSurgicalTypeCPE',
      method: 'GET',
      params: this.transferParams({
        name,
      }),
    }).then((r) => r.data.map((_) => this.transferSourceData(_)));
  }
  getOptionalDoctorAndNurse() {
    return this._request<{ DOCTOR: string[]; NURSE: string[] }>({
      url: '/api/family/planning/getDoctorAndNurse',
      method: 'GET',
      params: {},
    }).then((r) => r.data);
  }
  getFamilyPlanningDefaultSetting() {
    return this._request<IModel_FamilyPlanningDefaultSetting>({
      url: '/api/family/planning/getFamilyPlanningDefaultSetting',
      method: 'GET',
      params: {},
    }).then((r) => r.data);
  }
  getStatistic(start: Dayjs, end: Dayjs) {
    return this._request<{ appointmentNum: number; completeNum: number; signNum: number; timeout: number }>({
      url: '/api/family/planning/getAppointmentSignCompleteTimeoutNum',
      method: 'GET',
      params: {
        'appointmentDate.greaterOrEqualThan': start.format('YYYY-MM-DD'),
        'appointmentDate.lessOrEqualThan': end.format('YYYY-MM-DD'),
      },
    }).then((r) => r.data);
  }
}



export const SModel_EarlyPregnancyCheckSurgeryType = new MY_ModelService(
  {
    n: 'EarlyPregnancyCheckSurgicalType',
    prePath: '/family/planning',
    addictionalParams: { deleteFlag: 0 }
  }
);
SModel_EarlyPregnancyCheckSurgeryType.DateKeys.push('appointmentDate', 'registrationDate', 'admissionTime');
SModel_EarlyPregnancyCheckSurgeryType.TimeKeys.push('appointmentTimeRangeStart', 'appointmentTimeRangeEnd');
