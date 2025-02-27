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

// sql to create table
$sql = "CREATE TABLE Employee_Company (
id INT(6)  AUTO_INCREMENT PRIMARY KEY,
firstname VARCHAR(30) NOT NULL,
lastname VARCHAR(30) NOT NULL,
email VARCHAR(50))";

if ($conn->query($sql) === TRUE) {
  echo "Table Employee  created successfully";
} else {
  echo "Error creating table: " . $conn->error;
}

$conn->close();
?>