import { DoctorEnd_HeaderInfoLayout } from '@lm_fe/pages';
import { SLocal_SystemConfig } from '@lm_fe/service';
import { getSearchParamsValue, request } from '@lm_fe/utils';
import { message, Tabs } from 'antd';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import './index.less';
import React from 'react';
import ArchivalInformation from './archival-information/index1';
import CloseArchives from './close-archives/index1';
import FurtherVisit from './further-visit/index1';
import InformedConsent from './InformedConsent/index1';
import PostpartumVisit from './postpartum-visit/index1';
import { mchcUtils } from '@lm_fe/env';
import { MyLazyComponent } from '@lm_fe/components';
const getDoctorEndId = mchcUtils.getDoctorEndId
const TABS = {
  ArchivalInformation: '1',
  FurtherVisit: '2',
  PostpartumVisit: '3',
  DoctorInformedConsent: '4',
  InformedConsent: '5',
  OuterCourtReport: '6',
  CloseArchives: '7',
};
function NurseMain(props: any) {
  console.log('NurseMain props', props)
  const [headerData, set_headerData] = useState({})
  const [activeKey, set_activeKey] = useState(TABS['ArchivalInformation'])
  const pregnancy_id = get(props, `id`) ?? getSearchParamsValue('id');

  useEffect(() => {
    getHeaderInfo();
    console.log('useEffect getHeaderInfo')
    return () => {

    };
  }, []);



  // 子页面 档案信息点击保存后刷新表头信息
  async function getHeaderData() {
    const id = get(props, 'id') || getSearchParamsValue('id');
    const headerData = (await request.get(`/api/nurse/getOutpatientHeaderInfo?id=${id}&q=1`)).data;

    set_headerData(headerData)

  };
  async function getHeaderInfo() {
    const id = getSearchParamsValue('id') || get(props, `id`);
    if (!id) {
      message.error('请选择就诊人');
      return null;
    }
    const res = (await request.get('/api/doctor/getOutpatientHeaderInfo?q=2&id=' + id)).data;

    set_headerData(res)
    return res

  }
  async function handleChangeTab(activeKey: string) {
    set_activeKey(activeKey)

  };





  function renderContent() {
    const id = get(props, 'id') || getSearchParamsValue('id');
    const nurseDeskVoucher = SLocal_SystemConfig.get('nurseDeskVoucher')

    return (
      <MyLazyComponent>
        <Tabs className="panel-with-child_content-tabs" activeKey={activeKey} onChange={handleChangeTab}>
          <Tabs.TabPane tab="档案信息" key={TABS['ArchivalInformation']}>
            <ArchivalInformation id={id} reloadHeader={getHeaderData} {...props} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="复诊管理" key={TABS['FurtherVisit']}>
            {activeKey === TABS['FurtherVisit'] && (
              <FurtherVisit id={get(headerData, 'outpatientNO')} pregnancyData={headerData} {...props} />
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="产后复诊管理" key={TABS['PostpartumVisit']}>
            {activeKey === TABS['PostpartumVisit'] && (
              <PostpartumVisit id={get(headerData, 'outpatientNO')} pregnancyData={headerData} {...props} />
            )}
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab="文书管理" key={TABS['DoctorInformedConsent']}>
          {activeKey === TABS['DoctorInformedConsent'] && (
            <DoctorInformedConsent id={id} pregnancyData={headerData} {...props} />
          )}
        </Tabs.TabPane> */}
          {nurseDeskVoucher && (
            <Tabs.TabPane tab="补助券管理" key={TABS['InformedConsent']}>
              {activeKey === TABS['InformedConsent'] && (
                <InformedConsent id={id} pregnancyData={headerData} {...props} />
              )}
            </Tabs.TabPane>
          )}
          {/* <Tabs.TabPane tab="外院报告" key={TABS['OuterCourtReport']}>
          {activeKey === TABS['OuterCourtReport'] && (
            <OuterCourtReport id={id} pregnancyData={headerData} {...props} />
          )}
        </Tabs.TabPane> */}
          <Tabs.TabPane tab="结案管理" key={TABS['CloseArchives']}>
            {activeKey === TABS['CloseArchives'] && <CloseArchives id={id} {...props} />}
          </Tabs.TabPane>
        </Tabs>
      </MyLazyComponent>
    );
  };
  return <DoctorEnd_HeaderInfoLayout {...props}
    id={pregnancy_id}
    isNurse
    saveHeaderInfo={set_headerData} >

    {renderContent()}
  </DoctorEnd_HeaderInfoLayout>
}
export default NurseMain
