<?php 
  include_once('../../../../connection.php'); 
  $requestedData = $_POST['data'];
  $dataSplit = explode('-|-', $requestedData);
  //getData
  $stmt = $conn->prepare("SELECT * FROM artAdminRegister WHERE adminUser=:inAdmin LIMIT 1"); 
  $stmt->bindParam(':inAdmin', $dataSplit[0]);
  $stmt->execute(); 
  $regUsers = $stmt->fetchAll();
  foreach($regUsers as $regu) {
      $username = $regu['adminUser'];
      $password = $regu['password'];
      $stmt2 = $conn->prepare("INSERT INTO artadmin (adminUser, password, role) VALUES (:username, :pass, :role)"); 
      $stmt2->bindParam(':username', $username);
      $stmt2->bindParam(':pass', $password);
      $stmt2->bindParam(':role', $dataSplit[1]);
      $stmt2->execute(); 
      $stmt3 = $conn->prepare("DELETE FROM artAdminRegister WHERE adminUser=:username AND password=:pass LIMIT 1"); 
      $stmt3->bindParam(':username', $username);
      $stmt3->bindParam(':pass', $password);
      $stmt3->execute(); 
      echo 'Success';
  }
?> 