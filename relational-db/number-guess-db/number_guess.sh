#!/bin/bash
PSQL='psql --username=freecodecamp --dbname=number_guess -qt --no-align -c'

play_game () {
  SECRET_NUM=$(( RANDOM % 1000 + 1 ))
  ATTEMPTS=0
  echo 'Guess the secret number between 1 and 1000:'
  read GUESS
  ATTEMPTS=$(( $ATTEMPTS+1 ))
  while [[ "$GUESS" -ne "$SECRET_NUM" ]]; do
    if [[ $GUESS =~ [^0-9] ]]; then
      echo "That is not an integer, guess again:"
      read GUESS
    elif [[ $GUESS -lt $SECRET_NUM ]]; then
      echo "It's higher than that, guess again:"
      read GUESS
    elif [[ $GUESS -gt $SECRET_NUM ]]; then
      echo "It's lower than that, guess again:"
      read GUESS
    fi
    ATTEMPTS=$(( $ATTEMPTS+1 ))
  done

  GAMES_PLAYED=$1
  BEST_GAME=$2

  GAMES_PLAYED=$(( $GAMES_PLAYED+1 ))
  BEST_GAME=$(( $BEST_GAME == 0 ? $ATTEMPTS : $BEST_GAME > $ATTEMPTS ? $ATTEMPTS : $BEST_GAME ))

  if [[ $GAMES_PLAYED -eq 1 ]]; then
    $PSQL "INSERT INTO user_scores (username, games_played, best_game) VALUES ('$3', $GAMES_PLAYED, $BEST_GAME)"
  else
    $PSQL "UPDATE user_scores SET games_played=$GAMES_PLAYED, best_game=$BEST_GAME WHERE username='$3'"
  fi

  echo "You guessed it in $ATTEMPTS tries. The secret number was $SECRET_NUM. Nice job!"
}

echo 'Enter your username:'
read USERNAME

if [[ ${#USERNAME} -gt 22 ]]; then
  echo 'Enter your username:'
  read USERNAME
fi

IFS="|" read GAMES_PLAYED BEST_GAME <<< "$($PSQL "SELECT games_played, best_game FROM user_scores WHERE username='$USERNAME'")"

if [[ "$GAMES_PLAYED" == "" ]]; then
  echo "Welcome, $USERNAME! It looks like this is your first time here."
  play_game 0 0 "$USERNAME"
else
  echo "Welcome back, $USERNAME! You have played $GAMES_PLAYED games, and your best game took $BEST_GAME guesses."
  play_game $GAMES_PLAYED $BEST_GAME "$USERNAME"
fi
