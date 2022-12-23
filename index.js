const fs = require("fs");
const http = require("http");
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const overview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const card = fs.readFileSync(
  `${__dirname}/templates/templete-card.html`,
  "utf-8"
);

const productData = JSON.parse(data);
////////////////////////////////////////
function replaceTemplate(card, obj) {
  let output = card.replace(/{%PRODUCTNAME%}/g, obj.productName);

  output = output.replace(/{%IMAGE%}/g, obj.image);
  output = output.replace(/{%QUANTITY%}/g, obj.quantity);
  output = output.replace(/{%PRICE%}/g, obj.price);
  output = output.replace(/{%NUTRIENTS%}/g, obj.nutrients);
  output = output.replace(/{%ID%}/g, obj.id);
  if (!obj.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
}
// const text = JSON.parse(fs.readFileSync("./txt/input.txt", "utf-8"));

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         "./txt/final.txt",
//         `${data1}\n${data2}\n${data3}`,
//         "utf-8",
//         (e) => console.log(e)
//       );
//     });
//   });
// });
// console.log("will read file");

// server

const server = http.createServer((req, res) => {
  const pathName = req.url;
  console.log(pathName);
  // Overview page
  if (pathName === "/overview" || pathName === "/") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHTML = productData
      .map((obj) => {
        return replaceTemplate(card, obj);
      })
      .join("");
    console.log(cardsHTML);
    const output = overview.replace("{%PRODUCT_CARD%}", cardsHTML);
    return res.end(output);
  }
  // API
  else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });

    res.end(data);
  }
  // no page
  else {
    res.end("<h1>No such page :(</h1>");
  }
  // res.writeHead(404, {
  //   "Content-type": "text/html",
  // });
});

server.listen(8000, "127.0.0.1", (e) => {
  console.log("listening to request");
});
