<?php 
    //This code will update the record in the table of name passed in the request of post method
    //sample input json data for this code
    // {
    //     "table_name": "table_name",
    //     "record_id": idValue,
    //     "record": [
    //         {
    //             "column_name": "column_name",
    //             "column_value": "value"
    //         }
    //     ]
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
    $record = $data['record'];

    // Check if table name, record id and record are not empty
    if(empty($table_name) || empty($record_id) || empty($record)){
        echo json_encode(["status" => "error", "message" => "Table name, record id and record are required"]);
        exit();
    }

    // Check if table exists
    $sql = "SHOW TABLES LIKE '$table_name'";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) == 0) {
        echo json_encode(["status" => "error", "message" => "Table $table_name does not exist"]);
        exit();
    }

    // Prepare Update columns
    // $update_columns = array_map(function($column){
    //     return $column['column_name'] . "='" . $column['column_value'] . "'";
    // }, $record);
    // $update_columns = implode(',', $update_columns);

    // Prepare update columns(better way)
    $update_columns = [];
    foreach ($record as $column) {
        $column_name = mysqli_real_escape_string($conn, $column['column_name']);
        $column_value = mysqli_real_escape_string($conn, $column['column_value']);
        
        // Handle numeric and string values properly
        if (is_numeric($column_value)) {
            $update_columns[] = "`$column_name` = $column_value";
        } else {
            $update_columns[] = "`$column_name` = '$column_value'";
        }
    }



    // Update record query
    $sql = "UPDATE `$table_name` SET $update_string WHERE `_id` = $record_id";

    // Execute query
    if (mysqli_query($conn, $sql)) {
        echo json_encode(["status" => "success", "message" => "Record updated successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update record: " . mysqli_error($conn)]);
    }

    // Close connection
    mysqli_close($conn);

?>