<?php

if(userLogin()['level'] == 3){
    header('location: '.$main_url.'error-page.php');
    exit();
}

function insert($data) {
    global $koneksi;

    $nama = mysqli_real_escape_string($koneksi, $data["nama"]);
    $telpon = mysqli_real_escape_string($koneksi, $data["telpon"]);
    $deskripsi = mysqli_real_escape_string($koneksi, $data["deskripsi"]); // Corrected column name
    $alamat = mysqli_real_escape_string($koneksi, $data["alamat"]);

    $query = "INSERT INTO tbl_supplier (nama, telpon, deskripsi, alamat) VALUES ('$nama', '$telpon', '$deskripsi', '$alamat')";
    if (mysqli_query($koneksi, $query)) {
        return true;
    } else {
        // Log the error message
        error_log("Error: " . mysqli_error($koneksi));
        return false;
    }
}

?>