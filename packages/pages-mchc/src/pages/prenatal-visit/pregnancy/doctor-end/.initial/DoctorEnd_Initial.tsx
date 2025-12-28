// import CheckAndCancelButton from '@/components/GeneralComponents/CheckAndCancelButton'; //一键选择&一键取消
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PrinterOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { CheckAndCancelButton, MyForm, MyLazyComponent, getFormData } from '@lm_fe/components_m';
import { Form, FormInstance } from 'antd';
import { api } from '../.api';
// import { getBMI, getGesWeek, menopauseWeek } from '@/utils/formula';
import { ALLOW_CALC_EDD_BASED_ON_IVF, getBMI, getGesWeek, menopauseWeek } from '@lm_fe/components_m';
import { mchcEnv, mchcEvent, mchcLogger, mchcUtils } from '@lm_fe/env';
import { mchcModal__ } from '@lm_fe/pages';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_FirstVisitDiagnosisOutpatient, IMchc_Doctor_OutpatientHeaderInfo, SLocal_Calculator, SMchc_Doctor, TIdType, TIdTypeCompatible } from '@lm_fe/service';
import { event, safe_json_parse } from '@lm_fe/utils';
import { Button, Modal, Space, Tabs, message } from 'antd';
import { cloneDeep, find, forEach, get, isEqual, set } from 'lodash';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { filter_diagnoses } from '../.utils';
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
const getDoctorEndId = mchcUtils.getDoctorEndId
const tabContents = [YCQ, YBBS, QTBS, YCS, TGJC, ZKJC, JYJC, ZDCL];
export interface IDoctorEnd_InitialProps {
  diagnosis_addon_btns?: (data?: IMchc_Doctor_FirstVisitDiagnosisOutpatient) => React.ReactNode
  diagnosis_before_submit?: (submit: (values: any) => Promise<void>, data?: IMchc_Doctor_FirstVisitDiagnosisOutpatient, form?: FormInstance, sync?: Boolean) => Promise<void>

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
  const pregnancyId = getDoctorEndId(props);

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
  const [newFormData, set_newFormData] = useState({})


  const [cur_step, set_cur_step] = useState(allTabs[0].key)
  const [tabs, set_tabs] = useState(allTabs)
  const [updateGesweekModalVisible, set_updateGesweekModalVisible] = useState(false)
  const [vertical, set_vertical] = useState(true)
  const [sureEddModify, set_sureEddModify] = useState(0)
  const [sureUpdateEdd, set_sureUpdateEdd] = useState<string>()
  const forms = useRef(Array(10).fill(0).map(_ => Form.useForm()[0]))

  const [canSave, setCanSave] = useState(false)
  const [serialNo, setSerialNo] = useState<string>('')

  useEffect(() => {
    if (id) {
      initTabs().then(() => {

        requestTabFormData('tab-0');

      });
    }
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
  }, [id])

  useEffect(() => {


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
  async function requestTabFormData(tab: string,) {

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
          checkNtExamNeedCorrect(res, ntExams[0]);
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

  function cal_next_tab(key: string,) {
    const idx = tabs.findIndex((item) => item.key === key);
    if (idx === -1 || idx === tabs.length) return
    return tabs[idx + 1]
  }
  function cal_next_step(key: string,) {
    return cal_next_tab(key)?.key
  }

  async function handleSubmit(key: string,) {
    if (cur_step == 'tab-7') return
    const tab = tabs.filter((item: any) => item.key === cur_step)[0];

    const idx = Number(tab.key.slice(-1))

    if (tab.Content.tmp) {

      try {
        const form = forms.current[idx]
        // console.log('gg', '111')

        if (form) {
          const a = await form.validateFields()
          // console.log('gg', { fieldChange, a })

          form.submit()

          // updateHeaderInfo(id);

        }
      } catch (e) {
        message.destroy();
        message.error('请完善表单项！!');
      }
      return
    } else {


      const _data = await formHandler.submit();
      let validCode = _data.validCode
      let __res = _data.res

      tab.error = !validCode;
      if (validCode) {

        if (__res) {
          delete __res['fmh'];
          let postData = getFormData(__res, true);
          // mchcLogger.log('getFormData', { postData, __res });
          await __handleSave({ ...get(newFormData, `${cur_step}`), ...postData, sureEddModify: sureEddModify },);

        }


      } else {
        message.destroy();
        message.error('请完善表单项！!');
        set_tabs(tabs)
      }

    }

  }
  async function __handleSave(postData: any) {

    mchcLogger.log('__handleSave', postData)
    const cloneStep = cur_step;


    if (cloneStep == 'tab-0' && !modalTips) {
      let ntExams = get(postData, 'ntExams', []);
      if (ntExams && ntExams.length > 0) {
        let hasCheck: Boolean = await checkNtExamNeedCorrect(postData, ntExams[0]);
        if (hasCheck) {
          return;
        }
      }
    }
    await requestMethods[updateTabMethods[cur_step]](postData).then(async (data) => {
      if (data) {
        const res = cloneDeep(data);

        set_newFormData({ ...newFormData, [cloneStep]: res })

        mchcEvent.emit('outpatient', {
          type: '刷新头部',
          pregnancyId: pregnancyId
        })
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


  async function handleUpdateGesweek() {

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

  function checkNtExamNeedCorrect(formData: object, ntExam: object) {
    // 进来的弹窗 newFormData对象竟然是空的 神奇的bug 因此改成传formdata进来操作
    // if (mchcEnv.is_primary) return
    let ntgestationalWeek: string = get(ntExam, 'gestationalWeek') || '';
    let ntcheckdate = get(ntExam, 'checkdate');
    if (!ntgestationalWeek) {
      return false
    }
    if (!ntcheckdate) {
      return false
    }
    // if (!ntgestationalWeek && !ntcheckdate) {
    //   return false;
    // }
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
          // const { res } = await formHandler.submit();
          // let FormData = getFormData(res, true);
          let step = 'tab-0';
          // mchcLogger.log('FormData', FormData, res)
          // let postData = { id: get(newFormData, `${step}.id`), ...FormData, sureEdd: ntEdd.format('YYYY-MM-DD') };
          let postData = { ...formData, sureEdd: ntEdd.format('YYYY-MM-DD') };
          let finalRes = await requestMethods[updateTabMethods[step]](postData)
          message.success('修改成功')
          set_newFormData({ ...newFormData, [step]: finalRes })

          mchcEvent.emit('outpatient', {
            type: '刷新头部',
            pregnancyId: pregnancyId
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
        activeKey={cur_step}
        className="prenatal-visit-main_initial-tabs"
        onChange={(_next) => {
          // handleSubmit(key, true)
          set_cur_step(_next)
          initTabs(_next)
          requestTabFormData(_next);
        }}
      >
        {tabs.map(({ key, title, error, config, Content, className }: any, idx) => {
          const isFunc = Content.tmp

          const optionNode = <Space className="prenatal-visit-main_initial-btns">
            <Button size="large" onClick={() => handlePrint('prenatalVisit', undefined)}>
              <PrinterOutlined /> 打印档案
            </Button>
            <Button size="large" type="primary" disabled={!canSave} onClick={() => handleSubmit(key)}>
              <SaveOutlined /> {saveBtnTxt}
            </Button>
            {cur_step != 'tab-7' && (
              <Button size="large" type="primary" onClick={() => {
                // handleSubmit('', true)
                const _next = cal_next_step(cur_step)
                if (_next) {
                  set_cur_step(_next)
                  initTabs(_next)
                  requestTabFormData(_next);

                }
              }}>
                <ArrowRightOutlined /> 下一页
              </Button>
            )}
          </Space>

          const node = cur_step === key && cur_step !== 'tab-7' ? (
            <MyForm
              disabled_all={!canSave}
              config={config ?? []}
              value={getTabData(cur_step)}
              getFormHandler={(f: any) => {
                set_formHandler(f)
              }}
              submitChange={false}
            />
          ) : cur_step == 'tab-7' ? (
            <ZDCL
              diagnosis_before_submit={props.diagnosis_before_submit}
              diagnosis_addon_btns={props.diagnosis_addon_btns}
              canSave={canSave}
              serialNo={serialNo}
              active={key === cur_step}
              form={forms.current[idx]}
              handlePrint={handlePrint}
              changeScreening={changeScreening}
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

                <MyLazyComponent size='middle'>
                  {isFunc ? <Content active={key === cur_step} form={forms.current[idx]} /> : node}
                  {cur_step == 'tab-7' ? null : optionNode}
                </MyLazyComponent>
              </div>
            </Tabs.TabPane>
          );
        })}
      </Tabs>
      {renderUpdateGesweekTips()}
    </div>
  );
}
export default DoctorEnd_Initial
