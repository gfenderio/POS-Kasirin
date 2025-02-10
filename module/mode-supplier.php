<?php

if (userLogin()['level'] == 3) {
    header("Location:" . $main_url . "error-page.php");
    exit();
}

function insert($data){
    global $koneksi;

    $nama       = mysqli_real_escape_string($koneksi, $data["nama"]);
    $telp       = mysqli_real_escape_string($koneksi, $data["telpon"]); // Corrected key
    $deskripsi  = mysqli_real_escape_string($koneksi, $data["deskripsi"]);
    $alamat     = mysqli_real_escape_string($koneksi, $data["alamat"]);

    $sqlSupplier = "INSERT INTO tbl_supplier (nama, telp, deskripsi, alamat) VALUES ('$nama', '$telp', '$deskripsi', '$alamat')";
    if (mysqli_query($koneksi, $sqlSupplier)) {
        return true;
    } else {
        // Log the error message
        error_log("Error: " . mysqli_error($koneksi));
        return false;
    }
}

function update($data) {
    global $koneksi;

    $id_supplier = mysqli_real_escape_string($koneksi, $data["id_supplier"]);
    $nama        = mysqli_real_escape_string($koneksi, $data["nama"]);
    $telp        = mysqli_real_escape_string($koneksi, $data["telpon"]); // Corrected key
    $deskripsi   = mysqli_real_escape_string($koneksi, $data["deskripsi"]);
    $alamat      = mysqli_real_escape_string($koneksi, $data["alamat"]);

    $sqlUpdate = "UPDATE tbl_supplier SET nama = '$nama', telp = '$telp', deskripsi = '$deskripsi', alamat = '$alamat' WHERE idsup = $id_supplier";
    if (mysqli_query($koneksi, $sqlUpdate)) {
        return true;
    } else {
        // Log the error message
        error_log("Error: " . mysqli_error($koneksi));
        return false;
    }
}

function delete($id){
    global $koneksi;

    $sqlDelete = "DELETE FROM tbl_supplier WHERE idsup = $id";
    mysqli_query($koneksi, $sqlDelete);

    return mysqli_affected_rows($koneksi);
}

?>