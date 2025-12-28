import { mchcEnv } from '@lm_fe/env';
import { getTableColumns_default } from './default';
import { getTableColumns_gysy } from './gysy';
export const getTableColumns = mchcEnv.is('广三') ? getTableColumns_gysy : getTableColumns_default