#!/bin/bash

sudo -i rm -rf /etc/nginx/nginx.conf
sudo -i ln -s /opt/cicd/src/nginx.conf /etc/nginx/nginx.conf
sudo -i systemctl restart nginx
