<?php


if (userLogin()['level'] == 3) {
    header("Location:" . $main_url . "error-page.php");
    exit();
}

function insert($data){
    global $koneksi;

    $nama       = mysqli_real_escape_string($koneksi, $data["nama"]);
    $telp       = mysqli_real_escape_string($koneksi, $data["telp"]);
    $deskripsi  = mysqli_real_escape_string($koneksi, $data["deskripsi"]);
    $alamat     = mysqli_real_escape_string($koneksi, $data["alamat"]);

    $sqlSupplier = "INSERT INTO tbl_supplier (nama, telp, deskripsi, alamat) VALUES ('$nama', '$telp', '$deskripsi', '$alamat')";
    mysqli_query($koneksi, $sqlSupplier);

    return mysqli_affected_rows($koneksi);
}

function delete($id){
    global $koneksi;

    $sqlDelete = "DELETE FROM tbl_supplier WHERE idsup = $id";
    mysqli_query($koneksi, $sqlDelete);

    return mysqli_affected_rows($koneksi);
}

?>