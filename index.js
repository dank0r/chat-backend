let consign = require('consign');

let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');


let app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

consign()
  .include('db.js')
  .then('routes')
  .then('libs/boot.js')
  .into(app);