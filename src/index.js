const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const morgan = require('morgan');
const app = express();
const port = 3010;
const route = require('./routes');
const cors = require('cors')

app.use(cors())

//Static file
app.use(express.static(path.join(__dirname, 'public')));

// HTTP Logger
      app.use(morgan('combined'));

// Middleware
app.use(
    express.urlencoded({
        extended: true,
    }),
);
      
app.use(express.json());

//Template Engine
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//Route init
route(app);

const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
  
    console.log(`Server listening on port ${server.address().port}`);
});
