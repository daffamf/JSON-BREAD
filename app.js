const fs = require('fs')
const bp = require('body-parser')
const express = require('express')
const path =require('path')
const app =express()

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(bp.json());
app.use(bp.urlencoded({
  extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

let data = JSON.parse(fs.readFileSync(path.join(__dirname, './data.json'), 'utf8'));
const writeData = (data) => {
  fs.writeFileSync(path.join(__dirname, './data.json'), JSON.stringify(data, null, 3), 'utf8');
}

app.get('/', function (req, res, next) {
  res.render('index.ejs',{
      data
    });
});

app.post('/search', function (req, res, next) {
  const {id, string, integer, float, boolean} = req.body;
  res.render('index', { data: data });
});


app.get('/add', function (req, res, next) {
  res.render('add');
});

app.post('/add', function (req, res) {
  data.push({
    string: req.body.string,
    integer: parseInt(req.body.integer),
    float: parseFloat(req.body.float),
    date: req.body.date,
    boolean: JSON.parse(req.body.boolean)
  });
  writeData(data);
  res.redirect('/');
})

app.get('/edit/:id', function (req, res, next) {
  let id = req.params.id;
  res.render('edit.ejs', {
    item: data[id],
    id: id
  });
});

app.post('/edit/:id', function (req, res) {
  let id = req.params.id;
  data[id]=({
    string: req.body.string,
    integer: parseInt(req.body.integer),
    float: parseFloat(req.body.float),
    date: req.body.date,
    boolean: JSON.parse(req.body.boolean)
  });
  writeData(data);
  res.redirect('/');
})


app.get('/delete/:id', function (req, res, next) {
  let id = req.params.id;
  data.splice(id, 1);
  writeData(data);
  res.redirect('/');
});
app.listen(3000, () => {
console.log('web berjalan di port 3000')
})