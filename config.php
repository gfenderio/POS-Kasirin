<?php

date_default_timezone_set('Asia/Jakarta');

$host  = 'localhost';
$user  = 'root';
$pass = '';
$dbname = 'db_dikasirinpos';

$koneksi = mysqli_connect($host, $user, $pass, $dbname);

//if (mysqli_connect_errno()) {
//    echo "Koneksi database gagal : " . mysqli_connect_error();
//exit();
//} else {
//    echo "Koneksi database berhasil";
//}

$main_url = 'http://localhost/POS-Kasirin/';

?>