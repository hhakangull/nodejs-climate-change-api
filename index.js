const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const newspapers = [
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
  },
{
    name: 'thetimes',
    address: 'https://www.thetimes.co.uk/environment/climate-change'
},

{
    name: 'telegraph',
    address: 'https://www.telegraph.co.uk/climate-change'
}
];

const articles = [];

app.get("/", (req, res) => {
  res.json("Welcome to my Climate Change News API");
});

app.get("/news", (req, res) => {
  axios
    .get("https://www.theguardian.com/environment/climate-crisis")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");

        articles.push({
          title,
          url,
        });
      });
      res.json(articles);
    })
    .catch();
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
