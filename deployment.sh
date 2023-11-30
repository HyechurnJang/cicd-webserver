#!/bin/bash
source .cicd/files/ini_parser.sh
process_ini_file "deployment.ini" > /dev/null

# Load Variables from INI ###################################################
workspace=$default_workspace
application_vip=$service_application_vip

# Deployment Script Here ####################################################
sudo -i sed "s/__HOSTNAME__/$(hostname)/g" src/webroot/template/index.html | sudo -i tee src/webroot/index.html
sudo -i cat src/nginx.conf.template | sudo -i tee src/nginx.conf
sudo -i sed -i "s/__WORKSPACE__/$workspace/g" src/nginx.conf
sudo -i sed -i "s/__APPLICATION_VIP__/$application_vip/g" src/nginx.conf

sudo -i rm -rf /etc/nginx/nginx.conf
sudo -i ln -s /opt/cicd/src/nginx.conf /etc/nginx/nginx.conf
sudo -i systemctl restart nginx
