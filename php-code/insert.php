<?php
    //this code is for inserting data into the database , data is coming from the form as post request table_name and record

    //Include database configuration
    require_once 'db.config.php';

    //Set headers to allow CORS and handle JSON data
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST');
    header('Content-Type: application/json');

    

    //Get the raw POST data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);



    //Check if data is received
    if(!$data){
        echo json_encode(["status" => "error", "message" => "No data received"]);
        exit();
    }

    $table_name = $data['table_name'];
    $record = $data['record'];

   

    //Check if table name and record are not empty
    if(empty($table_name) || empty($record)){
        echo json_encode(["status" => "error", "message" => "Table name and record are required"]);
        exit();
    }

    //Check if table exists
    $sql = "SHOW TABLES LIKE '$table_name'";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) <= 0) {
        echo json_encode(["status" => "error", "message" => "Table $table_name does not exist"]);
        exit();
    }

    //Create columns and values string for SQL query
    $columns = [];
    $values = [];

    foreach($record as $key => $value){
        $columns[] = $key;
        $values[] = $value;
    }

    $columns_string = implode(", ", $columns);
    //make column string and check if value is integer or string
    $values_string = implode("', '", $values);
    

    //Insert record query
    $sql = "INSERT INTO $table_name ($columns_string) VALUES ('$values_string')";

    // echo json_encode(["status" => "success", "message" => "Record inserted successfully", "record" => $record, "sql" => $sql]);


    //Execute query
    if (mysqli_query($conn, $sql)) {
        echo json_encode(["status" => "success", "message" => "Record inserted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error inserting record: " . mysqli_error($conn)]);
    }

    //Close connection
    mysqli_close($conn);
?>