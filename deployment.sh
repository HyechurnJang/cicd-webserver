#!/bin/bash
source .cicd/files/ini_parser.sh
process_ini_file "deployment.ini" > /dev/null

# Load Variables from INI ###################################################
workspace=$default_workspace
application_vip=$service_application_vip

# Deployment Script Here ####################################################
echo $(hostname) | sudo tee src/webroot/hostname.html
sudo sed "s/__APPLICATION_VIP__/$application_vip/g" src/nginx.conf.template | sudo tee src/nginx.conf

sudo rm -rf /etc/nginx/nginx.conf
sudo ln -s $workspace/src/nginx.conf /etc/nginx/nginx.conf
sudo systemctl restart nginx
