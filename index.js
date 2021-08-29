const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = (template, product) => {
  let output = template.replace(/{%productname%}/g, product.productName);
  output = output.replace(/{&image%}/g, product.image);
  output = output.replace(/{%price%}/g, product.price);
  output = output.replace(/{%from%}/g, product.from);
  output = output.replace(/{%quantity%}/g, product.quantity);
  output = output.replace(/{%nutrients%}/g, product.nutrients);
  output = output.replace(/{%description%}/g, product.description);
  output = output.replace(/{%id%}/g, product.id);

  if(!product.organic){
    output = output.replace(/{%not__organic%}/g, 'not-organic');
  }

  return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productsData = JSON.parse(data);

const server = http.createServer((req, res) => {

  const {query, pathname} = url.parse(req.url, true)

  //OVERVIEW PAGE
  if(pathname === '/' || pathname === '/overview' ){
    res.writeHead(200, {'Content-type': 'text/html'});
    
    const cardsHTML = productsData.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace(/{%product_cards%}/g, cardsHTML);
    res.end(output);
  } 

  //PRODUCT PAGE
  else if(pathname=== '/product'){
    res.writeHead(200, {'Content-type': 'text/html'});
    const product = productsData[query.id];
    const output = replaceTemplate(tempProduct, product)
    res.end(output);
  } 
  
  //API
  else if(pathname=== '/api'){
    res.writeHead(200, {'Content-type': 'application/json'});
    res.end(data);
  }

  //NOT FOUND
  else {
    res.end('<h1>NOT FOUND</h1>')
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Listening to the port 3000');
});