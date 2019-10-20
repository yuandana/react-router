import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

export default {
    input: `./src/index.js`,
    output: [
        {
            file: `./dist/es/index.js`,
            format: 'es',
            name: '@yuandana/redux-x'
        },
        {
            file: `./dist/umd/index.js`,
            format: 'umd',
            name: '@yuandana/redux-x'
        }
    ],
    plugins: [
        resolve({ mainFields: ['module', 'jsnext', 'main'] }),
        commonjs(),
        babel({
            exclude: 'node_modules/**',
            presets: [
                [
                    '@babel/preset-env',
                    {
                        modules: false
                    }
                ]
            ]
        }),
        replace({
            exclude: 'node_modules/**',
            ENV: JSON.stringify(process.env.NODE_ENV)
        }),
        filesize()
    ]
};
