var imgExten = ['png', 'jpg', 'jpeg', 'svg', 'apng', 'avif', 'bmp', 'gif', 'ico'];
var videoExten = ['mp4', 'ogg', 'mov', 'avi'];

function getQueryString() {
  document.getElementById('loadedP').innerText = '0';
  var userID,
    nsfw = 'false',
    catagories = [];
  var urlParams = new URLSearchParams(location.search);
  for (var [key, value] of urlParams) {
    if (key == 'user' || key == 'name') {
      userID = value;
      console.log('user input ID: ' + userID);
    }
    if (key == 'catagories') {
      catagories = addQuotes(value.split('|'));
      console.log('user input Catagories: ' + catagories);
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
  document.getElementById('catagories').innerHTML = catagories;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', 'scripts/php/getDB.php', true);
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xmlhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200 && this.responseText != '') {
      //console.log('response: ' + this.responseText); // echo from php
      if (this.responseText == '0 results') {
        alert('0 Results');
      } else if (this.responseText == 'error') {
        alert('An Error Occurred');
      } else {
        addImgsToGal(this.responseText);
      }
    }
  };

  //if user and catagories
  if (userID && catagories.length > 0) {
    xmlhttp.send('data=' + 'userCatagories|' + userID + '|' + catagories + '|' + nsfw);
  }
  //if user, but no catagories
  if (userID && catagories.length <= 0) {
    xmlhttp.send('data=' + 'user|' + userID + '|none|' + nsfw);
  }
  //if no user but catagories
  if (!userID && catagories.length > 0) {
    xmlhttp.send('data=' + 'catagories|' + catagories + '|none|' + nsfw);
  }
  //if no user no catagories
  if (!userID && catagories.length <= 0) {
    xmlhttp.send('data=' + 'none|none' + '|none|' + nsfw);
  }
}

function addQuotes(input) {
  return input.length ? "'" + input.join("','") + "'" : '';
}

function addImgsToGal(returnedValues) {
  var imagesAndCaptions = returnedValues.split('|');
  var errorImg = 'https://cdn.iconscout.com/icon/free/png-512/data-not-found-1965034-1662569.png';

  for (var i = 0; i < imagesAndCaptions.length; i++) {
    if (imagesAndCaptions[i] != '' && imagesAndCaptions[i] != undefined) {
      var urlAuthor = splitString(imagesAndCaptions[i], ['ID::', 'USER::', 'CAT::']);
      urlAuthor[0] = urlAuthor[0].replace('\r\n \r\n  ', '');
      var importData,
        extention = getFileType(urlAuthor[0]);

      if (imgExten.includes(extention)) {
        importData = `<img id="zoom" src="${urlAuthor[0]}" onerror='this.onerror=null;this.src="${errorImg}";'>`;
        //"<img id='zoom' src='".$img['imgURL']."' onerror='this.onerror=null;this.src=".'"'. $errorImg .'"'.";' '>";
      }
      if (videoExten.includes(extention)) {
        importData = `<video controls><source src="${urlAuthor[0]}" type="video/${extention}">Your browser does not support the video tag.</video>`;
      }
      //console.log(importData + "\n\n" + extention);
      document
        .getElementById('galleryTest')
        .insertAdjacentHTML(
          'afterend',
          `<div class="gallery"><a target="_blank" href="${urlAuthor[0]}">${importData}</a><div class=desc>Made by ${urlAuthor[2]} | Category = ${urlAuthor[3]}</div></div>`
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
