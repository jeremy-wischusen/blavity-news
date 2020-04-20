"use strict";
require('dotenv').config();
//console.log(process.env);
const express = require('express');
const port = 3000;
const app = express();
const bodyParser = require('body-parser');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const {Pool} = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
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
app.get('/articles/saved', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const client = await pool.connect();
        await client.query("SELECT ID, TITLE, URL, IMAGE_URL FROM SAVED_ARTICLES", (e, r) => {
            if (e) {
                client.end();
                res.send(JSON.stringify(e));
            } else {
                let articles = [];
                if (r.rowCount > 0) {
                    let rows = r.rows;
                    for (let i in rows) {
                        let a = rows[i];
                        articles.push({
                            "id": a.id,
                            "title": a.title,
                            "url": a.url,
                            "urlToImage": a.image_url
                        });
                    }
                }
                client.end();
                res.send(articles);
            }
        });
    } catch (e) {
        client.end();
        res.send(JSON.stringify(e));
    }
});
app.post('/articles/saved', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        let article = req.body;
        const client = await pool.connect();
        await client.query("INSERT INTO SAVED_ARTICLES(TITLE, URL,IMAGE_URL) VALUES($1,$2,$3)", [
            article.title,
            article.url,
            article.urlToImage || ''
        ], (e, r) => {
            if (e) {
                res.send(JSON.stringify(e));
            } else {
                res.send({"added": r.rowCount});
            }
            client.end();
        });
    } catch (e) {
        client.end();
        res.send(JSON.stringify(e));
    }
});
app.delete('/articles/saved/:id', async (req, res) => {
    try {
        const client = await pool.connect();
        await client.query("DELETE FROM SAVED_ARTICLES WHERE ID =$1", [
            req.params.id
        ], (e, r) => {
            if (e) {
                res.send(JSON.stringify(e));
            } else {
                res.send({"deleted": r.rowCount});
            }
            client.end();
        });
    } catch (e) {
        client.end();
        res.send(JSON.stringify(e));
    }
});
app.listen(port, () => console.log(`Server is listening on port ${port}!`));
