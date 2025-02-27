<?php
    // Include database configuration
    require_once 'db.config.php';

    // Set headers to allow CORS and handle JSON data
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST');
    header('Content-Type: application/json');

    // echo json_encode(["status" => "success", "message" => "Table created successfully"]);
    // Get the raw POST data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);



    // Check if data is received
    if(!$data){
        echo json_encode(["status" => "error", "message" => "No data received"]);
        exit();
    }

    $table_name = $data['table_name'];
    $columns = $data['columns'];

    // Check if table name and columns are not empty
    if(empty($table_name) || empty($columns)){
        echo json_encode(["status" => "error", "message" => "Table name and columns are required"]);
        exit();
    }

    // Check if table already exists
    $sql = "SHOW TABLES LIKE '$table_name'";
    $result = $conn->query($sql);

    if($result->num_rows > 0){
        echo json_encode(["status" => "error", "message" => "Table $table_name already exists"]);
        exit();
    }

    // Create columns string for SQL query
    $columns_string = array_map(function($column){
        //check if data type is VARCHAR or CHAR and add length as default for VARCHAR as 255 and CHAR as 1
        if($column['column_datatype'] === 'VARCHAR' || $column['column_datatype'] === 'CHAR'){
            $length = $column['column_datatype'] === 'VARCHAR' ? 255 : 1;
            return $column['column_name'] . ' ' . $column['column_datatype'] . '(' . $length . ')';
        }

        return $column['column_name'] . ' ' . $column['column_datatype'];
    }, $columns);

    $columns_string = implode(',', $columns_string);
    echo json_encode(["status"=>"success", "data"]);
    // Add the auto-increment `_id` column at the beginning
    $columns_string = "_id INT AUTO_INCREMENT PRIMARY KEY, " . $columns_string;



    //MAIN CODE
    // Create table query
    $sql = "CREATE TABLE $table_name ($columns_string)";

    // Execute query
    if (mysqli_query($conn, $sql)) {
        echo json_encode(["status" => "success", "message" => "Table $table_name created successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error creating table: " . $conn->error]);
    }

    mysqli_close($conn);
    
    // ALTERNATE CODE
    // if($conn->query($sql) === TRUE){
    //     echo json_encode(["status" => "success", "message" => "Table $table_name created successfully"]);
    // } else {
    //     echo json_encode(["status" => "error", "message" => "Error creating table: " . $conn->error]);
    // }
?>
