import dilatationAndCurettage from './Curettage';
import putInIntrauterineDevice from './Place';
import takeOutIntrauterineDevice from './TakeOut';
import uterineFallopianTubeFluid from './Uterus';
import inducedAbortion from './Pressure';
import vaginoscopy from './Vaginoscopy';
import hysteroscopicSurgery from './HysteroscopicSurgery';
import vulvarCystStoma from './VulvarCystStoma';
import uterosalpingography from './Uterosalpingography';

export const 妇科专病_手术病历_mapping = {
  dilatationAndCurettage: {
    key: 'dilatationAndCurettage',
    name: '刮宫术',
    icon: '',
    component: dilatationAndCurettage,
  },
  // Puberty: {
  //   key: 'Puberty',
  //   name: '清宫术',
  //   icon: '',
  //   api: '/api/labour-records',
  //   component: Curettage,
  // },
  putInIntrauterineDevice: {
    key: 'putInIntrauterineDevice',
    name: '宫内避孕器放置术',
    icon: '',
    component: putInIntrauterineDevice,
  },
  takeOutIntrauterineDevice: {
    key: 'takeOutIntrauterineDevice',
    name: '宫内节育器取出术',
    icon: '',
    component: takeOutIntrauterineDevice,
  },
  uterineFallopianTubeFluid: {
    key: 'uterineFallopianTubeFluid',
    name: '子宫输卵管通液术',
    icon: '',
    component: uterineFallopianTubeFluid,
  },
  inducedAbortion: {
    key: 'inducedAbortion',
    name: '人工流产',
    icon: '',
    component: inducedAbortion,
  },
  // vaginoscopy: {
  //   key: 'vaginoscopy',
  //   name: '阴道镜检查',
  //   icon: '',
  //   component: vaginoscopy,
  // },
  // hysteroscopicSurgery: {
  //   key: 'hysteroscopicSurgery',
  //   name: '宫腔镜手术',
  //   icon: '',
  //   component: hysteroscopicSurgery,
  // },
  // vulvarCystStoma: {
  //   key: 'vulvarCystStoma',
  //   name: '外阴囊肿造口术',
  //   icon: '',
  //   component: vulvarCystStoma,
  // },
  // uterosalpingography: {
  //   key: 'uterosalpingography',
  //   name: '子宫输卵管照影术',
  //   icon: '',
  //   component: uterosalpingography,
  // },
};
