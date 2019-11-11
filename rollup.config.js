import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

export default {
    input: `./src/index.js`,
    // external: ['react-is'],
    output: [
        {
            file: `./dist/es/index.js`,
            format: 'es',
            name: '@yuandana/react-router'
            // globals: {
            //     'react-is': 'reactIs'
            // }
        },
        {
            file: `./dist/umd/index.js`,
            format: 'umd',
            name: '@yuandana/react-router'
            // globals: {
            //     'react-is': 'reactIs'
            // }
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
