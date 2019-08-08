var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
const CreateFiles = fs.createWriteStream('./output.txt', {
      flags: 'a' //flags: 'a' preserved old data
})
 
const iniPage = 'https://www.pathofexile.com/forum/view-forum/patch-notes/page/1';
 
function requestPage(thisPage){
  request(thisPage, (err, res, html) =>{
    if (!err && res.statusCode == 200){
      //console.log(html);
      var $ = cheerio.load(html);
      $('div.title').each(function(i, element){
        var a = $(this).children();
        var postName = a.text();
        var postUrl = 'https://www.pathofexile.com' + a.attr('href');
        var b = $(this).next().parent().next().next().children();
        var postInfo = b.text();
 
        var metaData = {
          title: postName.trim(),
          link: postUrl,
          info: postInfo
        };
        console.log(metaData);
        if(meuarquivo.indexOf(metaData.title) > -1){
          console.log("Informação já existe na base!");
          //do nothing
        }else{
          CreateFiles.write(metaData.title + '\r\n' + metaData.link + '\r\n' + metaData.info + '\r\n\n');
          console.log('Registrando ' + metaData.title + ' na base!');
        }
      });
    }
  });
}
 
var meuarquivo = '';
 
        fs.readFile('./output.txt', 'utf-8' ,(err, data)=>{
          if(err){
            throw err;
          }
          //console.log(data);
          meuarquivo = data;
          requestPage(iniPage)
});