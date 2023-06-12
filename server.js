var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var JournalorBook, borjName,data,pDate;
var oldName,newName;
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("public", { extensions: ["css"] }));

const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'Library';

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/home.html");
});

app.get("/search.html", function (req, res) {
  res.sendFile(__dirname + "/search.html");
});

app.get("/update.html", function (req, res) {
  res.sendFile(__dirname + "/update.html");
});

app.get("/report.html", function (req, res) {
  res.sendFile(__dirname + "/report.html");
});

app.post("/search/result", function (req, res) {
  JournalorBook = req.body.type;
  borjName = req.body.searchQuery;
  console.log(JournalorBook);

  async function main() {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection(JournalorBook);
    if(JournalorBook === "book"){

    var query = { book_name: borjName };
    data = await collection.find(query).toArray();
    }
    else{

      var query = { journal_name: borjName };
      data = await collection.find(query).toArray();
    }
    console.log(data);

    if (data.length > 0) {
      res.send({ found: true }); // Book found
    } else {
      res.send({ found: false }); // Book not found
    }
  }

  main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
});

app.post("/retrieve/result", function (req, res) {
  JournalorBook = req.body.type1;
  pDate = req.body.publicationDate;
  console.log(JournalorBook);
  console.log(pDate);

  async function main() {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection(JournalorBook);

    var query = { publication_date: pDate };
    data = await collection.find(query).toArray();
    console.log(data);

    if (data.length === 0) {
         res.write('<html><head>');
         res.write('<style>');
         res.write('body { background-color: #e9ab69; font-family: Arial, sans-serif; }');
         res.write('h1 { color: #333; text-align: center; padding: 30px 0; }');
         res.write('.button-container { text-align: center; }');  // Added button container style
         res.write('.button { background-color: #333; color: #fff; border: none; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin-top: 20px; }');
         res.write('</style>');
         res.write('</head><body>');
         res.write("<h1>NO DATA FOUND</h1>");
         res.write('<div class="button-container">');  
         res.write('<a class="button" href="/">Go Home</a>');
         res.write('</div>'); 
         res.write('</body></html>');
         res.end();
    } else {
      if (JournalorBook === "book") {
        res.write('<html><head>');
        res.write('<style>');
        res.write('body { background-color: #e9ab69; font-family: Arial, sans-serif; }');
        res.write('h1 { color: #333; text-align: center; padding: 30px 0; }');
        res.write('table { margin: 20px auto; border-collapse: collapse; }');
        res.write('th, td { padding: 10px; border: 1px solid #ccc; text-align: center; }');
        res.write('th { background-color: #333; color: #fff; }');
        res.write('.button-container { text-align: center; }');  // Added button container style
        res.write('.button { background-color: #333; color: #fff; border: none; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin-top: 20px; }');
        res.write('</style>');
        res.write('</head><body>');
        res.write('<h1>Search Results</h1>');
        res.write('<table>');
        res.write('<tr><th>BookName</th><th>BookID</th><th>Publication Date</th><th>Author</th></tr>');
        data.forEach(function (item) {
          res.write('<tr>');
          res.write('<td>' + item.book_name + '</td>');
          res.write('<td>' + item.book_id + '</td>');
          res.write('<td>' + item.publication_date + '</td>');
          res.write('<td>' + item.author_name + '</td>');
          res.write('</tr>');
        });
        res.write('</table>');
        res.write('<div class="button-container">');  // Added button container div
        res.write('<a class="button" href="/">Go Home</a>');
        res.write('</div>');  // Close button container div
        res.write('</body></html>');
        res.end();
      } else {
        res.write('<html><head>');
        res.write('<style>');
        res.write('body { background-color: #e9ab69; font-family: Arial, sans-serif; }');
        res.write('h1 { color: #333; text-align: center; padding: 30px 0; }');
        res.write('table { margin: 20px auto; border-collapse: collapse; }');
        res.write('th, td { padding: 10px; border: 1px solid #ccc; text-align: center; }');
        res.write('th { background-color: #333; color: #fff; }');
        res.write('.button-container { text-align: center; }');  // Added button container style
        res.write('.button { background-color: #333; color: #fff; border: none; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin-top: 20px; }');
        res.write('</style>');
        res.write('</head><body>');
        res.write('<h1>Search Results</h1>');
        res.write('<table>');
        res.write('<tr><th>JournalName</th><th>JournalID</th><th>Publication Date</th><th>Author</th></tr>');
        data.forEach(function (item) {
          res.write('<tr>');
          res.write('<td>' + item.journal_name + '</td>');
          res.write('<td>' + item.journal_id + '</td>');
          res.write('<td>' + item.publication_date + '</td>');
          res.write('<td>' + item.author_name + '</td>');
          res.write('</tr>');
        });
        res.write('</table>');
        res.write('<div class="button-container">');  // Added button container div
        res.write('<a class="button" href="/">Go Home</a>');
        res.write('</div>');  // Close button container div
        res.write('</body></html>');
        res.end();
      }
      

      }
      
  }

  main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
});

app.post("/update", function (req, res) {
  JournalorBook = req.body.type;
  oldName = req.body.oldName;
  newName = req.body.newName;
  console.log(JournalorBook);
  console.log(oldName);
  console.log(newName);

  async function main() {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection(JournalorBook);

    var query = {};
    if (JournalorBook === "book") {
      query = { book_name: oldName };
    } else {
      query = { journal_name: oldName };
    }
    console.log(query);

    data = await collection.find(query).toArray();
    console.log(data);

    if (data.length > 0) {
      var update = {};
      if (JournalorBook === "book") {
        update = { $set: { book_name: newName } };
      } else {
        update = { $set: { journal_name: newName } };
      }

      const result = await collection.updateOne(query, update);
      if (result.modifiedCount > 0) {
        res.send({ success: true, message: "Update successful!" });
      } else {
        res.send({ success: false, message: "Failed to update book/journal name." });
      }
    } else {
      res.send({ success: false, message: "Book/Journal not found." });
    }
  }

  main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
});

app.post("/reports", async function(req, res) {
  try {
    await client.connect();
    console.log("Connected successfully to the server");

    const db = client.db(dbName);
    const bookCollection = db.collection("book");
    const journalCollection = db.collection("journal");

    const bookData = await bookCollection.find({}, { book_name: 1, author_name: 1, _id: 0 }).toArray();
    const transformedBookData = bookData.map(({ book_name, author_name }) => ({ book_name, author_name }));

    const journalData = await journalCollection.find({}, { journal_name: 1, author_name: 1, _id: 0 }).toArray();
    const transformedJournalData = journalData.map(({ journal_name, author_name }) => ({ journal_name, author_name }));

    console.log(transformedBookData);
    console.log(transformedJournalData);

    if (transformedBookData.length === 0 && transformedJournalData.length === 0) {
      res.send("<h1>NO DATA FOUND</h1>");
    } else {
      res.write(`
      <html>
      <head>
        <style>
          body {
            background-color: #e9ab69;
          }
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .table-container {
            width: 80%;
            margin: 20px auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
          }
          th,
          td {
            padding: 10px;
            text-align: left;
            border-left: 2px solid black;
            border-top: 2px solid black;
            border-bottom: 2px solid black;
          }
          th {
            background-color: #333;
            color: #fff;
          }
          tr:hover {
            background-color: rgb(255, 225, 165);
          }
          h1 {
            color: #fff;
            display: flex;
            align-items: center;
           justify-content: center;
           margin-top: 10px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #333;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
          }
           .button:hover {
             background-color: #555;
           }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>REPORT ON LIST OF BOOK AND JOURNAL</h1>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Book Name</th>
                  <th>Author Name</th>
                </tr>
              </thead>
              <tbody>
                ${transformedBookData
                  .map(
                    ({ book_name, author_name }) =>
                      `<tr><td>${book_name}</td><td>${author_name}</td></tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Journal Name</th>
                  <th>Author Name</th>
                </tr>
              </thead>
              <tbody>
                ${transformedJournalData
                  .map(
                    ({ journal_name, author_name }) =>
                      `<tr><td>${journal_name}</td><td>${author_name}</td></tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          <a class="button" href="/">Go Home</a>
        </div>
      </body>
    </html>    
   `);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  } finally {
    await client.close();
    res.end();
  }
});






var server = app.listen(3000, function () {
  console.log("Server running at port " + server.address().port);
});
