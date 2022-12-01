const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");

const app = express();

const newspapers = [
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",

    base: "",
  },

  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change",
    base: "https://www.telegraph.co.uk",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("climate")', html).each(function () {
        const title = $(this)
          .text()
          .replace(/\r?\n|\r/g, " ")
          .trimStart();
        const url = $(this).attr("href");

        articles.push({
          title: title,
          url: newspaper.base + url,
          source: newspaper.name,
        });
      });
    })
    .catch((err) => {});
});

app.get("/", (req, res) => {
  res.json("Welcome to my Climate Change News API");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", async (req, res) => {
  const newsPaperId = req.params.newspaperId;

  const newspaper = newspapers.filter((newsP) => newsP.name == newsPaperId)[0];
  const newspaperAddress = newspaper.address;
  const newspaperBase = newspaper.base;
  const newspaperName = newspaper.name;

  axios.get(newspaperAddress).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    const specifArticles = [];
    $('a:contains("climate")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      specifArticles.push({
        name: newspaperName,
        title,
        url: newspaperBase + url,
      });
    });
  });
  
  res.json(newspaperAddress)
  //res.json(specifArticles);
});

app.get("/oldNews", (req, res) => {
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
