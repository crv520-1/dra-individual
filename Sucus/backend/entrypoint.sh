#!/bin/bash

TIMESTAMP_FILE="/app/data/last_countries_update.txt"
UPDATE_INTERVAL=${UPDATE_INTERVAL:-2592000}  # Default: 30 days in seconds

mkdir -p /app/data

run_countries_script() {
  echo "Running almacenarPaises.js script..."
  node /app/scripts/almacenarPaises.js
  date +%s > "$TIMESTAMP_FILE"
  echo "Countries data updated successfully."
}

# Check if we should update the countries data
if [ ! -f "$TIMESTAMP_FILE" ]; then
  echo "No timestamp file found. First run detected."
  run_countries_script
else
  last_update=$(cat "$TIMESTAMP_FILE")
  current_time=$(date +%s)
  elapsed_time=$((current_time - last_update))
  
  if [ $elapsed_time -ge $UPDATE_INTERVAL ]; then
    echo "Data update interval reached ($elapsed_time seconds since last update)."
    run_countries_script
  else
    echo "Countries data is up to date. Last update was $elapsed_time seconds ago."
  fi
fi

# Start the main application
echo "Starting server..."
exec "$@"
