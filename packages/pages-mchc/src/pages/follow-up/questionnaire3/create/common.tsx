// import Editor from '@/components/GeneralComponents/Editor';
import { mchcEnv } from '@lm_fe/env';
import { IMchc_QuestionGroup, IMchc_QuestionItem, IMchc_QuestionOption, mchcEnums } from '@lm_fe/service';
export const QuestionTypeEnums = mchcEnums.Questionnaire.type
export type TQuestionType = typeof mchcEnums.Questionnaire.type.t
type TChooseArray = { title: TQuestionType, iconImg: any }[]
export const chooseArray: TChooseArray = [
  {
    title: '单选题',
    iconImg: mchcEnv.gs(_=>_.lm_imgs.qn['radio.png']),
  },
  {
    title: '多选题',
    iconImg: mchcEnv.gs(_=>_.lm_imgs.qn['checkbox.png']),

  },
  {
    title: '下拉题',
    iconImg: mchcEnv.gs(_=>_.lm_imgs.qn['select.png']),

  },
  {
    title: '填空题',
    iconImg: mchcEnv.gs(_=>_.lm_imgs.qn['vacancy.png']),

  },

];
export const starArray: TChooseArray = [
  {
    title: '打分题',
    iconImg: mchcEnv.gs(_=>_.lm_imgs.qn['stars.png']),

  },
];
export const descArray: TChooseArray = [
  {
    title: '段落说明',
    iconImg: mchcEnv.gs(_=>_.lm_imgs.qn['description.png']),

  },
];
export const labelsArray = [...chooseArray, ...starArray, ...descArray];
export const labelsArrayMapping = labelsArray.reduce((a, b) => Object.assign(a, { [b.title]: b }), {} as { [x in TQuestionType]: typeof labelsArray[1] })
const defaultSelectOptions = [
  {
    optionIndex: 1000,
    optionScore: 0,
    optionTitle: '选项1',
  },
  {
    optionIndex: 1001,
    optionScore: 0,
    optionTitle: '选项2',
  },
] as unknown as IMchc_QuestionOption[]
const defaultOtherOptions = [
  {
    optionIndex: 1000,
    optionScore: 0,
    optionTitle: 'contain',
  },
] as unknown as IMchc_QuestionOption[]
export const initQuestionMap: { [x in typeof QuestionTypeEnums.t]: Partial<IMchc_QuestionItem> } = {
  '单选题': {
    questionOptionList: defaultSelectOptions,
    questionTitle: '',
    questionType: QuestionTypeEnums.getValue('单选题'),
  },
  '多选题': {
    questionOptionList: defaultSelectOptions,
    questionTitle: '',
    questionType: QuestionTypeEnums.getValue('多选题'),
  },

  '下拉题': {
    questionOptionList: defaultSelectOptions,
    questionTitle: '',
    questionType: QuestionTypeEnums.getValue('下拉题'),
  },
  '填空题': {
    questionOptionList: defaultOtherOptions,
    questionTitle: '',
    questionType: QuestionTypeEnums.getValue('填空题'),
  },
  '打分题': {
    questionOptionList: defaultOtherOptions,

    questionTitle: '',
    questionType: QuestionTypeEnums.getValue('打分题'),
  },
  '段落说明': {
    questionOptionList: defaultOtherOptions,

    questionTitle: '',
    questionType: QuestionTypeEnums.getValue('段落说明'),
  },


}
export function getTargetQuestionInGroup(allQuestions: IMchc_QuestionItem[], groupIndex?: number, group?: IMchc_QuestionGroup,) {
  if (typeof groupIndex !== 'number' || !group) return undefined
  const allIdx = allQuestions.map(_ => _.questionIndex)
  const list = group.questionIndexList.filter(_ => allIdx.includes(_))
  const realQuestionIndex = list[groupIndex]
  const activeQuestion = typeof realQuestionIndex === 'number' ? allQuestions.find(_ => _.questionIndex === realQuestionIndex) : undefined
  return activeQuestion
}
export function getQuestionsInGroup(allQuestions: IMchc_QuestionItem[], groups?: IMchc_QuestionGroup,) {
  const data = groups?.questionIndexList?.map(_ => allQuestions.find(q => q.questionIndex === _) as IMchc_QuestionItem).filter(_ => !!_) || []
  return data
}

