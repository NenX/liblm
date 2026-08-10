import { GestationalWeekProjectTree, MyLazyComponent, OkButton } from '@lm_fe/components_m';
import { mchcConfig, mchcEnv, mchcUtils } from '@lm_fe/env';
import { use_provoke } from '@lm_fe/provoke';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, IMchc_Doctor_RvisitInfoOfOutpatient, IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit, TIdTypeCompatible } from '@lm_fe/service';
import { request } from '@lm_fe/utils';
import { Card, Collapse, Timeline } from 'antd';
import classnames from 'classnames';
import { get, isEmpty, join, map, size, slice } from 'lodash';
import React, { useEffect, useState } from 'react';
import Diagnoses from '../../../.components/Diagnoses_New';
import './index.less';
import ManagementPlan from './management-plan';
import PrenatalTree from './prenatal-tree';
import SurveyList from './survey-list';
import WeightGainWarningTips from "./WeightGainWarningTips"
import { FurtherHistory } from '../FurtherTable/FurtherHistory';
import { SideTemplate } from './SideTemplate'
interface IProps {
  visitsData?: IMchc_Doctor_RvisitInfoOfOutpatient
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo
  id: TIdTypeCompatible


  diagnosesList: IMchc_Doctor_Diagnoses[]
  furtherRefresh(): void
  serialNo: string

  setDiagnosesList(list: any[]): void,
  formData?: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>,

}
export default function FurtherSidebar(props: IProps) {
  const { sys_theme, config } = use_provoke('sys_theme', 'config')

  const { 医生端_又一个预警提醒 } = config
  const {
    headerInfo,
    id,
    visitsData,
    formData,
    diagnosesList,
    furtherRefresh,
    setDiagnosesList,
    serialNo,
  } = props;

  if (mchcConfig.get('医生端_复诊左侧隐藏'))
    return null

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

  useEffect(() => {

    getLackReports();

    return () => {

    }
  }, [])
  useEffect(() => {

    const planData = get(visitsData, `visitPlans`, []);

    // set_recentPlanData(slice(planData, 0, 2))
    set_recentPlanData(planData)

    return () => {

    }
  }, [visitsData])









  async function getLackReports(visitsData = props.visitsData) {
    const lackReports = get(visitsData, `lackReports`, []);

    set_lackReports(join(lackReports || [], '，'))
  };

  function closeModal(type: 'isShowManageModal') {


    if (type === 'isShowManageModal') {
      set_isShowManageModal(false)
    }
  };

  function handleBtnClick(e: any, type: string) {
    e.stopPropagation();
    switch (type) {


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
              <Collapse destroyOnHidden size='small' defaultActiveKey={['1', '2', '4', '5']} bordered={false}>
                <Collapse.Panel
                  header={
                    <span style={{ marginLeft: '10px' }}>
                      诊断
                    </span>
                  }
                  key="1"
                  id="further-diagnosis"
                >
                  <Diagnoses
                    pv_id_for_diagnose={formData?.id}
                    serialNo={serialNo}
                    setDiagnosesList={setDiagnosesList}
                    headerInfo={headerInfo}
                    diagnosesList={diagnosesList}
                    isAllPregnancies={false}


                    page="return"
                  />
                </Collapse.Panel>

                {
                  医生端_又一个预警提醒
                    ? <Collapse.Panel
                      header={
                        <span >
                          预警提醒
                        </span>
                      }
                      key="5"
                    >
                      <WeightGainWarningTips visitsData={visitsData} />
                    </Collapse.Panel>
                    : null
                }

                <Collapse.Panel
                  header={!!lackReports ? '缺少检验报告' : '必查检验检查'}
                  extra={
                    <OkButton
                      type='dashed'
                      size='small'
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
                    </OkButton>
                  }
                  key="2"
                  id="further-check-item"
                >
                  <GestationalWeekProjectTree pregnancyId={mchcUtils.single_id()} />
                </Collapse.Panel>


                {
                  mchcEnv.is('广三') || <Collapse.Panel
                    header={'产检计划'}
                    extra={
                      <OkButton
                        type='dashed'
                        size='small'
                        onClick={(e) => handleBtnClick(e, 'manageBtn')}
                      >
                        产检管理
                      </OkButton>
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
          {sidebarTab == 3 && (

            <FurtherHistory visitsData={visitsData} />
          )}
          {sidebarTab == 4 && (

            <SideTemplate />
          )}
        </div>
        <div className="tab-content" style={{ background: sys_theme.bg_color }}>
          <div
            style={{ color: sidebarTab == 1 ? sys_theme.colorPrimary : '' }}
            className={classnames('tab-item',)}
            onClick={handleTabClick.bind(null, 1)}
          >
            诊断
          </div>
          <div
            style={{ color: sidebarTab == 2 ? sys_theme.colorPrimary : '' }}

            className={classnames('tab-item',)}
            onClick={handleTabClick.bind(null, 2)}
          >
            产检树
          </div>
          <div
            style={{ color: sidebarTab == 3 ? sys_theme.colorPrimary : '' }}

            className={classnames('tab-item',)}
            onClick={handleTabClick.bind(null, 3)}
          >
            历史
          </div>
          <div
            style={{ color: sidebarTab == 4 ? sys_theme.colorPrimary : '' }}

            className={classnames('tab-item',)}
            onClick={handleTabClick.bind(null, 4)}
          >
            模板
          </div>

        </div>
      </div>
    )
  };
  function handleTabClick(value: any) {
    if (value == 2) {
      initTreeData();
    }
    if (value == 3) {
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




  return (
    <Card size='small' styles={{ body: { padding: 0 } }} style={{ width: 260, height: '100%', marginRight: 8, overflow: 'auto' }}>

      <MyLazyComponent size='middle'>
        {renderSiderBar()}

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
    </Card>
  );
}
