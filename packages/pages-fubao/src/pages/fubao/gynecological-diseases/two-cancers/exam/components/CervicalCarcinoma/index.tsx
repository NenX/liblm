import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { IFubao_CervicalCancerRecord, SFubao_CervicalCancerRecord, TIdTypeCompatible } from '@lm_fe/service';
import { fubaoRequest as request } from '@lm_fe/utils';
import { Button, Card, Col, Modal, Popconfirm, Row, message } from 'antd';
import classnames from 'classnames';
import { cloneDeep, get, map, set } from 'lodash';
import React, { useEffect, useState } from 'react';
import { NurseTypesMapping } from './config';
import './index.less';
const DEFAULT_ACTIVE_TEMPLETE: TNurseType = 'Screening';
type TNurseType = keyof typeof NurseTypesMapping
interface IProps {
  id: TIdTypeCompatible
}
export default function Nursing(props: IProps) {
  const [activeTemplate, set_activeTemplate] = useState(DEFAULT_ACTIVE_TEMPLETE)
  const [siderPanels, set_siderPanels] = useState<Partial<IFubao_CervicalCancerRecord>[]>([])
  const [visible, set_visible] = useState(false)
  const [activeItem, set_activeItem] = useState<Partial<IFubao_CervicalCancerRecord>>({})

  useEffect(() => {
    handleInit();


    return () => {

    }
  }, [])


  function handleAdd() {

    set_visible(true)
  };

  function handleClickListItem(item: any, code: TNurseType) {
    return () => {
      const temp = get(NurseTypesMapping, `${code}.key`);

      set_activeItem(item)
      set_activeTemplate(temp)
    }
  }

  async function handleInit(type = DEFAULT_ACTIVE_TEMPLETE, activeItem?: any, isAdd?: boolean) {
    const id = get(props, 'id');
    const cervicalCancerScreeningId = get(props, 'cervicalCancerScreeningId');
    // let data = (
    //   await request.get(
    //     `/api/two/cancer/screening/getCervicalCancerRecord?fileId.equals=${id}&deleteFlag.equals=0`,
    //   )
    // ).data;
    const cervicalCancerRecordS: Partial<IFubao_CervicalCancerRecord>[] = await SFubao_CervicalCancerRecord.getList({ params: { 'fileId.equals': id } }, 'cervicalCancerRecord')

    if (cervicalCancerRecordS.length > 0) {
      const lastOne = cervicalCancerRecordS[cervicalCancerRecordS.length - 1]
      const aa = cervicalCancerRecordS.find(_ => Number(cervicalCancerScreeningId) === _.cervicalCancerScreeningId)
      if (aa) {
        set_activeItem(aa)
      } else if (isAdd) {
        set_activeItem(lastOne)
      } else {
        set_activeItem(activeItem ?? lastOne)
      }

      set_activeTemplate(type)

    } else {
      cervicalCancerRecordS.push({ cervicalCancerScreeningId: -1 });

    }

    set_siderPanels(cervicalCancerRecordS)

  };

  function handleDelete(item: any, code: any) {
    return async () => {
      if (code === 'Screening') {
        const id = get(item, 'cervicalCancerScreeningId');
        const res = (await request.delete(`/api/two/cancer/screening/deleteCervicalCancerScreening/${id}`)).data;
        if (get(res, 'code') === 1) {

        } else {

        }
        await handleInit();
      } else {
        const id = get(item, 'cervicalCancerBiopsyId');
        const res = (await request.delete(`/api/two/cancer/screening/deleteCervicalCancerBiopsy/${id}`)).data;
        if (get(res, 'code') === 1) {

        } else {

        }
        await handleInit();
      }
    };
  }

  function handleChooseTemplate(xxType: TNurseType) {
    return () => {
      const newSiderPanels = cloneDeep(siderPanels);
      const listData = newSiderPanels[newSiderPanels.length - 1];

      if (xxType !== 'Screening') {
        if (get(listData, 'cervicalCancerBiopsyId')) {

        } else {
          set(listData, 'cervicalCancerBiopsyId', -1);

          set_siderPanels(newSiderPanels)

        }

        set_activeTemplate(xxType)
        set_activeItem(listData)
      } else {
        if (get(listData, 'cervicalCancerScreeningId') === -1) {
          message.warning('请先保存上一次筛查！');
          return;
        }
        let newImte: Partial<IFubao_CervicalCancerRecord> = {
          cervicalCancerScreeningId: -1,
        }
        newSiderPanels.push(newImte);
        set_siderPanels(newSiderPanels)
        set_activeTemplate(xxType)
        set_activeItem(newImte)
      }
      set_visible(false)

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
        {map(siderPanels, (item, index) => {
          return (
            <div key={item.id} className="two-cancers-list">
              <div className="two-cancers-doctor-desk-first-visit-sider-list_title">{`第${index + 1}次筛查`}</div>

              {get(item, 'cervicalCancerScreeningId') && (
                <>
                  <div
                    className="doctor-desk-first-visit-sider-list__item"
                    style={
                      get(activeItem, 'id') === get(item, 'id') && activeTemplate === 'Screening'
                        ? { background: '#eaf4fd' }
                        : { background: 'none' }
                    }
                    onClick={handleClickListItem(item, 'Screening')}
                  >
                    <span className="doctor-desk-first-visit-sider-list__item-title">
                      筛查{' '}
                      {get(item, 'cervicalCancerScreeningCheckDate') &&
                        '(' + get(item, 'cervicalCancerScreeningCheckDate') + ')'}
                    </span>
                    {get(item, 'cervicalCancerScreeningScreeningSuggest') && (
                      <span
                        className={classnames('label-result', {
                          red: get(item, 'cervicalCancerScreeningScreeningSuggest') === '可疑',
                        })}
                      >
                        {get(item, 'cervicalCancerScreeningScreeningSuggest')}
                      </span>
                    )}
                    {get(item, 'cervicalCancerScreeningId') && get(item, 'cervicalCancerScreeningId') != -1 ? (
                      <Popconfirm
                        title="确定要删除这个病历吗?"
                        onConfirm={handleDelete(item, 'Screening')}
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
              {get(item, 'cervicalCancerBiopsyId') && (
                <div
                  className="doctor-desk-first-visit-sider-list__item"
                  style={
                    get(activeItem, 'id') === get(item, 'id') && activeTemplate === 'PathologicalBiopsy'
                      ? { background: '#eaf4fd' }
                      : { background: 'none' }
                  }
                  onClick={handleClickListItem(item, 'PathologicalBiopsy')}
                >
                  <span className="doctor-desk-first-visit-sider-list__item-title">
                    病理活检{' '}
                    {get(item, 'cervicalCancerBiopsyCheckDate') &&
                      '(' + get(item, 'cervicalCancerBiopsyCheckDate') + ')'}
                  </span>
                  {get(item, 'cervicalCancerBiopsyScreeningSuggest') && (
                    <span
                      className={classnames('label-result', {
                        red: get(item, 'cervicalCancerBiopsyScreeningSuggest') === '治疗',
                      })}
                    >
                      {get(item, 'cervicalCancerBiopsyScreeningSuggest')}
                    </span>
                  )}
                  {get(item, 'cervicalCancerBiopsyId') && get(item, 'cervicalCancerBiopsyId') != -1 ? (
                    <Popconfirm
                      title="确定要删除这个病历吗?"
                      onConfirm={handleDelete(item, 'PathologicalBiopsy')}
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
      >
        {map(NurseTypesMapping, (nurseType, key) => {
          return (
            <Button style={{ margin: 8 }} key={key} onClick={handleChooseTemplate(nurseType.key)}>
              {nurseType.name}
            </Button>
          );
        })}
      </Modal>
    </Row>
  );
}
