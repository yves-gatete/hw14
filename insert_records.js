var fs = require('fs');
//const fastcsv = require("fast-csv");
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://yvesdrop:memorysucks00@cluster0.p16bt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
var port = process.env.PORT || 8000;

function main() 
{
    let stream = fs.createReadStream("companies.csv");
    let csvData = [];
    let csvStream = fastcsv
    .parse()
    .on("data", function(data) {
        csvData.push({
        company: data[0],
        ticker: data[1]
        });
    })
    .on("end", function() {
        // remove the first line: header
        csvData.shift();

        console.log(csvData);

        MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, native_parser:true}, function(err, db) {
            if (db) {
                if(err) { return console.log(err); }
            
                var dbo = db.db("stocks");
                var collection = dbo.collection('companies');
                
                console.log("here");
                collection.insertMany(csvData, (err, res) => {
                    if (err) throw err;
                    console.log(`Inserted: ${res.insertedCount} rows`);
                    db.close();
                });
            }
            else {
                console.log("oops");
            }
            console.log("Success!");
        });
    });
    stream.pipe(csvStream);
}

main();