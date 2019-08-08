var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var Promise = require('promise');

var t = 0;
var build = '';
var title, link, info, content = '';

//var createStream = fs.createWriteStream(build, {flags: 'a'});
function finderMax(){
fs.readFile('./output.txt', 'utf-8', (err, data)=>{
	if (err){
		console.log('erro na abertura do output');
		throw err;
	}
	srcFile = data.split(/\r\n|\n/);
function tryMe(t){
		title = srcFile[t];
		link = srcFile[t+1];
		info = srcFile[t+2];
	return new Promise((resolve, reject)=>{
		console.log(link + '\n' + title);
	request(link, (err, res, html)=>{
		if (!err && res.statusCode == 200){
			build = './files/'+title.replace(/[^a-zA-Z0-9 .]/g, "")+'.html';
			var $ = cheerio.load(html);
			content = $('div.content').html();
			fs.writeFile(build, link +'\n'+info+'\n\n'+content, (err)=>{
					if(err){
						throw err;
						reject(err);
					}
					resolve(console.log('saved'));
				});
		}else{
			reject(err);
		}
	});
	});
}
	function callmeCarson2(){
	tryMe(t).then(()=>{
		t= t + 4;
		console.log('done');
		callmeCarson2();
	}).catch(()=>{
		console.log('foi nada');
	});
}
	callmeCarson2();
});
}
finderMax();
module.exports.finderMax = finderMax;
