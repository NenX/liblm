import Tree from 'antd/es/tree';
import 'antd/es/tree/style';
import React from 'react';

export default function LazyInner(props: any) {
    return <Tree.DirectoryTree {...props} />
}