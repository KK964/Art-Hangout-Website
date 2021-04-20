var imgExten = ['png', 'jpg', 'jpeg', 'svg', 'apng', 'avif', 'bmp', 'gif', 'ico'];
var videoExten = ['mp4', 'ogg', 'mov', 'avi'];
var splitStringChars = '|~!@#&&';
var validCategories = [
  'general-art',
  'people-art',
  'furry-art',
  'petanimal-art',
  'supernatural-art',
  'animations',
  'music',
  'gaming-art',
  'photography-film',
  'gore-art',
  'gross-art',
  'wip-art',
  'event',
];
function toChannelName(data) {
  return validCategories.includes(data);
}

function getQueryString() {
  document.getElementById('loadedP').innerText = '0';
  var userID,
    nsfw = 'false',
    categories = [];
  var urlParams = new URLSearchParams(location.search);
  for (var [key, value] of urlParams) {
    key = DOMPurify.sanitize(key);
    value = DOMPurify.sanitize(value);
    if (key == 'user' || key == 'name') {
      userID = value;
      console.log('user input ID: ' + userID);
    }
    if (key == 'categories') {
      var valid = [];
      var cat = value.split('|');
      for (var ci of cat) if (toChannelName(ci)) valid.push(ci);
      categories = addQuotes(valid);
      console.log('user input categories: ' + categories);
    }
    if (key == 'nsfw') {
      if (value == 'true') {
        nsfw = 'true';
      } else {
        nsfw = 'false';
      }
    }
  }
  document.getElementById('user').innerHTML = userID;
  document.getElementById('categories').innerHTML = categories;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', 'scripts/php/getDB.php', true);
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xmlhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200 && this.responseText != '') {
      console.log('response: ' + this.responseText); // echo from php
      if (this.responseText == '0 results') {
        alert('0 Results');
      } else if (this.responseText == 'error') {
        alert('An Error Occurred');
      } else {
        addImgsToGal(this.responseText);
      }
    }
  };

  //if user and categories
  if (userID && categories.length > 0) {
    xmlhttp.send('data=' + 'usercategories|' + userID + '|' + categories + '|' + nsfw);
  }
  //if user, but no categories
  if (userID && categories.length <= 0) {
    xmlhttp.send('data=' + 'user|' + userID + '|none|' + nsfw);
  }
  //if no user but categories
  if (!userID && categories.length > 0) {
    xmlhttp.send('data=' + 'categories|' + categories + '|none|' + nsfw);
  }
  //if no user no categories
  if (!userID && categories.length <= 0) {
    xmlhttp.send('data=' + 'none|none' + '|none|' + nsfw);
  }
}

function addQuotes(input) {
  return input.length ? "'" + input.join("','") + "'" : '';
}

function addImgsToGal(returnedValues) {
  var imagesAndCaptions = returnedValues.split(splitStringChars);
  var errorImg = 'https://cdn.iconscout.com/icon/free/png-512/data-not-found-1965034-1662569.png';

  while (imagesAndCaptions.length > 50) imagesAndCaptions.shift(1);

  for (var i = 0; i < imagesAndCaptions.length; i++) {
    var regex = /(\r|\n| )/g;
    imagesAndCaptions[0] = imagesAndCaptions[0].replace(regex, '');
    if (imagesAndCaptions[i] != '' && imagesAndCaptions[i] != undefined) {
      var urlAuthor = splitString(imagesAndCaptions[i], ['ID::', 'USER::', 'CAT::', 'WINNER::']);
      var importData,
        extention = getFileType(urlAuthor[0]);
      var winner;
      if (urlAuthor[4] == 0) winner = 'nonwinner';
      if (urlAuthor[4] == 1) winner = 'winner';
      var category = urlAuthor[3];
      var url = urlAuthor[0];
      var user = DOMPurify.sanitize(urlAuthor[2]).replace(/(<([^>]+)>)/gi, '');

      if (imgExten.includes(extention)) {
        importData = `<img id="zoom" src="${url}" onerror='this.onerror=null;this.src="${errorImg}";'>`;
        //"<img id='zoom' src='".$img['imgURL']."' onerror='this.onerror=null;this.src=".'"'. $errorImg .'"'.";' '>";
      }
      if (videoExten.includes(extention)) {
        importData = `<video controls><source src="${url}" type="video/${extention}">Your browser does not support the video tag.</video>`;
      }
      //console.log(importData + "\n\n" + extention);
      document
        .getElementById('galleryTest')
        .insertAdjacentHTML(
          'afterend',
          `<div class="gallery ${winner}"><a target="_blank" href="${url}">${importData}</a><div class=desc>Made by ${user} | Category = ${category}</div></div>`
        );
    }
    //urlAuthor[0] = url
    //urlAuthor[1] = id
    //urlAuthor[2] = username
    //urlAuthor[3] = category
    document.getElementById('loadedP').innerText = getPercentage(i, imagesAndCaptions.length);
    if (i + 1 == imagesAndCaptions.length) {
      stopLoading();
    }
  }
}

function getFileType(url) {
  var extention = url.replace(/^.*\./, '');
  return extention;
}

function splitString(string, splitters) {
  var list = [string];
  for (var i = 0, len = splitters.length; i < len; i++) {
    traverseList(list, splitters[i], 0);
  }
  return flatten(list);
}

function getPercentage(num, total) {
  var total = (num * 100) / total + '%';
  return total;
}

function traverseList(list, splitter, index) {
  if (list[index]) {
    if (list.constructor !== String && list[index].constructor === String)
      list[index] != list[index].split(splitter)
        ? (list[index] = list[index].split(splitter))
        : null;
    list[index].constructor === Array ? traverseList(list[index], splitter, 0) : null;
    list.constructor === Array ? traverseList(list, splitter, index + 1) : null;
  }
}

function flatten(arr) {
  return arr.reduce(function (acc, val) {
    return acc.concat(val.constructor === Array ? flatten(val) : val);
  }, []);
}

function stopLoading() {
  document.getElementById('loader-wrapper').style.display = 'none';
  document.getElementById('galleryDiv').style.display = 'block';
}

getQueryString();
