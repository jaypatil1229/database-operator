<?php
    //This code will delete the record in the table of name passed in the request of post method
    //sample input json data for this code
    // {
    //     "table_name": "table_name",
    //     "record_id": idValue
    // }

    // Include database configuration
    require_once 'db.config.php';

    // Set headers to allow CORS and handle JSON data
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST');
    header('Content-Type: application/json');

    // Get the raw POST data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // Check if data is received
    if(!$data){
        echo json_encode(["status" => "error", "message" => "No data received"]);
        exit();
    }

    $table_name = $data['table_name'];
    $record_id = $data['record_id'];

    // Check if table name and record id are not empty
    if(empty($table_name) || empty($record_id)){
        echo json_encode(["status" => "error", "message" => "Table name and record id are required"]);
        exit();
    }

    // Check if table exists
    $sql = "SHOW TABLES LIKE '$table_name'";
    $result = $conn->query($sql);

    if($result->num_rows == 0){
        echo json_encode(["status" => "error", "message" => "Table $table_name does not exist"]);
        exit();
    }

    // Delete record
    $sql = "DELETE FROM $table_name WHERE _id=$record_id";
    $result = $conn->query($sql);

    if($result){
        echo json_encode(["status" => "success", "message" => "Record deleted successfully"]);
    }else{
        echo json_encode(["status" => "error", "message" => "Failed to delete record"]);
    }

    $conn->close();
?>