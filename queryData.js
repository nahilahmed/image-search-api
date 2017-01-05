var express =require("express");
var MongoClient = require("mongodb").MongoClient;
var MONGODB_URI=process.env.MONGODB_URI;

var queryData = {};

// inserts a query to the database
queryData.insert = function(q){
    MongoClient.connect(MONGODB_URI, function(err, db){
        if(err){throw err}
        else{
            var collection = db.collection("image_Queries");
            collection.insert({time: String(new Date()), query: q}, function(err, doc){
                if(err) console.log("Query data storage failed.");
                console.log("Data inserted");
            });
        }
        db.close();
    });
};

// finds a query responds with the api in json format
queryData.find = function(ar, response){
 MongoClient.connect(MONGODB_URI, function(err, db){
        if(err){throw err}
        else{
            var collection2 = db.collection("image_Queries");
            var count = collection2.find().count();
            collection2.find({}, {_id:0, time:1, query:1}, {sort: {time: -1}, limit: 10}, function(err, items){
                if(err)throw err;
                else {
                    items.toArray(function(err, result){
                        if(err)throw err;
                        else{
                            var jsn = {
                                "recentQueries": result
                            };
                            ar.splice(0, 0, jsn);
                            count.then(function(val){
                                    console.log(val);
                                    var total = {
                                        totalQueries: val
                                    };
                                    ar.splice(0,0, total);
                                    response.send(ar);
                                });
                            
                        }
                    });
                }
            });
            
        };
        
        db.close();
    });
}

module.exports = queryData;