export function findIdsByChildId(data: any[], key: string) {
    let res: any[] = [];
    const findIds = (arr: any[], temp: any[] = []) => {
        for (const node of arr) {
            if (node.children?.length > 0) {
                // 判断是否有子级,有则继续递归
                findIds(node.children, temp.concat(node.key));
            } else {
                if (node.key === key) {
                    // 找到指定id,则返回递归列表
                    temp.push(key); // 若不需要返回已知的id，注释此段即可
                    res = temp;
                    return;
                }
            }
        }
    };
    findIds(data, []);
    return res;
}