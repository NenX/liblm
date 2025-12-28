import { APP_CONFIG, rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
const ctx = rt_ctx
const React = rt_ctx.React
const mchcEnv = rt_ctx.mchcEnv
export default function () {

    return defineFormConfig(
        [
            {
                title: '原血片号',
                layout: '1/2',
                dataIndex: 'bloodNo',
                width: APP_CONFIG.CELL_WIDTH_SMALL,
                fixed: 'left',

            },
            // {
            //   title: '复筛血片号',
            //   layout: '1/2',
            //   dataIndex: 'secondaryBloodNo',
            //   width: APP_CONFIG.CELL_WIDTH_SMALL,
            //   
            // },
            {
                title: '床号',
                layout: '1/2',
                dataIndex: 'bedNO',
                width: APP_CONFIG.CELL_WIDTH_MIDDLE,
                fixed: 'left',
            },
            {
                title: '母亲姓名',
                layout: '1/2',
                dataIndex: 'name',
                width: APP_CONFIG.CELL_WIDTH_MIDDLE,
                fixed: 'left',
                render: (value: any, record: any) =>
                    <div title={record?.deleteFlag ? '该数据已被护理系统删除' : ''}>{value}</div>

                ,
            },
            {
                title: '多胎',
                layout: '1/2',
                dataIndex: 'multiplets',
                width: 50,
            },
            {
                title: '联系电话',
                layout: '1/2',
                dataIndex: 'telephone',
                align: 'center',
                inputType: 'MA',
                width: APP_CONFIG.CELL_WIDTH_MIDDLE,

                inputProps: {
                    memorieskey: 'telephone',
                    memoriesname: '联系电话',
                },
            },
            {
                title: '联系电话2',
                layout: '1/2',
                dataIndex: 'telephone2',
                align: 'center',
                inputType: 'MA',
                width: APP_CONFIG.CELL_WIDTH_MIDDLE,

                inputProps: {
                    memorieskey: 'telephone',
                    memoriesname: '联系电话',
                },
            },
            {
                title: '住院号',
                layout: '1/2',
                dataIndex: 'inpatientNo',
                width: APP_CONFIG.CELL_WIDTH_SMALL,

            },
            {
                title: '胎儿娩出时间',
                layout: '1/2',
                dataIndex: 'deliveryTime',
                width: APP_CONFIG.CELL_WIDTH_MIDDLE,

                inputType: 'single_date_picker',
                // inputProps: {
                //   showTime: { format: 'HH:mm' },
                //   format: 'YYYY-MM-DD HH:mm',
                // },
                render: (value: any) => ctx.utils.formatDate(value,),
            },
            {
                title: '婴儿性别',
                layout: '1/2',
                dataIndex: 'gender',
                inputType: 'MySelect',
                inputProps: { optionKey: '性别3', marshal: 0 },
                width: 68,


            },
            {
                title: '采血日期',
                layout: '1/2',
                dataIndex: 'bloodSamplingTime',
                width: APP_CONFIG.CELL_WIDTH_SMALL,

                inputType: 'single_date_picker',
                render: (value: any) => ctx.utils.formatDate(value,),
            },
            {
                title: '采血人',
                layout: '1/2',
                dataIndex: 'bloodSamplingPeople',
                inputType: 'MA',

                width: APP_CONFIG.CELL_WIDTH_MIDDLE,
                inputProps: {
                    memorieskey: 'diseaseSignature',
                    memoriesname: '新生儿疾病-采血人',
                },
            },
            {
                title: '迟采血原因',
                layout: '1/2',
                dataIndex: 'delayed',

                width: APP_CONFIG.CELL_WIDTH_SMALL,
            },
            {
                title: '标本寄送日期',
                layout: '1/2',
                dataIndex: 'sampleTime',
                width: APP_CONFIG.CELL_WIDTH_SMALL,

                inputType: 'single_date_picker',
                render: (value: any) => ctx.utils.formatDate(value,),
            },
            {
                title: '标本质量',
                layout: '1/2',
                dataIndex: 'sample',
                inputType: 'MySelect',
                inputProps: { uniqueKey: 'diseaseScreening.sampleQuality' },
                width: 86,


            },
            {
                title: '标本重采',
                layout: '1/2',
                dataIndex: 'sampleRepeat',
                inputType: 'MySelect',
                inputProps: { uniqueKey: 'diseaseScreening.sampleRepeat' },
                width: 86,


            },
            {
                title: '筛查阳性结果-G6PD',
                layout: '1/2',
                dataIndex: 'resultG6PD',
                inputType: 'MySelect',
                inputProps: { uniqueKey: 'diseaseScreening.screeningResult' },
                width: APP_CONFIG.CELL_WIDTH_SMALL,
                align: 'center',


            },
            {
                title: '筛查阳性结果-甲低',
                layout: '1/2',
                dataIndex: 'resultHypothyroidism',
                inputType: 'MySelect',
                inputProps: { uniqueKey: 'diseaseScreening.screeningResult' },
                width: APP_CONFIG.CELL_WIDTH_SMALL,
                align: 'center',


            },
            {
                title: '筛查阳性结果-苯丙酮尿症',
                layout: '1/2',
                dataIndex: 'resultPKU',
                inputType: 'MySelect',
                inputProps: { uniqueKey: 'diseaseScreening.screeningResult' },
                width: APP_CONFIG.CELL_WIDTH_SMALL,
                align: 'center',


            },
            {
                title: '筛查阳性结果-CAH',
                layout: '1/2',
                dataIndex: 'resultCAH2',
                inputType: 'MySelect',
                inputProps: { uniqueKey: 'diseaseScreening.screeningResult' },
                width: APP_CONFIG.CELL_WIDTH_SMALL,


            },
            {
                title: '筛查阳性结果-串联质谱',
                layout: '1/2',
                dataIndex: 'resultLCMS',
                inputType: 'MySelect',
                inputProps: { uniqueKey: 'diseaseScreening.screeningResult' },
                width: APP_CONFIG.CELL_WIDTH_SMALL,

            },
            {
                title: '未筛查原因',
                layout: '1/2',
                dataIndex: 'noScreening',

                width: APP_CONFIG.CELL_WIDTH_SMALL,
            },
            {
                title: '备注',
                layout: '1/2',
                dataIndex: 'note',
                width: APP_CONFIG.CELL_WIDTH_SMALL,

            },
        ]
    )
}