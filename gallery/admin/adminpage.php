<?php
if(!isset($_SESSION)) { 
    session_start(); 
} 
include_once('../connection.php'); 
if(!isset($_SESSION['legitUser']) || $_SESSION['legitUser'] != 'qwerty') {
     echo '<h1>You are not an authorised user</h1>';
     //header("location:index.html");
     die();
} else {
    echo '<h3>User '.$_SESSION["Username"].'</h3>';
    echo '<h4>Role '.$_SESSION["Role"].'</h4>';
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="./scripts/admin/css/admin.css" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="shortcut icon"
      href="../../assets/images/4e323f6c8b0d5403424598993a97c2a3-128x128.png"
      type="image/x-icon"
    />

    <title>Art Hangout Admin</title>

    <meta property="og:site_name" content="Art Hangout Admin Page" />
    <meta property="og:url" content="https://arthangout.art/gallery/admin" />
    <meta property="og:title" content="Art Hangout Gallery Admin" />
    <meta property="og:description" content="Admin panel for Art Hangout Gallery" />
    <meta property="og:type" content="website" />
    <meta name="theme-color" content="#ff3636" />
  </head>
  <body>
    <div class="row">
          <?php
            if($_SESSION['Role'] == 'Owner' || $_SESSION['Role'] == 'Admin') {
              echo "<div class='column acceptAdmin'><h2>Admin Register</h2><div class='btd'><form>";
              $stmt = $conn->prepare("SELECT * FROM artAdminRegister"); 
              $stmt->execute(); 
              $users = $stmt->fetchAll(); 
              foreach($users as $user) { 
                echo ("<label for='admin'>".$user['adminUser'].": </label>");
                if($_SESSION['Role'] == 'Owner') {
                  echo "<input type='button' value='Admin' data-type='role' data-name='".$user['adminUser']."' data-role='Admin' name='admin'>";
                }
                echo "<input type='button' value='Mod' data-type='role' data-name='".$user['adminUser']."' data-role='Mod' name='mod'>";
                echo "<input type='button' value='Deny' data-type='role' data-name='".$user['adminUser']."' data-role='Deny' name='deny'><br>";
              } 
              echo "</form></div></div>";
            }
          ?>
        <div class="column gallery"><h2>Gallery</h2>
           <?php
           $imgExten = array('png', 'jpg', 'jpeg', 'svg', 'apng', 'avif', 'bmp', 'gif', 'ico');
           $videoExten = array('mp4', 'ogg', 'mov', 'avi');
           $errorImg = "https://cdn.iconscout.com/icon/free/png-512/data-not-found-1965034-1662569.png";
              $stmt = $conn->prepare("SELECT * FROM galleryImgs"); 
              $stmt->execute(); 
              $imgs = $stmt->fetchAll(); 
              $imgs_reversed = array_reverse($imgs);
              foreach($imgs_reversed as $img) { 
                $uext = explode(".", $img['imgURL']);
                $ext = end($uext);
                $delButton = "<button type='button' data-type='delete' data-url='".$img['imgURL']."'>Delete</button>";
                if(in_array($ext, $imgExten)) {
                  $importDataImg = "<img id='zoom' src='".$img['imgURL']."' onerror='this.onerror=null;this.src=".'"'. $errorImg .'"'.";' '>";
                  echo "<div class='imgs'><a target='_blank' href='".$img['imgURL']."'>".$importDataImg."</a><div class=desc>Made by ".$img['username']." | Category = ".$img['category']."<br>".$delButton."  </div></div>";
                } else
                if(in_array($ext, $videoExten)) {
                  $importDataVid = "<video controls><source src='".$img['imgURL']."' type='video/".$ext."'>Your browser does not support the video tag.</video>";
                  echo "<div class='imgs'><a target='_blank' href='".$img['imgURL']."'>".$importDataVid."</a><div class=desc>Made by ".$img['username']." | Category = ".$img['category']."<br>".$delButton."</div></div>";
                }
              } 
           ?>
         </div>
        <div class="column reports"><h2>Reports</h2></div>
    </div>
  </body>
  <script src="./scripts/admin/js/onClick.js"></script>
</html>
