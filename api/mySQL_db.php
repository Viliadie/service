<?
$server = "127.0.0.1";
$login = "root";
$pass = "";
$name_db = "database1";

$connect = mysqli_connect($server, $login, $pass, $name_db);

if ($connect == false) {
    echo "Соединение с БД не удалось";
}
?>