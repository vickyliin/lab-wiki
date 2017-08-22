const express = require('express')
const app = express()
const fs = require('fs')
const glob = require('glob')
const loremIpsum = require('lorem-ipsum')

app.use(express.static('data'))
app.use(function(req, res, next){
  "use strict";
  res.set('Access-Control-Allow-Origin', 'http://localhost:12345')
  next()
})

glob('data/*.json', function(er, files){
  for(let file of files){
    app.get(file.replace(/data\/(.*)\.json/, '/$1'), function(req, res){
      data = fs.readFileSync(file, 'utf-8')
      res.json(JSON.parse(data))
    })
  }
})

app.sta

app.get('/news', function(req, res){
  "use strict";
  res.json({
    title: loremIpsum({sentenceUpperBound: 10}),
    content: loremIpsum({units: 'paragraphs'}),
    date: new Date(),
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})