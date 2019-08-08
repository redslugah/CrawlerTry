//using cheerio, filesystem and request
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var Promise = require('promise');
//the var is for increment page number aside with the url
var i = 1;
//this var is for reject our promise if the page dos not have posts
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
  //this function will be called from the final of this scrpit.
  function requestPage(thisPage){
    return new Promise((resolve, reject)=>{
    request(thisPage,(err, res, html) =>{
    if (!err && res.statusCode == 200){
      //if everything is ok, load html body in var $
      var $ = cheerio.load(html);
      //for each tag div with title as class in the body, we´ll track de following data
      entrou = false;
      console.log('Looking at ' + thisPage);
      $('div.title').each(function(i, element){
        entrou = true;
        //define a to be the children tag of div title, aka the tag 'a', where we will get the url and text of the post.
        var a = $(this).children();
        //get the post name
        var postName = a.text();
        //get the post url. Here gives a relative url, so we need to add the hostname and protocol before.
        var postUrl = 'https://www.pathofexile.com' + a.attr('href');
        //lets move from here to the next tag we need to fetch, the post owner and date.
        //this needs a condition because if the post has more than 1 page, he'll create
        //a new div classed as 'forum_pagination', so if this div exist, we'll need to skip it
        //by adding one more .next().
        //check if the div class forum_pagination exist on the next div of our parent div 
        if ($(this).parent().next().attr('class') == 'forum_pagination'){
          //if exist, we need to skip 1 more div, and fetch for the children(where the data is)
          var b = $(this).parent().next().next().children();
        }else{
          //if doesnt exist, we can just skip to the next div
          var b = $(this).parent().next().children();
        }
        //now that we fetched the right tag to extract the data, lets do it!
        //get the post info (owner and data)
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
  //creating the url to be crawled
  var iniPage = 'https://www.pathofexile.com/forum/view-forum/22/page/'+i;
  //here we'll call requestPage, a function that returns a promise
  requestPage(iniPage).then(()=>{
    //if the promise resolve, we increment the page counter and callmeCarson again.
    i++; 
    console.log('done with ' + iniPage);
    callmeCarson();
  }).catch(()=>{
    //if the promise got reject, we stop everything.
    console.log('\nfim das páginas!');
  });
}
callmeCarson();
});
//https://www.pathofexile.com/forum/view-forum/patch-notes/page/
//https://www.pathofexile.com/forum/view-forum/22/page/