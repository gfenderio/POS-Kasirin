<?php

require_once "../config/config.php";
require_once "../config/function.php";
if (userLogin()['level'] == 3) {
    header("Location:" . $main_url . "error-page.php");
    exit();
}

function generateId() {
    global $koneksi;

    $queryId    = mysqli_query($koneksi, "SELECT max(idbar) as maxid from tbl_barang");
    $data       = mysqli_fetch_array($queryId);
    $maxid      = $data['maxid'];

    if ($maxid) {
        $noUrut = (int) substr($maxid, 4, 3);
        $noUrut++;
        $maxid = "BRG-" . sprintf("%03s", $noUrut);
    } else {
        $maxid = "BRG-001";
    }

    return $maxid;
}

function insert($data){
    global $koneksi;

    $id         = mysqli_real_escape_string($koneksi, $data["kode"]);
    $barcode    = mysqli_real_escape_string($koneksi, $data["barcode"]);
    $name       = mysqli_real_escape_string($koneksi, $data["name"]);
    $satuan     = mysqli_real_escape_string($koneksi, $data["satuan"]);
    $harga_beli = mysqli_real_escape_string($koneksi, $data["harga_beli"]);
    $harga_jual = mysqli_real_escape_string($koneksi, $data["harga_jual"]);
    $stockmin   = mysqli_real_escape_string($koneksi, $data["stock_minimal"]);
    $foto       = uploadimg(null, $id);

    if (!$foto) {
        return false;
    }

    $sqlBarang = "INSERT INTO tbl_barang VALUES ('$id', '$barcode', '$name', '$harga_beli', '$harga_jual', 0, '$satuan', '$stockmin', '$foto')";
    mysqli_query($koneksi, $sqlBarang);

    return mysqli_affected_rows($koneksi);
}

function update($data) {
    global $koneksi;
    
    $id         = mysqli_real_escape_string($koneksi, $data["kode"]);
    $barcode    = mysqli_real_escape_string($koneksi, $data["barcode"]);
    $name       = mysqli_real_escape_string($koneksi, $data["name"]);
    $satuan     = mysqli_real_escape_string($koneksi, $data["satuan"]);
    $harga_beli = mysqli_real_escape_string($koneksi, $data["harga_beli"]);
    $harga_jual = mysqli_real_escape_string($koneksi, $data["harga_jual"]);
    $stockmin   = mysqli_real_escape_string($koneksi, $data["stock_minimal"]);
    $gbrLama    = mysqli_real_escape_string($koneksi, $data["oldImg"]);
    $foto       = uploadimg($gbrLama, $id);

    if (!$foto) {
        return false;
    }

    $sqlUpdate = "UPDATE tbl_barang SET barcode = '$barcode', nama_barang = '$name', satuan = '$satuan', harga_beli = '$harga_beli', harga_jual = '$harga_jual', stock_minimal = '$stockmin', foto = '$foto' WHERE idbar = '$id'";
    mysqli_query($koneksi, $sqlUpdate);

    return mysqli_affected_rows($koneksi);
}

function delete($id, $gbr) {
    global $koneksi;

    // Delete the item
    $sqlDel = "DELETE FROM tbl_barang WHERE idbar = '$id'";
    mysqli_query($koneksi, $sqlDel);
    if ($gbr != 'no_product.png' && file_exists('../asset/image/' . $gbr)) {
        unlink('../asset/image/' . $gbr);
    }

    return mysqli_affected_rows($koneksi);
}

?>