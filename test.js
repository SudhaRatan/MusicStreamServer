const youtubesearchapi = require("youtube-search-api")
const ytdl = require('ytdl-core');

const getRes = async () => {
  // console.log("Step 1")
  // var list = await youtubesearchapi.GetListByKeyword("Heather",false,3)
  // console.log("Step 2")
  // let e = await ytdl.getInfo(`http://www.youtube.com/watch?v=${list.items[0].id}`);
  // let audioFormat = ytdl.chooseFormat(e.formats, { quality: 'highestaudio', filter: 'audioonly' });
  // var url = audioFormat.url;
  // console.log(url)
  // console.log(await youtubesearchapi.GetVideoDetails("24u3NoPvgMw"))
  var vidDet = await youtubesearchapi.GetVideoDetails("24u3NoPvgMw")
  console.log(vidDet.suggestion[0].thumbnail[1])
  // console.log(list)
}
getRes()