#!/bin/bash

bold=$(tput bold)
normal=$(tput sgr0)

hostname=127.0.0.1:3000

echo
echo -e "\n${bold}First curl - Create user${normal}:\ncurl -i -H \"Content-Type: application/json\" -X POST -d '{\"username\":\"jsmith\",\"first_name\" : \"John\", \"last_name\" : \"Smith\"}' http://${hostname}/api/users\n"

user=$(curl -s -i -H "Content-Type: application/json" -X POST -d '{"username":"jsmith","first_name" : "John", "last_name" : "Smith"}' http://${hostname}/api/users)

echo ${user}
user_id=$(echo ${user} | egrep -o '\"id\":\"[0-9a-f]+\"' | egrep -o '[0-9a-f]{24}')

echo -e "\n${bold}Second curl - Update user${normal}:\ncurl -i -H \"Content-Type: application/json\" -X PUT -d '{\"first_name\" : \"John\", \"last_name\" : \"Doe\"}' http://${hostname}/api/users/${user_id}\n"

userUpdate=$(curl -s -i -H "Content-Type: application/json" -X PUT -d '{"first_name" : "John", "last_name" : "Doe"}' http://${hostname}/api/users/${user_id})
echo ${userUpdate}

echo -e "\n${bold}Third curl - List all users${normal}:\ncurl -i -H \"Accept: application/json\" -H \"Content-Type: application/json\" -X GET http://${hostname}/api/users\n"

userList=$(curl -s -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://${hostname}/api/users)
echo ${userList}

echo -e "\n${bold}Forth curl - Get User info${normal}:\ncurl -i -H \"Accept: application/json\" -H \"Content-Type: application/json\" -X GET http://${hostname}/api/users/${user_id}\n"

userInfo=$(curl -s -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://${hostname}/api/users/${user_id})
echo ${userInfo}

echo -e "\n${bold}Fifth curl - Create Task${normal}:\ncurl -i -H \"Content-Type: application/json\" -X POST -d '{\"name\":\"My task\",\"description\" : \"Description of task\", \"date_time\" : \"2016-05-25 14:25:00\"}' http://${hostname}/api/users/${user_id}/tasks\n"

task=$(curl -s -i -H "Content-Type: application/json" -X POST -d '{"name":"My task","description" : "Description of task", "date_time" : "2016-05-25 14:25:00"}' http://${hostname}/api/users/${user_id}/tasks)
echo ${task}

task_id=$(echo ${task} | egrep -o '\"id\":\"[0-9a-f]+\"' | egrep -o '[0-9a-f]{24}')

echo -e "\n${bold}Sixth curl - Create 2nd Task${normal}:\ncurl -i -H \"Content-Type: application/json\" -X POST -d '{\"name\":\"My task\",\"description\" : \"Description of task\", \"date_time\" : \"2016-05-25 14:25:00\"}' http://${hostname}/api/users/${user_id}/tasks\n"

task=$(curl -s -i -H "Content-Type: application/json" -X POST -d '{"name":"My task","description" : "Description of task", "date_time" : "2016-05-25 14:25:00"}' http://${hostname}/api/users/${user_id}/tasks)
echo ${task}

echo -e "\n${bold}Seventh curl - Update Task${normal}:\ncurl -i -H \"Content-Type: application/json\" -X PUT -d '{\"name\":\"My updated task\"}' http://${hostname}/api/users/${user_id}/tasks/${task_id}\n"

updateTask=$(curl -s -i -H "Content-Type: application/json" -X PUT -d '{"name":"My updated task"}' http://${hostname}/api/users/${user_id}/tasks/${task_id})
echo ${updateTask}

echo -e "\n${bold}Eighth curl - Get Task Info${normal}:\ncurl -i -H \"Accept: application/json\" -H \"Content-Type: application/json\" -X GET http://${hostname}/api/users/${user_id}/tasks/${task_id}\n"

taskInfo=$(curl -s -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://${hostname}/api/users/${user_id}/tasks/${task_id})
echo ${taskInfo}

echo -e "\n${bold}ninth curl - List all tasks for a user${normal}:\ncurl -i -H \"Accept: application/json\" -H \"Content-Type: application/json\" -X GET http://${hostname}/api/users/${user_id}/tasks\n"

taskListUser=$(curl -s -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://${hostname}/api/users/${user_id}/tasks)
echo ${taskListUser}

echo -e "\n${bold}Last curl - Delete Task${normal}:\ncurl -i -H \"Content-Type: application/json\" -X DELETE http://${hostname}/api/users/${user_id}/tasks/${task_id}\n"

taskDelete=$(curl -s -i -H "Content-Type: application/json" -X DELETE http://${hostname}/api/users/${user_id}/tasks/${task_id})
echo ${taskDelete}

echo -e "\n"
sleep 0.5
echo -e "...Done!"