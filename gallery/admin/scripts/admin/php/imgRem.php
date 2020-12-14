<?php 
  include_once('../../../../connection.php'); 
  $requestedData = $_POST['data'];
  //$dataSplit = explode('|', $requestedData);
  $stmt = $conn->prepare("DELETE FROM galleryImgs WHERE imgURL=:inURL LIMIT 1"); 
  $stmt->bindParam(':inURL', $requestedData);
  $stmt->execute(); 
?> 