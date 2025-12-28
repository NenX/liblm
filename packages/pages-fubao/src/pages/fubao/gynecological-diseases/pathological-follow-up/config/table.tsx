import { APP_CONFIG } from "@lm_fe/components_m"
import { get } from 'lodash';
export const tableColumns = [
  {
    title: '检查日期',
    dataIndex: 'checkDate',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  // {
  //   title: '档案号',
  //   dataIndex: 'checkupNO',
  //   width: APP_CONFIG.CELL_WIDTH_SMALL,
  // },
  {
    title: '姓名',
    dataIndex: 'name',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '手机号码',
    dataIndex: 'telephone',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '筛查类型',
    dataIndex: 'screeningType',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  // {
  //   title: '初筛结果异常/可疑项目',
  //   dataIndex: 'nationality',
  //   width: APP_CONFIG.CELL_WIDTH_LARGE,
  // },
  {
    title: '初筛建议',
    dataIndex: 'screeningSuggest',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '病理检查日期',
    dataIndex: 'pathologicalExaminationDate',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '病理检查情况',
    dataIndex: 'pathologicalExaminationResult',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '治疗方法',
    dataIndex: 'treatment',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '备注',
    dataIndex: 'notificationNote',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (text: any, record: any) => {
      return text
        ? `${text}${get(record, 'notificationOtherNote') ? `-${get(record, 'notificationOtherNote')}` : ''}`
        : '';
    },
  },
  {
    title: '随访日期',
    dataIndex: 'notificationDate',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '随访方式',
    dataIndex: 'notificationWay',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '是否失访',
    dataIndex: 'loseTrack',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (text: any) => {
      if (text === 0) {
        return '否';
      }
      if (text === 1) {
        return <span style={{ color: 'red' }}>是</span>;
      }
      return '';
    },
  },
  {
    title: '随访状态',
    dataIndex: 'notificationStatus',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (text: any) => {
      if (text === 1) {
        return (
          <div>
            <span
              style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                marginRight: 4,
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: 'green',
              }}
            ></span>
            <span style={{ display: 'inline-block', verticalAlign: 'middle', color: 'green' }}>随访成功</span>
          </div>
        );
      }
      if (text === 2) {
        return (
          <div>
            <span
              style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                marginRight: 4,
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: 'red',
              }}
            ></span>
            <span style={{ display: 'inline-block', verticalAlign: 'middle', color: 'red' }}>随访失败</span>
          </div>
        );
      }
      return (
        <div>
          <span
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              marginRight: 4,
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: 'gray',
            }}
          ></span>
          <span style={{ display: 'inline-block', verticalAlign: 'middle', color: '#9e9a9a' }}>待随访</span>
        </div>
      );
    },
  },
];
