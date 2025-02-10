<?php

if (userLogin()['level'] == 3) {
    header("Location:" . $main_url . "error-page.php");
    exit();
}

function insertCustomer($data){
    global $koneksi;

    $nama       = mysqli_real_escape_string($koneksi, $data["nama"]);
    $telpon     = mysqli_real_escape_string($koneksi, $data["telpon"]); // Corrected key
    $deskripsi  = mysqli_real_escape_string($koneksi, $data["deskripsi"]);
    $alamat     = mysqli_real_escape_string($koneksi, $data["alamat"]);

    $sqlCustomer = "INSERT INTO tbl_customer (nama, telpon, deskripsi, alamat) VALUES ('$nama', '$telpon', '$deskripsi', '$alamat')";
    if (mysqli_query($koneksi, $sqlCustomer)) {
        return true;
    } else {
        // Log the error message
        error_log("Error: " . mysqli_error($koneksi));
        return false;
    }
}

function updateCustomer($data) {
    global $koneksi;

    $id_customer = mysqli_real_escape_string($koneksi, $data["id_customer"]);
    $nama        = mysqli_real_escape_string($koneksi, $data["nama"]);
    $telpon      = mysqli_real_escape_string($koneksi, $data["telpon"]); // Corrected key
    $deskripsi   = mysqli_real_escape_string($koneksi, $data["deskripsi"]);
    $alamat      = mysqli_real_escape_string($koneksi, $data["alamat"]);

    $sqlUpdate = "UPDATE tbl_customer SET nama = '$nama', telpon = '$telpon', deskripsi = '$deskripsi', alamat = '$alamat' WHERE id_customer = $id_customer";
    if (mysqli_query($koneksi, $sqlUpdate)) {
        return true;
    } else {
        // Log the error message
        error_log("Error: " . mysqli_error($koneksi));
        return false;
    }
}

function deleteCustomer($id){
    global $koneksi;

    $sqlDelete = "DELETE FROM tbl_customer WHERE id_customer = $id";
    mysqli_query($koneksi, $sqlDelete);

    return mysqli_affected_rows($koneksi);
}

?>