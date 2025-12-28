import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { fubaoRequest as request } from '@lm_fe/utils';
import { Button, Card, Col, Modal, Popconfirm, Row, message } from 'antd';
import classnames from 'classnames';
import { cloneDeep, get, map, set } from 'lodash';
import React, { useEffect, useState } from 'react';
import { NurseTypesMapping } from './config';
import './index.less';
const DEFAULT_ACTIVE_TEMPLETE = 'Screening';
export default function MammaryCancer(props: any) {

  const [activeTemplate, set_activeTemplate] = useState(DEFAULT_ACTIVE_TEMPLETE)
  const [siderPanels, set_siderPanels] = useState<any[]>([])
  const [oldsiderPanels, set_oldsiderPanels] = useState<any[]>([])
  const [visible, set_visible] = useState(false)
  const [activeItem, set_activeItem] = useState({},)
  const [activeType, set_activeType] = useState('Screening')


  useEffect(() => {
    handleInit();


    return () => {

    }
  }, [])


  function handleAdd() {

    set_visible(true)
  };

  function handleClickListItem(item: any, code: any) {
    return () => {
      const activeTemplate: any = get(NurseTypesMapping, `${code}.key`);


      set_activeItem(item)
      set_activeTemplate(activeTemplate)
      set_activeType(code)

    }
  }

  async function handleInit(activeType?: any, activeItem?: any, isAdd?: boolean) {
    const id = get(props, 'id');
    const breastCancerScreeningId = get(props, 'breastCancerScreeningId');
    const breastCancerXRayId = get(props, 'breastCancerXRayId');
    let data = (await request.get(
      `/api/two/cancer/screening/getBreastCancerRecord?fileId.equals=${id}&deleteFlag.equals=0`,
    )).data;
    let breastCancerRecord: any = [];
    if (get(data, 'data')) {
      breastCancerRecord = get(data, 'data.breastCancerRecord');
    }
    if (breastCancerRecord.length > 0) {
      //病理提醒 病理结果追踪跳转对应的tab
      if (breastCancerScreeningId) {
        map(breastCancerRecord, (item, index) => {
          if (Number(breastCancerScreeningId) === get(item, 'breastCancerScreeningId')) {

            set_siderPanels(breastCancerRecord)
            set_activeItem(item)
            set_activeType('Screening')
            set_activeTemplate(DEFAULT_ACTIVE_TEMPLETE)
          }
        });
      } else if (breastCancerXRayId) {
        map(breastCancerRecord, (item, index) => {
          if (Number(breastCancerXRayId) === get(item, 'breastCancerXRayId')) {

            set_siderPanels(breastCancerRecord)
            set_activeItem(item)
            set_activeType('Mammography')
            set_activeTemplate(get(NurseTypesMapping, `Mammography.key`))
          }
        });
      } else {


        set_siderPanels(breastCancerRecord)
        set_activeItem(activeItem && !isAdd ? activeItem : breastCancerRecord[breastCancerRecord.length - 1])
        set_activeType(activeType ? activeType : 'Screening')
        set_activeTemplate(activeType ? get(NurseTypesMapping, `${activeType}.key`)! : DEFAULT_ACTIVE_TEMPLETE)
      }
    } else {
      breastCancerRecord.push({ breastCancerScreeningId: -1 });

      set_siderPanels(breastCancerRecord)
    }
  };

  function handleDelete(item: any, code: any) {
    return async () => {
      if (code === 'Screening') {
        const id = get(item, 'breastCancerScreeningId');
        const res = (await request.delete(`/api/two/cancer/screening/deleteBreastCancerScreening/${id}`)).data;
        if (get(res, 'code') === 1) {

        } else {

        }
        await handleInit();
      } else if (code === 'Mammography') {
        const id = get(item, 'breastCancerXRayId');
        const res = (await request.delete(`/api/two/cancer/screening/deleteBreastCancerXRay/${id}`)).data;
        if (get(res, 'code') === 1) {

        } else {

        }
        await handleInit();
      } else {
        const id = get(item, 'breastCancerBiopsyId');
        const res = (await request.delete(`/api/two/cancer/screening/deleteBreastCancerBiopsy/${id}`)).data;
        if (get(res, 'code') === 1) {

        } else {

        }
        await handleInit();
      }
    };
  }

  function handleChooseTemplate(nurseType: any) {
    return () => {
      const clickTempKey = get(nurseType, 'key');
      const newSiderPanels: any[] = cloneDeep(siderPanels);
      const listData = newSiderPanels[newSiderPanels.length - 1];

      if (clickTempKey === 'Screening') {
        if (get(listData, 'breastCancerScreeningId') === -1) {
          message.warning('请先保存上一次筛查！');
          return;
        }
        let newImte = {
          breastCancerScreeningId: -1,
        }
        newSiderPanels.push(newImte);

        set_siderPanels(newSiderPanels)
        set_activeTemplate(get(nurseType, 'key'))
        set_visible(false)
        set_activeItem(newImte)
        set_activeType(clickTempKey)

      } else if (clickTempKey === 'Mammography') {
        if (get(listData, 'breastCancerXRayId')) {


          set_activeTemplate(get(nurseType, 'key'))
          set_visible(false)
          set_activeItem(listData)
          set_activeType(clickTempKey)
        } else {
          set(listData, 'breastCancerXRayId', -1);


          set_siderPanels(newSiderPanels)
          set_activeTemplate(get(nurseType, 'key'))
          set_visible(false)
          set_activeItem(listData)
          set_activeType(clickTempKey)
        }
      } else {
        if (get(listData, 'breastCancerBiopsyId')) {



          set_activeTemplate(get(nurseType, 'key'))
          set_visible(false)
          set_activeItem(listData)
          set_activeType(clickTempKey)
        } else {
          set(listData, 'breastCancerBiopsyId', -1);


          set_siderPanels(newSiderPanels)
          set_activeTemplate(get(nurseType, 'key'))
          set_visible(false)
          set_activeItem(listData)
          set_activeType(clickTempKey)
        }
      }
    };
  }

  function renderSider() {
    return (
      <Card
        size="small"
        bordered={false}
        style={{ height: '100%' }}
        title="就诊记录"
        extra={<PlusCircleOutlined onClick={handleAdd} />}
      >
        {map(siderPanels, (data, index) => {
          return (
            <div key={data.id} className="two-cancers-list">
              <div className="two-cancers-doctor-desk-first-visit-sider-list_title">{`第${index + 1}次筛查`}</div>

              {get(data, 'breastCancerScreeningId') && (
                <>
                  <div
                    className="doctor-desk-first-visit-sider-list__item"
                    style={
                      get(activeItem, 'id') === get(data, 'id') && activeType === 'Screening'
                        ? { background: '#eaf4fd' }
                        : { background: 'none' }
                    }
                    onClick={handleClickListItem(data, 'Screening')}
                  >
                    <span className="doctor-desk-first-visit-sider-list__item-title">
                      筛查{' '}
                      {get(data, 'breastCancerScreeningCheckDate') &&
                        '(' + get(data, 'breastCancerScreeningCheckDate') + ')'}
                    </span>
                    {get(data, 'breastCancerScreeningScreeningSuggest') && (
                      <span
                        className={classnames('label-result', {
                          red: get(data, 'breastCancerScreeningScreeningSuggest') === '复查乳腺X线',
                        })}
                      >
                        {get(data, 'breastCancerScreeningScreeningSuggest')}
                      </span>
                    )}
                    {get(data, 'breastCancerScreeningId') && get(data, 'breastCancerScreeningId') != -1 ? (
                      <Popconfirm
                        title="确定要删除这个病历吗?"
                        onConfirm={handleDelete(data, 'Screening')}
                        okText="确定"
                        cancelText="取消"
                      >
                        <DeleteOutlined style={{ color: 'rgb(205,72,57)', float: 'right', marginTop: 2 }} />
                      </Popconfirm>
                    ) : (
                      <EditOutlined style={{ color: 'rgb(24, 144, 255)', float: 'right', marginTop: 2 }} />
                    )}
                  </div>
                </>
              )}

              {get(data, 'breastCancerXRayId') && (
                <>
                  <div
                    className="doctor-desk-first-visit-sider-list__item"
                    style={
                      get(activeItem, 'id') === get(data, 'id') && activeType === 'Mammography'
                        ? { background: '#eaf4fd' }
                        : { background: 'none' }
                    }
                    onClick={handleClickListItem(data, 'Mammography')}
                  >
                    <span className="doctor-desk-first-visit-sider-list__item-title">
                      乳腺X线{' '}
                      {get(data, 'breastCancerXRayCheckDate') && '(' + get(data, 'breastCancerXRayCheckDate') + ')'}
                    </span>
                    {get(data, 'breastCancerXRayScreeningSuggest') && (
                      <span
                        className={classnames('label-result', {
                          red: get(data, 'breastCancerXRayScreeningSuggest') === '复查乳腺X线',
                        })}
                      >
                        {get(data, 'breastCancerXRayScreeningSuggest')}
                      </span>
                    )}
                    {get(data, 'breastCancerXRayId') && get(data, 'breastCancerXRayId') != -1 ? (
                      <Popconfirm
                        title="确定要删除这个病历吗?"
                        onConfirm={handleDelete(data, 'Mammography')}
                        okText="确定"
                        cancelText="取消"
                      >
                        <DeleteOutlined style={{ color: 'rgb(205,72,57)', float: 'right', marginTop: 2 }} />
                      </Popconfirm>
                    ) : (
                      <EditOutlined style={{ color: 'rgb(24, 144, 255)', float: 'right', marginTop: 2 }} />
                    )}
                  </div>
                </>
              )}

              {get(data, 'breastCancerBiopsyId') && (
                <div
                  className="doctor-desk-first-visit-sider-list__item"
                  style={
                    get(activeItem, 'id') === get(data, 'id') && activeType === 'PathologicalBiopsy'
                      ? { background: '#eaf4fd' }
                      : { background: 'none' }
                  }
                  onClick={handleClickListItem(data, 'PathologicalBiopsy')}
                >
                  <span className="doctor-desk-first-visit-sider-list__item-title">
                    病理活检{' '}
                    {get(data, 'breastCancerBiopsyCheckDate') && '(' + get(data, 'breastCancerBiopsyCheckDate') + ')'}
                  </span>
                  {get(data, 'breastCancerBiopsyScreeningSuggest') && (
                    <span
                      className={classnames('label-result', {
                        red: get(data, 'breastCancerBiopsyScreeningSuggest') === '治疗',
                      })}
                    >
                      {get(data, 'breastCancerBiopsyScreeningSuggest')}
                    </span>
                  )}
                  {get(data, 'breastCancerBiopsyId') && get(data, 'breastCancerBiopsyId') != -1 ? (
                    <Popconfirm
                      title="确定要删除这个病历吗?"
                      onConfirm={handleDelete(data, 'PathologicalBiopsy')}
                      okText="确定"
                      cancelText="取消"
                    >
                      <DeleteOutlined style={{ color: 'rgb(205,72,57)', float: 'right', marginTop: 2 }} />
                    </Popconfirm>
                  ) : (
                    <EditOutlined style={{ color: 'rgb(24, 144, 255)', float: 'right', marginTop: 2 }} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </Card>
    );
  };

  function renderContent() {
    const { reload } = props as any;
    if (NurseTypesMapping[activeTemplate]) {
      const Component = NurseTypesMapping[activeTemplate]['component'];
      return (
        <Component
          {...props}
          activeItem={activeItem}
          onRefresh={handleInit}
          reload={reload}
          siderPanels={siderPanels}
        />
      );
    } else {
      return <div>该{activeTemplate}不存在此tab中</div>;
    }
  };
  console.log('zzx item', activeItem)

  return (
    <Row style={{ height: '100%' }}>
      <Col style={{ height: '100%', width: 290, overflow: 'scroll', backgroundColor: '#fff' }}>
        {renderSider()}
      </Col>
      <Col style={{ height: '100%', width: 'calc(100% - 290px)', overflow: 'scroll' }}>{renderContent()}</Col>
      <Modal
        visible={visible}
        onCancel={() => {
          set_visible(false)
        }}
        onOk={() => {
          set_visible(false)
        }}
      >
        {map(NurseTypesMapping, (nurseType, key) => {
          return (
            <Button style={{ margin: 8 }} key={key} onClick={handleChooseTemplate(nurseType)}>
              {nurseType.name}
            </Button>
          );
        })}
      </Modal>
    </Row>
  );
}
