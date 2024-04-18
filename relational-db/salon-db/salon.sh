#! /bin/bash
PSQL='psql --username=freecodecamp --dbname=salon -qt --no-align -c'

showServices() {
  echo '1) cut'
  echo '2) color'
  echo '3) shave'
}

echo 'Welcome to My Salon, how can I help you?'
showServices
read SERVICE_ID_SELECTED

while [ $SERVICE_ID_SELECTED -lt 1 -o $SERVICE_ID_SELECTED -gt 3 ];
do
  echo -e '\nI could not find that service. What would you like today?'
  showServices
  read SERVICE_ID_SELECTED
done

echo -e "\nWhat's your phone number?"
read CUSTOMER_PHONE

echo -e "\n$($PSQL "SELECT COUNT(*) FROM customers WHERE phone='$CUSTOMER_PHONE'")"