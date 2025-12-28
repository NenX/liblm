import image from '@rollup/plugin-image'
import jsx from 'acorn-jsx'
import cssUrl from 'postcss-url'
import postcss from 'rollup-plugin-postcss'
import { createSharedConfig } from '../../rollup.config'

export default (commandLineArgs) => {
    const config = createSharedConfig(commandLineArgs.watch)

    return {
        ...config,
        acornInjectPlugins: [jsx()],
        plugins: [
            image({
                //  dom: true
            }),
            postcss({
                use: [['less', { javascriptEnabled: true }]],
                // extract: true,
                autoModules: true,
                plugins: [
                    cssUrl({
                        url: 'inline',
                        // assetsPath: path.resolve(__dirname, './dist/imgxx'),
                        // useHash: true
                    }),
                ],
            }),
            ...config.plugins,
        ],
        output: {
            ...config.output,
            entryFileNames: `[name].js`,
            format: 'esm',
            chunkFileNames: (ChunkInfo) => {
                if (!ChunkInfo.facadeModuleId) return 'a_chunks/[name].js'
                const id = ChunkInfo.facadeModuleId.replace(/\..*$/, '').split('/').slice(-4, -1).join('.')

                return `a_chunks/${id ? id : 'bad/[name]'}.js`
            },
            sourcemap: true, // 👈 开启 source map
        },
    }
}
