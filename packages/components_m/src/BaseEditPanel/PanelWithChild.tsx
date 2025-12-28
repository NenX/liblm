import React from 'react';
import styles from './less/panel-with-child.module.less';
export interface IPanelWithChildProps { }
interface IState {
  data: {
    name?: string;
    age?: string | number;
    [propName: string]: any;
  };
  [propName: string]: any;
}
export class PanelWithChild extends React.Component<IPanelWithChildProps, IState> {
  constructor(props) {
    super(props);
    this.headerRef = React.createRef();
    this.state = {
      data: {
        name: '',
        age: '',
        currentGestationalWeek: '',
        sureEdd: '',
        edd: '',
        outpatientNO: '',
        inpatientNO: '',
        checkupNO: '',
      },
    };
  }

  renderHeader = () => {
    const {
      data: { name, age, currentGestationalWeek, sureEdd, edd, outpatientNO, inpatientNO, checkupNO },
    } = this.state;
    return (
      <div className={styles["panel-with-child_header"]}>
        <div className={styles["panel-with-child_header-item"]}>
          <span className={styles["panel-with-child_header-item-label"]}>姓名：</span>
          <span className={styles["panel-with-child_header-item-value"]}>{name}</span>
        </div>
        <div className={styles["panel-with-child_header-item"]}>
          <span className={styles["panel-with-child_header-item-label"]}>年龄：</span>
          <span className={styles["panel-with-child_header-item-value"]}>{age}</span>
        </div>
        <div className={styles["panel-with-child_header-item"]}>
          <span className={styles["panel-with-child_header-item-label"]}>孕周：</span>
          <span className={styles["panel-with-child_header-item-value"]}>{currentGestationalWeek}</span>
        </div>
        <div className={styles["panel-with-child_header-item"]}>
          <span className={styles["panel-with-child_header-item-label"]}>预产期：</span>
          <span className={styles["panel-with-child_header-item-value"]}>{sureEdd || edd}</span>
        </div>
        <div className={styles["panel-with-child_header-item"]}>
          <span className={styles["panel-with-child_header-item-label"]}>就诊卡号：</span>
          <span className={styles["panel-with-child_header-item-value"]}>{outpatientNO}</span>
        </div>
        {inpatientNO && (
          <div className={styles["panel-with-child_header-item"]}>
            <span className={styles["panel-with-child_header-item-label"]}>住院号：</span>
            <span className={styles["panel-with-child_header-item-value"]}>{inpatientNO}</span>
          </div>
        )}
        <div className={styles["panel-with-child_header-item"]}>
          <span className={styles["panel-with-child_header-item-label"]}>产检编号：</span>
          <span className={styles["panel-with-child_header-item-value"]}>{checkupNO}</span>
        </div>
      </div>
    );
  };

  renderContent = () => {
    return <></>;
  };

  render() {
    return (
      <div className={styles["panel-with-child"]}>
        <div ref={this.headerRef}>{this.renderHeader()}</div>
        <div
          className={styles["panel-with-child_content"]}
          style={{ height: `calc(100% - ${this.headerRef.current?.clientHeight}px` }}
        >
          {this.renderContent()}
        </div>
      </div>
    );
  }
}
type EC = typeof PanelWithChild & { styles: React.CSSProperties }
const PanelWithChild_Styles: EC = Object.assign(PanelWithChild, { styles })

export default PanelWithChild_Styles