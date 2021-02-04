#!/bin/bash
#Detta scrip är för att kompletera background scriptet. För att den iblan slutar köra

declare -i pid

pid=`pgrep -f "npm start"`

echo cargo is running at pid is "$pid"

if [ "$pid" != 0 ]
then
	echo website is runing
	date >> GURXLOG.txt
	exit 0
else
	echo i will now start website
	echo i restarted website >> GURXLOG.txt
	cd /bin/d0020e/Digital-Vinter/app
	sudo npm start &
fi







exit 0

