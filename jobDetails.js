const fs = require("fs");
const request = require("request-promise");
const cheerio = require("cheerio");
const url =
  "https://indore.craigslist.org/sof/d/react-nodejs-developer/7346680061.html";

//
const scrapJobDetails = async (url) => {
  let jobDetails = { jobRequirments: [], jobResponsibilties: [] };
  const html = await request.get(url);
  const $ = cheerio.load(html);
  fs.writeFileSync("./jobDetails.html", html);

  var textArray = $("#postingbody").text().split("\n");
  textArray = textArray.map((s) => s.trim()); //trim all empty strings
  textArray = textArray.filter((v) => v != ""); //Filter(Remove) Every empty string from array
  textArray = textArray.map((str) => str.replaceAll("•\t", "")); //removing /t from all strings

  var indexValResponsibilty;
  var indexValRequirements;
  textArray.find((str, index) => {
    if (str === "Responsibilities:") {
      indexValResponsibilty = index;
    }
  });
  textArray.find((str, index) => {
    if (str === "Requirements:") {
      indexValRequirements = index;
    }
  });

  const responsibilities = textArray.slice(
    indexValResponsibilty,
    indexValRequirements - 1
  );
  const requirements = textArray.slice(indexValRequirements, textArray.length);
  jobDetails.jobResponsibilties = [...responsibilities];
  jobDetails.jobRequirments = [...requirements];
  console.log(jobDetails);
};

scrapJobDetails(url);
