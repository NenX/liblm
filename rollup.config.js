import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import path from 'path'
// import { terser } from "@rollup/plugin-terser";
import json from '@rollup/plugin-json'

/**
 * @type { import('rollup').RollupOptions }
 */
const sharedOptions = {
    input: 'src/index.ts',
    plugins: [
        nodeResolve(), // path resolve
        commonjs(), // convert CommonJS modules to ES6
        typescript({
            tsconfig: './tsconfig.json',
            jsx: 'preserve',
            declaration: true,
            noEmitOnError: false,
            outputToFilesystem: false,
        }),

        babel({
            presets: ['@babel/preset-react'],
            plugins: [
                '@babel/plugin-transform-runtime',
                'babel-plugin-lodash',
                [
                    'import',
                    {
                        libraryName: 'antd',
                        libraryDirectory: 'es',
                        style: true,
                    },
                ],
            ],
            babelHelpers: 'runtime',
            extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
        }),
        dynamicImportVars({
            // options
        }),
        json(),
    ],

    output: {
        dir: path.resolve(__dirname, 'dist'),

        exports: 'named',
        // format: 'cjs',
        format: 'esm',
        externalLiveBindings: false,
        freeze: false,
        plugins: [
            getBabelOutputPlugin({
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-transform-runtime'],
            }),
        ],
    },
    external: [
        'react',
        'react-dom',
        'axios',
        'antd',
        'store',
        'lodash',
        'moment',
        '@ant-design/icons',
        '@lm_fe/static',
        ,
        'dayjs',
        ...Object.keys(require('./package.json').dependencies || {}),
        ...Object.keys(require('./package.json').peerDependencies || {}),
        /antd/,
        /lodash/,
        /rc-/,
    ],
}

export function createSharedConfig(isDev = false) {
    if (!isDev && false) {
        // sharedOptions.plugins.push(
        //     terser({
        //         compress: {
        //             drop_console: true,
        //             drop_debugger: true,
        //         },
        //         format: {
        //             comments: false,
        //         }
        //     })
        // )
    }
    return isDev ? sharedOptions : sharedOptions
}
