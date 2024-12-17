#!/bin/sh

echo "Starting the entrypoint script"

if [ -z "$API_URL" ]; then
  echo "API_URL is not set. Exiting."
else
	echo "API_URL is set to $API_URL"
	envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js
fi

echo "Starting nginx"
nginx -g 'daemon off;'