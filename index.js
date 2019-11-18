const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const registrationOpp = require("./registration");
const flash = require("express-flash");
const session = require("express-session");
let regDisplay = "";

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
    let regDisplay = await registration.getRegNumbers();
    let towns = await registration.getTowns();
    res.render("index", {
      regDisplay,
      towns
    });
  });

  app.get("/filter/:tag", async function(req, res) {
    let tag = req.params.tag;
    let regDisplay = await registration.filter(tag);
  
    res.render("index", {
      regDisplay,
      towns
    });
  });

app.post("/reg-numbers", async function(req, res){
   const regPlate = req.body.reg
 
   regDisplay = await registration.addReg(regPlate)


   if(regPlate === "" || !regPlate){
     await req.flash("error", "Invalid registration number - town not supported.");
   }
   else if(regPlate){
     await req.flash("success", "Registration number added successfully!");
   }
   else{
     await req.flash("error", "This registration number already exists!");
     return false;
   }

  res.redirect('/');
})

const PORT = process.env.PORT || 5500;

app.listen(PORT, function() {
  console.log("App has started", PORT);
});