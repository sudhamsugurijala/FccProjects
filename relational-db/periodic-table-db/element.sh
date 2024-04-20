#! /bin/bash
PSQL='psql --username=freecodecamp --dbname=periodic_table -qt --no-align -c'

test_argument () {
  IFS="|" read ATOMIC_NUM SYMBOL NAME <<< $1
  if [[ "$NAME" == "" ]]; then
    echo 'I could not find that element in the database.'
  else
    IFS="|" read TEMP ATOMIC_MASS MPS BPS TYPE_ID <<< "$($PSQL "SELECT * FROM properties WHERE atomic_number=$ATOMIC_NUM")"
    TYPE="$($PSQL "SELECT type FROM types WHERE type_id=$TYPE_ID")"
    echo "The element with atomic number $ATOMIC_NUM is $NAME ($SYMBOL). It's a $TYPE, with a mass of $ATOMIC_MASS amu. $NAME has a melting point of $MPS celsius and a boiling point of $BPS celsius."
  fi
}

if [ -z $1 ]; then
  echo 'Please provide an element as an argument.'
elif [[ $1 =~ [^0-9] ]]; then
  test_argument "$($PSQL "SELECT * FROM elements WHERE symbol='$1' OR name='$1'")"
else
  test_argument "$($PSQL "SELECT * FROM elements WHERE atomic_number=$1")"
fi