<?php

require "../config/config.php";

session_start();
if (!isset($_SESSION["ssLogin"])) {
  header("Location: {$main_url}auth/login.php");
  exit();
}

require "../config/function.php";
require "../module/mode-customer.php";

$id = $_GET["id"];

if (deleteCustomer($id)) {
    header("Location: data-customer.php");
} else {
    echo "Error: " . mysqli_error($koneksi);
}

?>