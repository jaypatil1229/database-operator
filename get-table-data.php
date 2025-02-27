<?php 
    //This file will be used to get the table data from the database and send it back to the client
    //we using GET method to get the table name from the client

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


    // Get table data
    $sql = "SELECT * FROM $table_name";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }
    }

    echo json_encode(["status" => "success", "data" => $data]);

    mysqli_close($conn);


    //ANOHTER WAY TO DO THIS
    // // Get table data
    // $sql = "SELECT * FROM $table_name";
    // $result = $conn->query($sql);

    // $data = [];
    // if($result->num_rows > 0){
    //     while($row = $result->fetch_assoc()){
    //         $data[] = $row;
    //     }
    // }

    // echo json_encode(["status" => "success", "data" => $data]);
    
?>