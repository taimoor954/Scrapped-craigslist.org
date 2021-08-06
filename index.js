// const request = require("request-promise");
const request = require('requestretry').defaults({fullResponse:false})
const cheerio = require("cheerio");
const fs = require("fs");
const { title } = require("process");
const { scrapJobDetails } = require("./jobDetails");
const url = "https://ahmedabad.craigslist.org/d/software-qa-dba-etc/search/sof";

const scrapeResult = {
  title: "",
  description: "",
  datePosted: new Date(),
  url: "",
  hood: "",
  address: "",
  compensatiom: "",
};
var jobObj = {};

async function scrapeCraglist(url) {
  try {
    const html = await request.get(url);
    var postedDates = [];
    var jobTitles = [];
    var jobLinks = [];
    var nearByTitles = [];
    var nearByText = [];
    var times = [];
    var jobs = [];
    // var jobObj = {};
    fs.writeFileSync("./test.html", html);
    const $ = await cheerio.load(html);

    $(".result-info").each((index, element) => {
      postedDates.push($(element).children("time").text());
      times.push($(element).children("time").attr("datetime"));

      nearByTitles.push(
        $(element).children(".result-meta").children(".nearby").attr("title")
      );

      nearByText.push(
        $(element).children(".result-meta").children(".nearby").text()
      );
    });

    $(".result-heading").each((index, element) => {
      var title = $(element).children(".result-title").text();
      var link = $(element).children("a").attr("href");
      jobTitles.push(title);
      jobLinks.push(link);
    });

    //STORING ALL THE ITEMS IN AN OBJECT
    for (let index = 0; index < jobTitles.length; index++) {
      jobObj = {
        title: jobTitles[index],
        link: jobLinks[index],
        postedOn: postedDates[index],
        nearByTitle: nearByTitles[index],
        nearByText: nearByText[index],
        time: times[index],
        Details: await scrapJobDetails(jobLinks[index]),
      };

      jobs.push(jobObj);
    }
    writeJSON(jobs);
  } catch (error) {
    console.log(error);
  }
}
scrapeCraglist(url);

var writeJSON = async (json) => {
  var resultJSON = JSON.stringify(json);
  fs.writeFileSync("./jobs.json", resultJSON);
};
