<?php
    include_once('../../connection.php');
    $sql;
    $splitString = "|~!@#&&";

    $requestedData = $_POST['data'];
    $dataSplit = explode('|', $requestedData);
    if($dataSplit[0] == 'usercategories') {
      $sql = $conn->prepare('SELECT * FROM galleryImgs WHERE (userID=:userID AND category IN (:categories));');
      $sql->bindParam(':userID', $dataSplit[1]);
      $sql->bindParam(':categories', $dataSplit[2]);
    } else
    if($dataSplit[0] == 'user') {
      $sql = $conn->prepare('SELECT * FROM galleryImgs WHERE (userID=:userID);');
      $sql->bindParam(':userID', $dataSplit[1]);
    } else
    if($dataSplit[0] == 'categories') {
      $sql = $conn->prepare('SELECT * FROM galleryImgs WHERE (category IN (:categories:));');
      $sql->bindParam(':categories:', $dataSplit[1]);
    } else
    if($dataSplit[0] == 'none') {
      $sql = $conn->prepare('SELECT * FROM galleryImgs WHERE category="general-art";');
    }

    try {
      $sql->execute();
      $result = $sql->fetchAll();
      if(!$result) {
      echo($conn->error);
      } else {
      if (sizeof($result) > 0) {
          foreach($result as $row) {
              if(!($dataSplit[3] == 'false' && ($row["category"] == 'nsfw-art' || $row["category"] == 'gore-art' || $row["category"] == 'gross-art' || $row["category"] == '18-plus'))) {
              echo $row["imgURL"] . "ID::" . $row["userID"] . "USER::" . $row["username"] . "CAT::" . $row["category"] . "WINNER::" . $row["winner"] . $splitString;
              }
          }
          } else {
          echo "0 results";
      }
      }
    }
    catch(PDOException $e) {
       // handle error 
       echo $e->getmessage();
       exit();
    }

?>