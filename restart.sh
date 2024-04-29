#!/bin/bash

# Activate virtual environment
source ~/nodevenv/xtremetools/20/bin/activate

# Navigate to the directory
cd ~/xtremetools

# Log start of deployment
echo "$(date +'%Y-%m-%d %H:%M:%S') - Deployment started" | tee -a deploy.log

git pull | tee -a deploy.log

# Install npm packages and capture output
npm install | tee -a deploy.log

# Get PID from file
PID=$(cat "PID")

# Kill the process
kill -9 $PID

# Log end of deployment
echo "$(date +'%Y-%m-%d %H:%M:%S') - Deployment completed" | tee -a deploy.log
