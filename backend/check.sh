#!/bin/bash
#Detta scrip är för att kompletera background scriptet. För att den iblan slutar köra

declare -i pid

pid=`pgrep -f cargo`

echo cargo is running at pid is "$pid"

if [ "$pid" != 0 ]
then
	echo backround script rustbackend is running
 	date >> GURXLOG.txt
	exit 0
else
	echo i will now start backend

	cd /bin/d0020e/Digital-Vinter/backend
	sudo cargo run &
fi

exit 0

