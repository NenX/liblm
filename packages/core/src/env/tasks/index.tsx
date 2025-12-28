
import { checkLogin } from './checkLogin';
import { checkVersion } from './checkVersion';
export function runTask() {
    setInterval(() => {
        checkVersion()
    }, 60 * 1000 * 2);

    setInterval(() => {
        checkLogin()
    }, 30 * 1000);
}
