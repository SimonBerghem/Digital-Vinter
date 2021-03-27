#!/bin/bash
#Detta scrip är för att kompletera background scriptet. För att den iblan slutar köra
#Detta script kör med hjälp av cron job med sudo så för att starta upp den så måste du ha sudo privleges
#sudo su, crontab -e i den fillen finns */5 * * * * /bin/d0020e/Digital-Vinter/backend/rustbackground.sh detta betyder att var 5 min så kommer scriptet köras.


declare -i pid
declare -i pid2

pid=`pgrep -f cargo`

pid2=`pgrep -f "npm start"`

echo cargo is running at pid is "$pid"

if [ "$pid" != 0 ]
then
	echo backround script rustbackend is running
 	date >> GURXLOG.txt
	exit 0
else
	echo i will now start backend
#	echo "Digital-Vinter server backend nere" | mailx -s 'Server backend nere!' gustav.rixon@gmail.com
	echo i restarted >> GURXLOG.txt
	cd /bin/d0020e/Digital-Vinter/backend
	sudo cargo run &
fi

if [ "$pid2" != 0 ]
then
	echo website is runing
	date >> GURXLOG.txt
else
	echo i will now start website
	echo i restarted website >> GURXLOG.txt
	cd /bin/d0020e/Digital-Vinter/app
	sudo npm run &
fi







exit 0

