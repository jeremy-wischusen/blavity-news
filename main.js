"use strict";
require('dotenv').config();
//console.log(process.env);
const express = require('express');
const port = 3000;
const app = express();
const bodyParser = require('body-parser');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const mongo = require('mongodb');
const client = mongo.MongoClient(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(express.static('public'));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile('index.html');
});
app.get('/articles/', (req, res) => {
    /*{status: "ok", articles: [...]}*/
    newsapi.v2.topHeadlines({
        country: 'us'
    }).then(response => {
        res.setHeader('Content-Type', 'application/json');
        res.send(response.articles);
    });
});
app.get('/articles/saved', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    client.connect((e, r) => {
        if (e) {
            console.error(e);
        } else {
            client.db('blavity').collection("savedArticles").find().toArray((e, r) => {
                if (e) {
                    res.send(e.message);
                } else {
                    res.send(r);
                }
            });
        }
    });
});
app.post('/articles/saved', (req, res) => {
    client.connect((e, r) => {
        if (e) {
            console.error(e);
        } else {
            client.db('blavity').collection("savedArticles").insertOne(req.body, (e, r) => {
                if (e) {
                    res.send(e.message);
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(r);
                }
            });
        }
    });
});
app.delete('/articles/saved/:id', (req, res) => {
    client.connect((e, r) => {
        if (e) {
            console.error(e);
        } else {
            client.db('blavity').collection("savedArticles").deleteOne({_id: new mongo.ObjectId(req.params.id)},
                (e, r) => {
                    if (e) {
                        res.send(e.message);
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(r);
                    }
                });
        }
    });
});
app.listen(port, () => console.log(`Server is listening on port ${port}!`));
