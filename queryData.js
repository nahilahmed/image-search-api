var MongoClient = require("mongodb").MongoClient;

module.exports = function(q){
    MongoClient.connect(process.env.MONGODB_URI, function(err, db){
        if(err){throw err}
        else{
            var collection = db.collection("image_Queries");
            collection.insert({time: new Date(), query: q}, function(err, doc){
                if(err) console.log("Query data storage failed.")
                console.log("Data inserted");
            })
        }
        db.close();
    })
}