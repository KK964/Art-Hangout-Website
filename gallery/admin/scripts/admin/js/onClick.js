var xmlhttp = new XMLHttpRequest();

document.onclick = function (e) {
  e = e.target.dataset; // reuse the variable e
  if (e['type'] == 'role') {
    if (e['role'] == 'Deny') {
      var denyConf = confirm('Are you sure you want to deny ' + e['name'] + '?');
      if (denyConf == true) {
        xmlhttp.open('POST', './scripts/admin/php/regRem.php', true);
        xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp.send('data=' + e['name']);
      }
    } else {
      var staffConf = confirm('Are you sure you want to give ' + e['name'] + ' ' + e['role'] + '?');
      if (staffConf == true) {
        xmlhttp.open('POST', './scripts/admin/php/staffAcc.php', true);
        xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp.send(`data=${e['name']}-|-${e['role']}`);
        //console.log('data=' + e['name'] + '|' + e['role']);
      }
    }
  }
  if (e['type'] == 'delete') {
    var conf = confirm('Are you sure you want to delete this?');
    if (conf == true) {
      xmlhttp.open('POST', './scripts/admin/php/imgRem.php', true);
      xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xmlhttp.send('data=' + e['url']);
    }
  }
};

xmlhttp.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200 && this.responseText != '') {
    console.log('response: ' + this.responseText); // echo from php
    location.reload();
  }
};
