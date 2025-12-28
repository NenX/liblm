import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Modal, Button, Space } from 'antd';
import ReactToPrint from 'react-to-print';
import { get, forEach, filter, isEmpty, includes, size, orderBy, last, split, floor } from 'lodash';
import dayjs from 'dayjs';
import styles from './index.module.less';
import { IMchc_Doctor_OutpatientHeaderInfo, IMchc_Doctor_PreRiskAssessmentInfo, IMchc_Doctor_RvisitInfoOfOutpatient_Diagnoses, IMchc_TemplateTree_Item, TIdTypeCompatible } from '@lm_fe/service'
import { SMchc_Doctor, SMchc_TemplateTrees } from '@lm_fe/service';
import { IGlobalModalProps } from '@lm_fe/components';
import { getSearchParamsValue } from '@lm_fe/utils';
import { mchcEnv } from '@lm_fe/env';
import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

export function getDiffYears(date: string, preDate: string) {
  return dayjs(date).diff(dayjs(preDate), 'years', true);
}
interface IProps {
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo
  // diagnosesList: IMchc_Doctor_RvisitInfoOfOutpatient_Diagnoses[]
}
export default function Preeclampsia(props: IGlobalModalProps<IProps>) {
  const { modal_data, close, ...others } = props
  const { headerInfo, } = modal_data;


  const printTableRef = useRef<HTMLDivElement>(null)

  const [treeFactor, setTreeFactor] = useState<any>(null)
  const [treeGuide, setTreeGuide] = useState<any>(null)
  const [factorKeys, setFactorKeys] = useState<any>([])
  const [guideKeys, setGuideKeys] = useState<any>([])


  useEffect(() => {
    (
      async () => {
        const pregnancyId = get(headerInfo, `id`) || getSearchParamsValue('id');

        SMchc_TemplateTrees.getTemplateTree(35).then(setTreeGuide);
        const treeFactor = await SMchc_TemplateTrees.getTemplateTree(34);
        const selecteFactor = await SMchc_TemplateTrees.findAlertAssessment(34, pregnancyId);
        const selecteGuide = await SMchc_TemplateTrees.findAlertAssessment(35, pregnancyId);
        const res = await SMchc_Doctor.getPreRiskAssessmentInfo(pregnancyId);

        const factorValue = get(selecteFactor, 'value') || [];
        const factorKeys: any[] = [];
        forEach(factorValue, (item) => factorKeys.push(String(item.id)));

        const guideValue = get(selecteGuide, 'value') || [];
        const guideKeys: any[] = [];
        forEach(guideValue, (item) => guideKeys.push(String(item.id)));
        const newKeys = getTreeFactor(treeFactor, factorKeys, res);

        setTreeFactor(treeFactor)
        setFactorKeys(newKeys)
        setGuideKeys(guideKeys)

      }
    )()
  }, [])

  function getTreeFactor(treeFactor: IMchc_TemplateTree_Item[], factorKeys: any[], data: IMchc_Doctor_PreRiskAssessmentInfo) {
    // const { diagnosesList } = props;
    const _pregnancyData = data;
    const _diagnosesList = _pregnancyData.diagnoses // || diagnosesList;
    /**自动勾选项判断*/
    const pregnancyHistories = orderBy(get(_pregnancyData, 'pregnancymh'), ['gravidityindex'], ['asc']) || [];
    const gravidity = get(_pregnancyData, 'gravidity');
    const bmi = get(_pregnancyData, 'bmi');
    const familyHistoryOtherNote = get(_pregnancyData, 'familyHistoryOrderNote') || '';
    const allergyHistoryOtherNote = get(_pregnancyData, 'allergyDrugNote') || '';
    const sureEdd = get(_pregnancyData, 'sureEdd') || '';
    const dob = get(_pregnancyData, 'dob') || '';
    const futureAge = get(_pregnancyData, 'eddAge'); //getDiffYears(sureEdd, dob);
    const lastPregnancyHistory = last(pregnancyHistories);

    forEach(pregnancyHistories, (item) => {
      if (item.exceptionalcase && item.exceptionalcase.indexOf('子痫前期') !== -1) {
        factorKeys.push(getTreeId('子痫前期史, 尤其合并不良妊娠结局', treeFactor));
      }
      forEach(get(item, 'children'), (subItem) => {
        if (subItem.neonateWeight < 2.5) {
          factorKeys.push(
            getTreeId(
              '个人既往史因素（如: 低出生体重, 妊娠年龄偏小,  前次不良妊娠结局, 超过10年以上的妊娠间隔）',
              treeFactor,
            ),
          );
        }
      });
    });
    function hasCode(diagnosisObj: any) {
      const arr = [
        'N00',
        'N01',
        'N02',
        'N03',
        'N04',
        'N05',
        'N06',
        'N07',
        'N08',
        'N09',
        'N010',
        'N11',
        'N12',
        'N14',
        'N15',
        'N16',
        'N17',
        'N18',
        'N19',
        'N25',
        'N26',
        'N27',
      ];
      const code = get(diagnosisObj, 'diagnosisCode');
      const codeArr = split(code, '.');
      let bool = includes(arr, get(codeArr, '[0]'));
      if (bool) return bool;
      if (get(codeArr, '[0]') == 'N28') {
        const codeNum = floor(get(codeArr, `[1]`));
        if (codeNum <= 820) return true;
      }
      return bool;
    }

    // 诊断判断
    forEach(_diagnosesList, (item) => {
      if (
        item.diagnosis.indexOf('双胎妊娠') !== -1 ||
        item.diagnosis.indexOf('多胎妊娠') !== -1 ||
        item.diagnosis.indexOf('胎妊娠') !== -1
      ) {
        factorKeys.push(getTreeId('多胎妊娠', treeFactor));
      }
      if (item.diagnosis.indexOf('慢性高血压') !== -1) {
        factorKeys.push(getTreeId('慢性高血压', treeFactor));
      }
      if (item.diagnosis.indexOf('1型糖尿病') !== -1 || item.diagnosis.indexOf('2型糖尿病') !== -1) {
        factorKeys.push(getTreeId('1型或 2型糖尿病', treeFactor));
      }
      if (item.diagnosis.indexOf('鼻息肉') !== -1) {
        factorKeys.push(getTreeId('鼻息肉（可能会引起致命的支气管阻塞）', treeFactor));
      }
      if (
        (item.diagnosis.indexOf('尿毒症') !== -1 ||
          item.diagnosis.indexOf('肾炎') !== -1 ||
          item.diagnosis.indexOf('肾衰竭') !== -1 ||
          item.diagnosis.indexOf('肾病') !== -1 ||
          item.diagnosis.indexOf('肾积水') !== -1 ||
          item.diagnosis.indexOf('肾盂积水') !== -1 ||
          item.diagnosis.indexOf('肾小管') !== -1 ||
          item.diagnosis.indexOf('肾脏') !== -1 ||
          item.diagnosis.indexOf('肾硬化') !== -1) &&
        item.diagnosis.indexOf('胎') === -1
      ) {
        factorKeys.push(getTreeId('肾病', treeFactor));
      }
      if (hasCode(item)) {
        factorKeys.push(getTreeId('肾病', treeFactor));
      }
      if (
        item.diagnosis.indexOf('SLE') !== -1 ||
        item.diagnosis.indexOf('红斑狼疮') !== -1 ||
        item.diagnosis.indexOf('抗磷脂综合征') !== -1
      ) {
        factorKeys.push(getTreeId('自身免疫性疾病（系统性红斑狼疮, 抗磷脂综合症）', treeFactor));
      }
      if (
        item.diagnosis.indexOf('异位妊娠') != -1 ||
        item.diagnosis.indexOf('葡萄胎') != -1 ||
        item.diagnosis.indexOf('绒毛膜上皮性疾病') != -1
      ) {
        factorKeys.push(
          getTreeId(
            '个人既往史因素（如: 低出生体重, 妊娠年龄偏小,  前次不良妊娠结局, 超过10年以上的妊娠间隔）',
            treeFactor,
          ),
        );
      }
    });

    if (gravidity === 1) factorKeys.push(getTreeId('初次妊娠', treeFactor));
    if (bmi > 30) factorKeys.push(getTreeId('肥胖（BMI > 30kg/㎡）', treeFactor));
    if (familyHistoryOtherNote.indexOf('子痫前期') !== -1) {
      factorKeys.push(getTreeId('子痫前期家族史', treeFactor));
    }
    if (futureAge >= 35) factorKeys.push(getTreeId('妊娠年龄超过35岁', treeFactor));
    if (allergyHistoryOtherNote.indexOf('阿司匹林') !== -1) {
      factorKeys.push(getTreeId('阿司匹林过敏史（荨麻疹等症状）', treeFactor));
    }
    if (allergyHistoryOtherNote.indexOf('水杨酸') !== -1) {
      factorKeys.push(getTreeId('对其他水杨酸类药物过敏（以防交叉过敏）', treeFactor));
    }
    if (allergyHistoryOtherNote.indexOf('NSAIDs') !== -1 || allergyHistoryOtherNote.indexOf('非甾体类消炎药') !== -1) {
      factorKeys.push(getTreeId('对NSAIDs过敏', treeFactor));
    }

    if (
      futureAge < 18 ||
      isBool(lastPregnancyHistory) ||
      get(lastPregnancyHistory, 'fetusdeath') ||
      // getDiffYears(dayjs(new Date()).format('YYYY-MM-DD'), get(lastPregnancyHistory, 'year')) > 10.767
      (lastPregnancyHistory?.year && getDiffYears(dayjs(new Date()).format('YYYY-MM-DD'), lastPregnancyHistory?.year) > 10)
    ) {
      factorKeys.push(
        getTreeId(
          '个人既往史因素（如: 低出生体重, 妊娠年龄偏小,  前次不良妊娠结局, 超过10年以上的妊娠间隔）',
          treeFactor,
        ),
      );
    }
    function isBool(lastPregnancyHistory: any) {
      let bool = false;
      const exceptionalcase = get(lastPregnancyHistory, 'exceptionalcase') || '';
      let naturalAbortion = get(lastPregnancyHistory, 'naturalAbortion');
      let biochemicalAbortion = get(lastPregnancyHistory, 'biochemicalAbortion');
      let fetusdeath = get(lastPregnancyHistory, 'fetusdeath');
      let preterm = get(lastPregnancyHistory, 'preterm');
      if (
        exceptionalcase.indexOf('异位妊娠') != -1 ||
        exceptionalcase.indexOf('滋养细胞') != -1 ||
        exceptionalcase.indexOf('葡萄胎') != -1 ||
        exceptionalcase.indexOf('出生缺陷') != -1 ||
        exceptionalcase.indexOf('新生儿缺陷') != -1 ||
        exceptionalcase.indexOf('胚胎停育') != -1 ||
        exceptionalcase.indexOf('胎停') != -1 ||
        exceptionalcase.indexOf('绒毛摸上皮性疾病') != -1 ||
        naturalAbortion ||
        biochemicalAbortion ||
        fetusdeath ||
        preterm
      ) {
        bool = true;
      }
      return bool;
    }

    return factorKeys;
  };

  function getTreeId(val: string, treeData: IMchc_TemplateTree_Item[]) {
    let treeId = '';
    forEach(treeData, (item) => {
      if (item.val === val) treeId = item.id.toString();
    });
    return String(treeId);
  };

  function handleCheckFactor(keys: any) {


    forEach(treeFactor, (item: any) => {
      if (keys.includes(String(item.id))) {
        item.selected = true;
      } else {
        item.selected = null;
      }
    });
    setFactorKeys(keys)
    setTreeFactor(treeFactor)
  };

  function handleCheckGuide(keys: any) {

    forEach(treeGuide, (item: any) => {
      if (keys.includes(String(item.id))) {
        item.selected = true;
      } else {
        item.selected = null;
      }
    });
    setGuideKeys(keys)
    setTreeGuide(treeGuide)

  };



  async function handleOk() {

    const pregnancyId = headerInfo?.id

    const filterFactor = filter(treeFactor, (item: any) => includes(factorKeys, String(item.id)));
    const factorData = { pregnancyId, type: 34, value: filterFactor, templateId: null };
    const filterGuide = filter(treeGuide, (item: any) => includes(guideKeys, String(item.id)));
    const guideData = { pregnancyId, type: 35, value: filterGuide, templateId: null };
    if (guideData.value.length == 0 && factorData.value.length == 0) {

      // request.delete()deleteHighrisk
      // delete guideData.value;
      // delete factorData.value;
      await SMchc_TemplateTrees.deleteHighrisk(guideData);
      await SMchc_TemplateTrees.deleteHighrisk(factorData);

    } else {
      await SMchc_TemplateTrees.saveAlertAssessment(factorData);
      await SMchc_TemplateTrees.saveAlertAssessment(guideData);
    }

    // let isShowColors = false;
    // forEach(filterGuide, (item) => {

    //   if (item.val.indexOf('高危因素') !== -1) isShowColors = true;
    // });

    close?.(false);
  };

  function transferTemplateData(data: any, pid = 0) {
    const treeData: any = [];
    forEach(data, (item: any) => {
      if (item.pid === pid) {
        if (item.pid === 0) item.className = styles['tree-title'];
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


  const treeFactorNodes = transferTemplateData(treeFactor);

  const treeGuideNodes = transferTemplateData(treeGuide);
  const footer = [
    <>
      <p className={styles["footer-tips"]}>
        {mchcEnv.is('郫都') ? '参考指南：子痫前期的预防及预测指南(2025)' : '参考指南：2018美国妇产科医师协会“妊娠期低剂量阿司匹林的应用”'}
      </p>
      <Space style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button onClick={() => close?.()}>取消</Button>
        <Button type="primary" onClick={handleOk}>
          确定
        </Button>
        <ReactToPrint
          trigger={() => (
            <div>
              <Button type="primary">打印</Button>
            </div>
          )}
          /*为了获取更新数据后的页面*/
          onBeforeGetContent={async () => {
            setTimeout(() => { }, 100);
          }}
          content={() => printTableRef.current}
        />
      </Space>
    </>,
  ];

  return (
    <Modal
      {...others}
      className={styles["preeclampsia-modal"]}
      title="子痫前期风险评估表"
      // visible={isShowPreeclampsia && treeFactorNodes.length > 0 && treeGuideNodes.length > 0}
      width={900}
      footer={footer}
      maskClosable={false}
    >
      <Row>
        <Col span={12} className={styles["tree-left"]}>
          <Tree
            key={treeFactorNodes}
            checkable
            defaultExpandAll={true}
            checkedKeys={factorKeys}
            onCheck={handleCheckFactor}
            treeData={treeFactorNodes}
          />
        </Col>
        <Col span={11} offset={1} className={styles["tree-right"]}>
          <Tree
            key={treeGuideNodes}
            checkable
            defaultExpandAll={true}
            checkedKeys={guideKeys}
            onCheck={handleCheckGuide}
            treeData={treeGuideNodes}
          />
        </Col>
      </Row>
      <div style={{ display: 'none' }}>
        <div style={{ marginTop: '28px' }} ref={printTableRef} className={styles["printPreeclampsia"]}>
          <h2 style={{ textAlign: 'center' }}>子痫前期风险评估表</h2>
          <Row>
            <Col span={12} className={styles["tree-left"]}>
              <Tree
                key={treeFactorNodes}
                checkable
                defaultExpandAll={true}
                checkedKeys={factorKeys}
                treeData={treeFactorNodes}
              />
            </Col>
            <Col span={11} offset={1} className={styles["tree-right"]}>
              <Tree
                key={treeGuideNodes}
                checkable
                defaultExpandAll={true}
                checkedKeys={guideKeys}
                treeData={treeGuideNodes}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  );
}



