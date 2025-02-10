<?php

session_start();
if (!isset($_SESSION["ssLogin"])) {
    header("Location: {$main_url}auth/login.php");
    exit();
}

require "../config/config.php";
require "../config/function.php";
require "../module/mode-supplier.php";

$id = $_GET["id"];

if (delete($id)) {
    echo "<script>
    document.location.href = 'data-supplier.php?msg=terhapus';
    </script>";
} else {
    echo "<script>
    document.location.href = 'data-supplier.php?msg=dibatalkan';
    </script>";
}