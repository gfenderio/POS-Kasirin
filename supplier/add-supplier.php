<?php

require "../config/config.php";

session_start();
if (!isset($_SESSION["ssLogin"])) {
    header("Location: {$main_url}auth/login.php");
    exit();
}

require "../config/function.php";
require "../module/mode-supplier.php";

$title = "Tambah Supplier - Dikasirin POS";
require "../template/header.php";
require "../template/navbar.php";
require "../template/sidebar.php";

$alert = '';

if (isset($_POST["simpan"])) {
    if (insert($_POST)) {
        $alert = '<div class="alert alert-success alert-dismissible fade show" role="alert">
        <i class="icon fas fa-check"></i> Data Supplier berhasil ditambahkan
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
        </div>';             
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
                    <h1 class="m-0">Supplier</h1>
                </div><!-- /.col -->
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="<?=$main_url?>dashboard.php">Halaman Utama</a></li>
                        <li class="breadcrumb-item"><a href="<?=$main_url?>supplier/data-supplier.php">Supplier</a></li>
                        <li class="breadcrumb-item active">Tambah Supplier</li>
                    </ol>
                </div><!-- /.col -->
            </div><!-- /.row -->
        </div><!-- /.container-fluid -->
    </div>

    <section class="content">
        <div class="container-fluid">
            <div class="card">
                <form action="" method="post">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-solid fa-truck" style="margin-right: 8px;"></i> Tambah Supplier</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <?php if ($alert != '') {
                            echo $alert;
                            } ?>
                            <div class="col-lg-8 mb-3">
                                <div class="form-group">
                                    <label for="nama">Nama Supplier</label>
                                    <input type="text" name="nama" class="form-control" id="nama" placeholder="Masukkan Nama Supplier" autofocus autocomplete="off" required>
                                </div>
                                <div class="form-group">
                                    <label for="telp">Telpon</label>
                                    <input type="text" name="telp" class="form-control" id="telp" placeholder="Masukan Nomor Telpon Supplier" pattern="[0-9]{5,}" title="minimal 5 angka" required>
                                </div>
                                <div class="form-group">
                                    <label for="deskripsi">Keterangan</label>
                                    <textarea name="deskripsi" id="deskripsi" rows="1" class="form-control" placeholder="Keterangan Supplier" required></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="alamat">Alamat</label>
                                    <textarea name="alamat" id="alamat" rows="3" class="form-control" placeholder="Masukan Alamat Lengkap Supplier" required></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button type="submit" name="simpan" class="btn btn-primary btn-sm float-right"><i class="fas fa-save"></i> Simpan</button>
                        <button type="reset" class="btn btn-danger btn-sm float-right mr-1"><i class="fas fa-times"></i> Reset</button>
                    </div>
                </form>
            </div>
        </div>
    </section>
</div>

<?php 

require "../template/footer.php";

?>
