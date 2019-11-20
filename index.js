const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const registrationOpp = require("./registration");
const flash = require("express-flash");
const session = require("express-session");
let regPlate

const app = express();

const pg = require("pg");
const Pool = pg.Pool;

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}
// which db connection to use
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://sino:codex123@localhost:5432/registration-opp";

const pool = new Pool({
  connectionString,
  ssl: useSSL
});


const registration = registrationOpp(pool);

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers:{
      selectedTag: function(){
          if(this.selected){
              return 'selected';
          }
      },
    },
    extname: ".handlebars",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials"
  })
);
app.set("view engine", "handlebars");

// initialise session middleware - flash-express depends on it
app.use(
  session({
    secret: "message",
    resave: false,
    saveUninitialized: true
  })
);

// initialise the flash middleware
app.use(flash());

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get("/", async function(req, res) {
   
    let towns = await registration.getTowns();
    res.render("index", {
      regDisplay:await registration.getRegNumbers(),
      towns
    });
  });

app.post("/reg-numbers", async function(req, res){
    regPlate = req.body.reg
 console.log("regPlate", regPlate)
  // if(await registration.regDuplicate() === 0){
  await registration.addReg(regPlate)
//  console.log(await registration.regDuplicate())
// }
// else{
//    req.flash("error", "This registration number already exists!");
//  }
  //  if(regPlate === "" || !regPlate){
  //   req.flash("error", "Invalid registration number - town not supported.");
  //  }
  //  else if(regPlate){
  //    req.flash("success", "Registration number added successfully!");
  //  }
  //  else if(regPlate){
  //     req.flash("error", "This registration number already exists!");
  //  }

  res.redirect('/');
})

app.get("/filter/:tag", async function(req, res) {
  let tag = req.params.tag;
  let regDisplay = await registration.filter(tag);
  let towns = await registration.getTowns();

  res.render("index", {
    regDisplay,
    towns
  });
});

app.post("/clear", async function(req, res){
  await registration.clearReg();
  res.redirect("/")
})

const PORT = process.env.PORT || 5500;

app.listen(PORT, function() {
  console.log("App has started", PORT);
});

