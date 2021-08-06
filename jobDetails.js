const request = require("request-promise");
const cheerio = require("cheerio");
exports.scrapJobDetails = async (url) => {
  let jobDetails = {
    jobRequirments: [],
    jobResponsibilties: [],
    compensation: "",
    employmentType: "",
  };

  const html = await request.get(url);
  const $ = cheerio.load(html);
  var compensation, employmentType;
  // fs.writeFileSync("./jobDetails.html", html);

  var jobType = $(".attrgroup").text().split("\n");
  jobType = jobType.map((s) => s.trim()); //trim all empty strings
  jobType = jobType.filter((v) => v != ""); //Filter(Remove) Every empty string from array
  jobType = jobType.map((str) => str.replaceAll("•\t", "")); //removing /t from all strings


  jobType.forEach((job, index) => {
    var a = job.split(":");
    if (index == 0) {
      compensation = [...a];
    
    }
    if (index == 1) {
      employmentType = [...a];
    }
  });

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

  if (indexValRequirements || indexValResponsibilty) {
    const responsibilities = textArray.slice(
      indexValResponsibilty,
      indexValRequirements - 1
    );
    const requirements = textArray.slice(
      indexValRequirements,
      textArray.length
    );
    jobDetails.jobResponsibilties = [...responsibilities];
    jobDetails.jobRequirments = [...requirements];
  } else {
    jobDetails.details = [...textArray];
  }
  jobDetails.compensation = compensation[1];
  jobDetails.employmentType = employmentType[1];
  return jobDetails
 
};

