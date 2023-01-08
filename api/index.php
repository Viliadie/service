<?
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Credentials: true');
header("Content-Type: application/json");
include "mySQL_db.php";


$method = $_SERVER['REQUEST_METHOD'];

$arResult = mysqli_query($connect, "SELECT * FROM `users`");

$usersList = [];

function addUser($connect, $data) {

    $fName = $data['fName'];
    $lName = $data['lName'];
    $date = $data['date'];

    mysqli_query($connect, "INSERT INTO `users` (`id`, `first_name`, `last_name`, `date`) VALUES (NULL, '$fName', '$lName', '$date')");

    http_response_code(201);
    $res = [
        "status" => true,
        "user_id" => mysqli_insert_id($connect)
    ];

    echo json_encode($res);
}

if ($method === 'GET') {
    while ($user = mysqli_fetch_assoc($arResult)) {
        $usersList[] = $user;
    }

    function sort_date($a_new, $b_new) {

        $a_new = strtotime($a_new["date"]);
        $b_new = strtotime($b_new["date"]);
    
        return $a_new - $b_new;
    
    }
    
    usort($usersList, "sort_date");
    
    //print_r($usersList);
    http_response_code(200);
    echo json_encode($usersList, JSON_UNESCAPED_UNICODE);
    
 } elseif ($method === "POST") {
    addUser($connect, $_POST);
}
