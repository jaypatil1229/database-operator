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

$sql = "SELECT id, firstname, lastname ,email FROM employee_company";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    echo "id: " . $row["id"]. " - Name: " . $row["firstname"]. " " . $row["lastname"]. "Email:".$row['email']."<br>";
  }
} else {
  echo "0 results";
}
$conn->close();
?>