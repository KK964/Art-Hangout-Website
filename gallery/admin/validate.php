
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
        
      $adminname = test_input($_POST["adminname"]); 
      $password = test_input($_POST["password"]); 
      $hash = password_hash($password, PASSWORD_DEFAULT);
      if(password_verify($password, $hash)) {
        $stmt = $conn->prepare("SELECT * FROM artadmin WHERE adminUser=:username"); 
        $stmt->bindParam(':username', $adminname);
        $stmt->execute(); 
        $users = $stmt->fetchAll(); 
        foreach($users as $user) { 
            if(password_verify($password, $user['password'])) {
                $_SESSION['legitUser'] = 'qwerty';
                $_SESSION['Username'] = $adminname;
                $_SESSION['Role'] = $user['role'];
                header("Location: adminpage.php"); 
            }
        } 
      } else {
        echo "<script language='javascript'>"; 
        echo "alert('Somthing went wrong\nplease try agian')"; 
        echo "</script>"; 
      }
  } 
    
  ?> 
  