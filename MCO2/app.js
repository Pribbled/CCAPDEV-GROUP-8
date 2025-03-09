const express = require('express');
const server = express();

const bodyParser = require('body-parser');
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

server.use(express.static('public'));

const controllers = ['routes','reserve','reserveLab', 'login', 'register', 'slots', 'slotsLab'];
for(var i=0; i<controllers.length; i++){
    const model = require('./controllers/'+controllers[i]);
    model.add(server);
}

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/ccapdev').then(() => console.log('MongoDB connected')).catch(err => console.log(err));

const port = process.env.PORT || 9090;
server.listen(port, function(){
    console.log('Listening at port '+port);
});