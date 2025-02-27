
<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "company_object";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "UPDATE employee_company SET email='abhijeet123@gmail.com' WHERE id=102";

if ($conn->query($sql) === TRUE) {
  echo "Record updated successfully";
} else {
  echo "Error updating record: " . $conn->error;
}

$conn->close();
?>