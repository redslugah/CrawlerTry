//using cheerio, filesystem and request
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var Promise = require('promise');
var i = 1;
var entrou = false;
//create the write stream so we can write on output.txt.
const CreateFiles = fs.createWriteStream('./output.txt', {
      flags: 'a' //flags: 'a' preserved old data
})
//the var that we'll use to compare if the data is already on the file
var meuarquivo = '';
//read the file
fs.readFile('./output.txt', 'utf-8' ,(err, data)=>{
  if(err){
    throw err;
  }
  //save the data of output in the var meuarquivo and call requestPage function, passing our url so we can start crawling
  meuarquivo = data;
  //setting 500 pages to crawl
  //creating the url to be crawled
  var iniPage = 'https://www.pathofexile.com/forum/view-forum/patch-notes/page/'+i;
  function requestPage(thisPage){
    return new Promise((resolve, reject)=>{
    request(thisPage,(err, res, html) =>{
    if (!err && res.statusCode == 200){
      //if everything is ok, load html body in var $
      var $ = cheerio.load(html);
      //for each tag div with title as class in the body, we´ll track de following data
      entrou = false;
      $('div.title').each(function(i, element){
        entrou = true;
        console.log('Looking at ' + thisPage);
        //define a to be the children tag of div title, aka the tag 'a', where we will get the real data.
        var a = $(this).children();
        //get the post name
        var postName = a.text();
        //get the post url. Here gives a relative url, so we need to add the hostname and protocol before.
        var postUrl = 'https://www.pathofexile.com' + a.attr('href');
        //lets move from here to the next tag we need to fetch, a children of 3 divis below us
        //so we get out of the tag a by using .parent, go 3 tags below using 3x.next and go in
        //the target tag by using .children again.
        var b = $(this).next().parent().next().next().children();
        //get the post info that is on the tag commented above
        var postInfo = b.text();
        //create the dict that will save our data
        var metaData = {
          title: postName.trim(),
          link: postUrl,
          info: postInfo
        };
        //print data on cosole
        console.log(metaData);
        //if this data is already on the output file, we do not need to save it again.
        if(meuarquivo.indexOf(metaData.link) > -1){
          resolve(console.log("Informação já existe na base!"));
          //do nothing
        }else{
          //else, we need. Saving the file.
          CreateFiles.write(metaData.title + '\r\n' + metaData.link + '\r\n' + metaData.info + '\r\n\n');
          resolve(console.log('Registrando ' + metaData.title + ' na base!'));
        }
      });
      if (!entrou){
        reject();
      }
    }else{
      console.log('deu ruim!');
    }
  });
});
}
function callmeCarson(){
  var iniPage = 'https://www.pathofexile.com/forum/view-forum/patch-notes/page/'+i;
  requestPage(iniPage).then(()=>{
    i++; 
    console.log('done with ' + iniPage);
    callmeCarson();
  }).catch(()=>{
    console.log('\nfim das paginas!');
  });
}
callmeCarson();
});
