#!/bin/bash

if hash openssl 2>/dev/null; then
  rm -rf certs
  mkdir certs/
  if [ $(openssl version | cut -f1 -d' ') = "LibreSSL" ]; then
    openssl req -new -x509 -nodes -newkey ec:<(openssl ecparam -name prime256v1) -keyout certs/localhost.key -out certs/localhost.crt -days 3650 -subj "/CN=localhost"
  else
    openssl req -x509 -nodes -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -keyout certs/localhost.key -out certs/localhost.crt -days 365 -subj "/CN=localhost"
  fi
  chmod 400 certs/localhost.key
fi

