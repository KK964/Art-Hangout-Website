<?php 
  include_once('../../../../connection.php'); 
  $requestedData = $_POST['data'];
  //$dataSplit = explode('|', $requestedData);
  $stmt = $conn->prepare("DELETE FROM artAdminRegister WHERE adminUser=:username LIMIT 1"); 
  $stmt->bindParam(':username', $requestedData);
  $stmt->execute(); 
?> 