# ManageLazily

> A project management application built with small businesses in mind. Users can create, 
update, assign, track, and analyze their businesses projects securely on the cloud from 
any location with access to the web.


ManageLazily enables company owners, project managers, and employees to have a one-stop
project management hub where they can create projects, track project completion and due dates, 
add tasks to projects, log hours worked on project tasks, and more. Built with simplicity 
and usability in mind, ManageLazily is a great alternative to more complex (and expensive) 
project management software.

![](header.png)


## Usage

- Landing Page
- Register
- Login
- Dashboard
- ProjectView
- Edit/Add Project
- Edit/Add Job
- Log Hours
- Profile View


## Development setup

General Setup:
- Clone this repository to your local machine git clone PROJECT-URL NEW-PROJECTS-NAME
- cd into the cloned repository
- Make a fresh start of the git history for this project with rm -rf .git && git init
- Install the node dependencies npm install
- Move the example Environment file to .env - mv example.env .env
- Edit the contents of the package.json to use NEW-PROJECT-NAME

Firebase Setup:
- Create a Firebase project
- Register your app with Firebase
- Add Firebase project configuration to your .env file
- Create Cloud Firestore database via the Firebase console - see [Cloud Firestore Setup](https://firebase.google.com/docs/firestore/quickstart)
- Enable email authentication via the Firebase console
- For in-depth instructions, please visit [Firebase Docs](https://firebase.google.com/docs/web/setup)

## Scripts

Start the application npm start

Run the tests npm run cypress:open

## Release History

- 0.0.1
  - Work in progress

## Meta

Contributors:
 - [Adam Newhouser](https://github.com/AdamNewhouser)
 - [Alex Bannow](https://github.com/rbannal86)
 - [Balay Aydemir](https://github.com/balayaydemir)
 - [Bridger Hammond](https://github.com/reifnotreef)
 - [Dan Wagar](https://github.com/danWagar) 

Distributed under the MIT license. See [LICENSE.md](https://github.com/balayaydemir/Capstone-Group3-Client/blob/master/LICENSE) for more information.



## [Contributing](https://github.com/balayaydemir/Capstone-Group3-Client/blob/master/CONTRIBUTING.md)

<!-- Markdown link & img dfn's -->

[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/yourname/yourproject/wiki
