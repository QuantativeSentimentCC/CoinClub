const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const request = require('request');

/* Connect
const connection = closure => {
  return MongoClient.connect('mongodb://localhost:27017/cs5412', (err, db) => {
    if (err) return console.log(err);

    closure(db);
  });
};*/

// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};

// Response handling
let response = {
  status: 200,
  data: [],
  message: null
};

// Get news
router.get('/news', (req, res) => {
  //MongoClient.connect('mongodb://database:27017', (err, client) => {
  MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) throw err;
    client
      .db('cs5412')
      .collection('news_data')
      .find({})
      .sort({ time: -1 })
      .limit(20)
      .toArray()
      .then(news => {
        response.data = news;
        res.json(response);
      })
      .catch(err => {
        sendError(err, res);
      });
  });
});

router.get('/news/:news_id', (req, res) => {
  //MongoClient.connect('mongodb://database:27017', (err, client) => {
  MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) throw err;
    client
      .db('cs5412')
      .collection('news_data')
      .findOne({ _id: ObjectID(req.params.news_id) })
      .then(news => {
        response.data = news;
        res.json(response);
      })
      .catch(err => {
        sendError(err, res);
      });
  });
});

router.get('/price', (req, res) => {
  //MongoClient.connect('mongodb://database:27017', (err, client) => {
  MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) throw err;
    client
      .db('cs5412')
      .collection('price_data')
      .find({})
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray()
      .then(news => {
        response.data = news[0];
        res.json(response);
      })
      .catch(err => {
        sendError(err, res);
      });
  });
});

router.get('/headlines', (req, res) => {
  var url =
    'https://newsapi.org/v2/everything?q=cryptocurrency&sortBy=publishedAt&apiKey=f462ca2cbbbc445c9c9ed76819a8e458';

  request.get(url, (error, resp, body) => {
    headlines = JSON.parse(body);
    response.data = headlines.articles.filter(obj => obj.urlToImage != null);
    //console.log(response.data);
    res.json(response);
  });
});

router.get('/prediction', (req, res) => {
  //MongoClient.connect('mongodb://database:27017', (err, client) => {
  MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) throw err;
    client
      .db('cs5412')
      .collection('prediction_data')
      .find({})
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray()
      .then(prices => {
        response.data = prices[0];
        res.json(response);
      })
      .catch(err => {
        sendError(err, res);
      });
  });
});

module.exports = router;
