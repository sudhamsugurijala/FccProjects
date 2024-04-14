#! /bin/bash

if [[ $1 == "test" ]]
then
  PSQL="psql --username=postgres --dbname=worldcuptest -qt --no-align -c"
else
  PSQL="psql --username=freecodecamp --dbname=worldcup -qt --no-align -c"
fi

# Do not change code above this line. Use the PSQL variable above to query your database.
declare -A team_ids
winner_id=0
opponent_id=0

exec < games.csv
read header

while IFS="," read year round winner opponent winner_goals opponent_goals
do
  if [[ -n "${team_ids[$winner]}" ]]
  then
    winner_id=${team_ids[${winner}]}
  else
    winner_id="$($PSQL "INSERT INTO teams (name) VALUES ('$winner') RETURNING team_id")"
    team_ids["$winner"]=${winner_id}
  fi

  if [[ -n "${team_ids[$opponent]}" ]]
  then
    opponent_id=${team_ids[${opponent}]}
  else
    opponent_id="$($PSQL "INSERT INTO teams (name) VALUES ('$opponent') RETURNING team_id")"
    team_ids["$opponent"]=${opponent_id}
  fi
  
  $PSQL "INSERT INTO games (year,round,winner_id,opponent_id,winner_goals,opponent_goals) values ($year,'$round',$winner_id,$opponent_id,$winner_goals,$opponent_goals);"
done
