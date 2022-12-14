const axios = require("axios");
const cheerio = require("cheerio");
const crypto = require("crypto");
const fs = require("fs");
const moment = require("moment");
const path = require("path");
const {
  convertJackpotRawToJackpot,
  convertTimestampRawToTimestamp,
} = require("./utils");

(async () => {
  let results = [];

  for (let i = 2000; i <= 2022; i++) {
    results = results.concat(await loadEntriesForYear(i));

    console.log(i);

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  fs.writeFileSync("data.json", JSON.stringify(results));

  console.log(results.length);
})();

async function loadEntriesForYear(year) {
  const results = [];

  const url = `https://za.national-lottery.com/lotto/results/${year}-archive`;

  const html = await loadHtmlFromUrl(url);

  const $ = cheerio.load(html);

  const elements = $("#content table.table tbody tr:not(.noBox)").toArray();

  for (const element of elements) {
    const timestampRaw = $(element).find("td:nth-of-type(1) a").html();

    const timestamp = convertTimestampRawToTimestamp(timestampRaw);

    const numbers = $(element)
      .find("td:nth-of-type(2) ul.balls li")
      .toArray()
      .map((x) => parseInt($(x).html()));

    const jackpotRaw = $(element).find("td:nth-of-type(3)").html();

    const jackpot = convertJackpotRawToJackpot(jackpotRaw);

    results.push({
      jackpot,
      numbers,
      timestamp,
      ...(await loadDetailsForDate(moment(timestamp).format("DD-MMMM-YYYY"))),
    });
  }

  return results;
}

async function loadDetailsForDate(date) {
  const url = `https://za.national-lottery.com/lotto/results/${date}`;

  const html = await loadHtmlFromUrl(url);

  const $ = cheerio.load(html);

  const drawNumber = parseInt(
    $(
      "#content .box.block.breakdownBox .drawInfo .half:nth-of-type(1) p:nth-of-type(1) span"
    )
      .html()
      .replace(/,/g, "")
  );

  const machineName = $(
    "#content .box.block.breakdownBox .drawInfo .half:nth-of-type(1) p:nth-of-type(2) span"
  ).html();

  const ticketsSold =
    $(
      "#content .box.block.breakdownBox .drawInfo .half:nth-of-type(2) p:nth-of-type(1) span"
    ).html() === "(Unavailable)"
      ? null
      : parseInt(
          $(
            "#content .box.block.breakdownBox .drawInfo .half:nth-of-type(2) p:nth-of-type(1) span"
          )
            .html()
            .replace(/,/g, "")
        );

  return {
    drawNumber,
    machineName,
    ticketsSold,
  };
}

async function loadHtmlFromUrl(url) {
  if (!fs.existsSync(path.join(__dirname, "..", ".cache"))) {
    fs.mkdirSync(path.join(__dirname, "..", ".cache"));
  }

  const hash = crypto.createHash("md5").update(url).digest("hex");

  const filename = path.join(__dirname, "..", ".cache", `${hash}.html`);

  if (fs.existsSync(filename)) {
    return fs.readFileSync(filename, "utf-8");
  }

  const response = await axios.get(url, {
    responseType: "text",
  });

  fs.writeFileSync(filename, response.data);

  return response.data;
}
