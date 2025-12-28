import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import jsx from 'acorn-jsx';
import postcss from 'rollup-plugin-postcss'
import path from 'path'
import { defineConfig } from 'rollup';
import { createSharedConfig } from '../../rollup.config'

export default defineConfig((commandLineArgs) => {
  const config = createSharedConfig(commandLineArgs.watch)

  return {
    ...config,


  }
})





