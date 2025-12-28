import { SettingOutlined } from '@ant-design/icons';
import { CustomIcon, GestationalWeekProjectTree, MyLazyComponent } from '@lm_fe/components_m';
import { mchcConfig, mchcEnv, mchcUtils } from '@lm_fe/env';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, IMchc_Doctor_RvisitInfoOfOutpatient, TIdTypeCompatible } from '@lm_fe/service';
import { request } from '@lm_fe/utils';
import { Button, Collapse, Timeline } from 'antd';
import classnames from 'classnames';
import { get, isEmpty, join, map, size, slice } from 'lodash';
import React, { useEffect, useState } from 'react';
import Diagnoses from '../../../.components/Diagnoses';
import DiagTable from './diag-table';
import './index.less';
import ManagementPlan from './management-plan';
import PrenatalTree from './prenatal-tree';
import SurveyList from './survey-list';

interface IProps {
  visitsData?: IMchc_Doctor_RvisitInfoOfOutpatient
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo
  id: TIdTypeCompatible

  changeScreening(b: boolean): void
  changeSyphilis(b: boolean): void

  diagnosesList: IMchc_Doctor_Diagnoses[]
  furtherRefresh(): void
  diagnosesWord: string
  getHighriskDiagnosis(id: TIdTypeCompatible): void
  serialNo: string

  saveHeaderInfo(h: IMchc_Doctor_OutpatientHeaderInfo): void,
  setDiagnosesList(list: any[]): void,
  setDiagnosesWord(t: string): void,

}
export default function FurtherSidebar(props: IProps) {


  const {
    headerInfo,
    id,
    visitsData,

    changeScreening,
    changeSyphilis,
    diagnosesList,
    furtherRefresh,
    diagnosesWord,
    getHighriskDiagnosis,
    saveHeaderInfo,
    setDiagnosesList,
    setDiagnosesWord,
    serialNo,
  } = props;

  if (mchcConfig.get('医生端_复诊左侧隐藏'))
    return null

  const [isShowHisModal, set_isShowHisModal] = useState(false)
  const [isShowListModal, set_isShowListModal] = useState(false)
  const [isShowManageModal, set_isShowManageModal] = useState(false)
  const [sidebarTab, set_sidebarTab] = useState(1)
  const [prenatalTreeData, set_prenatalTreeData] = useState(null)
  const [templateData, set_templateData] = useState<{
    adviseTemplate: any[]
    doctorTemplate: any[]
    personalTemplate: any[]
  } | null>(null)

  const [lackReports, set_lackReports] = useState('')
  const [recentPlanData, set_recentPlanData] = useState<{
    gestationalWeek: any
    remind: any
  }[]>([])
  const [collapseActiveKey, set_collapseActiveKey] = useState(['1', '2', '4'])

  useEffect(() => {

    getLackReports();
    getPlanData();
    return () => {

    }
  }, [])





  async function changeState(value: any) {
    await initTemplateData();
    set_sidebarTab(value)
  }



  async function getPlanData(visitsData = props.visitsData) {
    const planData = get(visitsData, `visitPlans`, []);

    set_recentPlanData(slice(planData, 0, 2))
  };

  async function getLackReports(visitsData = props.visitsData) {
    const lackReports = get(visitsData, `lackReports`, []);

    set_lackReports(join(lackReports || [], '，'))
  };

  function closeModal(type: 'isShowHisModal' | 'isShowManageModal') {

    if (type === 'isShowHisModal') {
      set_isShowHisModal(false)
    }
    if (type === 'isShowManageModal') {
      set_isShowManageModal(false)
    }
  };

  function handleBtnClick(e: any, type: string) {
    e.stopPropagation();
    switch (type) {
      case 'hisBtn':
        set_isShowHisModal(true)
        break;


        break;
      case 'manageBtn':
        set_isShowManageModal(true)

        break;
      default:
        break;
    }
  };
  function getId() {
    return get(headerInfo, 'id') || id;
  }

  function renderSiderBar() {

    return (
      <div className="sider-container">
        <div className="main-content">
          {sidebarTab == 1 && (
            <div className="prenatal-visit-main_return-sidebar">
              <Collapse defaultActiveKey={collapseActiveKey}>
                <Collapse.Panel
                  header={
                    <span style={{ marginLeft: '10px' }}>
                      诊断
                      {/* <span onClick={(e) => handleBtnClick(e, 'hisBtn')} >
                        <ProjectOutlined className="header-icon" />
                        历史
                      </span> */}
                    </span>
                  }
                  key="1"
                  id="further-diagnosis"
                >
                  <Diagnoses
                    serialNo={serialNo}
                    diagnosesWord={diagnosesWord}
                    getHighriskDiagnosis={getHighriskDiagnosis}
                    changeScreening={changeScreening}
                    changeSyphilis={changeSyphilis}
                    saveHeaderInfo={saveHeaderInfo}
                    setDiagnosesList={setDiagnosesList}
                    setDiagnosesWord={setDiagnosesWord}
                    headerInfo={headerInfo}
                    diagnosesList={diagnosesList}
                    isShowDiagnosesTemplate={false}
                    noshowlist={false}
                    isShowDiagnosesTemplatets={false}
                    isAllPregnancies={false}

                    getDiagnosesList={() => { }}

                    page="return"
                  />
                </Collapse.Panel>

                <Collapse.Panel
                  header={
                    <span style={{ marginLeft: '10px' }}>
                      {!!lackReports ? '缺少检验报告' : '必查检验检查'}
                      <Button
                        className="header-btn"
                        icon={<CustomIcon type={'icon-batch'} />}
                        onClick={(e) => {
                          set_isShowListModal(true)

                          // mchcModal__.open('bf_form', {
                          //   modal_data: {
                          //     title: '必查清单-检验检查',
                          //     history_args: { relationId: getSearchParamsValue('id')! }
                          //   }
                          // })
                        }}
                      >
                        必查清单
                      </Button>
                    </span>
                  }
                  key="2"
                  id="further-check-item"
                >
                  <GestationalWeekProjectTree pregnancyId={mchcUtils.getDoctorEndId()} />
                </Collapse.Panel>

                {/* <Collapse.Panel header="产前筛查与诊断" key="3">
        </Collapse.Panel> */}

                {
                  mchcEnv.is('广三') || <Collapse.Panel
                    header={
                      <span style={{ marginLeft: '10px' }}>
                        产检计划
                        <Button
                          className="header-btn"
                          icon={<SettingOutlined />}
                          onClick={(e) => handleBtnClick(e, 'manageBtn')}
                        >
                          产检管理
                        </Button>
                      </span>
                    }
                    key="4"
                  >
                    {size(recentPlanData) > 0 ? (
                      <Timeline className="plan-timeline" mode="left">
                        {map(recentPlanData, (item) => (
                          <Timeline.Item>
                            <div>{item.gestationalWeek}孕周</div>
                            <div>{item.remind}</div>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    ) : (
                      '暂无产检计划~'
                    )}
                  </Collapse.Panel>
                }
              </Collapse>
            </div>
          )}
          {sidebarTab == 2 && (
            <div className="prenatal-tree-content">
              <PrenatalTree id={getId()} treeData={prenatalTreeData}></PrenatalTree>
            </div>
          )}
          {/* {sidebarTab == 3 && (
            <div className="prenatal-tree-content">
              <Template templateData={templateData} />
            </div>
          )} */}
        </div>
        <div className="tab-content">
          <div
            className={classnames('tab-item', { active: sidebarTab == 1 })}
            onClick={handleTabClick.bind(this, 1)}
          >
            诊断
          </div>
          <div
            className={classnames('tab-item', { active: sidebarTab == 2 })}
            onClick={handleTabClick.bind(this, 2)}
          >
            产检树
          </div>
          {/* <div
            className={classnames('tab-item', { active: sidebarTab == 3 })}
            onClick={handleTabClick.bind(this, 3)}
          >
            模板
          </div> */}
        </div>
      </div>
    )
  };
  function handleTabClick(value: any) {
    if (value == 2) {
      initTreeData();
    }
    if (value == 3) {
      initTemplateData();
    }
    set_sidebarTab(value)
  }

  async function initTreeData() {
    if (prenatalTreeData) return;
    let data: any = (await request.get('/api/doctor/getExamTree?id=' + getId())).data;
    data = data.sort((a: any, b: any) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0)
    set_prenatalTreeData(data)

  }
  function transferTemplateData(data: any, pid = 0) {
    const treeData: any = [];
    map(data, (item: any) => {
      if (item.pid === pid) {
        item.title = item.val;
        item.key = String(item.id);
        item.children = transferTemplateData(data, item.id);
        if (isEmpty(item.children)) {
          item.isLeaf = true;
        } else {
          item.isLeaf = false;
        }
        treeData.push(item);
      }
    });
    return treeData;
  };

  async function initTemplateData() {
    if (templateData) return;
    let res, res2, res3;
    if (size(get(templateData, `doctorTemplate`, [])) == 0)
      //医生模板
      res = (await request.get(`/api/template-trees?type.equals=6&depid.equals=2&page=0&size=500`)).data;
    if (size(get(templateData, `personalTemplate`, [])) == 0)
      //个人模板
      res2 = (await request.get(
        `/api/template-trees?type.equals=7&userid.equals=${get(props, `basicInfo.id`)}&page=0&size=500`,
      )).data;
    if (size(get(templateData, `adviseTemplate`, [])) == 0)
      //建议模板
      res3 = (await request.get(
        `/api/template-trees?type.equals=10&depid.equals=2&pregnancyid.equals=${getId()}&page=0&size=500`,
      )).data;




    set_templateData(
      {
        adviseTemplate: transferTemplateData(res3),
        doctorTemplate: transferTemplateData(res),
        personalTemplate: transferTemplateData(res2),
      }
    )
  }


  return (
    <div style={{ width: 280, height: '100%', padding: 4, marginRight: 8, background: '#fff', }}>

      <MyLazyComponent size='middle'>
        {renderSiderBar()}
        {isShowHisModal && <DiagTable


          isShowHisModal={isShowHisModal}
          closeModal={closeModal}
          visitsData={visitsData}
          headerInfo={headerInfo}

        />}
        {isShowListModal && (
          <SurveyList
            headerInfo={headerInfo}
            isAllPregnancies={false}
            furtherRefresh={furtherRefresh}
            isShowListModal={true}
            closeModal={() => {
              set_isShowListModal(false)
            }}
          />
        )}
        {isShowManageModal && (
          <ManagementPlan
            isShowManageModal={isShowManageModal}
            headerInfo={headerInfo}
            closeModal={closeModal}
          />
        )}

      </MyLazyComponent>
    </div>
  );
}
