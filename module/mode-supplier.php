<?php

if (userLogin()['level'] == 3) {
    header("Location:" . $main_url . "error-page.php");
    exit();
}

function insert($data){
    global $koneksi;

    $nama       = mysqli_real_escape_string($koneksi,$data["nama"]);
    $telp       = mysqli_real_escape_string($koneksi,$data["telp"]);
    $deskripsi  = mysqli_real_escape_string($koneksi,$data["deskripsi"]);
    $alamat     = mysqli_real_escape_string($koneksi,$data["alamat"]);

    $sqlSupplier = "INSERT INTO tbl_supplier VALUES ('', '$nama', '$telp', '$deskripsi', '$alamat')";
    mysqli_query($koneksi, $sqlSupplier);

    return mysqli_affected_rows($koneksi);
}

?>