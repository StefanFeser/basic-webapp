Stefan Feser's Basic Webapp
============

My personal basic vanilla web app to kickstart a new app.

I'm playing around with ES2015, Babel and gulp. I don't use any components or frameworks in this repository. [Only VanillaJS](http://vanilla-js.com/)

Feel free to use and modify it.

Components / Dev dependencies
============
There are already some basic components included:

* Normalize-SCSS
* Gulp

I use SASS (http://sass-lang.com) as CSS Preprocessor.

Installation
============

You need to have Bower (http://bower.io), Gulp (http://gulpjs.com/) and NPM (node.js - http://nodejs.org) installed.

1.) Clone this repository:
```
git clone git@github.com:StefanFeser/basic-webapp.git

cd basic-webapp
```


2.) Install bower components
```
bower install
```


3.) Install gulp modules/tasks
```
npm install
```

4.) Inject bower components in index.html
```
gulp bower-install
```

5.) Run gulp
```
gulp
```

That's it!
