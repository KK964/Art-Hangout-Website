<?php
    include_once('../../connection.php');
    $sql;

    //SELECT * FROM arthangout WHERE (userID="1234" AND catagory IN ("test1","test3"));

    $requestedData = $_POST['data'];
    $dataSplit = explode('|', $requestedData);
    if($dataSplit[0] == 'userCatagories') {
      $sql = $conn->prepare('SELECT * FROM galleryImgs WHERE (userID=:userID AND catagory IN (:categories));');
      $sql->bindParam(':userID', $dataSplit[1]);
      $sql->bindParam(':categories', $dataSplit[2]);
    } else
    if($dataSplit[0] == 'user') {
      $sql = $conn->prepare('SELECT * FROM galleryImgs WHERE (userID=:userID);');
      $sql->bindParam(':userID', $dataSplit[1]);
    } else
    if($dataSplit[0] == 'catagories') {
      $sql = $conn->prepare('SELECT * FROM galleryImgs WHERE (catagory IN (:categories));');
      $sql->bindParam(':categories', $dataSplit[1]);
    } else
    if($dataSplit[0] == 'none') {
      $sql = $conn->prepare('SELECT * FROM galleryImgs;');
    }

    $sql->execute();
    $result = $sql->fetchAll()
    if(!$result) {
    echo($conn->error);
    } else {
    if (sizeof($result) > 0) {
        foreach($result as $row) {
            if(!($nsfw == 'false' && ($row["catagory"] == 'nsfw-art' || $row["catagory"] == 'gore-art' || $row["catagory"] == 'gross-art' || $row["catagory"] == '18-plus'))) {
            echo $row["imgURL"] . "ID::" . $row["userID"] . "USER::" . $row["username"] . "CAT::" . $row["catagory"] . "|";
            }
        }
        } else {
        echo "0 results";
    }
    }
?>