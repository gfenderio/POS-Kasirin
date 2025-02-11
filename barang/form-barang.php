<?php

require "../config/config.php";

session_start();
if (!isset($_SESSION["ssLogin"])) {
  header("Location: {$main_url}auth/login.php");
  exit();
}

require "../config/function.php";
require "../module/mode-barang.php";

$title = "Form Barang - Dikasirin POS";
require "../template/header.php";
require "../template/navbar.php";
require "../template/sidebar.php";

if (isset($_GET["msg"])) {
    $msg = $_GET["msg"];
    $id = $_GET['id'];
    $sqlEdit = "SELECT * FROM tbl_barang WHERE idbar = '$id'"; // Ensure the table name is correct
    $barang = getData($sqlEdit);
    if ($barang === false) {
        echo "<div class='alert alert-danger' role='alert'>Error: Data not found.</div>";
        $barang = [];
    } else {
        $barang = $barang[0];
    }
} else {
    $msg = '';
}

$alert = '';
if (isset($_POST["simpan"])) {
    if ($msg != '') {
        if (update($_POST)) {
            echo "
            <script>
                document.location.href = 'index.php?msg=updated';</script>";
        }
    } else {
        if (insert($_POST)) {
            $alert = "<div class='alert alert-success alert-dismissible fade show' role='alert'>
                        <i class='icon fas fa-check'></i> Barang berhasil ditambahkan
                        <button type='button' class='close' data-dismiss='alert' aria-label='Close'>
                            <span aria-hidden='true'>&times;</span>
                        </button>
                      </div>";
        }
    }
}

?>

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Barang</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="<?=$main_url?>dashboard.php">Halaman Utama</a></li>
                        <li class="breadcrumb-item"><a href="<?=$main_url?>barang/index.php">Barang</a></li>
                        <li class="breadcrumb-item active"><?= $msg != '' ? 'Edit Barang' : 'Add Barang' ?></li>
                    </ol>
                </div>
            </div>
        </div>
    </div>

    <!-- Main content -->
    <section class="content">
        <div class="container-fluid">
            <div class="card">
                <form action="" method="post" enctype="multipart/form-data">
                    <?php if ($alert != '') {
                        echo $alert; 
                    } ?>
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-plus fa-sm"></i> <?= $msg != '' ? 'Edit Barang' : 'Input Barang' ?> </h3>
                        <div class="card-tools">
                            <button type="submit" name="simpan" class="btn btn-primary btn-sm"><i class="fas fa-save"></i> Simpan</button>
                            <button type="reset" class="btn btn-danger btn-sm"><i class="fas fa-times"></i> Reset</button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-8 mb-3 pr-3">
                                <div class="form-group">
                                    <label for="kode">Kode Barang</label>
                                    <input type="text" name="kode" class="form-control" id="kode" value="<?= $msg != '' ? $barang['idbar'] : generateId() ?>" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="barcode">Barcode *</label>
                                    <input type="text" name="barcode" class="form-control" id="barcode" value ="<?= $msg != '' ? $barang['barcode'] : null ?>" 
                                    placeholder="Barcode" autocomplete="off" autofocus required>
                                </div>
                                <div class="form-group">
                                    <label for="name">Nama *</label>
                                    <input type="text" name="name" class="form-control" id="name" placeholder="Nama Barang" value="<?= $msg != '' ? $barang['nama_barang'] : null ?>"
                                     autocomplete="off" required>
                                </div>
                                <div class="form-group">
                                    <label for="satuan">Satuan *</label>
                                    <select name="satuan" class="form-control" id="satuan" required>
                                        <?php if ($msg != '') {
                                            $satuan = ["piece"];
                                            foreach ($satuan as $sat) {
                                                if ($barang['satuan'] == $sat) {
                                                    echo "<option value='$sat' selected>$sat</option>";
                                                } else {
                                                    echo "<option value='$sat'>$sat</option>";
                                                }
                                            }
                                        } else { ?>
                                            <option value="">>-- Satuan Barang</option>
                                            <option value="piece">Pcs</option>
                                        <?php } ?>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="harga_beli">Harga Beli *</label>
                                    <input type="number" name="harga_beli" class="form-control" id="harga_beli" value="<?= $msg != '' ? $barang['harga_beli'] : null ?>" 
                                    placeholder="Rp. 0" autocomplete="off" required>
                                </div>
                                <div class="form-group">
                                    <label for="harga_jual">Harga Jual *</label>
                                    <input type="number" name="harga_jual" class="form-control" id="harga_jual" value="<?= $msg != '' ? $barang['harga_jual'] : null ?>" 
                                    placeholder="Rp. 0" autocomplete="off" required>
                                </div>
                                <div class="form-group">
                                    <label for="stock_minimal">Stock Minimal *</label>
                                    <input type="number" name="stock_minimal" class="form-control" id="stock_minimal" value="<?= $msg != '' ? $barang['stock_minimal'] : null ?>" 
                                    placeholder="0" autocomplete="off" required>
                                </div>
                            </div>
                            <div class="col-lg-4 text-center px-3">
                                <img src="<?= $msg != '' ? $main_url . 'asset/image/' . $barang['foto'] : $main_url . 'asset/image/no_product.png' ?>" class="profile-user-img mb-3 mt-4" alt="No Image">
                                <input type="file" name="foto" class="form-control">
                                <span class="text-sm">Tipe file gambar JPG | PNG | GIF</span>
                                <?php if ($msg != '') { ?>
                                    <input type="hidden" name="oldImg" value="<?= $barang['foto'] ?>">
                                <?php } ?>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>

<?php
require "../template/footer.php";
?>