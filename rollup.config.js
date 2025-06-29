import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'

export default {
	input: 'src/index.tsx',
	output: [
		{
			file: 'dist/index.js',
			format: 'cjs',
			exports: 'named',
			sourcemap: true,
		},
		{
			file: 'dist/index.esm.js',
			format: 'esm',
			exports: 'named',
			sourcemap: true,
		},
	],
	external: ['react', 'react-dom', 'framer-motion'],
	plugins: [
		resolve({
			browser: true,
		}),
		commonjs(),
		typescript({
			tsconfig: './tsconfig.json',
		}),
		postcss({
			config: {
				path: './postcss.config.js',
			},
			extensions: ['.css'],
			minimize: true,
			inject: {
				insertAt: 'top',
			},
		}),
	],
}
