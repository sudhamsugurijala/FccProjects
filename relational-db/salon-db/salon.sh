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

while [[ $SERVICE_ID_SELECTED =~ [^0-9] ]] || [ $SERVICE_ID_SELECTED -lt 1 -o $SERVICE_ID_SELECTED -gt 3 ];
do
  echo -e '\nI could not find that service. What would you like today?'
  showServices
  read SERVICE_ID_SELECTED
done

SERVICE_NAME="$($PSQL "SELECT name FROM services WHERE service_id='$SERVICE_ID_SELECTED'")"
echo -e "\nWhat's your phone number?"
read CUSTOMER_PHONE

CUSTOMER_NAME="$($PSQL "SELECT name FROM customers WHERE phone='$CUSTOMER_PHONE'")"

if [[ "$CUSTOMER_NAME" == "" ]]; then
  echo -e "\nI don't have a record for that phone number, what's your name?"
  read CUSTOMER_NAME
  $PSQL "INSERT INTO customers (name, phone) VALUES ('$CUSTOMER_NAME','$CUSTOMER_PHONE')"
fi

CUSTOMER_ID="$($PSQL "SELECT customer_id FROM customers WHERE phone='$CUSTOMER_PHONE'")"

echo -e "\nWhat time would you like your cut, $CUSTOMER_NAME?"
read SERVICE_TIME
$PSQL "INSERT INTO appointments (customer_id, service_id, time) VALUES ('$CUSTOMER_ID','$SERVICE_ID_SELECTED','$SERVICE_TIME')"

echo -e "\nI have put you down for a $SERVICE_NAME at $SERVICE_TIME, $CUSTOMER_NAME."