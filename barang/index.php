<?php

session_start();

if (!isset($_SESSION["ssLogin"])) {
    $main_url = "http://yourdomain.com/"; // Define your main URL here
    header("Location: {$main_url}auth/login.php");
    exit();
}

require "../config/config.php";
require "../config/function.php";
require "../module/mode-barang.php";

$title = "Barang - Dikasirin POS";
require "../template/header.php";
require "../template/navbar.php";
require "../template/sidebar.php";

$msg = isset($_GET['msg']) ? $_GET['msg'] : '';

$alert = '';
// hapus barang
if ($msg == 'deleted') {
    $id = $_GET['id'];
    $gbr = $_GET['gbr'];
    $user = userLogin()['username'];
    $gbrUser = userLogin()['foto'];
    if (delete($id, $gbr)) {
        $alert = "<script>
                    $(document).ready(function() {
                        Swal.fire({
                            icon: 'success',
                            title: '$user',
                            imageUrl: '../asset/image/$gbrUser',
                            imageWidth: 100,
                            imageHeight: 100,
                            text: 'Data Barang berhasil dihapus',
                            showConfirmButton: false,
                            timer: 1500,
                            position: 'bottomRight'
                        });
                    });
                  </script>";
    } else {
        $alert = "<script>
                    $(document).ready(function() {
                        Swal.fire({
                            icon: 'error',
                            title: '$user',
                            imageUrl: '../asset/image/$gbrUser',
                            imageWidth: 100,
                            imageHeight: 100,
                            text: 'Data Barang gagal dihapus',
                            showConfirmButton: false,
                            timer: 1500,
                            position: 'bottomRight'
                        });
                    });
                  </script>";
    }
}

if ($msg == 'updated') {
    $user = userLogin()['username'];
    $gbrUser = userLogin()['foto'];
    $alert = "<script>
                $(document).ready(function() {
                    Swal.fire({
                        icon: 'success',
                        title: '$user',
                        imageUrl: '../asset/image/$gbrUser',
                        imageWidth: 100,
                        imageHeight: 100,
                        text: 'Data Barang berhasil diperbarui',
                        showConfirmButton: false,
                        timer: 1500,
                        position: 'bottomRight'
                    });
                });
              </script>";
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
                        <li class="breadcrumb-item active">Tambah Barang</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>

    <section class="content">
        <div class="container-fluid">
            <div class="card">
                <?php if ($alert != '') {
                    echo $alert;
                } ?>
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-list fa-sm"></i> Data Barang</h3>
                    <a href="<?=$main_url?>barang/form-barang.php" class="btn btn-primary btn-sm float-right">
                        <i class="fas fa-plus fa-sm"></i> Tambah Barang
                    </a>
                </div>
                <div class="card-body table-responsive p-3">
                    <table class="table table-hover text-nowrap" id="tblData">
                        <thead>
                            <tr>
                                <th>Gambar</th>
                                <th>ID Barang</th>
                                <th>Nama Barang</th>
                                <th>Harga Beli</th>
                                <th>Harga Jual</th>
                                <th style="width: 10%;" class="text-center">Operasi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php 
                            $no = 1;
                            $barang = getData("SELECT * FROM tbl_barang");
                            foreach ($barang as $brg) { ?>
                                <tr>
                                    <td><img src="../asset/image/<?= htmlspecialchars($brg['foto']) ?>" alt="gambar barang" class="rounded-circle" width="60px"></td>
                                    <td><?= htmlspecialchars($brg['idbar']) ?></td>
                                    <td><?= htmlspecialchars($brg['nama_barang']) ?></td>
                                    <td class="text-center"><?= number_format($brg['harga_beli'],0,',','.') ?></td>
                                    <td class="text-center"><?= number_format($brg['harga_jual'],0,',','.') ?></td>
                                    <td class="text-center">
                                        <a href="form-barang.php?id=<?= htmlspecialchars($brg['idbar']) ?>&msg=editing" 
                                        class="btn btn-warning btn-sm" title="edit barang">
                                        <i class="fas fa-pen"></i></a>
                                        <a href="?id=<?= htmlspecialchars($brg['idbar']) ?>&gbr=<?= htmlspecialchars($brg['foto']) ?>&msg=deleted" 
                                        class="btn btn-danger btn-sm" title="hapus barang" onclick="return confirm('Anda yakin akan menghapus barang ini?')">
                                        <i class="fas fa-trash"></i></a>
                                    </td>
                                </tr>
                            <?php } ?>                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</div>

<?php

require "../template/footer.php";

?>