<?php

require "../config/config.php";

session_start();
if (!isset($_SESSION["ssLogin"])) {
    header("Location: {$main_url}auth/login.php");
    exit();
}

require "../config/function.php";
require "../module/mode-supplier.php";

$title = "Data Supplier - Dikasirin POS";
require "../template/header.php";
require "../template/navbar.php";
require "../template/sidebar.php";


if (isset ($_GET['msg'])) {
    $msg = $_GET['msg'];
} else {
    $msg = '';
}

$alert = '';
if ($msg == 'terhapus') {
    $alert = '<div class="alert alert-success alert-dismissible">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
    Data supplier berhasil dihapus.
    </div>';
} elseif ($msg == 'dibatalkan') {
    $alert = '<div class="alert alert-danger alert-dismissible">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
    Data supplier gagal dihapus.
    </div>';
}

?>

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
              <li class="breadcrumb-item active">Data Supplier</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>

<section>
    <div class="container-fluid">
        <div class="card">
            <?php if ($alert != '') {
                echo $alert;
            } ?>
            <div class="card-header">
                <h3 class="card-title"><i class="fas fa-list fa-sm" style="margin-right: 8px;"></i> Data Supplier</h3>
                <a href="<?=$main_url?>supplier/add-supplier.php" class="btn btn-primary btn-sm float-right"><i class="fas fa-plus fa-sm" style="margin-right: 5px;"></i> Tambah Supplier</a>
            </div>
            <div class="card-body table-responsive p-3">
                <table class="table table-hover text-nowrap" id="tblData">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Supplier</th>
                            <th>Telepon</th>
                            <th>Alamat</th>
                            <th>Deskripsi</th>
                            <th style="width: 10%">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $no = 1;
                        $suppliers = getData("SELECT * FROM tbl_supplier");
                        foreach ($suppliers as $supplier) :
                        ?>
                            <tr>
                            <td><?=$no++?></td>
                            <td><?=$supplier["nama"]?></td>
                            <td><?=$supplier["telp"]?></td>
                            <td><?=$supplier["alamat"]?></td>
                            <td><?=$supplier["deskripsi"]?></td>
                            <td>
                                <a href="" class="btn btn-sm btn-warning" title="edit supplier"><i class="fas fa-pen"></i></a>
                                <a href="del-supplier.php?id=<?= $supplier ['idsup'] ?>" class="btn btn-sm btn-danger" title="hapus supplier" onclick="return confirm('Anda yakin akan menghapus data supplier ini?')"><i class="fas fa-trash"></i></a>
                            </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>

<?php
require "../template/footer.php";
?>