# curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
# sudo apt install nodejs

# sudo npm install -g http-server

npm config set registry http://registry.npm.taobao.org

cd /home/ubuntu/consensuspoc/server
npm install

cd /home/ubuntu/consensuspoc/worker
npm install

cd /home/ubuntu/consensuspoc/angularjsclient
npm install
cd /home/ubuntu/consensuspoc/angularjsclient/app
pm2 start /usr/local/bin/http-server --name consensuspoc_webui -- -p 3005 -d false

cd /home/ubuntu/consensuspoc/deploy
pm2 start pm2.json


cd /home/ubuntu/consensuspoc/mockup
npm install
pm2 start node send_medicalRecords.js --name consensus-mock