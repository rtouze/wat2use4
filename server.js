// Main part of app server side.

var express = require('express');
var app = express();

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html')
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
    res.render('index', {title: 'Ma page avec express'});
})

var server = app.listen(3000, function () {
    console.log('app up and running on 3000...');
})

app.use(function(err, req, res, next){
    // whatever you want here, feel free to populate
    // properties on `err` to treat it differently in here.
    res.send(err.status || 500, { error: err.message });
});


