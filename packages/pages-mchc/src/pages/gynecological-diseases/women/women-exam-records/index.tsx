import React from 'react';
import WomenExamRecordsList from './List';
import { get } from 'lodash';
import { PanelWithChild } from '@lm_fe/components_m';
import { getSearchParamsValue, request } from '@lm_fe/utils';
export default class List extends PanelWithChild {
  state = {
    data: {},
  };

  async componentDidMount() {
    const id = getSearchParamsValue('id');
    const data = (await request.get(`/api/gynecological-patients/${id}`)).data;
    this.setState({
      data,
    });
  }

  renderHeader = () => {
    const { data } = this.state;
    return (
      <div className={PanelWithChild.styles["panel-with-child_header"]}>
        <div className={PanelWithChild.styles["panel-with-child_header-item"]}>
          <span className={PanelWithChild.styles["panel-with-child_header-item-label"]}>姓名:</span>
          <span className={PanelWithChild.styles["panel-with-child_header-item-value"]}>{get(data, 'name')}</span>
        </div>
        <div className={PanelWithChild.styles["panel-with-child_header-item"]}>
          <span className={PanelWithChild.styles["panel-with-child_header-item-label"]}>年龄:</span>
          <span className={PanelWithChild.styles["panel-with-child_header-item-value"]}>{get(data, 'age')}</span>
        </div>
        <div className={PanelWithChild.styles["panel-with-child_header-secend-item"]}>
          <span className={PanelWithChild.styles["panel-with-child_header-secend-item-label"]}>门诊号:</span>
          <span className={PanelWithChild.styles["panel-with-child_header-secend-item-value"]}>{get(data, 'outpatientNO')}</span>
        </div>
      </div>
    );
  };

  renderContent = () => {
    const id = getSearchParamsValue('id');

    return <WomenExamRecordsList asChildComponentQueryLabel="gynecologicalPatientId.equals" id={id} />;
  };
}
