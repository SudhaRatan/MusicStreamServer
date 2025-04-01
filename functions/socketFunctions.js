const youtubesearchapi = require("youtube-search-api")
const ytdl = require('ytdl-core');

const getSong = async (song) => {
  var list = await youtubesearchapi.GetListByKeyword(song, false, 5);
  let e = await ytdl.getInfo(`http://www.youtube.com/watch?v=${list.items[0].id}`);
  // let audioFormat = ytdl.chooseFormat(e.formats, { quality: 'highestaudio', filter: 'audioonly' });
  console.log(e.formats.filter(i => i.mimeType.includes('video/mp4;') && i.qualityLabel == "360p" && i.audioBitrate))
  var url = e.formats.filter(i => i.mimeType.includes('video/mp4;') && i.qualityLabel == "360p" && i.audioBitrate)[0].url;
  var title = e.videoDetails.title;
  var thumbnails = e.videoDetails.thumbnails;
  var thumbnail = e.videoDetails.thumbnails[thumbnails.length - 1];
  return { url, title, thumbnail };
}

const getSongV2 = async (song, count) => {
  var list = await youtubesearchapi.GetListByKeyword(song);
  // console.log(list.items)
  let e = await ytdl.getInfo(`http://www.youtube.com/watch?v=${list.items[count].id}`);
  let audioFormat = ytdl.chooseFormat(e.formats, { quality: 'highestaudio', filter: 'audioonly' });
  var url = audioFormat.url;
  // console.log(url)
  return url;
}

const OnlineCount = () => {
  
}

module.exports = { getSong, getSongV2 }