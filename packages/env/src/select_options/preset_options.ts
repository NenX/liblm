import { mchcEnv } from '../env';
import { checkbox_options } from './checkbox_options';
import { 国家, 国家s } from './country';
import { getDualModeOptions } from './funcs';
import { ICommonOption } from './types';
export { getSimpleOptions, getDualModeOptions, optionKey不详, optionKey其他, optionKey否, getSameOptions } from './funcs'
const userTypeMapping = () => [
  {
    value: 1,
    label: '临时用户',
  },
  {
    value: 2,
    label: '永久用户',
  },
];


const orderStatusMapping = () => [
  {
    value: 0,
    label: '待付款',
  },
  {
    value: 1,
    label: '已支付',
  },
  {
    value: 2,
    label: '使用中',
  },
  {
    value: 3,
    label: '已完成',
  },
  {
    value: 4,
    label: '已关闭',
  },
  {
    value: 5,
    label: '逾期中',
  },
  {
    value: 6,
    label: '已取消',
  },
];

const [随访状态, 随访状态s] = getDualModeOptions(() => '已完成,待随访,未到,失访')


const [性别4, 性别4s] = getDualModeOptions(() => '男,女,未知,双性')
const [性别3, 性别3s] = getDualModeOptions(() => '男、女、未知')
const [性别2, 性别2s] = getDualModeOptions(() => '男、女')
const [宫腔镜并发症, 宫腔镜并发症s] = getDualModeOptions(() => `TRUP综合征,子宫穿孔,其他脏器损伤,出血,气体栓塞,肺栓塞,感染,其它`)

const [地址类型, 地址类型s] = getDualModeOptions(() => '农村,城镇')
const [人流手术, 人流手术s] = getDualModeOptions(() => `吸宫术,钳刮术,药物流产,清宫术,诊刮术,阴道镜+活检,阴道镜,宫颈息肉摘除术,宫颈锥切术,宫颈射频治疗,输卵管造影术,输卵管通液术,宫内节育器放置-免费,宫内节育器放置-自费,宫内节育器放置取出,外阴（阴道）良性肿物切除术,前庭大腺囊肿造口术,宫颈内口探查术,取皮埋术,宫腔镜检查术,其它`)

const [人流并发症, 人流并发症s] = getDualModeOptions(() => `无,子宫穿孔,人流/药流不全,漏吸,感染,术中出血,环脱落,其它`, { start: 0 })

const [人流原因, 人流原因s] = getDualModeOptions(() => '医学需要胚胎异常,医学需要母体异常,非意愿妊娠')



const [职业, 职业s] = getDualModeOptions(() =>
  mchcEnv.is('建瓯')
    ? '学生（大中小学生）,教师,保育员及保姆,餐饮食品业,公共场所服务员,商业服务,医务人员,工人,民工,牧民,渔（船）民,海员及长途驾驶员,干部职员,离退人员,家务及待业,其他,不详'
    : '学生(研究生/大学/中学),教师,医务人员,国家公务员,专业技术人员,企业管理人员,自由职业者,工人,现役军人,个体经营者,职员,农民,退(离)休人员,其它'
)


const [民族, 民族s] = getDualModeOptions(() => `汉族、蒙古族、回族、藏族、维吾尔族、苗族、彝族、壮族、布依族、朝鲜族、满族、侗族、瑶族、白族、土家族、哈尼族、哈萨克族、傣族、黎族、傈僳族、佤族、畲族、高山族、拉祜族、水族、东乡族、纳西族、景颇族、柯尔克孜族、土族、达斡尔族、仫佬族、羌族、布朗族、撒拉族、毛难族、仡佬族、锡伯族、阿昌族、普米族、塔吉克族、怒族、乌孜别克族、俄罗斯族、鄂温克族、崩龙族、保安族、裕固族、京族、塔塔尔族、独龙族、鄂伦春族、赫哲族、门巴族、珞巴族、基诺族、其它`)

const [民族10, 民族10s] = getDualModeOptions(() => `汉族,壮族,满族,回族,苗族,维吾尔族,彝族,土家族,蒙古族,藏族,其他`)

const [阴阳3, 阴阳3s] = getDualModeOptions(() => '阴性、阳性、不详')
const [产后出血高危因素, 产后出血高危因素s] = getDualModeOptions(() => `精神,糖尿病,甲减,甲亢,产程延长,前置胎盘,胎盘早剥,高血压,宫腔感染,多胎,羊水过多,巨大儿,瘢痕子宫,多产,子宫肌瘤,子宫畸形(双子宫、双角),肌纤维变性 (高龄),镇静剂、收缩抑制剂,胎盘滞留,胎盘植入或黏连,胎盘残留,胎盘过大,钳产,臀牵引,产道血肿,急产/产程过快,宫颈裂伤,会阴深度裂伤,裂伤处血管出血,会阴侧切,软产道静脉曲张,外阴水肿,软产道组织弹性差而产力过强,血小板减少,贫血,肝脏疾病,产科DIC(死胎、羊水栓塞、重度子痫前期),产前出血,产后出血史,过期妊娠,催引产,不良孕产史,胎膜早破,椎管内麻醉`)

const relationMapping = () => [
  {
    value: 1,
    label: '丈夫',
  },
  {
    value: 2,
    label: '父亲',
  },
  {
    value: 3,
    label: '母亲',
  },
  {
    value: 4,
    label: '爷爷',
  },
  {
    value: 5,
    label: '奶奶',
  },
  {
    value: 6,
    label: '姐姐',
  },
  {
    value: 7,
    label: '妹妹',
  },
  {
    value: 8,
    label: '哥哥',
  },
  {
    value: 9,
    label: '弟弟',
  },
  {
    value: 10,
    label: '儿子',
  },
  {
    value: 11,
    label: '女儿',
  },
  {
    value: 12,
    label: '妻子',
  },
];
const [婚姻, 婚姻s] = getDualModeOptions(() => '已婚,未婚,离异,再婚,丧偶,同居')


const provinceMapping = () => [
  {
    code: '11',
    label: '北京市',
    value: '北京市',
  },
  {
    code: '12',
    label: '天津市',
    value: '天津市',
  },
  {
    code: '13',
    label: '河北省',
    value: '河北省',
  },
  {
    code: '14',
    label: '山西省',
    value: '山西省',
  },
  {
    code: '15',
    label: '内蒙古自治区',
    value: '内蒙古自治区',
  },
  {
    code: '21',
    label: '辽宁省',
    value: '辽宁省',
  },
  {
    code: '22',
    label: '吉林省',
    value: '吉林省',
  },
  {
    code: '23',
    label: '黑龙江省',
    value: '黑龙江省',
  },
  {
    code: '31',
    label: '上海市',
    value: '上海市',
  },
  {
    code: '32',
    label: '江苏省',
    value: '江苏省',
  },
  {
    code: '33',
    label: '浙江省',
    value: '浙江省',
  },
  {
    code: '34',
    label: '安徽省',
    value: '安徽省',
  },
  {
    code: '35',
    label: '福建省',
    value: '福建省',
  },
  {
    code: '36',
    label: '江西省',
    value: '江西省',
  },
  {
    code: '37',
    label: '山东省',
    value: '山东省',
  },
  {
    code: '41',
    label: '河南省',
    value: '河南省',
  },
  {
    code: '42',
    label: '湖北省',
    value: '湖北省',
  },
  {
    code: '43',
    label: '湖南省',
    value: '湖南省',
  },
  {
    code: '44',
    label: '广东省',
    value: '广东省',
  },
  {
    code: '45',
    label: '广西壮族自治区',
    value: '广西壮族自治区',
  },
  {
    code: '46',
    label: '海南省',
    value: '海南省',
  },
  {
    code: '50',
    label: '重庆市',
    value: '重庆市',
  },
  {
    code: '51',
    label: '四川省',
    value: '四川省',
  },
  {
    code: '52',
    label: '贵州省',
    value: '贵州省',
  },
  {
    code: '53',
    label: '云南省',
    value: '云南省',
  },
  {
    code: '54',
    label: '西藏自治区',
    value: '西藏自治区',
  },
  {
    code: '61',
    label: '陕西省',
    value: '陕西省',
  },
  {
    code: '62',
    label: '甘肃省',
    value: '甘肃省',
  },
  {
    code: '63',
    label: '青海省',
    value: '青海省',
  },
  {
    code: '64',
    label: '宁夏回族自治区',
    value: '宁夏回族自治区',
  },
  {
    code: '65',
    label: '新疆维吾尔自治区',
    value: '新疆维吾尔自治区',
  },
  {
    code: '81',
    label: '香港特别行政区',
    value: '香港特别行政区',
  },
  {
    code: '82',
    label: '澳门特别行政区',
    value: '澳门特别行政区',
  },
  {
    code: '71',
    label: '台湾省',
    value: '台湾省',
  },
  {
    code: '91',
    label: '海外',
    value: '海外',
  },
  {
    code: '99',
    label: '其他',
    value: '其他',
  },
];
const 胎方位12: () => ICommonOption[] = () => [
  {
    value: 0,
    label: '左枕前(LOA)',
  },
  {
    value: 1,
    label: '左枕横(LOT)',
  },
  {
    value: 2,
    label: '左枕后(LOP)',
  },
  {
    value: 3,
    label: '右枕前(LOA)',
  },
  {
    value: 4,
    label: '右枕横(LOT)',
  },
  {
    value: 5,
    label: '右枕后(LOP)',
  },
  {
    value: 6,
    label: '左骶前(LSA)',
  },
  {
    value: 7,
    label: '左骶横(LST)',
  },
  {
    value: 8,
    label: '左骶后(LSP)',
  },
  {
    value: 9,
    label: '右骶前(LSA)',
  },
  {
    value: 10,
    label: '右骶横(LST)',
  },
  {
    value: 11,
    label: '右骶后(LSP)',
  },
  {
    value: 12,
    label: '正枕后(OP)',
  },
];

const hasOrNoMapping = () => [
  {
    value: false,
    label: '无',
  },
  {
    value: true,
    label: '有',
  },
];


const consciousnessMapping = () => [
  {
    value: 0,
    label: '清醒',
  },
  {
    value: 1,
    label: '嗜睡',
    warning: true,
  },
  {
    value: 2,
    label: '模糊',
    warning: true,
  },
  {
    value: 3,
    label: '昏睡',
    warning: true,
  },
  {
    value: 4,
    label: '昏迷',
    warning: true,
  },
];


const [否是, 否是s] = getDualModeOptions(() => '否,是')
const [无有, 无有s] = getDualModeOptions(() => '无,有')



const premaritalExamResultMapping = () => [
  {
    value: 0,
    label: '未查',
  },
  {
    value: 1,
    label: '正常',
  },
  {
    value: 2,
    label: '异常',
  },
];

const aboMapping = () => [
  {
    value: 1,
    label: 'A',
  },
  {
    value: 2,
    label: 'B',
  },
  {
    value: 3,
    label: 'AB',
  },
  {
    value: 4,
    label: 'O',
  },
  {
    value: 5,
    label: '不详',
  },
] as ICommonOption[];

const rhMapping = () => [
  {
    value: 1,
    label: '阴性',
  },
  {
    value: 2,
    label: '阳性',
  },
  {
    value: 3,
    label: '不详',
  },
];



const passMapping = () => [
  {
    value: 1,
    label: '未通过',
  },
  {
    value: 2,
    label: '通过',
  },
  {
    value: 3,
    label: '未筛',
  },
];

const pediatricMapping = () => [
  {
    value: true,
    label: '转儿科',
  },
];
const rhTypeMapping = () => [
  {
    value: 1,
    label: 'RH(-)',
  },
  {
    value: 2,
    label: 'RH(+)',
  },
] as ICommonOption[];

const jingfouMapping = () => [
  {
    value: '经',
    label: '经',
  },
  {
    value: '否',
    label: '否',
  },
];

const settlementTypeMapping = () => [
  {
    value: 1,
    label: '社会基本医疗保险',
  },
  {
    value: 2,
    label: '公费医疗',
  },
  {
    value: 3,
    label: '大病统筹',
  },
  {
    value: 4,
    label: '商业保险',
  },
  {
    value: 5,
    label: '自费医疗',
  },
  {
    value: 99,
    label: '其他',
  },
];

const nurseLevelMapping = () => [
  { value: '特级', label: '特级' },
  { value: '一级', label: '一级' },
  { value: '二级', label: '二级' },
  { value: '三级', label: '三级' },
];

const processMapping = () => [
  {
    value: '顺利',
    label: '顺利',
  },
  {
    value: '困难',
    label: '困难',
  },
  {
    value: '失败',
    label: '失败',
  },
];

const recordStateMapping = () => [
  { label: '待审核', value: '0' },
  { label: '已审核', value: '1' },
  { label: '已结案', value: '6' },
];

// const periodStateMapping = ()=>[
//     { label: '怀孕中', value: '1' },
//     { label: '已分娩', value: '2' },
//     { label: '终止妊娠', value: '3' },
//     { label: '失访', value: '4' },
//     { label: '转院', value: '5' },
// ];



const [孕期状态, 孕期状态s] = getDualModeOptions(() =>

  mchcEnv.is('广三')
    ? '怀孕中,已分娩,终止妊娠,外院分娩,转院'
    : '怀孕中,已分娩,终止妊娠,失访,转院'
  , { useString: true })

const deliveryModeMapping = () => [
  { label: '顺产', value: 1 },
  { label: '剖宫产', value: 2 },
  { label: '钳产', value: 3 },
  { label: '吸引产', value: 4 },
  { label: '臀助产', value: 5 },
];

const appointmentStateMapping = () => [
  { label: '预约', value: 1 },
  { label: '到达', value: 2 },
  { label: '取消', value: 3 },
  { label: '其他', value: 4 },
];

const [上报状态, 上报状态s] = getDualModeOptions(() => '成功,失败,未上报,保存失败')


// const reportStateMapping = () => [
//     { label: '成功', value: 1 },
//     { label: '失败', value: 2 },
//     { label: '未上报', value: 3 },
//     { label: '保存失败', value: 4 },
// ];

const surgicalMapping = () => [
  {
    value: 1,
    label: '羊膜腔穿刺',
  },
  {
    value: 2,
    label: '绒毛活检术',
  },
  {
    value: 3,
    label: '脐带穿刺术',
  },
  {
    value: 4,
    label: '羊膜腔灌注术',
  },
  {
    value: 5,
    label: '羊膜腔注药术',
  },
  {
    value: 6,
    label: '选择性减胎',
  },
  {
    value: 7,
    label: '羊水减量',
  },
  {
    value: 8,
    label: '宫内输血',
  },
  {
    value: 9,
    label: '胎儿囊液穿刺',
  },
];



const ultrosoundMapping = () => [
  { label: '未筛', value: '未筛' },
  { label: '正常', value: '正常' },
  { label: '异常', value: '异常' },
];

const prenatalDiagnosisMapping = () => [
  { label: '未做', value: '未做' },
  { label: '正常', value: '正常' },
  { label: '异常', value: '异常' },
];

const HouseholdTypeMapping = () => [
  { label: '城镇户籍', value: '城镇户籍' },
  { label: '农业户籍', value: '农业户籍' },
];

const releaseTypeMapping = () => [
  { label: '门诊', value: 1 },
  { label: '住院', value: 2 },
];

const deviceStateMapping = () => [
  { label: '空闲', value: 1 },
  { label: '使用中', value: 2 },
  { label: '故障', value: 9 },
];

const amyExamGestation = () => [
  { label: '孕期', value: '孕期' },
  { label: '产时', value: '产时' },
];


// const 胎方位22: () => ICommonOption[] = () => [
//     { "label": "未定", "value": 0, },
//     { "label": "左枕前(LOA)", "value": 1, },
//     { "label": "左枕横(LOT)", "value": 2, },
//     { "label": "左枕后(LOP)", "value": 3, },
//     { "label": "右枕前(ROA)", "value": 4, },
//     { "label": "右枕横(ROT)", "value": 5, },
//     { "label": "右枕后(ROP)", "value": 6, },
//     { "label": "左骶前(LSA)", "value": 7, },
//     { "label": "左骶横(LST)", "value": 8, },
//     { "label": "左骶后(LSP)", "value": 9, },
//     { "label": "右骶前(RSA)", "value": 10, },
//     { "label": "右骶横(RST)", "value": 11, },
//     { "label": "右骶后(RSP)", "value": 12, },
//     { "label": "左颏前(LMA)", "value": 13, },
//     { "label": "左颏横(LMT)", "value": 14, },
//     { "label": "左颏后(LMP)", "value": 15, },
//     { "label": "右颏前(RMA)", "value": 16, },
//     { "label": "右颏横(RMT)", "value": 17, },
//     { "label": "右颏后(RMP)", "value": 18, },
//     { "label": "左肩前(LScA)", "value": 19, },
//     { "label": "左肩后(LScP)", "value": 20, },
//     { "label": "右肩前(RScA)", "value": 21, },
//     { "label": "右肩后(RScP)", "value": 22, },
//     { "label": "正枕后(OP)", "value": 23, },
// ]
const [胎方位22, 胎方位22s] = getDualModeOptions(() =>
  `未定,左枕前(LOA),左枕横(LOT),左枕后(LOP),右枕前(ROA),右枕横(ROT),右枕后(ROP),左骶前(LSA),左骶横(LST),左骶后(LSP),右骶前(RSA),右骶横(RST),右骶后(RSP),左颏前(LMA),左颏横(LMT),左颏后(LMP),右颏前(RMA),右颏横(RMT),右颏后(RMP),左肩前(LScA),左肩后(LScP),右肩前(RScA),右肩后(RScP),正枕后(OP)`,
  { start: 0 }
)
const [文化程度, 文化程度s] = getDualModeOptions(() =>
  mchcEnv.is('建瓯')
    ? '文盲或半文盲,小学,初中,大学专科和专科学校,不详,研究生,高中,技工学校,中等专业学校,大学本科'
    : '文盲/半文盲,小学,初中,高中,中专,大专,本科,硕士,博士及以上,不详'
)



const [证件类型, 证件类型s] = getDualModeOptions(() => '身份证,护照,回乡证,台胞证,港澳台居民居住证,外国人永居证,其它')
const [先露, 先露s] = getDualModeOptions(() => '头,臀,肩,脚,手,未定')
const [先露高低, 先露高低s] = getDualModeOptions(() => '-5、-4、-3、-2、-1、0、+1、+2、+3、+4、+5')

const [乳房情况, 乳房情况s] = getDualModeOptions(() => '胀、稍胀、不胀、回奶、红肿、硬结、未见异常')
const [出量, 出量s] = getDualModeOptions(() => ['术中出血', '阴道出血', '术中尿量', '尿', '呕吐', '痰液', '大便', '尿管', '胃管', '腹腔引流管', '胸腔引流管', 'T管', '肾造瘘管', '空肠造瘘管', '肾周引流管', '盆腔引流管', '肾上引流管', '肾下引流管', '肝上引流管', '肝下引流管', '膈下引流管', '腰骶引流管', '伤口引流管', '负压吸引', '阴道出血', '膀胱造瘘管', '宫腔球囊'])
const [入量, 入量s] = getDualModeOptions(() => ['口服', '输液', '鼻饲', '血小板', '红细胞', '白细胞', '血浆', '冷沉淀', '纤维蛋白', '酶原复合物', '白蛋白', '丙球', 'CTK', '术中输液'])
const [颜色, 颜色s] = getDualModeOptions(() => ['黄色', '绿色', '鲜红色', '暗红色', '酱油色', '咖啡色', '棕色', '黑色', '白色', '无色',])
const [膝反射, 膝反射s] = getDualModeOptions(() => ['正常', '存在'])
const [面色, 面色s] = getDualModeOptions(() => '红润、青紫、苍白、黄染')
const [反应, 反应s] = getDualModeOptions(() => ['好', '迟钝', '弱'])
const [哭声, 哭声s] = getDualModeOptions(() => ['大', '微弱', '无'])
const [吸吮力, 吸吮力s] = getDualModeOptions(() => ['弱', '强'])
const [脐带, 脐带s] = getDualModeOptions(() => ['干洁', '发红', '渗血', '渗液'])
const [臀部, 臀部s] = getDualModeOptions(() => ['干洁', '红臀', '皮疹', '破损'])
const [大便, 大便s] = getDualModeOptions(() => ['未排', '已排', '正常'])
const [小便, 小便s] = getDualModeOptions(() => ['未排', '已排', '正常'])
const [喂养, 喂养s] = getDualModeOptions(() => ['人工', '母乳'])
const [头颈, 头颈s] = getDualModeOptions(() => '正常、产瘤、血肿、皮疹、出血点')



const [阴阳, 阴阳s] = getDualModeOptions(() => '阴性,阳性')
const [推送状态, 推送状态s] = getDualModeOptions(() => '成功,失败,未执行')

const [过敏药物, 过敏药物s] = getDualModeOptions(() => '青霉素类,喹啉类,链霉素,庆大霉素,磺胺类,卡那霉素,头孢类,利福平,氨基比林,普鲁卡因')



const [腹部, 腹部s] = getDualModeOptions(() => '平软、凹陷、膨隆、肠型')
const [生殖器, 生殖器s] = getDualModeOptions(() => '正常、睾丸未降、阴茎短小、龟头红、阴囊水肿、会阴水肿')
const [四肢, 四肢s] = getDualModeOptions(() => '正常、多指(趾)、少指(指)、并指(趾)、外翻、内翻')
const [意识, 意识s] = getDualModeOptions(() => '清醒、嗜睡、模糊、昏睡、昏迷、瞻望')

const [泌乳情况, 泌乳情况s] = getDualModeOptions(() => '通、不通')
const [腹部伤口, 腹部伤口s] = getDualModeOptions(() => '干洁、渗血、渗液')
const [会阴伤口, 会阴伤口s] = getDualModeOptions(() => '正常、水肿、渗血、渗液')
const [宫缩, 宫缩s] = getDualModeOptions(() => '好、乏力')
const [宫底高度, 宫底高度s] = getDualModeOptions(() => 'U-4、U-3、U-2、U-1、U=0、U+1、U+2、U+3、U+4')


const [破膜方式, 破膜方式s] = getDualModeOptions(() => '自然、人工')

const [分娩方式, 分娩方式s] = getDualModeOptions(() =>
  mchcEnv.is('南医增城') ? `顺产,吸引产,钳产,剖宫产,臀助产,臀牵引,肩难产,其他`
    : (
      mchcEnv.is('广三') ? '顺产,剖宫产,钳产,吸引产,臀助产,臀牵引,其他'
        : '自然产,剖宫产,钳产,吸引产,臀助产,臀牵引,其他'
    )
)

const [语言表达, 语言表达s] = getDualModeOptions(() => '清楚、含糊、失语')

// const [生殖缺陷, 生殖缺陷s] = getDualModeOptions(() => `
// 无脑畸形,脊柱裂,脑彭出,先天性脑积水,腾裂,唇裂,唇裂合并膀裂,小耳(包括无耳),
// 外耳其他畸形(小耳、无耳除外),食道闭锁或狭窄,直肠肛门闭锁或狭窄(包括无肛),
// 尿道下裂,膀胱外翻,马蹄内翻足,多指,多趾,并指,并趾,上肢短缩,下肢缩短,先天性隔疵,
// 脐膨出,腹裂,联体双胎,唐氏综合征,其他`)









export const AddresstypeMapping = () => [
  {
    value: 1,
    label: '农业',
  },
  {
    value: 2,
    label: '非农业',
  },
];

export const pre_option_map = {
  ...checkbox_options,
  abo血型: aboMapping,
  rh血型: rhTypeMapping,
  乳房情况s,
  先露,
  先露s,
  先露高低s,
  出量s,
  入量s,
  颜色s,
  膝反射s,
  腹部s,
  生殖器s,
  四肢s,
  面色s,
  反应s,
  哭声s,
  吸吮力s,
  脐带s,
  臀部s,
  大便s,
  小便s,
  喂养s,
  头颈s,
  意识s,
  泌乳情况,
  泌乳情况s,
  腹部伤口s,
  腹部伤口,
  会阴伤口s,
  会阴伤口,
  宫缩s,
  宫底高度s,
  宫底高度,
  破膜方式,
  破膜方式s,
  性别2,
  性别2s,
  性别3,
  性别3s,
  性别4,
  性别4s,
  胎方位12,
  胎方位22,
  胎方位22s,
  分娩方式,
  分娩方式s,
  语言表达,
  语言表达s,
  民族,
  民族s,
  民族10,
  民族10s,
  职业,
  职业s,
  阴阳3,
  阴阳3s,
  否是,
  否是s,
  婚姻,
  婚姻s,
  地址类型,
  地址类型s,
  人流手术,
  人流手术s,
  人流并发症,
  人流并发症s,
  人流原因,
  人流原因s,
  宫腔镜并发症,
  宫腔镜并发症s,

  文化程度,
  文化程度s,
  教育程度: 文化程度,
  教育程度s: 文化程度s,
  无有,
  无有s,
  证件类型,
  证件类型s,
  产后出血高危因素,
  产后出血高危因素s,
  孕期状态,
  孕期状态s,
  阴阳,
  阴阳s,
  档案状态: recordStateMapping,
  过敏药物,
  过敏药物s,
  省份s: provinceMapping,
  国家s,
  国家,
  上报状态,
  上报状态s,
  推送状态,
  推送状态s,
  随访状态,
  随访状态s,
  yesOrNoMapping: () => [
    {
      value: false,
      label: '否',
    },
    {
      value: true,
      label: '是',
    },
  ],
}

export const selectOptionMap: { [x: string]: () => ICommonOption[] } = {
  ...pre_option_map,
  AddresstypeMapping,
  degreeofeducationMapping: 文化程度,
  userTypeMapping,
  orderStatusMapping,
  genderMapping: 性别4,

  IDCardMapping: 证件类型,
  jobMapping: 职业s,
  ethnicMapping: 民族s,
  maritalMapping: 婚姻,
  relationMapping,
  provinceMapping,
  hasOrNoMapping,
  hasOrNoMapping2: 无有,
  // 无有: hasOrNoMapping2,
  consciousnessMapping,
  educationMapping: 文化程度,
  familyTypeMapping: 地址类型,
  cultureMapping: 文化程度,
  premaritalExamResultMapping,

  aboMapping,
  rhMapping2: 阴阳,
  passMapping,
  pediatricMapping,
  rhMapping,
  rhTypeMapping,
  jingfouMapping,
  settlementTypeMapping,
  nurseLevelMapping,
  processMapping,
  recordStateMapping,
  periodStateMapping: 孕期状态,
  deliveryModeMapping,
  appointmentStateMapping,
  reportStateMapping: 上报状态,
  surgicalMapping,
  ultrosoundMapping,
  prenatalDiagnosisMapping,
  HouseholdTypeMapping,
  deviceStateMapping,
  releaseTypeMapping,
  hbsagMapping: 阴阳,
  amyExamGestation,
};


export function merge_preset_options_inner(ops: Partial<typeof pre_option_map>) {
  Object.assign(selectOptionMap, ops)
}
export function getPresetOptions(key: keyof typeof pre_option_map, pure = false) {
  const options = selectOptionMap[key]?.() ?? []
  return pure ? options.map(_ => ({ ..._, inputType: undefined })) : options
}
export function getOptionLabel(k: keyof typeof pre_option_map, value: any, defaultLabel = '') {
  const options = pre_option_map[k]?.() ?? []
  return options.find(_ => _.value === value)?.label ?? defaultLabel
}
export function getOptionValue(k: keyof typeof pre_option_map, label: any) {
  const options = pre_option_map[k]?.() ?? []
  return options.find(_ => _.label === label)?.value
}

export { ICommonOption, getDualModeOptions as getAllOptions }
