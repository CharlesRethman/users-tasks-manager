# Users Tasks Manager

API to manage users and users' tasks, including a scheduler

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

The project was initiated with the Swagger-Node codegen, an npm package that was installed globally (`$ swagger project create users-tasks-manager`). This README was written up. The project, which is just a 'Hello World' at this stage, can be tested by running `$ swagger project start` and using the supplied command `$ curl http://127.0.0.1:10010/hello?name=Scott`. The Swagger spec file is edited with `$ swagger project edit`.

### Editing the Swagger Spec

Project port changed to `3000` and base route to `api/`, as per requirements. Test file copied over for easy ref. 



