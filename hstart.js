#!/usr/bin/env node
const program = require('commander');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const CQuestion = require('./cquestion');

program
  .version('0.0.1')
  .option('-r, --react', 'with react')
  .option('-d, --directory [dir]', 'start project directory')
  .parse(process.argv);

const react_enable = program.react;
const dir = program.directory;

if (!dir) {
  console.log(colors.red('Please enter directory with -d or --directory'));
  process.exit(0);
}

if (fs.existsSync(dir)) {
  console.log(colors.red('The enter directory is already exists.'));
  process.exit(0);
}

const package_define = {
  scripts: {
    dev: 'node ./node_modules/webpack-dev-server/bin/webpack-dev-server.js --inline --hot',
    build: 'node ./node_modules/webpack/bin/webpack.js'
  },
  dependencies: {
    'babel-runtime': '^6.23.0',
    request: '^2.81.0'
  },
  devDependencies: {
    'babel-core': '^6.24.1',
    'babel-eslint': '^7.2.3',
    'babel-loader': '^7.0.0',
    'babel-plugin-import': '^1.2.0',
    'babel-plugin-transform-class-properties': '^6.24.1',
    'babel-plugin-transform-react-jsx': '^6.24.1',
    'babel-plugin-transform-runtime': '^6.23.0',
    'babel-preset-es2015': '^6.24.1',
    'babel-preset-react': '^6.24.1',
    'babel-preset-stage-1': '^6.24.1',
    'css-loader': '^0.28.2',
    'postcss-loader': '^2.0.5',
    eslint: '^3.19.0',
    'eslint-loader': '^1.7.1',
    'eslint-plugin-react': '^7.0.1',
    'extract-text-webpack-plugin': '^2.1.0',
    'html-webpack-plugin': '^2.28.0',
    less: '^2.7.2',
    'less-loader': '^4.0.3',
    'node-sass': '^4.5.3',
    sass: '^0.5.0',
    'sass-loader': '^6.0.5',
    'style-loader': '^0.18.0',
    webpack: '^2.5.1',
    'webpack-dev-server': '^2.4.5'
  }
};

const eslint_define = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    'no-unused-vars': 0,
    'no-console': 0,
    indent: ['warn', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['warn', 'single'],
    semi: ['warn', 'always']
  }
};

let cq = new CQuestion();
let answers = cq.run({
  name: `name (${dir}): `,
  version: 'version (1.0.0):  ',
  description: 'description:  ',
  entry: 'entry point (index.js): ',
  keywords: 'keywords:  ',
  git: 'git repository: ',
  author: 'author:  ',
  license: 'license (ISC):  '
});

answers
  .then(data => {
    let package_compack = Object.assign(
      {},
      {
        name: data.name || dir,
        version: data.version || '1.0.0',
        description: data.description,
        main: data.entry || 'index.js',
        keywords: data.keywords.split(' '),
        repository: { type: 'git', url: data.git },
        author: data.author,
        license: data.license || 'ISC'
      },
      package_define
    );

    let webpack_config_define = fs.readFileSync(
      path.resolve(__dirname, './webpack.config.js')
    );

    if (react_enable) {
      package_compack = Object.assign({}, package_compack, {
        react: '^15.5.4',
        'react-dom': '^15.5.4',
        'react-router': '^4.1.1',
        'react-router-dom': '^4.1.1'
      });
    } else {
      webpack_config_define = webpack_config_define
        .toString()
        .replace(/'react'/g, '')
        .replace(/'transform-react-jsx',/g, '');
    }

    const postcss_config_define = fs.readFileSync(
      path.resolve(__dirname, './postcss.config.js')
    );

    //make base dirs
    fs.mkdirSync(path.resolve(dir));
    fs.mkdirSync(path.resolve(dir + '/app'));
    fs.mkdirSync(path.resolve(dir + '/public'));

    const index_html = fs.readFileSync(path.resolve(__dirname, './index.html'));

    fs.writeFileSync(path.resolve(dir + '/public/index.html'), index_html);

    fs.writeFileSync(
      path.resolve(dir + '/app/index.js'),
      `document.body.innerHtml = 'Hello, hstart';`
    );

    fs.writeFileSync(
      path.resolve(dir + '/webpack.config.js'),
      webpack_config_define
    );
    fs.writeFileSync(
      path.resolve(dir + '/postcss.config.js'),
      postcss_config_define
    );
    fs.writeFileSync(
      path.resolve(dir + '/package.json'),
      JSON.stringify(package_compack, null, 2)
    );
    fs.writeFileSync(
      path.resolve(dir + '/.eslintrc.json'),
      JSON.stringify(eslint_define, null, 2)
    );

    console.log(
      colors.green(
        `
    Create project success.

    Now, first of all, run comand:

        cd ${dir} && npm install

    then, your need to config your webpack.config.js, then
    config eslintrc.json if your need,
    that is all.
  `
      )
    );

    process.exit(0);
  })
  .catch(e => {
    console.log(colors.red(e));
  });
