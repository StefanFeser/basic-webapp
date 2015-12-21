Stefan Feser's Basic Webapp
============

My personal basic web app to kickstart a new app. Most of the times I use AngularJS, that's why Angular is a component by default. 

Feel free to use and modify it.

Components
============
There are already some basic components included:

* AngularJS
* AngularUI Router
* Fastclick (To prevent 300ms click delay on mobile)
* Normalize-SCSS
* Grunt Taskrunner

I use SASS (http://sass-lang.com) as CSS Preprocessor.

Installation
============

You need to have Bower (http://bower.io) and NPM (node.js - http://nodejs.org) installed.

1.) Clone this repository:
```
git clone git@github.com:StefanFeser/basic-webapp.git

cd basic-webapp
```


2.) Install Bower components
```
bower install
```


3.) Install Grunt modules/tasks
```
npm install
```

4.) Add Bower dependencies to HTML
```
grunt bower-install
```

5.) Run Grunt
```
grunt
```

That's it!


