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

$sql = "INSERT INTO employee_company (id,firstname, lastname, email) VALUES (102,'Abhijeet','Mane','abhijeet@gmail.com')";
 

if ($conn->query($sql) === TRUE) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>