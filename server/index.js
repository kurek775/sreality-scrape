const keys = require("./keys");
const axios = require('axios')
const bodyParser = require("body-parser");
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const {Pool} = require("pg");
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on("connect", client => {
    client
        .query("CREATE TABLE IF NOT EXISTS prod(id INT,title VARCHAR(300), locality VARCHAR(300),image VARCHAR(300))")
        .catch(err => console.log("PG ERROR", err));
});


app.get("/scrape", async (req, res) => {
    pgClient.query('DELETE FROM prod');
    const url = 'https://www.sreality.cz/api/cs/v2/estates?category_main_cb=1&category_type_cb=1&per_page=500&tms=1675972823550'

    axios(url)
        .then(response => {
            const scrape = response.data;


            for (var keyg in scrape) {
                if (keyg === "_embedded") {
                    const est = scrape[keyg]["estates"];

                    for (let flat in est) {
                        const title = est[flat]["name"];
                        const locality = est[flat]["locality"];
                        const img = est[flat]["_links"]["images"][0]["href"];

                        pgClient.query('INSERT INTO prod(id,title,locality,image) VALUES($1,$2,$3,$4)', [flat, title,locality, img]);
                    }

                }
            }

        });

    res.send("scraped");


});

app.get("/flats/:page", async (req, res) => {

    const page = parseInt(req.params['page']) * 20;
    const values = await pgClient.query("SELECT * FROM prod");

    res.send(values["rows"].slice(page, page + 20));


});


app.listen(5000, err => {
    console.log("Listening");
});
