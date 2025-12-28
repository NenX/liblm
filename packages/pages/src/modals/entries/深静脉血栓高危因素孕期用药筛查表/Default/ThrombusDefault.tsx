import { IGlobalModalProps } from '@lm_fe/components';
import { IMchc_TemplateTree_Item, SMchc_Doctor, SMchc_TemplateTrees, TIdTypeCompatible } from '@lm_fe/service';
import { Button, Col, Modal, Row, Space } from 'antd';
import { DataNode } from 'antd/lib/tree';
import classNames from 'classnames';
import { filter, forEach, get, includes, isEmpty } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import styles from './index.module.less';
import React from 'react';
import { LoadingPlaceholder } from '@lm_fe/components_m';
import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


interface IProos {
  pregnancyId: TIdTypeCompatible


}
export function ThrombusDefault(props: IGlobalModalProps<IProos>) {

  const { modal_data, close, ...others } = props;
  const { pregnancyId, } = modal_data;


  const printTableRef = useRef<HTMLDivElement>(null)
  const [treeFactor, setTreeFactor] = useState<IMchc_TemplateTree_Item[]>([])
  const [treeGuide, setTreeGuide] = useState<IMchc_TemplateTree_Item[]>([])
  const [factorKeys, setFactorKeys] = useState<string[]>([])
  const [guideKeys, setGuideKeys] = useState<string[]>([])


  useEffect(() => {


    (async () => {

      const treeFactor = await SMchc_TemplateTrees.getTemplateTree(31);
      const treeGuide = await SMchc_TemplateTrees.getTemplateTree(32);
      const selecteFactor = await SMchc_TemplateTrees.findAlertAssessment(31, pregnancyId);
      const selecteGuide = await SMchc_TemplateTrees.findAlertAssessment(32, pregnancyId);
      const res = await SMchc_Doctor.getPreRiskAssessmentInfo(pregnancyId);

      const factorValue = get(selecteFactor, 'value') || [];
      const factorKeys: string[] = [];
      forEach(factorValue, (item) => factorKeys.push(String(item.id)));
      const guideValue = get(selecteGuide, 'value') || [];
      const guideKeys: string[] = [];
      forEach(guideValue, (item) => guideKeys.push(String(item.id)));

      /**自动勾选项判断*/
      const bmi = get(res, 'bmi');
      const futureAge = get(res, 'eddAge');
      const parity = get(res, 'parity');
      const diagnosesList = get(res, 'diagnoses')
      const familyHistoryOtherNote = get(res, 'familyHistoryOrderNote') || '';
      const smoke = get(res, 'smoke');
      const conceiveMode = get(res, 'conceiveMode');


      if (bmi > 30) factorKeys.push(getTreeId('肥胖(BMI>30kg/㎡)', treeFactor));
      if (futureAge >= 35) factorKeys.push(getTreeId('年龄>=35岁', treeFactor));
      if (parity >= 3) factorKeys.push(getTreeId('产次≥3', treeFactor));
      if (smoke) factorKeys.push(getTreeId('吸烟', treeFactor));
      if (conceiveMode === 1) factorKeys.push(getTreeId('IVF/ART', treeFactor));
      forEach(diagnosesList, (item) => {
        if (
          item.diagnosis.indexOf('肿瘤') !== -1 ||
          item.diagnosis.indexOf('癌') !== -1 ||
          item.diagnosis.indexOf('心衰') !== -1 ||
          item.diagnosis.indexOf('心力衰竭') !== -1 ||
          item.diagnosis.indexOf('狼疮') !== -1 ||
          item.diagnosis.indexOf('SLE') !== -1 ||
          item.diagnosis.indexOf('肠炎') !== -1 ||
          item.diagnosis.indexOf('肠道感染') !== -1 ||
          item.diagnosis.indexOf('镰状细胞病') !== -1 ||
          item.diagnosis.indexOf('镰状细胞疾患') !== -1 ||
          item.diagnosis.indexOf('多关节炎') !== -1 ||
          item.diagnosis.indexOf('多关节型关节炎') !== -1 ||
          item.diagnosis.indexOf('肾病综合征') !== -1
        ) {
          factorKeys.push(
            getTreeId(
              '内科合并症：\r\n 肿瘤、心衰、狼疮活动\r\n 炎症性肠病、镰状细胞病、炎性多关节病\r\n 肾病综合征、1型糖尿病合并肾病',
              treeFactor,
            ),
          );
        }
        if (
          item.diagnosis.indexOf('1型糖尿病') !== -1 &&
          item.diagnosis.indexOf('肾') !== -1 &&
          item.diagnosis.indexOf('胎') == -1
        ) {
          factorKeys.push(
            getTreeId(
              '内科合并症：\r\n 肿瘤、心衰、狼疮活动\r\n 炎症性肠病、镰状细胞病、炎性多关节病\r\n 肾病综合征、1型糖尿病合并肾病',
              treeFactor,
            ),
          );
        }
        if (item.diagnosis.indexOf('子痫前期') !== -1) {
          factorKeys.push(getTreeId('本次妊娠子痫前期', treeFactor));
        }
        if (item.diagnosis.indexOf('静脉曲张') !== -1) {
          factorKeys.push(getTreeId('静脉曲张', treeFactor));
        }
        if (item.diagnosis.indexOf('截瘫') !== -1) {
          factorKeys.push(getTreeId('不能活动如截瘫或者长时间制动者', treeFactor));
        }
        if (
          familyHistoryOtherNote.indexOf('栓') !== -1 ||
          familyHistoryOtherNote.indexOf('梗') !== -1 ||
          familyHistoryOtherNote.indexOf('VTE') !== -1
        ) {
          factorKeys.push(getTreeId('VTE家族史', treeFactor));
        }
        if (
          item.diagnosis.indexOf('双胎妊娠') !== -1 ||
          item.diagnosis.indexOf('三胎妊娠') !== -1 ||
          item.diagnosis.indexOf('四胎妊娠') !== -1 ||
          item.diagnosis.indexOf('五胎妊娠') !== -1 ||
          item.diagnosis.indexOf('多胎妊娠') !== -1
        ) {
          factorKeys.push(getTreeId('多胎妊娠', treeFactor));
        }
      });
      setTreeFactor(treeFactor)
      setTreeGuide(treeGuide)
      setFactorKeys(factorKeys)
      setGuideKeys(guideKeys)
    })()

  }, [])


  function getTreeId(val: string, treeData: any) {
    let treeId = '';
    forEach(treeData, (item) => {
      if (item.val === val) treeId = item.id;
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

  function handleCancel() {


    close?.(false);
  };

  async function handleOk() {


    const filterFactor = filter(treeFactor, (item: any) => includes(factorKeys, String(item.id)));
    const factorData = { pregnancyId, type: 31, value: filterFactor, templateId: null };
    await SMchc_TemplateTrees.saveAlertAssessment(factorData);

    const filterGuide = filter(treeGuide, (item: any) => includes(guideKeys, String(item.id)));
    const guideData = { pregnancyId, type: 32, value: filterGuide, templateId: null };
    await SMchc_TemplateTrees.saveAlertAssessment(guideData);


    close?.(true);
  };

  function transferTemplateData(data: IMchc_TemplateTree_Item[], pid = 0) {
    const treeData: DataNode[] = [];
    data.forEach((item) => {
      const _item: DataNode = { key: String(item.id) }
      if (item.pid === pid) {
        _item.style = { padding: `${item.depid}px 0`, }
        _item.className = classNames({ [styles['tree-title']]: item.pid === 0 }, { [styles['active-item']]: item.active });
        _item.title = item.val;
        _item.key = String(item.id)

        _item.children = transferTemplateData(data, item.id);
        if (isEmpty(_item.children)) {
          _item.isLeaf = true;
        } else {
          _item.isLeaf = false;
        }
        treeData.push(_item);
      }
    });
    return treeData;
  };

  const treeFactorNodes = transferTemplateData(treeFactor);
  const treeGuideNodes = transferTemplateData(treeGuide);
  const footer = [
    <>
      <p className={styles["footer-tips"]}>
        《2015RCOG降低妊娠及产褥期静脉血栓栓塞的风险》附录1 Obstetric thromboprophylaxis risk assessment and
        management
      </p>
      <Space>
        <Button onClick={handleCancel}>取消</Button>
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
      className={styles["screening-modal"]}
      title="深静脉血栓高危因素孕期用药筛查表"
      width={960}
      onCancel={handleCancel}
      footer={footer}
      maskClosable={false}
    >
      {
        treeFactor.length
          ? <Row>
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
          : <LoadingPlaceholder />
      }
      <div style={{ display: 'none' }}>
        <div style={{ marginTop: '28px' }} ref={printTableRef} className={styles["printscreening"]}>
          <h2 style={{ textAlign: 'center' }}>深静脉血栓高危因素孕期用药筛查表</h2>
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




