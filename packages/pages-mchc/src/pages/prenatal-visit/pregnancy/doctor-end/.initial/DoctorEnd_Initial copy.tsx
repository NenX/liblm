// import CheckAndCancelButton from '@/components/GeneralComponents/CheckAndCancelButton'; //一键选择&一键取消
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PrinterOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { Form } from 'antd'
import { CheckAndCancelButton, MyForm, getFormData } from '@lm_fe/components_m';
import { api } from '../.api';
// import { getBMI, getGesWeek, menopauseWeek } from '@/utils/formula';
import { ALLOW_CALC_EDD_BASED_ON_IVF, getBMI, getGesWeek, menopauseWeek } from '@lm_fe/components_m';
import { mchcEnv, mchcEvent, mchcLogger, mchcUtils } from '@lm_fe/env';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, IMchc_Pregnancy, SLocal_Calculator, SMchc_Doctor, TIdType, TIdTypeCompatible } from '@lm_fe/service';
import { event, getSearchParamsValue, safe_json_parse } from '@lm_fe/utils';
import { Button, Modal, Space, Tabs, message } from 'antd';
import { cloneDeep, find, forEach, get, includes, isArray, isEqual, pick, set } from 'lodash';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import JYJC from './components/JianYanJianCha';
import QTBS from './components/QiTaBingshi';
import TGJC from './components/TiGeJianCha';
import YBBS from './components/YiBanBingShi';
import YCQ from './components/YuChanQi';
import YCS from './components/YunChanShi';
import ZDCL from './components/ZhenDuanChuLi';
import ZKJC from './components/ZhuanKeJianCha';
import { emptyData, getEmptyData, getRequiredForm, physicalKeys } from './func';
import './index.less';
import requestMethods, { getTabMethods, updateTabMethods } from './methods/request';
import { filter_diagnoses } from '../.utils';
import { mchcModal__ } from '@lm_fe/pages';
const getDoctorEndId = mchcUtils.getDoctorEndId
const tabContents = [YCQ, YBBS, QTBS, YCS, TGJC, ZKJC, JYJC, ZDCL];
export interface IDoctorEnd_InitialProps {
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo
  changeScreening(b: boolean): void
  changeDiagnosesTemplate(b: boolean): void

  changePreeclampsia(b: boolean): void
  changeSyphilis(b: boolean): void
  changePreventPreeclampsia(b: boolean): void

  setDiagnosesList(l: IMchc_Doctor_Diagnoses[]): void
  updateHeaderInfo(id: TIdType): void
  isShowPreventPreeclampsia: boolean
  diagnosesList: IMchc_Doctor_Diagnoses[]

  formChange(v: boolean): void
  id?: TIdType

  setDiagnosesWord(v: string): void
  saveHeaderInfo(v: IMchc_Doctor_OutpatientHeaderInfo): void
  diagnosesWord: string
  getHighriskDiagnosis(v: TIdTypeCompatible): void


}
const allTabs = tabContents.map((tab, i) => ({
  key: `tab-${i}`,
  title: tab.Title,
  config: tab.Config,
  className: tab.ClassName,
  Content: tab,
  requestFrom: false,
  error: false
}));
function DoctorEnd_Initial(props: IDoctorEnd_InitialProps) {

  const {
    headerInfo,
    formChange,
    id,
    updateHeaderInfo,
    setDiagnosesList,
    setDiagnosesWord,
    diagnosesWord,
    saveHeaderInfo,
    getHighriskDiagnosis,

    changeScreening,
    changeDiagnosesTemplate,
    changePreeclampsia,
    changeSyphilis,
    changePreventPreeclampsia,
    diagnosesList,
    isShowPreventPreeclampsia,

  } = props;

  const $verticalFormHandler = useRef({})
  const [visitData, set_visitData] = useState({})
  const [analysisResult, set_analysisResult] = useState({})
  const [modalTips, set_modalTips] = useState(false)
  const [formHandler, set_formHandler] = useState({
    subscribe(a: string, b: string, c: (v: any) => void) { },
    listenFormData(v: () => any) { },
    submit() {
      return { validCode: null, res: null }
    },
    fieldChange: false

  })
  const [updateGesweekTips, set_updateGesweekTips] = useState({ sureEdd: '' })
  const [zdFormConfig, set_zdFormConfig] = useState([])
  const [syncData, set_syncData] = useState({})
  const [verticalFormHandler, set_verticalFormHandler] = useState({})
  const [newFormData, set_newFormData] = useState({})


  const [step, set_step] = useState(allTabs[0].key)
  const [tabs, set_tabs] = useState(allTabs)
  const [isPost, set_isPost] = useState(false)
  const [updateGesweekModalVisible, set_updateGesweekModalVisible] = useState(false)
  const [vertical, set_vertical] = useState(true)
  const [sureEddModify, set_sureEddModify] = useState(0)
  const [sureUpdateEdd, set_sureUpdateEdd] = useState<string>()
  const forms = useRef(Array(10).fill(0).map(_ => Form.useForm()[0]))

  const [canSave, setCanSave] = useState(false)
  const [serialNo, setSerialNo] = useState<string>('')

  useEffect(() => {

    initTabs().then(() => {

      requestTabFormData('tab-0');

    });
    event.on(CheckAndCancelButton.displayName!, checkCb);

    const rm = mchcEvent.on_rm('my_form', async (e) => {

      if (e.type !== 'onChange') return


      const { name, value, setValue } = e

      if (name === 'conceiveMode(Note)') {

        const checkedValues = value['conceiveMode']
        const withInputValues = safe_json_parse(value['conceiveModeNote'])
        const subValue = withInputValues?.[checkedValues]?.value ?? {}
        const 移植时间 = subValue[0]
        const 天数 = subValue[1] ?? 0
        const 胚胎数 = subValue[2] ?? 0
        const isIVF = checkedValues === 1
        if (isIVF && 移植时间) {
          const value = await SLocal_Calculator.calcEddBasedOnIVF(移植时间, 天数)
          mchcModal__.confirmOnce({
            title: '根据胚胎移植时间，是否调整预产期B超时间？',
            storeKey: ALLOW_CALC_EDD_BASED_ON_IVF,
            cb: () => setValue?.('sureEdd', value)
          })
        }

      }
    })
    return () => {
      event.off(CheckAndCancelButton.displayName!, checkCb);
      rm()
    }
  }, [])

  useEffect(() => {

    const pregnancyId = getDoctorEndId(props);

    if (formHandler && formHandler.listenFormData) {
      formHandler.listenFormData(() => handleFormChange(true));
    }

    if (formHandler.subscribe) {
      formHandler.subscribe('lmp', 'change', async (val: any) => {
        if (!val) return;
        const { res } = await formHandler.submit();
        const conceiveMode = res?.['conceiveMode(Note)']?.value?.conceiveMode

        const edd = await api.initial.calcEddByLmp(val);

        // （1）预产期始终跟着末次月经变
        // （2）孕周始终跟着B超预产期变
        // （3）B超预产期未手动修改保存过时，B超预产期跟随末次月经变
        // （4）B超预产期手动修改保存过时，B超预产期不再变化除非再次手动修改保存
        if (get(getTabData('tab-0'), 'sureEddModify') == 1) {
          formHandler.edd.actions.setValue(edd);
        } else {
          formHandler.edd.actions.setValue(edd);
          conceiveMode !== 1 && formHandler.sureEdd.actions.setValue(edd);
        }
        const ntUltrasounds = cloneDeep(formHandler.ntExams.actions.getValue().value);
        const nfUltrasounds = cloneDeep(formHandler.nfExams.actions.getValue().value);
        forEach(ntUltrasounds, (item) => {
          if (item.checkdate) {
            item.menopause = menopauseWeek(item.checkdate, val);
          } else {
            item.menopause = '';
          }
        });
        forEach(nfUltrasounds, (item) => {
          if (item.checkdate) {
            item.menopause = menopauseWeek(item.checkdate, val);
          } else {
            item.menopause = '';
          }
        });
        formHandler.ntExams.actions.setValue(ntUltrasounds);
        formHandler.nfExams.actions.setValue(nfUltrasounds);
        if (get(getTabData('tab-0'), 'sureEddModify') == 0) {
          const data = await api.initial.updateGesweekAlert(pregnancyId, edd);
          if (get(data, 'remind')) {

            set_updateGesweekTips({ ...data, sureEdd: edd })
            set_updateGesweekModalVisible(true)
          }
        }
      });

      formHandler.subscribe('sureEdd', 'change', async (val: any) => {
        if (!val) return;
        if (!dayjs(val).isSame(get(getTabData('tab-0'), 'sureEdd'))) {

          set_sureEddModify(1)
        }
        const data = await api.initial.updateGesweekAlert(pregnancyId, val);
        if (get(data, 'remind')) {

          set_updateGesweekTips({ ...data, sureEdd: val })
          set_updateGesweekModalVisible(true)
        }
      });

      formHandler.subscribe('ntExams', 'change', (val: any) => {
        const newVal = cloneDeep(val);
        // const sureEdd = formHandler.sureEdd.actions.getValue().value || formHandler.edd.actions.getValue().value;
        const lmp = formHandler.lmp.actions.getValue().value;
        forEach(newVal, (item, index) => {
          if (item.checkdate && lmp && !isEqual(item.checkdate, get(item, `oldCheckDate`))) {
            item.menopause = menopauseWeek(item.checkdate, lmp);
          }
        });
        formHandler.ntExams.actions.setValue(newVal);
      });

      formHandler.subscribe('nfExams', 'change', (val: any) => {
        const newVal = cloneDeep(val);
        // const sureEdd = formHandler.sureEdd.actions.getValue().value || formHandler.edd.actions.getValue().value;
        const lmp = formHandler.lmp.actions.getValue().value;
        forEach(newVal, (item) => {
          if (item.checkdate && lmp && !isEqual(item.checkdate, get(item, `oldCheckDate`))) {
            item.menopause = menopauseWeek(item.checkdate, lmp);
          }
        });
        formHandler.nfExams.actions.setValue(newVal);
      });

      formHandler.subscribe('physicalBaseExam.preheight', 'change', (val: any) => {
        const preweight = formHandler['physicalBaseExam.preweight'].actions.getValue().value;
        formHandler['physicalBaseExam.bmi'].actions.setValue(getBMI(preweight, val));
      });

      formHandler.subscribe('physicalBaseExam.preweight', 'change', (val: any) => {
        const preheight = formHandler['physicalBaseExam.preheight'].actions.getValue().value;
        formHandler['physicalBaseExam.bmi'].actions.setValue(getBMI(val, preheight));
      });

      formHandler.subscribe('syncBtn', 'click', async (val: any) => {
        const syncData = await api.further.syncPatientReport(pregnancyId);
        await requestTabFormData('tab-6', true);
        message.info('同步数据成功！');
        formHandler['syncDate'].actions.setValue(get(syncData, 'syncDate'));
      });

      formHandler.subscribe('normalBtn', 'click', (val: any) => {
        if (val === '全部正常') {
          forEach(physicalKeys, (item) => {
            formHandler[`physicalgeneralExam.${item}(Note)`]?.actions.setValue({ [item]: 1, [`${item}Note`]: '' });
          });
        } else {
          forEach(physicalKeys, (item) => {
            formHandler[`physicalgeneralExam.${item}(Note)`]?.actions.setValue({ [item]: null, [`${item}Note`]: '' });
          });
        }
      });

    }
  }, [formHandler])

  const handleFormChange = (bool: boolean) => {
    set_modalTips(!bool) //如果有改变的话 重新显示弹窗
    formChange(bool);
  };
  const checkCb = (name: string, flag: boolean) => {
    const moduleName = name;
    const allKeys = Object.keys(formHandler);
    const targetKeys = allKeys
      .filter((k) => k.startsWith(moduleName) && k.endsWith('(Note)'))
      .map((k) => k.split('.')[1].replace(/\(.*\)/g, ''));

    targetKeys.forEach((k) => {
      formHandler[`${moduleName}.${k}(Note)`].actions.setValue(
        { [k]: flag ? false : undefined, [`${k}Note`]: undefined },
        // { key: flag ? false : undefined, keyNote: undefined }
      );
    });
  };


  async function initTabs(tab = 'tab-0') {
    const cloneTabs = cloneDeep(tabs) as any[];
    const obj = find(cloneTabs, (item: any) => item.key == tab);
    if (get(obj, `requestFrom`)) {
      return false;
    }
    const res = await api.initial.getFormConfigByTab(tab);
    if (tab == 'tab-7') {
      getRequiredForm('tab-7', res.fields);
      set_zdFormConfig(res.fields)
    }
    const ind = parseInt(tab.slice(4)) || 0;
    cloneTabs[ind].config = cloneTabs[ind].config || res.fields;
    cloneTabs[ind].requestFrom = true;
    getRequiredForm('tab-0', cloneTabs[ind].config);
    // https://www.tapd.cn/47222039/bugtrace/bugs/view?bug_id=1147222039001002280


    set_tabs(cloneTabs)
  }

  /**点击每一个tab查询该form的数据 */
  async function requestTabFormData(tab: string, refresh = false) {
    const pregnancyId = getDoctorEndId(props);
    const oldData = get(newFormData, `${tab}`);
    if (oldData && !refresh && tab != 'tab-7') return false; // 有数据不再请求
    let res = await requestMethods[getTabMethods[tab]](pregnancyId);

    if (res.serialNo) {
      setSerialNo(res.serialNo)
    }

    if (tab == 'tab-0') {
      if (mchcEnv.in(['广三', '建瓯'])) {
        set_sureEddModify(get(res, 'sureEddModify') ? get(res, 'sureEddModify') : 0)
      }
      reduceTab0(res);



      if (mchcEnv.is('越秀妇幼') && res.visitId) {
        SMchc_Doctor.getVisitEmrEditable(res.visitId)
          .then(setCanSave)
          .catch(() => setCanSave(true))
      } else {
        setCanSave(true)
      }

    }



    set_newFormData({ ...newFormData, [tab]: res })
    if (tab == 'tab-7') {
      const d = res.diagnoses as IMchc_Doctor_Diagnoses[]
      const _diagnoses = filter_diagnoses(d)
      // console.log('setDiagnosesList', _diagnoses)
      setDiagnosesList(_diagnoses);
      // const bool = get(res, `isOpenVTETable`);
      // if (bool) props.changeScreening(true);
    }
    if (tab == 'tab-0') {

      let ntExams = res.ntExams;
      if (ntExams && ntExams.length > 0) {
        setTimeout(() => {
          checkNtExamNeedCorrect(ntExams[0]);

        }, 300)
      }
    }
  }

  function reduceTab0(res: any) {
    if (!mchcEnv.is('越秀妇幼')) return
    const newNtVal = cloneDeep(get(res, 'ntExams'));
    const newNfVal = cloneDeep(get(res, 'nfExams'));
    const sureEdd = get(res, 'sureEdd');
    forEach(newNtVal, (item, index) => {
      if (item.checkdate && sureEdd) {
        item.menopause = getGesWeek(sureEdd, item.checkdate);
      }
    });
    forEach(newNfVal, (item) => {
      if (item.checkdate && sureEdd) {
        item.menopause = getGesWeek(sureEdd, item.checkdate);
      }
    });
    set(res, 'ntExams', newNtVal);
    set(res, 'nfExams', newNfVal);
  }



  async function handleSubmit(key: string, jump: boolean) {
    // mchcLogger.log('handleSubmit', { key, jump })

    const tab = tabs.filter((item: any) => item.key === step)[0];
    const next = key || tabs[tabs.indexOf(tab) + 1].key;

    const idx = Number(tab.key.slice(-1))
    let validCode, __res, fieldChange, postData

    if (tab.Content.tmp) {

      try {
        const form = forms.current[idx]
        // console.log('gg', '111')

        if (form) {
          fieldChange = form.isFieldsTouched()
          const a = await form.validateFields()
          // console.log('gg', { fieldChange, a })

          postData = form.getFieldsValue()
          validCode = true
        }
      } catch (e) {

      }
    } else {
      // console.log('gg', '222')

      const _data = await formHandler.submit();
      validCode = _data.validCode
      __res = _data.res
      fieldChange = formHandler.fieldChange

      // mchcLogger.log('formHandler', 'submit', { _data })

    }
    tab.error = !validCode;
    if (validCode) {

      if ((step == key && jump) || step == 'tab-7') {

      } else {
        if (__res) {
          delete __res['fmh'];
          postData = getFormData(__res, true);
          // mchcLogger.log('getFormData', { postData, __res });

        }
        if (fieldChange) await __handleSave({ ...get(newFormData, `${step}`), ...postData, sureEddModify: sureEddModify },);

      }







      await initTabs(next);
      await requestTabFormData(next);
      if (jump) {
        set_step(next)
      }
    } else {
      message.destroy();
      message.error('请完善表单项！!');
      set_tabs(tabs)
    }
  }
  async function __handleSave(postData: any) {

    mchcLogger.log('__handleSave', postData)
    const cloneStep = step;


    if (cloneStep == 'tab-0' && !modalTips) {
      let ntExams = get(postData, 'ntExams', []);
      if (ntExams && ntExams.length > 0) {
        let hasCheck: Boolean = await checkNtExamNeedCorrect(ntExams[0]);
        if (hasCheck) {
          return;
        }
      }
    }
    await requestMethods[updateTabMethods[step]](postData).then(async (data) => {
      if (data) {
        const res = cloneDeep(data);

        set_newFormData({ ...newFormData, [cloneStep]: res })
        const arr = ['tab-0', 'tab-3', 'tab-4'];
        if (includes(arr, step)) {
          const id = getDoctorEndId(props);
          // updateHeaderInfo(id);
          mchcEvent.emit('outpatient', {
            type: '刷新头部',
            pregnancyId: id
          })
        }
        // await initTabs();
        // requestTabFormData('tab-0', true);
        message.success('信息保存成功');
      }
    });
    formChange(false);
  };

  /**根据tab获取当前的form 数据 */
  function getTabData(tab: string) {

    const oldValue = newFormData[tab] ?? {};

    if (tab === 'tab-3') {
      oldValue.pregnancymh?.sort((a: any, b: any) => a.gravidityindex - b.gravidityindex);
    }
    return oldValue;
  }

  function getIcon(key: string, error: any) {

    /*必填项校验*/
    if (headerInfo || visitData) {
      getEmptyData(headerInfo, visitData);
    }
    if (error) return <ExclamationCircleOutlined />;
    if (emptyData[key].length === 1) return <CheckCircleOutlined />;
    return null;
  };

  function handlePrint(resource = 'prenatalVisit', id?: TIdTypeCompatible) {


    const visitId = id || get(headerInfo, 'id');

    mchcModal__.open('print_modal', {
      modal_data: {
        requestData: {
          url: '/api/pdf-preview',
          resource: resource || 'prenatalVisit',
          template: '',
          version: '',
          note: '',
          id: visitId,
        }
      }
    })
  }

  function renderPrint() {

    return null;
  };

  async function handleUpdateGesweek() {
    const pregnancyId = getDoctorEndId(props);
    await api.initial.updateGesweekBysureEdd({ pregnancyId, sureEdd: get(updateGesweekTips, 'sureEdd') });
    set_updateGesweekModalVisible(false)
    set_sureUpdateEdd(get(updateGesweekTips, 'sureEdd'))
  };
  function cancelGesweekTips() {
    set_updateGesweekModalVisible(false)
    if (get(newFormData, 'tab-0')) {
      if (sureUpdateEdd) {
        formHandler.sureEdd.actions.setValue(sureUpdateEdd);
      } else {
        formHandler.sureEdd.actions.setValue(get(newFormData, 'tab-0.sureEdd'));
      }
    }
  };
  function renderUpdateGesweekTips() {
    return (
      <Modal visible={updateGesweekModalVisible} onOk={handleUpdateGesweek} onCancel={cancelGesweekTips}>
        <p>
          <ExclamationCircleOutlined />
          <span> 请注意：</span>
        </p>
        <p>{get(updateGesweekTips, 'remind')}</p>
      </Modal>
    );
  };
  function setverticalFormHandler(key, formHandler) {
    $verticalFormHandler.current = {
      ...$verticalFormHandler.current,
      [key]: formHandler,
    };
  }
  function updataFormData(res: any) {
    set_newFormData({ ...newFormData, 'tab-7': res })
  }

  function checkNtExamNeedCorrect(ntExam: object) {
    mchcLogger.log('checkNtExamNeedCorrect')
    let ntgestationalWeek: string = get(ntExam, 'gestationalWeek', '');
    let ntcheckdate = get(ntExam, 'checkdate');
    if (!ntgestationalWeek && !ntcheckdate) {
      return false;
    }
    let week: number = Number(ntgestationalWeek.split('+')[0]);
    let day: number = Number(ntgestationalWeek.split('+')[1]) || 0;
    let gestationalWeekDay: number = week * 7 + day;
    let ntEdd = dayjs(ntcheckdate).add(280 - gestationalWeekDay, 'days');
    let sureEdd = dayjs(headerInfo.edd);
    let diffDay = Math.abs(ntEdd.diff(sureEdd, 'days'));
    if (diffDay > 7) {
      Modal.confirm({
        width: '700px',
        title: '预产期-B超纠正提醒',
        content: (
          <>
            <div>
              根据NT检查如孕周数，推测预产期-B超：{ntEdd.format('YYYY-MM-DD')}(原预产期为{sureEdd.format('YYYY-MM-DD')}
              )，
            </div>
            <div>是否需要纠正预产期-B超及当前孕周,</div>
          </>
        ),
        onOk: async () => {
          const { res } = await formHandler.submit();
          let FormData = getFormData(res, true);
          let step = 'tab-0';
          let postData = { id: get(newFormData, `${step}.id`), ...FormData, sureEdd: ntEdd.format('YYYY-MM-DD') };
          let finalRes = await requestMethods[updateTabMethods[step]](postData)
          set_newFormData({ ...newFormData, [step]: finalRes })
          const id = getDoctorEndId(props);
          mchcEvent.emit('outpatient', {
            type: '刷新头部',
            pregnancyId: id
          })
          set_modalTips(false)
        },
        okText: '确认纠正',
        cancelText: '关闭',
      });
      set_modalTips(true)
      return true;
    } else {
      return false;
    }
  };
  const saveBtnTxt = canSave ? `保存` : '无权限保存'

  return (
    <div className="prenatal-visit-main_initial">
      <Tabs
        type="card"
        activeKey={step}
        className="prenatal-visit-main_initial-tabs"
        onChange={(key) => handleSubmit(key, true)}
      >
        {tabs.map(({ key, title, error, config, Content, className }: any, idx) => {
          const isFunc = Content.tmp

          const optionNode = <Space className="prenatal-visit-main_initial-btns">
            <Button size="large" onClick={handlePrint.bind(this, 'prenatalVisit', undefined)}>
              <PrinterOutlined /> 打印档案.
            </Button>
            <Button size="large" type="primary" disabled={!canSave} onClick={() => handleSubmit(key, false)}>
              <SaveOutlined /> {saveBtnTxt}
            </Button>
            {step != 'tab-7' && (
              <Button size="large" type="primary" onClick={() => handleSubmit('', true)}>
                <ArrowRightOutlined /> 下一页
              </Button>
            )}
          </Space>

          const node = step === key && step !== 'tab-7' ? (
            <MyForm
              disabled_all={!canSave}
              config={config ?? []}
              value={getTabData(step)}
              getFormHandler={(f: any) => {
                set_formHandler(f)
              }}
              submitChange={false}
            />
          ) : step == 'tab-7' ? (
            <ZDCL
              canSave={canSave}
              serialNo={serialNo}

              visitData={getTabData(step)}
              handleSave={updataFormData}
              handlePrint={handlePrint}
              zdFormConfig={zdFormConfig}
              changeScreening={changeScreening}
              changeDiagnosesTemplate={changeDiagnosesTemplate}
              changePreeclampsia={changePreeclampsia}
              changeSyphilis={changeSyphilis}
              changePreventPreeclampsia={changePreventPreeclampsia}
              diagnosesList={diagnosesList}
              noShowBtn={false}
              isShowPreventPreeclampsia={isShowPreventPreeclampsia}
              headerInfo={headerInfo}
              setDiagnosesList={setDiagnosesList}
              setDiagnosesWord={setDiagnosesWord}
              getHighriskDiagnosis={getHighriskDiagnosis}
              diagnosesWord={diagnosesWord}
              saveHeaderInfo={saveHeaderInfo}
              getFormHandler={(f: any) => {
                set_formHandler(f)
              }}
            />
          ) : null
          return (
            <Tabs.TabPane
              key={key}
              tab={
                <span style={error ? { color: '#ff0000' } : {}}>
                  {getIcon(key, error)}
                  {title}
                </span>
              }
            >
              <div className={className}>

                {isFunc ? <Content data={getTabData(step)} form={forms.current[idx]} /> : node}
                {step == 'tab-7' ? null : optionNode}
              </div>
            </Tabs.TabPane>
          );
        })}
      </Tabs>
      {renderUpdateGesweekTips()}
      {renderPrint()}
    </div>
  );
}
export default DoctorEnd_Initial
