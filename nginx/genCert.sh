#!/bin/bash

mkdir -p /etc/nginx/ssl

# Generate a self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/selfsigned.key -out /etc/nginx/ssl/selfsigned.crt -subj "/C=MA/ST=khouribgha/L=khouribgha/O=1337/OU=1337/CN=localhost"