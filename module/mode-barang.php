<?php

require_once "../config/config.php";
require_once "../config/function.php";
if (userLogin()['level'] == 3) {
    header("Location:" . $main_url . "error-page.php");
    exit();
}

function generateId() {
    global $koneksi;

    $queryId    = mysqli_query($koneksi, "SELECT max(idbar) as maxid FROM tbl_barang");
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
    $foto       = mysqli_real_escape_string($koneksi, $_FILES["foto"]["name"]);

    $cekBarcode = mysqli_query($koneksi, "SELECT barcode FROM tbl_barang WHERE barcode = '$barcode'");
    if (mysqli_num_rows($cekBarcode)) {
        echo "<script>
                alert('Barcode sudah terdaftar');
                document.location.href = '';
              </script>";
        return false;
    }

    //upload foto barang
    if ($foto != null) {
        $foto = uploadimg(null, $id);
    } else {
        $foto = 'no_product.png';
    }

    // foto tidak sesuai validasi
    if (!$foto) {
        return false;
    }

    $sqlBarang = "INSERT INTO tbl_barang VALUES ('$id', '$barcode', '$name', '$harga_beli', '$harga_jual', 0, '$satuan', '$stockmin', '$foto')";
    mysqli_query($koneksi, $sqlBarang);

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

    // Update the remaining items
    $barang = getData("SELECT * FROM tbl_barang ORDER BY idbar ASC");
    $noUrut = 1;
    foreach ($barang as $row) {
        $newId = "BRG-" . sprintf("%03s", $noUrut);
        if (isset($row['foto']) && $row['foto'] != 'no_product.png') {
            $newfoto = str_replace($row['idbar'], $newId, $row['foto']);
            if (file_exists('../asset/image/' . $row['foto'])) {
                rename('../asset/image/' . $row['foto'], '../asset/image/' . $newfoto);
            }
        } else {
            $newfoto = $row['foto'];
        }
        $sqlUpdate = "UPDATE tbl_barang SET idbar = '$newId', foto = '$newfoto' WHERE idbar = '{$row['idbar']}'";
        mysqli_query($koneksi, $sqlUpdate);
        $noUrut++;
    }

    return mysqli_affected_rows($koneksi);
}

?>