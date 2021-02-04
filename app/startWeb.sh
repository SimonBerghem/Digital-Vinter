#!/bin/bash
#Detta scrip är för att kompletera background scriptet. För att den iblan slutar köra

declare -i pid

pid=`pgrep -f "npm start"`

echo webServer is running at pid is "$pid"

sudo kill -9 "$pid"

cd /bin/d0020e/Digital-Vinter/app

sudo npm start &


exit 0

