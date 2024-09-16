#!/bin/sh

echo "Starting the entrypoint script"

if [ -z "$API_URL" ]; then
  echo "API_URL is not set. Exiting."
else
	echo "API_URL is set to $API_URL"
	envsubst '$API_URL' < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js
fi

if [ -z "$API_PREDICT_URL" ]; then
	echo "API_PREDICT_URL is not set. Exiting."
else
	echo "API_PREDICT_URL is set to $API_PREDICT_URL"
	envsubst '$API_PREDICT_URL' < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js
fi

echo "Starting nginx"
nginx -g 'daemon off;'