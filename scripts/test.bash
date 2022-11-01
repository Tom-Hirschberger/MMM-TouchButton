#!/bin/bash
RETURN_CODE=0
if [ $# -gt 0 ]
then
	RETURN_CODE=1
fi

echoerr() { echo -e "$@" 1>&2; }

echo -e "This is \n my stdout string!"

echoerr "This is \n the stderr string!"

exit $RETURN_CODE
