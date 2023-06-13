const fs = require("fs");

const CURRENCY_FORMAT = new Intl.NumberFormat("en-us", {
  currency: "ZAR",
  currencyDisplay: "narrowSymbol",
  style: "currency",
});

const NUMBER_FORMAT = new Intl.NumberFormat("en-us", {});

function addPadding(str, n) {
  while (str.length < n) {
    str += " ";
  }

  return str;
}

const content = fs.readFileSync("data.json");

const data = JSON.parse(content);

const result = data
  .filter((x) => x.date.includes("2023"))
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .map(
    (x) =>
      `| ${x.date} | ${addPadding(
        CURRENCY_FORMAT.format(x.jackpot),
        19
      )}| ${addPadding(NUMBER_FORMAT.format(x.ticketsSold), 19)}| ${addPadding(
        x.numbers.join(", "),
        29
      )}|`
  );

fs.writeFileSync('test.txt', result.join('\r\n'));
