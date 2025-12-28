import React, { Component } from 'react';
import { Tabs } from 'antd';
import { get, size } from 'lodash';
import { api } from '../.api';
import BloodGlucose from './components/BloodGlucose';
import BloodPressure from './components/BloodPressure';
import FetalMovement from './components/FetalMovement';
import './index.less';
import { mchcUtils } from '@lm_fe/env';

export class DoctorEnd_HomeCare extends Component {
  state = {
    defaultActiveKey: null,
    bloodGlucose: [],
    bloodPressure: [],
    fetalMovement: [],
  };

  async componentDidMount() {
    const pregnancyId = mchcUtils.getDoctorEndId(this.props);
    const bloodGlucose = await api.home.getBloodGlucoseInHome(pregnancyId);
    const bloodPressure = await api.home.getBloodPressureInHome(pregnancyId);
    const fetalMovement = await api.home.getFetalMovementInHome(pregnancyId);
    this.setState({
      bloodGlucose,
      bloodPressure,
      fetalMovement,
    });
    if (size(bloodGlucose) > 0) {
      this.setState({ defaultActiveKey: 'bloodGlucose' });
    } else if (size(bloodPressure) > 0) {
      this.setState({ defaultActiveKey: 'bloodPressure' });
    } else if (size(fetalMovement) > 0) {
      this.setState({ defaultActiveKey: 'fetalMovement' });
    } else {
      this.setState({ defaultActiveKey: 'bloodGlucose' });
    }
  }

  render() {
    const { defaultActiveKey, bloodGlucose, bloodPressure, fetalMovement } = this.state;
    return defaultActiveKey ? (
      <div className="prenatal-visit-main_home">
        <Tabs defaultActiveKey={defaultActiveKey}>
          <Tabs.TabPane tab="血糖" key="bloodGlucose">
            <BloodGlucose bloodGlucose={bloodGlucose} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="血压" key="bloodPressure">
            <BloodPressure bloodPressure={bloodPressure} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="胎动" key="fetalMovement">
            <FetalMovement fetalMovement={fetalMovement} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    ) : null;
  }
}
