const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://yvesdrop:memorysucks00@cluster0.p16bt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
var port = process.env.PORT || 8000;

var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var obj = url.parse(req.url, true).query;
    var checkBox = (obj.toggle) ? true : false;
    var query = obj.query;

    const client = new MongoClient(url1, {useNewUrlParser: true, useUnifiedTopology: true, native_parser: true});
    
    connect(client, checkBox, query, res);

}).listen(port);

async function connect(client, checkBox, query, res) {
    client.connect(err => {
        const collection = client.db("companies_db").collection("companies");
        console.log("Success!");
        console.log(checkBox, query);

        collection.find().toArray(function (err, items) {
            if (err) {
                console.log("Error: " + err);
                return;
            }
            else {
                var found = false;
                for (i = 0; i < items.length; i++) {
                    if (checkBox) {
                        if (items[i].company == query) {
                            res.write("<html><body style='text-align: center; background-color: black; color: rgb(55, 238, 18); margin-top: 30px; font-size: 14px;'>" + query + "'s ticker symbol is: " + items[i].ticker + "</body></html>");
                            found = true;
                            break;
                        }
                    }
                    else {
                        if (items[i].ticker == query) {
                            res.write("<html><body style='text-align: center; background-color: black; color: rgb(55, 238, 18); margin-top: 30px; font-size: 14px;'>" + query + " is the ticker symbol for " + items[i].company + "</body></html>");
                            found = true;
                            break;
                        }
                    }
                }

                if (!found) {
                    res.write("<html><body style='text-align: center; background-color: black; color: rgb(55, 238, 18); margin-top: 30px; font-size: 14px;'>Oops! The company or ticker you have queried is not in our stock database.</body></html");
                }
            }
        });  //end find
    });
}