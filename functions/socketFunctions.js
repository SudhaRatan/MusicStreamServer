const youtubesearchapi = require("youtube-search-api")
const ytdl = require('ytdl-core');

const getSong = async (song) => {
  var list = await youtubesearchapi.GetListByKeyword(song, false, 5);
  let e = await ytdl.getInfo(`http://www.youtube.com/watch?v=${list.items[0].id}`);
  let audioFormat = ytdl.chooseFormat(e.formats, { quality: 'highestaudio', filter: 'audioonly' });
  var url = audioFormat.url;
  var title = e.videoDetails.title;
  var thumbnails = e.videoDetails.thumbnails;
  var thumbnail = e.videoDetails.thumbnails[thumbnails.length - 1];
  return { url, title, thumbnail };
}

module.exports = { getSong }