# Users Tasks Manager

## Introduction

API to manage users and users' tasks, including a scheduler.

> A small detail: I have added `./node_modules/.bin` to my `PATH` variable so that I can install node applications locally and still run them from the command line if I am in an application root directory. If, for example, Typescript or Gulp are installed globally, the application should work but parameters on the `tsconfig.json` and `gulpfile.js` may need changing.

The DB used is MongoDB and the project is configured to connect to a single local instance, without authentication.

The test suite has 32 tests and uses a different database from the that used for other environments. Data are created during the test and are deleted if the CLEAN_TEST environment variable is set to 'true', 't', 'yes' or 'y'. They may be left un-cleaned to inspect the results, e.g. with the Mongo shell.

The e2e tests are not cleaned out automatically; they should be cleaned with the Mongo shell (as per spec, tasks can be deleted but not users).

The scheduler is set every minute on the minute (except for the test, which is every 10 minutes), this can be changed in the configs.

## How the Project was Constructed

The project was regularly committed and the main commits have been tagged, this helps in reviewing the development process. The steps are:

1. Run the Swagger initialiser to create the boilerplate code that the API is built from.
1. Develop the Swagger specification and test with mocks on the Swagger Editor
1. Re-organise and simplify the directory structure, adding in the gulpfile and typescript config files, as well as the Typescript `src/` directory and the dbHandlers and workers directories (for the scheduler).
1. Develop unit tests and write the code for the base db modules: the connector and db CRUD operations
1. Logging and environment configs
1. Develop unit tests and write the code for the controllers
1. Develop unit tests and write the code for the worker (scheduler)
1. Develop e2e tests, based on the provided `curl` commands
1. Package and deploy the code to a server, ensuring the provided `curl` commands function as required.


### 1. Running the Swagger initialiser

> Label: initialise-project-with-swagger

The project was initiated with the Swagger-Node codegen, an npm package that was installed globally (`$ swagger project create users-tasks-manager`). This README was written up. The project, which is just a 'Hello World' at this stage, can be tested by running `$ swagger project start` and using the supplied command `$ curl http://127.0.0.1:10010/hello?name=Scott`. The Swagger spec file is edited with `$ swagger project edit`.

### 2. Editing the Swagger Spec

> Label: swagger-spec-with-mocks

Project port changed to `3000` and base route to `api/`, as per requirements. Test file copied over for easy ref. 

The `/api/users`, `/api/users/{id}`, `/api/users/{user_id}/tasks` routes were added in along with the `Users`, `UserDetails`, `UserNames` definitions. The API be tested on mocks by starting the project with 
```bash
$ swagger project start -m
```
and calling, e.g.,
```bash
$ curl http://127.0.0.1:3000/api/users
$ curl http://127.0.0.1:3000/api/users/1
$ curl -i -H "Content-Type: application/json" -X PUT -d '{"name":"My updated task"}' http://127.0.0.1:3000/api/users/1/tasks/1
```
, etc.
The id is a number field as it has been decided not to use MongoDb's native ObjectId string and to use a monotonic sequencer for identifying documents instead. The sequencer is intended to be added as a db module. A front-end requesting user or task details would first have to  GET all users or tasks to obtain the id's for it's GET or UPDATE details request (this is in spec).

### 3. Re-organise and Simplify the Directory Structure, Adding in the Gulp and Typescript Config Files

> Label: re-organise-directory-structure

Typescript and Gulp installed. `gulpfile.js`, `tsconfig.json` and `src/` directory added. `./app.js` copied to `src/app.ts` and modified to 'Typescript-style'. Gulp started and `dist/app.js` created (`dist/` excluded from repo by `.gitignore`).

Rearranged the files and directories. The `package.json` had the `"main"` and `"scripts.start"` values changed the `dist/app.js` for the new typescript-compiled main file. Swagger-node does not like the Swagger spec (`swagger.yaml`) file to be moved; it remains as `./api/swagger/swagger.yaml`.  This keeps the `$ swagger project start` command functioning, although if the `swagger.yaml` gets moved and the config option in `app.ts` is updated, `$ npm start` will work but not `swagger project start`.

### 4. Develop Unit Tests and Write the Code for the Base DB Modules

> Label: develop-tests-and-code-for-db

> _Change from Stage 2 here_: Changed the API `id` field to use the MongoDB `_id` field, not an auto-incrementing number. This means that the ObjectID type from the database must be converted into a 24-character string and the field name is changed from `_id` to `id`. The function for handling this, plus a `documentExists()` checker, are placed in a separate `helper.ts` module in the `db/` directory.

`connector.test.ts` and `connector.ts` module in directory `db/`. The MongoDB Nodejs client library has changed from v 2 to v 3 in that the `connect()` method no longer returns a Db instance; it now returns a MongoClient instance from which the db is accessed.

CRUD testing in `dbOps.test.ts` and CRUD operations in `dbOps.ts` module in directory `db/`.

The testing creates a collection of 'users' in the test database ('testUsersTasks') in MongoDB, all but one of which are deleted (one document remains).

`dbOps.ts` and `db.Opa.test.ts` were renamed to `ops.ts` and `ops.test.ts`, respectivley (they are in the `db/` directory).

Only one user from the 'users' collection is deleted in the db-CRUD tests, the other user remains.

### 5. Logging and environment configs

> Label: logging-and-environment-configs

Using the 'config' library with three config files (default, dev and test) to choose configurations according to the  environment. Testing in a `test` environment (`NODE_ENV`), and uses a different database from running.

Logging done by `Morgan`, a popular and common library, which is disabled during testing.

### 6. Develop Unit Tests and Write the Code for the Controllers

> Label: develop-tests-and-code-for-controllers

`users.test.js` And `tasks.test.js` developed with `users.ts` and `tasks.ts` for users and tasks controllers, respectively. Tests are run off a fake data set stored in `testUsers.json` and `testTasks.json`.

The data are created and amended in the test database, one task of which is deleted by the tests. The environment variable, `CLEAN_TEST`, determines if all data are cleaned out at the end of the test. This variable needs to be set to 'true', 'yes', 't' or 'y' (case insensitive) for this to happen -- any other value will leave the data in after the test.

To test the routing properly, the test checks the GET-all-user-tasks call for _each_ user. The struture of the test logic dictates that these calls are made at the end of the tasks suite.

### 7. Develop unit tests and write the code for the worker (scheduler)

> Label: develop-tests-and-code-for-worker

_Note_: This functionality is included directly into the main API because of project specification. However, in real-world practice, the scheduler worker should be a daemon on its own, which will allow the horizontal scaling of the server.

The assumption from the specification is that `next_execute_date_time` is a project constant, not a task field. This is assumed because none of the API calls include it as a field, which would have to be the case (e.g. if a task is 'scheduled'.). The project constant is set in the config files and can also be set in the environment (``)

Used the `node-schedule` library to handle scheduling. The `scheduleJob()` method takes a string that follows the `cron` pattern, except that seconds can be included as well, and a callback. The callback contains the `job.executeTask()` method, which is tested in the suite.

Logging the scheduled job simply uses the built-in `util` library. Server call logging uses `morgan`.

### 8. Develop e2e tests, based on the provided `curl` commands

> Label: e2e-testing

The end-to-end test were developed as a Bash script, essentially running the specified `curl` commands, with the relevant ids and the hostname substituted in.

Issue with the date-time data provided in `date_time`: it differs slightly from the `date-time` string format used in the Swagger (OpneAPI) spec, in that it consists of:
```
'yyyy-mm-dd hh:MM:ss'
```
instead of:
```
'yyyy-mm-ddThh:MM:ssZ'
```
which follows the RFC 3339, section 5.6 standard. An extra function was created in the tasks controller to handle this data case (as well as handle 'normal' data). The tests were modified accordingly.

The script essentially assigns the output of each `curl` statement to a variable and `echo`s the variable. The relevant user_id and task_id is `grep`ed off the output.

Removed the `/hello` and `/swagger` routes from the Swagger and code.