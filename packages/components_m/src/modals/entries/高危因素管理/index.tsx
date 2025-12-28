import { IGlobalModalProps } from '@lm_fe/components';
import { ICommonOption, mchcLogger } from '@lm_fe/env';
import {
  IMchc_Doctor_OutpatientHeaderInfo,
  IMchc_HighriskGradeConfig, IMchc_TemplateTree_Item,
  SMchc_Common,
  SMchc_Doctor,
  TIdTypeCompatible
} from '@lm_fe/service';
import { ROMAN_NUMERALS, request } from '@lm_fe/utils';
import { Modal, Tabs, message } from 'antd';
import {
  get,
  join,
  keyBy,
  map
} from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { HighriskSign_高危因素管理 } from './HighriskSign';
import { HighriskTimeline_高危因素管理 } from './HighriskTimeline';
import styles from './index.module.less';
const boundSymbol = ':';
interface IProps {
  data?: IMchc_Doctor_OutpatientHeaderInfo
  pregnancyId: TIdTypeCompatible
  onFinish?(v: IMchc_Doctor_OutpatientHeaderInfo): void
  handleSubmit?(): void

  hide高危标记?: boolean
  hide高危时间轴?: boolean
}
export default function HighriskFactor(props: IGlobalModalProps<IProps>) {

  const { modal_data, close, ...others } = props
  const { data, onFinish, handleSubmit, pregnancyId, hide高危时间轴, hide高危标记 } = modal_data;

  const highRiskTreeDataMapping = useRef<{ [x: string]: IMchc_TemplateTree_Item }>({})

  const [highriskTreeData, set_highriskTreeData] = useState<IMchc_TemplateTree_Item[]>([])
  const [gradeOptions, set_gradeOptions] = useState<IMchc_HighriskGradeConfig[]>([])
  const [contagionOptions, set_contagionOptions] = useState<ICommonOption[]>([])

  const [activeTabKey, set_activeTabKey] = useState(hide高危标记 ? (hide高危时间轴 ? '' : '2') : '1')


  const [initData, set_initData] = useState<IMchc_Doctor_OutpatientHeaderInfo>()

  const [headerInfo, setHeaderInfo] = useState<IMchc_Doctor_OutpatientHeaderInfo>()



  useEffect(() => {
    (async () => {
      SMchc_Common.getHighriskGradeConfig().then(set_gradeOptions)

      if (!hide高危标记) {
        const h = data ?? (await SMchc_Doctor.getOutpatientHeaderInfo(pregnancyId))
        setHeaderInfo(h)
        SMchc_Common.getHighriskContagionConfig()
          .then(r => {
            set_contagionOptions(r.options)

          })

        const treeData = await SMchc_Common.getHighriskTree()
        highRiskTreeDataMapping.current = keyBy(treeData, 'id');



        const highriskNote_ = h.highriskNote?.split(',') ?? [];
        let _selectTree: IMchc_TemplateTree_Item[] = [];
        highriskNote_.map((item) => {
          map(highRiskTreeDataMapping.current, (v, i) => {
            const addNote = getTargetNote(v)
            if (item == addNote) {
              _selectTree.push(v);
            }
          });
        });
        set_highriskTreeData(treeData)
      }
    })()

    return () => {

    }
  }, [])




  async function onOk() {
    if (hide高危标记) {
      close?.(true)
      return
    }
    if (!initData?.infectionNote) {
      return message.info('请选择传染病!')
    }

    if (initData.highriskGrade && initData.highriskGrade !== ROMAN_NUMERALS[1]) {
      if (!initData.highriskNote) {
        message.error('请填写高危因素!');
        return;
      }
    }
    if (initData.highriskNote) {
      if (!initData.highriskGrade) {
        message.error('请填写高危等级!');
        return;
      }
    }
    if (onFinish) {

      // 新建孕册
      if (headerInfo) {
        onFinish({
          ...headerInfo,
          ...initData,
        });
      }

    } else {
      await updateRiskRecords();
      handleSubmit?.();

    }
    close?.(true)

  };

  async function updateRiskRecords() {


    const postData = {
      outEmrId: get(headerInfo, 'id'),
      infectionNote: initData?.infectionNote,
      highriskNote: initData?.highriskNote,
      highriskGrade: initData?.highriskGrade,
      gestationalWeek: get(headerInfo, `gesweek`),
    };

    const res = await request.put('/api/doctor/assessHighRisk', postData);
    message.success('信息保存成功!');
    // saveHeaderInfo({
    //   ...props.data,
    //   ...pick(post, ['infectionNote', 'highriskNote']),
    //   highriskLable: get(post, `highriskGrade`),
    // });
    // saveHeaderInfo(ress);

  }





  function handleClose() {

    close?.()

  };







  function handleTabChange(key: string) {
    set_activeTabKey(key)
  };






  function getTargetNote(v: IMchc_TemplateTree_Item) {
    const p = get(highRiskTreeDataMapping.current, v.pid)
    const addNote = `${p?.val}${boundSymbol}${v?.val}`;

    return addNote
  }


  return (
    <Modal
      {...others}

      className={styles["highrisk-pop"]}
      bodyStyle={{
        padding: 0,
        maxHeight: 700
      }}
      width={1000}
      onCancel={handleClose}
      onOk={onOk}
    >
      <Tabs activeKey={activeTabKey} onChange={handleTabChange}>
        {
          hide高危标记 ? null :
            <Tabs.TabPane tab="高危标记" key="1">
              <HighriskSign_高危因素管理 initData={initData} set_initData={set_initData} gradeOptions={gradeOptions} contagionOptions={contagionOptions} highriskTreeData={highriskTreeData} headerInfo={headerInfo} />
            </Tabs.TabPane>
        }
        {/* 暂时屏蔽 */}
        {hide高危时间轴 ? null :
          <Tabs.TabPane tab="高危时间轴" key="2">
            <HighriskTimeline_高危因素管理 id={pregnancyId ?? headerInfo?.id} gradeOptions={gradeOptions} />
          </Tabs.TabPane>}
      </Tabs>
    </Modal>
  );
}

// console.dir("mapStateToProps",mapStateToProps);


