<?php
    //this code will return all the available table names in db as table_name : "table_name"

    // Include database configuration
    require_once 'db.config.php';

    // Set headers to allow CORS and handle JSON data
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET');
    header('Content-Type: application/json');

    // Get all tables
    $sql = "SHOW TABLES";
    $result = $conn->query($sql);

    $tables = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            //push as table_name : "table_name"
            $tables[] = ["table_name" => $row["Tables_in_db_operator"]];
        }
    }

    echo json_encode(["status" => "success", "data" => $tables]);
?>