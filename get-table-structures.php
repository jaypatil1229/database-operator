<?php
    //this code will return the structure of the table of name passed in the request as url parameter of get request
    // Include database configuration
    require_once 'db.config.php';

    // Set headers to allow CORS and handle JSON data
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET');
    header('Content-Type: application/json');

    // Check if table name is received
    if(!isset($_GET['table_name'])){
        echo json_encode(["status" => "error", "message" => "Table name is required"]);
        exit();
    }

    $table_name = $_GET['table_name'];

    // Check if table exists
    $sql = "SHOW TABLES LIKE '$table_name'";
    $result = $conn->query($sql);

    if($result->num_rows == 0){
        echo json_encode(["status" => "error", "message" => "Table $table_name does not exist"]);
        exit();
    }

    // Get table structure
    $sql = "DESCRIBE $table_name";
    $result = $conn->query($sql);

    $columns = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            //check if column is auto increment if yes then don't add it to the columns array
            if($row['Extra'] === 'auto_increment' || $row['Field'] === '_id'){
                continue;
            }
            
            $columns[] = $row;
        }
    }

    echo json_encode(["status" => "success", "data" => $columns]);
?>