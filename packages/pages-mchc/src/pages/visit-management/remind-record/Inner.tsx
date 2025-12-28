import { formatTimeToDate, OkButton } from "@lm_fe/components_m";
import { APP_CONFIG, mchcLogger } from "@lm_fe/env";
import { MyBaseList } from "@lm_fe/pages";
import { request } from "@lm_fe/utils";
import { message } from "antd";
import { get } from "lodash";
import React from "react";
import { RemindType } from "./types";


// remindType 预约提醒1 超时提醒2 超时电话提醒3

const req_url: { [x in RemindType]: string } = {
  1: "/api/prenatal-visit-logs/apppointmentRemind",
  2: "/api/prenatal-visit-logs/timeoutRemind",
  3: ""
}
export default function RemindRecord(prop: { remindType: RemindType }) {
  const remindType = prop.remindType
  const url = req_url[remindType]
  return <MyBaseList
    name="/api/prenatal-visit-logs"

    searchParams={{
      'remindType.equals': remindType,
    }}
    needChecked
    useListSourceCount
    initialSearchValue={{

    }}
    searchConfig={[
      { label: '就诊卡号', name: 'prenatalVisitCriteria.pregnancy.outpatientNO', inputType: 'Input' },
      { label: '姓名', name: 'prenatalVisitCriteria.pregnancy.name', inputType: 'Input' },
      { label: '预约时间', name: 'appointmentDate', inputType: 'rangeDate' },
      { label: '提醒方式', name: 'remindWay', inputType: 'MS', inputProps: { options: '短信,微信' } },
      { label: '发送状态', name: 'sendStatus', inputType: 'MS', inputProps: { options: '成功,失败' } },

    ]}

    showAction={false}
    showAdd={false}
    RenderBtns={(ctx) => {
      const selectRows = ctx.getCheckRows()
      return <OkButton primary disabled={!selectRows.length} onClick={async () => {
        const q = ctx.getSearchParams()
        mchcLogger.log('qq', { q, selectRows })


        const remindWay = get(q, 'remindWay.equals');
        if (!remindWay) {
          message.info('请选择提醒方式...');
          return
        }
        const prenatalVisitIds = selectRows.map((_) => get(_, 'prenatalVisit.id'));

        // if (prenatalVisitIds.length <= 0) {
        //   return message.info('请选择需要提醒的用户...！');
        // }
        const params = {
          remindWay,
          prenatalVisitIds,
        };
        // await request.post('/api/prenatal-visit-logs/apppointmentRemind', params);
        await request.post(url, params);

        message.info('批量发送操作成功，详情请看发送记录~！');


        ctx.handleSearch()
      }}>重新发送</OkButton>
    }}

    genColumns={ctx => {
      return [
        {
          title: '姓名',
          dataIndex: ['prenatalVisit', 'pregnancy', 'name'],
          width: APP_CONFIG.CELL_WIDTH_SMALL,
          showSorter: false,

          align: 'center',
        },
        {
          title: '就诊卡号',
          dataIndex: ['prenatalVisit', 'pregnancy', 'outpatientNO'],
          width: APP_CONFIG.CELL_WIDTH_SMALL,

        },
        {
          title: '预产期',
          dataIndex: ['prenatalVisit', 'pregnancy', 'edd'],
          width: APP_CONFIG.CELL_WIDTH_SMALL,
        },
        {
          title: '当前孕周',
          dataIndex: ['prenatalVisit', 'pregnancy', 'currentGestationalWeek'],
          width: APP_CONFIG.CELL_WIDTH_SMALL,
          showSorter: false,
          showFilter: false,
        },
        {
          title: '上次就诊时间',
          dataIndex: 'lastVisitDate',
          width: APP_CONFIG.CELL_WIDTH_SMALL,
          render: (value: string) => formatTimeToDate(value),
        },
        {
          title: '复诊预约日期',
          dataIndex: ['prenatalVisit', 'appointmentDate'],
          width: APP_CONFIG.CELL_WIDTH_SMALL,
          render: (value: string) => formatTimeToDate(value),
        },
        // 提醒方式 1 短信 2微信 3电话
        {
          title: '提醒方式',
          dataIndex: 'remindWay',
          width: APP_CONFIG.CELL_WIDTH_SMALL,
          render: (text) => {
            let index = text ? text : 0;
            const state = ['', '短信', '微信', '电话'];
            return state[index];
          },
        },
        {
          title: '发送时间',
          dataIndex: 'sendTime',
          width: APP_CONFIG.CELL_WIDTH_SMALL,
          render: (value: string) => formatTimeToDate(value),
        },
        {
          title: '发送状态',
          dataIndex: 'sendStatus',
          width: APP_CONFIG.CELL_WIDTH_SMALL,
          render: (text) => {
            let index = text ? text : 0;
            const state = ['', '成功', '失败', '未知'];
            return state[index];
          },
        },
        {
          title: '异常提示',
          dataIndex: 'errorMsg',
          width: APP_CONFIG.CELL_WIDTH_SMALL,
        },
        {
          title: '发送内容',
          dataIndex: 'content',
          width: APP_CONFIG.CELL_WIDTH_LARGE,

        },
        {
          title: '操作',
          dataIndex: 'content',
          width: APP_CONFIG.CELL_WIDTH_LARGE,
          render: (a, record) => {
            return <OkButton size="small" primary onClick={async () => {
              const id = get(record, 'prenatalVisit.id');
              const params = {
                remindWay: record.remindWay, // 提醒方式 1 短信 2微信
                prenatalVisitIds: [id],
              };
              await request.post(url, params);
              message.info('发送操作成功，详情请看发送记录~');
              ctx.handleSearch();
            }}>

              发送
            </OkButton>
          },
        },
      ]
    }}
  />
}

