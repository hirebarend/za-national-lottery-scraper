const fs = require("fs");

function calculateCombinations(arr, n) {

}

function calculateFrequencies(data) {
  const result = Array(53).fill(0);

  for (const x of data) {
    for (const n of x.numbers) {
      result[n] += 1;
    }
  }

  return result
    .map((x, i) => {
      return {
        n: i,
        count: x,
      };
    })
    .sort((a, b) => b.count - a.count);
}

const content = fs.readFileSync("data.json");

const data = JSON.parse(content);

console.log(
  calculateFrequencies(
    data.filter((x) => x.date.includes("2022") || x.date.includes("2023"))
  )
);

// const result = [];

// for (let i1 = 1; i1 < 52; i1++) {
//   for (let i2 = 1; i2 < 52; i2++) {
//     if (i1 === i2) {
//       continue;
//     }

//     for (let i3 = 1; i3 < 52; i3++) {
//       if (i1 === i3 || i2 === i3) {
//         continue;
//       }

//       for (let i4 = 1; i4 < 52; i4++) {
//         if (i1 === i4 || i2 === i4 || i3 === i4) {
//           continue;
//         }

//         result.push({
//           arr: [i1, i2, i3, i4],
//           count: data.filter(
//             (x) =>
//               (x.date.includes("2022") || x.date.includes("2023")) &&
//               x.numbers.includes(i1) &&
//               x.numbers.includes(i2) &&
//               x.numbers.includes(i3) &&
//               x.numbers.includes(i4)
//           ).length,
//         });
//       }
//     }
//   }
// }

// console.log(result.sort((a, b) => b.count - a.count).slice(0, 20));

// 1 5 29 29 7 15 22 9
// 4 44 11 14 7 22 35 46