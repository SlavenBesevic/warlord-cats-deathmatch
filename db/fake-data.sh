#!/bin/bash

for i in "$@"
do
case $i in
  -d=*|--database=*)
  DATABASE="${i#*=}"
  shift # past argument=value
  ;;
  -p=*|--path=*)
  SCRIPTPATH="${i#*=}"
  shift # past argument=value
  ;;
esac
done

psql ${DATABASE} -c "DROP SCHEMA public CASCADE;"
psql postgres -f ${SCRIPTPATH}/db/database-initialization.sql -v v1=${DATABASE} -v v2=${SCRIPTPATH}
