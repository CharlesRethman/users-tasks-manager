# Users Tasks Manager

API to manage users and users' tasks, including a scheduler.

> A small detail: I have added `./node_modules/.bin` to my `PATH` variable so that I can install node applications locally and still run them from the command line if I am in an application root directory. If, for example, Typescript or Gulp are installed globally, the application should work but parameters on the `tsconfig.json` and `gulpfile.js` may need changing.

## How the Project was Constructed

The project was regularly committed and the main commits have been tagged, this helps in reviewing the development process. The steps are:

1. Run the Swagger initialiser to create the boilerplate code that the API is built from.
1. Develop the Swagger specification and test with mocks on the Swagger Editor
1. Re-organise and simplify the directory structure, adding in the gulpfile and typescript config files, as well as the Typescript `src/` directory and the dbHandlers and workers directories (for the scheduler).
1. Develop unit tests for the base db modules: the connector and db CRUD operations, as well as the controllers
1. Write the code for the db modules
1. Develop unit tests for the controllers
1. Write the code for the controllers
1. Develop unit tests for the workers (scheduler)
1. Write the code  for the scheduler
1. Develop e2e tests, based on the provided `curl` commands, as well as local tests in the appropriate controllers
1. Final work to the code to ensure all tests pass and the API is constructed.
1. Package and deploy the code to a server, ensuring the provided `curl` commands function as required.

### Running the Swagger initialiser

> Label: initialise-project-with-swagger

The project was initiated with the Swagger-Node codegen, an npm package that was installed globally (`$ swagger project create users-tasks-manager`). This README was written up. The project, which is just a 'Hello World' at this stage, can be tested by running `$ swagger project start` and using the supplied command `$ curl http://127.0.0.1:10010/hello?name=Scott`. The Swagger spec file is edited with `$ swagger project edit`.

### Editing the Swagger Spec

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

### Re-organise and Simplify the Directory Structure, Adding in the Gulp and Typescript Config Files

> Label: re-organise-directory-structure

Typescript and Gulp installed. `gulpfile.js`, `tsconfig.json` and `src/` directory added. `./app.js` copied to `src/app.ts` and modified to 'Typescript-style'. Gulp started and `dist/app.js` created (`dist/` excluded from repo by `.gitignore`).

Rearranged the files and directories. The `package.json` had the `"main"` and `"scripts.start"` values changed the `dist/app.js` for the new typescript-compiled main file. Swagger-node does not like the Swagger spec (`swagger.yaml`) file to be moved; it remains as `./api/swagger/swagger.yaml`.  This keeps the `$ swagger project start` command functioning, although if the `swagger.yaml` gets moved and the config option in `app.ts` is updated, `$ npm start` will work but not `swagger project start`.




