#!/bin/bash
source .cicd/files/ini_parser.sh
process_ini_file "deployment.ini" > /dev/null

# Load Variables from INI ###################################################
workspace=$default_workspace
application_vip=$service_application_vip

# Deployment Script Here ####################################################


sudo -i rm -rf /etc/nginx/nginx.conf
sudo -i ln -s /opt/cicd/src/nginx.conf /etc/nginx/nginx.conf
sudo -i systemctl restart nginx
