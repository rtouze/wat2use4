Create an index to assign a TTL on wat2use4 documents

    > db.wat2use4.createIndex({ "creationDate": 1 }, { expireAfterSeconds: 86400 })
