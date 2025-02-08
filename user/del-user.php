<?php

require "../config/config.php";
require "../config/functions.php";
require "../module/mode-user.php";

$id    =$_GET["id"];
$foto = $_GET["foto"];

if (delete($id, $foto)) {
    echo "<script>
    alert('Data berhasil dihapus');
    document.location.href = '$main_url/user/data-user.php';
    </script>";
} else {
    echo "<script>
    alert('Data gagal dihapus');
    document.location.href = '$main_url/user/data-user.php';
    </script>";
}