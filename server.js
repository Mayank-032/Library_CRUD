const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const MongoClient = require("mongodb").MongoClient;

var db;
MongoClient.connect(
  "mongodb+srv://Mayank:2002@library-crud-cluster.zchbxy9.mongodb.net/test",
  (err, client) => {
    if (err) {
      return console.log(err);
    } else {
      db = client.db("BooksDB");

      app.listen(process.env.PORT || 8000, () => {
        console.log("Listening on Port 8000");
      });
    }
  }
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// GET Request
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

var http = require("http");

http.createServer(function (request, response) {
   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as "Hello World"
   response.end('Hello World\n');
}).listen(8081);

const {
    Promise,
  } = primordials;
  
  const {
    Readline,
  } = require('internal/readline/promises');
  
  const {
    Interface: _Interface,
    kQuestion,
    kQuestionCancel,
  } = require('internal/readline/interface');
  
  const {
    AbortError,
  } = require('internal/errors');
  const { validateAbortSignal } = require('internal/validators');
  
  const {
    kEmptyObject,
  } = require('internal/util');
  
  class Interface extends _Interface {
    // eslint-disable-next-line no-useless-constructor
    constructor(input, output, completer, terminal) {
      super(input, output, completer, terminal);
    }
    question(query, options = kEmptyObject) {
      return new Promise((resolve, reject) => {
        let cb = resolve;
  
        if (options?.signal) {
          validateAbortSignal(options.signal, 'options.signal');
          if (options.signal.aborted) {
            return reject(
              new AbortError(undefined, { cause: options.signal.reason }));
          }
  
          const onAbort = () => {
            this[kQuestionCancel]();
            reject(new AbortError(undefined, { cause: options.signal.reason }));
          };
          options.signal.addEventListener('abort', onAbort, { once: true });
          cb = (answer) => {
            options.signal.removeEventListener('abort', onAbort);
            resolve(answer);
          };
        }
  
        this[kQuestion](query, cb);
      });
    }
  }
  
  function createInterface(input, output, completer, terminal) {
    return new Interface(input, output, completer, terminal);
  }
  
  module.exports = {
    Interface,
    Readline,
    createInterface,
  };
  
// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');

app.get("/user", (req, res) => {
  res.send("Enter username")
  res.redirect("/login");
  res.send("Enter password")
  res.redirect("/login");
});

{ SHELL: '/bin/bash',
  SESSION_MANAGER:
   'local/digitalocean:@/tmp/.ICE-unix/1003,unix/digitalocean:/tmp/.ICE-unix/1003',
  COLORTERM: 'truecolor',
  SSH_AUTH_SOCK: '/run/user/1000/keyring/ssh',
  XMODIFIERS: '@im=ibus',
  DESKTOP_SESSION: 'ubuntu',
  SSH_AGENT_PID: '1150',
  PWD: '/home/sammy/first-program',
  LOGNAME: 'sammy',
  GPG_AGENT_INFO: '/run/user/1000/gnupg/S.gpg-agent:0:1',
  GJS_DEBUG_TOPICS: 'JS ERROR;JS LOG',
  WINDOWPATH: '2',
  HOME: '/home/sammy',
  USERNAME: 'sammy',
  IM_CONFIG_PHASE: '2',
  LANG: 'en_US.UTF-8',
  VTE_VERSION: '5601',
  CLUTTER_IM_MODULE: 'xim',
  GJS_DEBUG_OUTPUT: 'stderr',
  LESSCLOSE: '/usr/bin/lesspipe %s %s',
  TERM: 'xterm-256color',
  LESSOPEN: '| /usr/bin/lesspipe %s',
  USER: 'sammy',
  DISPLAY: ':0',
  SHLVL: '1',
  PATH:
   '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin',
  DBUS_SESSION_BUS_ADDRESS: 'unix:path=/run/user/1000/bus',
  _: '/usr/bin/node',
  OLDPWD: '/home/sammy' }
  
// POST Request
app.post("/Task1", (req, res) => {
  db.collection("books")
    .find({ book_name: new RegExp(req.body.BookName, "i") })
    .toArray(function (err, result) {
      if (err) return console.log(err);
      res.send(result);
    });
});

app.post("/Task2", (req, res) => {
  db.collection("books")
    .find(
      { category: req.body.Category },
      {
        $and: [
          { book_name: new RegExp(req.body.BookName1, "i") },
          {
            rent_per_day: {
              $and: [
                {
                  gte: req.body.minRange,
                },
                {
                  lte: req.body.maxRange,
                },
              ],
            },
          },
        ],
      }
    )
    .toArray((err, result) => {
      if (err) return console.log(err);
      res.send(result);
    });
});

// Store Data In Transactions and also update database when book is issued
app.post("/Task3", async (req, res) => {
  // console.log(req.body.BookName3)
  if (req.body.issue !== undefined) {
    if (
      (await db
        .collection("books")
        .count({ book_name: new RegExp(req.body.BookName3, "i") })) > 0
    ) {
      if (
        (await db.collection("Transaction").count({
          $and: [
            { book_name: new RegExp(req.body.BookName3, "i") },
            { person_name: new RegExp(req.body.PersonName, "i") },
          ],
        })) === 0
      ) {
        await db.collection("Transaction").insertOne({
          book_name: req.body.BookName3,
          person_name: req.body.PersonName,
          issueDate: new Date(),
        });

        res.send("Book Issued Successfully");
      } else {
        res.send("Book Already Issued");
      }
    } else {
      res.send("No Data Found");
    }
  } else {
    if (
      (await db.collection("Transaction").countDocuments({
        $and: [
          { book_name: req.body.BookName3 },
          { person_name: req.body.PersonName },
        ],
      })) > 0
    ) {
      await db
        .collection("Transaction")
        .findOneAndUpdate(
          { book_name: req.body.BookName3, person_name: req.body.PersonName },
          { $set: { returnDate: new Date() } }
        );

      let rentPerDay = await db
        .collection("books")
        .findOne(
          { book_name: new RegExp(req.body.BookName3, "i") },
          { person_name: new RegExp(req.body.PersonName, "i") }
        );

      let dates = await db.collection("Transaction").findOne({
        book_name: req.body.BookName3,
        person_name: req.body.PersonName,
      });

      let date1 = dates.issueDate;
      let date2 = dates.returnDate;
      let diff = date1.getTime() - date2.getTime();

      let TotalDays = Math.ceil(diff / (1000 * 3600 * 24));
      let rpd = rentPerDay.rent_per_day;

      res.send(
        "Book Returned Successfully!!! Total Rent Calculated: " +
          (TotalDays + 1) * rpd
      );
    } else {
      res.send("Please Issue The Book First!!!");
    }
  }
});
