# Codename Starshard

### Synopsis
SSI Network Infrastructure, provides a unified interface for web applications. 
The base system will provide session and db storage for upper applications.
Each application can define routes of their own and access one exclusive database.
Accounts can be shared throughout all applications.

### Base system

#### Routes
All applications can be accessed via paths like "/appname", and administrator can set an application as default ("/"). Some app names are reserved for management or maintenance purposes.

### Database Interface
Base system provides a database interface for applications. Each application will have their own database(if needed) and a shared user database.

If the application requires a database, the base system will provide an object to execute the database operations.

For each application that requires database storage, a Mongodb database will be created.

#### Session storage
The base system uses Redis to store user session data. Class Sessions will handle the session data of each user.

### Application

#### Shard.json
Shard.json will provide basic information for the base system. Shard properties will include:
* name - The name of the application, will be used in its path.
* usedb - [Bool] Indicate whether this app requires database
* static - Path of static files for this application
* permissions - [Array] Describes how the application can access users' information

#### Index.js
`index.js` is the entry point of the application. A typical index.js should look like:
```
var shard = require('./shard.json');
shard.routes = [
  {
    path: '/',
    method: 'GET',
    respond: function (req, res, session, db) {
	  // Handle the request
    }
  }
]
module.exports = shard;
```

#### Base system APIs
The base system provides database, route, and session APIs for each application. Each application main script should begin with: 
```
module.exports = function (route, db, session) {};
```
Application can use these three objects `route`, `db`, `session` to register routes, access  the database and session storage.

#### In-app routes
Sub-routes can be declared in each application. If a `/path` route is registered in an application, this path can be accessed via `/appname/path`.

Routes should be registered as the following using HTTP method names
```
route.get('/path', function (req, res) {});
/* You can also use .post, .put, .delete */
```

#### Database and session
Database and session can be accessed by `db` and `session`.

#### Shared users
All applications share users registered in the base system. Each application can access a user's name and unique id, but to access other properties like email, applications are required to ask for permission in Shard.json.