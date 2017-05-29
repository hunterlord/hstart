### use

```
hstart -d your_project

//work with react
hstart -d your_project --react
```


### create frontend environment with webpack

  * allow import css
  * allow import less
  * allow import html with art-template-loader
  * this tool is just create configs and start demo
  * allow es6 with babel

#### art-template  
  
```
//index.js:

import list from './list.html';
list({title: 'hello world'});

//list.html

<h3>{{title}}</h3>
```

#### build

```
npm run build
```

#### develope

```
npm run dev
```
