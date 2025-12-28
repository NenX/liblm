
import { TreeProps } from 'antd';
import { DirectoryTreeProps } from 'antd/lib/tree';
import TreeNode from 'rc-tree/es/TreeNode';
import React from 'react';
const Inner = React.lazy(() => import('./Inner'));
const DirectoryTreeInner = React.lazy(() => import('./DirectoryTreeInner'));

function Tree_<T extends Object = any>(props: TreeProps<T>) {
    return <Inner {...props} />
}

function DirectoryTree(props: DirectoryTreeProps) {
    return <DirectoryTreeInner {...props} />
}

type TreeType = typeof Tree_ & { TreeNode: typeof TreeNode, DirectoryTree: typeof DirectoryTree };
export const Tree: TreeType = Object.assign(Tree_, { TreeNode: TreeNode, DirectoryTree }) 
