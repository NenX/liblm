import { AutoCompleteProps } from 'antd/es/auto-complete';
import * as React from 'react';


const Inner = React.lazy(() => import('./Inner'));



const AutoComplete_L = React.forwardRef<any, AutoCompleteProps>((props, ref) => {
    return <Inner {...props} />;
});

AutoComplete_L.displayName = 'AutoComplete';


export {
    AutoComplete_L,
    AutoCompleteProps
};