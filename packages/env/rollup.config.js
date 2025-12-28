import postcss from 'rollup-plugin-postcss';
import { createSharedConfig } from '../../rollup.config';





export default commandLineArgs => {

  const config = createSharedConfig(commandLineArgs.watch)

  return {
    ...config,
    plugins: [

      postcss({
        use: [
          ['less', { javascriptEnabled: true }],
        ],
        // extract: true,
        autoModules: true,

      }),
      ...config.plugins,

    ],
    output: {
      ...config.output,
      entryFileNames: `[name].js`,
      format: 'esm',
      sourcemap: true, // 👈 开启 source map
    }
  }
}
