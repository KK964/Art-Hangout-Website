<?php
    include_once('../../connection.php');
    $sql;

    $requestedData = $_POST['data'];
    $dataSplit = explode('|', $requestedData);
    if($dataSplit[0] == 'userCatagories') {
      $sql = $conn->prepare('SELECT * FROM galleryImgs WHERE (userID=:userID AND category IN (:categories));');
      $sql->bindParam(':userID', $dataSplit[1]);
      $sql->bindParam(':categories', $dataSplit[2]);
    } else
    if($dataSplit[0] == 'user') {
      $sql = $conn->prepare('SELECT * FROM galleryImgs WHERE (userID=:userID);');
      $sql->bindParam(':userID', $dataSplit[1]);
    } else
    if($dataSplit[0] == 'catagories') {
      $sql = $conn->prepare('SELECT * FROM galleryImgs WHERE (category IN (:categories));');
      $sql->bindParam(':categories', $dataSplit[1]);
    } else
    if($dataSplit[0] == 'none') {
      $sql = $conn->prepare('SELECT * FROM galleryImgs;');
    }

    $sql->execute();
    $result = $sql->fetchAll();
    if(!$result) {
    echo($conn->error);
    } else {
    if (sizeof($result) > 0) {
        foreach($result as $row) {
            if(!($dataSplit[3] == 'false' && ($row["category"] == 'nsfw-art' || $row["category"] == 'gore-art' || $row["category"] == 'gross-art' || $row["category"] == '18-plus'))) {
            echo $row["imgURL"] . "ID::" . $row["userID"] . "USER::" . $row["username"] . "CAT::" . $row["category"] . "|";
            }
        }
        } else {
        echo "0 results";
    }
    }
?>