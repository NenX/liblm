import { changeScreening } from '@/actions/prenatal-visit';
import { api } from '@/pages/prenatal-visit/pregnancy/doctor-end/api';
import { Button, Col, Modal, Row, Space } from 'antd';
import { filter, forEach, get, includes, isEmpty, size } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactToPrint from 'react-to-print';
import './index.less';
import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd
class Index extends Component {
  printTableRef: any = React.createRef();
  state = {
    treeFactor: null,
    treeGuide: null,
    factorKeys: [],
    guideKeys: [],
  };

  async componentDidMount() {
    const { pregnancyData } = this.props;
    const pregnancyId = get(pregnancyData, 'id');
    const treeFactor = await api.components.getTemplateTree(31);
    const treeGuide = await api.components.getTemplateTree(32);
    const selecteFactor = await api.components.findAlertAssessment(31, pregnancyId);
    const selecteGuide = await api.components.findAlertAssessment(32, pregnancyId);
    const res = await api.components.getPreAssessmentInfo(pregnancyId);

    const factorValue = get(selecteFactor, 'value') || [];
    const factorKeys: any[] = [];
    forEach(factorValue, (item) => factorKeys.push(String(item.id)));
    const guideValue = get(selecteGuide, 'value') || [];
    const guideKeys: any[] = [];
    forEach(guideValue, (item) => guideKeys.push(String(item.id)));

    /**自动勾选项判断*/
    const bmi = get(res, 'bmi');
    const futureAge = get(res, 'eddAge');
    const parity = get(res, 'parity');
    const diagnosesList = get(res, 'diagnoses') || get(this.props, 'diagnosesList');
    const familyHistoryOtherNote = get(res, 'familyHistoryOrderNote') || '';
    const smoke = get(res, 'smoke');
    const conceiveMode = get(res, 'conceiveMode');


    if (bmi > 30) factorKeys.push(this.getTreeId('肥胖(BMI>30kg/㎡)', treeFactor));
    if (futureAge >= 35) factorKeys.push(this.getTreeId('年龄>=35岁', treeFactor));
    if (parity >= 3) factorKeys.push(this.getTreeId('产次≥3', treeFactor));
    if (smoke) factorKeys.push(this.getTreeId('吸烟', treeFactor));
    if (conceiveMode === 1) factorKeys.push(this.getTreeId('IVF/ART', treeFactor));
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
          this.getTreeId(
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
          this.getTreeId(
            '内科合并症：\r\n 肿瘤、心衰、狼疮活动\r\n 炎症性肠病、镰状细胞病、炎性多关节病\r\n 肾病综合征、1型糖尿病合并肾病',
            treeFactor,
          ),
        );
      }
      if (item.diagnosis.indexOf('子痫前期') !== -1) {
        factorKeys.push(this.getTreeId('本次妊娠子痫前期', treeFactor));
      }
      if (item.diagnosis.indexOf('静脉曲张') !== -1) {
        factorKeys.push(this.getTreeId('静脉曲张', treeFactor));
      }
      if (item.diagnosis.indexOf('截瘫') !== -1) {
        factorKeys.push(this.getTreeId('不能活动如截瘫或者长时间制动者', treeFactor));
      }
      if (
        familyHistoryOtherNote.indexOf('栓') !== -1 ||
        familyHistoryOtherNote.indexOf('梗') !== -1 ||
        familyHistoryOtherNote.indexOf('VTE') !== -1
      ) {
        factorKeys.push(this.getTreeId('VTE家族史', treeFactor));
      }
      if (
        item.diagnosis.indexOf('双胎妊娠') !== -1 ||
        item.diagnosis.indexOf('三胎妊娠') !== -1 ||
        item.diagnosis.indexOf('四胎妊娠') !== -1 ||
        item.diagnosis.indexOf('五胎妊娠') !== -1 ||
        item.diagnosis.indexOf('多胎妊娠') !== -1
      ) {
        factorKeys.push(this.getTreeId('多胎妊娠', treeFactor));
      }
    });
    this.setState({ treeFactor, treeGuide, factorKeys, guideKeys });
  }

  getTreeId = (val: string, treeData: any) => {
    let treeId = '';
    forEach(treeData, (item) => {
      if (item.val === val) treeId = item.id;
    });
    return String(treeId);
  };

  handleCheckFactor = (keys: any) => {
    const { treeFactor } = this.state;
    forEach(treeFactor, (item: any) => {
      if (keys.includes(String(item.id))) {
        item.selected = true;
      } else {
        item.selected = null;
      }
    });
    this.setState({ factorKeys: keys, treeFactor });
  };

  handleCheckGuide = (keys: any) => {
    const { treeGuide } = this.state;
    forEach(treeGuide, (item: any) => {
      if (keys.includes(String(item.id))) {
        item.selected = true;
      } else {
        item.selected = null;
      }
    });
    this.setState({ guideKeys: keys, treeGuide });
  };

  handleCancel = () => {
    const { changeScreening } = this.props;
    changeScreening(false);
  };

  handleOk = async () => {
    const { changeScreening, pregnancyData, onClose, handleSubmit } = this.props;
    const { treeFactor, treeGuide, factorKeys, guideKeys } = this.state;
    const pregnancyId = get(pregnancyData, 'id');

    const filterFactor = filter(treeFactor, (item: any) => includes(factorKeys, String(item.id)));
    const factorData = { pregnancyId, type: 31, value: filterFactor, templateId: null };
    await api.components.saveAlertAssessment(factorData);

    const filterGuide = filter(treeGuide, (item: any) => includes(guideKeys, String(item.id)));
    const guideData = { pregnancyId, type: 32, value: filterGuide, templateId: null };
    await api.components.saveAlertAssessment(guideData);
    handleSubmit && handleSubmit();
    if (size(factorKeys) === 0 && size(guideKeys) === 0) {
      onClose('screeningColorsVisible', false);
    } else {
      onClose('screeningColorsVisible', true);
    }
    changeScreening(false);
  };

  transferTemplateData = (data: any, pid = 0) => {
    const treeData: any = [];
    forEach(data, (item: any) => {
      if (item.pid === pid) {
        if (item.pid === 0) item.className = 'tree-title';
        item.title = item.val;
        item.key = String(item.id);
        item.children = this.transferTemplateData(data, item.id);
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

  render() {
    const { treeFactor, treeGuide, factorKeys, guideKeys } = this.state;
    const { isShowScreening } = this.props;
    const treeFactorNodes = this.transferTemplateData(treeFactor);
    const treeGuideNodes = this.transferTemplateData(treeGuide);
    const footer = [
      <>
        <p className="footer-tips">
          《2015RCOG降低妊娠及产褥期静脉血栓栓塞的风险》附录1 Obstetric thromboprophylaxis risk assessment and
          management
        </p>
        <Space>
          <Button onClick={this.handleCancel}>取消</Button>
          <Button type="primary" onClick={this.handleOk}>
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
              setTimeout(() => {}, 100);
            }}
            content={() => this.printTableRef}
          />
        </Space>
      </>,
    ];

    return (
      <Modal
        className="screening-modal"
        title="深静脉血栓高危因素孕期用药筛查表"
        visible={isShowScreening && treeFactorNodes.length>0 && treeGuideNodes.length>0}
        width={900}
        onCancel={this.handleCancel}
        footer={footer}
        maskClosable={false}
      >
        <Row>
          <Col span={12} className="tree-left">
            <Tree
              key={treeFactorNodes}
              checkable
              defaultExpandAll={true}
              checkedKeys={factorKeys}
              onCheck={this.handleCheckFactor}
              treeData={treeFactorNodes}
            />
          </Col>
          <Col span={11} offset={1} className="tree-right">
            <Tree
              key={treeGuideNodes}
              checkable
              defaultExpandAll={true}
              checkedKeys={guideKeys}
              onCheck={this.handleCheckGuide}
              treeData={treeGuideNodes}
            />
          </Col>
        </Row>
        <div style={{ display: 'none' }}>
          <div style={{ marginTop: '28px' }} ref={(refs) => (this.printTableRef = refs)} className="printscreening">
            <h2 style={{ textAlign: 'center' }}>深静脉血栓高危因素孕期用药筛查表</h2>
            <Row>
              <Col span={12} className="tree-left">
                <Tree
                  key={treeFactorNodes}
                  checkable
                  defaultExpandAll={true}
                  checkedKeys={factorKeys}
                  treeData={treeFactorNodes}
                />
              </Col>
              <Col span={11} offset={1} className="tree-right">
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
}
const mapDisPathchToProps = { changeScreening };
export default connect(null, mapDisPathchToProps)(Index);
