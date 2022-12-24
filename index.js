const fs = require("fs");
const url = require("url");
const http = require("http");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate.js");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const overview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const card = fs.readFileSync(
  `${__dirname}/templates/templete-card.html`,
  "utf-8"
);
const product = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");

const productData = JSON.parse(data).map((el) => {
  el.url = slugify(el.productName, { lower: true });
  return el;
});
////////////////////////////////////////
// console.log(productData);
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
  const { query, pathname } = url.parse(req.url, true);
  console.log(query, pathname);
  // Overview page
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardsHTML = productData
      .map((obj) => {
        return replaceTemplate(card, obj);
      })
      .join("");
    const output = overview.replace("{%PRODUCT_CARD%}", cardsHTML);
    return res.end(output);
  }
  // API
  else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });

    res.end(data);
  } else if (pathname.includes("product")) {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const query = pathname.slice(9, pathname.length);
    console.log(query, productData[0].url);
    const data = productData.find((el) => el.url == query);

    const output = replaceTemplate(product, data);
    res.end(output);
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
