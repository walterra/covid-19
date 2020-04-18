import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import babel from 'rollup-plugin-babel';
import async from 'rollup-plugin-async';
import builtins from 'rollup-plugin-node-builtins';
import externalGlobals from "rollup-plugin-external-globals";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/vega_renderer.js',
	output: {
		file: 'src-www/vega_renderer.js',
		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
    sourcemap: false,
    intro: 'const global = window;',
    strict: false
	},
	plugins: [
		resolve(), // tells Rollup how to find date-fns in node_modules
    commonjs(), // converts date-fns to ES modules
    json(), // required to build VEGA
    builtins(),
    async(),
    // buble({ transforms: { generator: false, forOf: false } }),
    externalGlobals({
      canvas: "canvas"
    }),
    babel({
      // exclude: 'node_modules/**',
      exclude: [ 'node_modules/@babel/**', 'node_modules/core-*/**' ],
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              browsers: "> 0.5%, ie >= 11",
            },
            modules: false,
            spec: false,
            // forceAllTransforms: true,
            useBuiltIns: 'entry',
            corejs: 2
          }
        ]
      ],
      plugins: ["@babel/plugin-transform-object-assign"]
    }),
		production && terser() // minify, but only in production
  ]
};
