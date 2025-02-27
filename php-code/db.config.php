<?php
    $server = "localhost";
    $username = "root";
    $password = "";
    $database = "db_operator";

    // Create connection to MySQL server (without specifying database)
    $conn = mysqli_connect($server, $username, $password);

    // Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    // Check if database exists
    $db_check_query = "SHOW DATABASES LIKE '$database'";
    $db_check_result = mysqli_query($conn, $db_check_query);

    // If database doesn't exist, create it
    if (mysqli_num_rows($db_check_result) == 0) {
        $create_db_query = "CREATE DATABASE $database";
        if (!mysqli_query($conn, $create_db_query)) {
            die("Error creating database: " . mysqli_error($conn));
        }
    }

    // Close the initial connection
    mysqli_close($conn);

    // Reconnect, this time to the specific database
    $conn = mysqli_connect($server, $username, $password, $database);

    // Final connection check
    if (!$conn) {
        die("Connection to database failed: " . mysqli_connect_error());
    }
?>
