
import { defineFormConfig, IMchc_FormDescriptions_Field, } from "@lm_fe/service";
import { mchcEnv } from "@lm_fe/env";
const keyChangeToValuesOptions = (str: string) => {
  let strArr = str.split(',');
  let options: Array<any> = [];
  strArr.map(data => {
    options.push({
      label: data,
      value: data,
    })
  })
  return options;
}
let formItemLayoutObj = {
  formItemLayout: {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }
}
export default defineFormConfig(
  [
    {
      label: '会阴情况',
      name: 'perineum',
      inputType: 'MC',
      inputProps: {
        options: keyChangeToValuesOptions('完整,自然裂伤,侧切,正切'),
        marshal: 0
      },
      layout: '1/3',
      ...formItemLayoutObj,
    },
    {
      label: '会阴裂伤度',
      name: 'perineumlaceration',
      inputType: 'MC',
      inputProps: {
        options: keyChangeToValuesOptions('Ⅰ°,Ⅱ°,Ⅲ°'),
        marshal: 0
      },
      layout: '1/3',
      ...formItemLayoutObj,
      requiredDeps: {
        perineum: ['自然裂伤']
      },
    },
    {
      label: '胎盘娩出',
      name: 'placentaDelivered',
      inputType: 'MC',
      inputProps: {
        options: keyChangeToValuesOptions('完整,不完整,人工剥离,清宫'),
        marshal: 0
      },
      layout: '1/3',
      ...formItemLayoutObj,
    },
    {
      label: '产时出血量', name: 'bloodLoss', inputType: 'input', layout: '1/3', ...formItemLayoutObj,
    },
    {
      label: '产后出血及原因', name: 'hemorrhageReason', inputType: 'MC', layout: '2/3',
      inputProps: {
        options: [
          { value: '无', label: '无', exclusive: true, },
          { value: '子宫收缩乏力', label: '子宫收缩乏力' },
          { value: '胎盘因素', label: '胎盘因素' },
          { value: '软产道损伤', label: '软产道损伤' },
          { value: '凝血功能异常', label: '凝血功能异常' },
        ],
        marshal: 0,
        type: 'multiple',
      },
    },
    {
      label: '',
      inputType: 'FormTabs',
      name: 'admission.noenateRecords',
      inputProps: {
        "marshal": 0,
        // "targetLabelCol": 2,
        title: '胎儿',
        fds: [{
          label: '胎儿娩出时间',
          name: 'deliverytime',
          inputType: 'DatePicker',
          inputProps: {
            showTime: true,
          },
          layout: '1/3',
          ...formItemLayoutObj,
        }, {
          label: '身长(cm)',
          name: 'height',
          inputType: 'input',
          layout: '1/3',
          ...formItemLayoutObj,
        }, {
          label: '体重(g)',
          name: 'weight',
          inputType: 'input',
          layout: '1/3',
          ...formItemLayoutObj,
        }, {
          label: '健康情况',
          name: 'healthStatus',
          inputType: 'MC',
          inputProps: {
            options: keyChangeToValuesOptions('良好,一般,差'),
            marshal: 0,
          },
          layout: '1/3',
          ...formItemLayoutObj,
        },
        {
          label: '性别',
          name: 'gender',
          inputType: 'MC',
          inputProps: {
            options: '男,女,不详',
            marshal: 0,
          },
          layout: '1/3',
          ...formItemLayoutObj,
        },
        {
          label: '孕周',
          name: 'gestationWeek',
          inputType: 'input',
          layout: '1/3',
          ...formItemLayoutObj,
        },
        {
          label: '分娩方式',
          name: 'deliverytype',
          inputType: 'MC',
          inputProps: {
            options: mchcEnv.is('郫都') ? '顺产,剖宫产,胎吸,钳产,臀助产,臀牵引,阴道助产,人工引产,人工流产,药物流产,自然流产' : '',
            optionKey: mchcEnv.is('郫都') ? '' as any : '分娩方式',
            marshal: 0,
          },
          layout: '1',
          formItemLayout: {
            labelCol: { span: 2 },
            wrapperCol: { span: 22 }
          }
        },
        {
          label: '医学指征剖宫产',
          name: 'medicalIndication',
          inputType: 'MC',
          inputProps: {
            options: '是,否',
            marshal: 0,
          },
          layout: '1/3',
          ...formItemLayoutObj,
        },
        {
          label: '出生时状况',
          name: 'initialBirthState',
          inputType: 'MC',
          inputProps: {
            options: keyChangeToValuesOptions('红润,发紫,苍白'),
            marshal: 0,
          },
          layout: '1/3',
          ...formItemLayoutObj,
        },
        {
          label: '阿氏评分1',
          name: 'apgar1',
          inputType: 'Input',
          layout: '1/3',
          ...formItemLayoutObj,
          isNewRow: true
        },
        {
          label: '阿氏评分2',
          name: 'apgar5',
          inputType: 'Input',
          layout: '1/3',
          ...formItemLayoutObj,
        },
        {
          label: '阿氏评分3',
          name: 'apgar10',
          inputType: 'Input',
          layout: '1/3',
          ...formItemLayoutObj,
        },
        {
          label: '接生医生',
          name: 'midwife',
          inputType: 'Input',
          layout: '1/3',
          ...formItemLayoutObj,
        },
        {
          label: '分娩地点',
          name: 'bornPlace',
          inputType: 'MC',
          inputProps: {
            options: keyChangeToValuesOptions('医院,家庭,途中,妇幼保健院,其他'),
            marshal: 0,
          },
          layout: '2/3',
          formItemLayout: {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
          }
        },
        {
          label: '婴儿死亡',
          name: 'babyDie',
          inputType: 'MC',
          inputProps: {
            options: keyChangeToValuesOptions('死胎,死产,产后死亡'),
            marshal: 0,
          },
          layout: '1/4',
          ...formItemLayoutObj,
          isNewRow: true
        },
        {
          label: '住院号',
          name: 'hosNO',
          inputType: 'Input',
          layout: '1/4',
          ...formItemLayoutObj,
        },
        {
          label: '出院日期',
          name: 'dischargeDate',
          inputType: 'DatePicker',
          layout: '1/4',
          ...formItemLayoutObj,
        },
        {
          label: '室息时间',
          name: 'chokeTime',
          inputType: 'Input',
          layout: '1/4',
          ...formItemLayoutObj,
        },
        {
          label: '死亡原因',
          name: 'deathCause',
          inputType: 'Input',
          layout: '1/2',
          formItemLayout: {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
          }
        },
        {
          label: '畸形形象描述',
          name: 'abnormalityDescription',
          inputType: 'MS',
          layout: '1/2',
          required: true,
          inputProps: {
            marshal: 0,
            type: 'multiple',
            options: [
              { value: '0', label: '无', exclusive: true, },
              {
                "label": "01.无脑畸形(Q00)",
                "value": "01"
              },
              {
                "label": "02.脊柱裂(Q05)",
                "value": "02"
              },
              {
                "label": "03.脑膨出(Q01)",
                "value": "03"
              },
              {
                "label": "04.先天性脑积水(Q03)",
                "value": "04"
              },
              {
                "label": "05.腭裂(Q35)-左",
                "value": "05"
              },
              {
                "label": "06.唇裂(Q36)-左",
                "value": "06"
              },
              {
                "label": "07.唇裂合并腭裂(Q37)-左",
                "value": "07"
              },
              {
                "label": "08.小耳(包括无耳)(Q17.2,Q16.0)-左",
                "value": "08"
              },
              {
                "label": "09.外耳其它畸形(小耳,无耳除外)(Q17)-左",
                "value": "09"
              },
              {
                "label": "10.食道闭锁或狭窄(Q39)",
                "value": "10"
              },
              {
                "label": "11.直肠肛门闭锁或狭窄(含无肛)(Q42)",
                "value": "11"
              },
              {
                "label": "12.尿道下裂(Q54)",
                "value": "12"
              },
              {
                "label": "13.膀胱外翻(Q64.1)",
                "value": "13"
              },
              {
                "label": "14.马蹄内翻足(Q66.0)-左",
                "value": "1401"
              },
              {
                "label": "14.马蹄内翻足(Q66.0)-右",
                "value": "1402"
              },
              {
                "label": "15.多指(Q69)-左",
                "value": "15"
              },
              {
                "label": "16.并指(Q70)-左",
                "value": "16"
              },
              {
                "label": "17.肢体短缩[包括缺指(趾)裂手(足)]-上肢左",
                "value": "1701"
              },
              {
                "label": "17.肢体短缩[包括缺指(趾)裂手(足)]-上肢右",
                "value": "1702"
              },
              {
                "label": "17.肢体短缩[包括缺指(趾)裂手(足)]-下肢左",
                "value": "1703"
              },
              {
                "label": "17.肢体短缩[包括缺指(趾)裂手(足)]-下肢右",
                "value": "1704"
              },
              {
                "label": "18.先天性膈疝(Q79.0)",
                "value": "18"
              },
              {
                "label": "19.脐膨出(Q79.2)",
                "value": "19"
              },
              {
                "label": "20.腹裂(Q79.3)",
                "value": "20"
              },
              {
                "label": "21.联体双胎(Q89.4)",
                "value": "21"
              },
              {
                "label": "22.唐氏综合征(21-三体综合征)(Q90)",
                "value": "22"
              },
              {
                "label": "23.先天性心脏病(Q20-26)",
                "value": "23"
              },
              {
                "label": "24.其它(写明病名或详细描述)",
                "value": "24"
              },
              {
                "label": "外耳附耳(左)",
                "value": "2501"
              },
              {
                "label": "外耳附耳(右)",
                "value": "2502"
              },
              {
                "label": "05.腭裂(Q35)-中",
                "value": "0501"
              },
              {
                "label": "05.腭裂(Q35)-右",
                "value": "0502"
              },
              {
                "label": "06.唇裂(Q36)-中",
                "value": "0601"
              },
              {
                "label": "06.唇裂(Q36)-右",
                "value": "0602"
              },
              {
                "label": "07.唇裂合并腭裂(Q37)-中",
                "value": "0701"
              },
              {
                "label": "07.唇裂合并腭裂(Q37)-右",
                "value": "0702"
              },
              {
                "label": "08.小耳(包括无耳)(Q17.2,Q16.0)-右",
                "value": "0801"
              },
              {
                "label": "09.外耳其它畸形(小耳,无耳除外)(Q17)-右",
                "value": "0901"
              },
              {
                "label": "15.多指(Q69)-右",
                "value": "1501"
              },
              {
                "label": "15.多趾(Q69)-左",
                "value": "1502"
              },
              {
                "label": "15.多趾(Q69)-右",
                "value": "1503"
              },
              {
                "label": "16.并指(Q70)-右",
                "value": "1601"
              },
              {
                "label": "16.并趾(Q70)-左",
                "value": "1602"
              },
              {
                "label": "16.并趾(Q70)-右",
                "value": "1603"
              },
              {
                "label": "15.多指(Q69)-左",
                "value": "1504"
              },
              {
                "label": "16.并指(Q70)-左",
                "value": "1604"
              },
            ]
          },
          formItemLayout: {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
          }
        },
        {
          label: '早产原因',
          name: 'pretermCause',
          inputType: 'MC',
          inputProps: {
            options: [
              { value: '胎膜早破', label: '胎膜早破' },
              { value: '双胎', label: '双胎' },
              { value: '妊娠期高血压', label: '妊娠期高血压' },
              { value: '糖尿病', label: '糖尿病' },
              { value: '胆淤症', label: '胆淤症' },
              { value: '产前出血', label: '产前出血' },
              { value: '前置胎盘', label: '前置胎盘' },
              { value: '其他(因其他合并症引起)', label: '其他(因其他合并症引起)' },
              { value: '自发性早产', label: '自发性早产', exclusive: true, },
            ],
            marshal: 0,
            type: 'multiple',
          },
          layout: '1',
          formItemLayout: {
            labelCol: { span: 2 },
            wrapperCol: { span: 20 }
          }
        },
        {
          label: '备注',
          name: 'memo',
          inputType: 'TextArea',
          placeHolder: '请输入其他畸形、不计入畸形情况、听力筛查备注、其他情况',
          inputProps: {
            placeHolder: '请输入其他畸形、不计入畸形情况、听力筛查备注、其他情况'
          },
          layout: '1',
          formItemLayout: {
            labelCol: { span: 2 },
            wrapperCol: { span: 20 }
          }
        },
        {
          label: '听力基因检测',
          name: 'earCheck',
          inputType: 'MC',
          inputProps: {
            options: keyChangeToValuesOptions('未做,已做'),
            marshal: 0,
          },
          layout: '1/3',
        },
        {
          label: '眼底筛查',
          name: 'eyeCheck',
          inputType: 'MC',
          inputProps: {
            options: keyChangeToValuesOptions('未做,已做'),
            marshal: 0,
          },
          layout: '1/3',
        },
        {
          label: '新生儿免疫球蛋白注射',
          name: 'ygbmkyQdb',
          inputType: 'MC',
          inputProps: {
            options: keyChangeToValuesOptions('是,否'),
            marshal: 0,
          },
          layout: '1/3',
          isNewRow: true,
          formItemLayout: {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }
        },
        {
          label: '免疫球蛋白注射时间',
          name: 'ygbmkyQdbDate',
          inputType: 'DatePicker',
          layout: '1/3',
          formItemLayout: {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }
        },
        {
          label: '新生儿首剂乙肝疫苗接种',
          name: 'fhbvac',
          inputType: 'MC',
          inputProps: {
            options: keyChangeToValuesOptions('是,否'),
            marshal: 0,
          },
          layout: '1/3',
          isNewRow: true,
          formItemLayout: {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }
        },
        {
          label: '首剂乙肝疫苗接种时间',
          name: 'fhbvacDate',
          inputType: 'DatePicker',
          layout: '1/3',
          formItemLayout: {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }
        }]
      }
    },

  ]
)