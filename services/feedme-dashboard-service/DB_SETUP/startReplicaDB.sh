#!/bin/sh
echo "SETTING UP REPLICATION"
echo "\n------ This is a dirty workaround and should not be run in production. ------\n"

#/usr/bin/mongod --bind_ip_all --replSet rs0 
/usr/bin/mongod --fork --logpath /var/log/db.log --bind_ip_all --replSet rs0

/usr/bin/mongo --eval "rs.initiate( { _id : 'rs0', members: [ { _id : 0, host : 'feedme-dashboard-database2:27017' }, { _id : 1, host : 'feedme-dashboard-database1:27017' } ] })"

# Print to stdout 1 for docker log
# >> /proc/1/fd/1

if mongo --eval "rs.status().ok" | grep -q '^1$'; then
    echo "DONE REPLICA"
else
    echo "ERROR REPLICA"
fi

tail -f /var/log/db.log