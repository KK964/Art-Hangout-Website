
<?php 
  session_start();
  include_once('../connection.php'); 
     
  function test_input($data) { 
        
      $data = trim($data); 
      $data = stripslashes($data); 
      $data = htmlspecialchars($data); 
      return $data; 
  } 
     
  if ($_SERVER["REQUEST_METHOD"]== "POST") { 
        
      $adminname = test_input($_POST["radminname"]); 
      $password = test_input($_POST["rpassword"]); 
      $hash = password_hash($password, PASSWORD_DEFAULT);

    $respo = checkInDB($adminname, $conn);

      if($respo === true) {
        if(password_verify($password, $hash)) {
          $stmt = $conn->prepare("INSERT INTO artAdminRegister (adminUser, password) VALUES (:username, :hash)"); 
          $stmt->bindParam(':username', $adminname);
          $stmt->bindParam(':hash', $hash);
          $stmt->execute(); 
          
        } else {
          echo "<script language='javascript'>"; 
          echo "alert('Somthing went wrong\nplease try agian')"; 
          echo "</script>"; 
        }
      } else {
        echo "<script language='javascript'>"; 
        echo "alert('That User Already Exists')"; 
        echo "</script>"; 
      }
  } 
  function checkInDB($adminname, $conn) {
    $stmt1 = $conn->prepare("SELECT * FROM artadmin WHERE adminUser=:username"); 
    $stmt1->bindParam(':username', $adminname);
    $stmt1->execute(); 
    $results1 = $stmt1->fetchAll();
    $stmt2 = $conn->prepare("SELECT * FROM artAdminRegister WHERE adminUser=:username"); 
    $stmt2->bindParam(':username', $adminname);
    $stmt2->execute(); 
    $results2 = $stmt2->fetchAll();
    if(empty($results1) && empty($results2)) {
      return true;
    } else {
      return false;
    }
  }
  ?> 

