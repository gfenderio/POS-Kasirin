<?php

require "../config/config.php";

session_start();
if (!isset($_SESSION["ssLogin"])) {
  header("Location: {$main_url}auth/login.php");
  exit();
}

require "../config/function.php";
require "../module/mode-customer.php";

$title = "Data Customer - Dikasirin POS";
require "../template/header.php";
require "../template/navbar.php";
require "../template/sidebar.php";

$customers = getData("SELECT * FROM tbl_customer");

?>

<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Customer</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="<?=$main_url?>dashboard.php">Halaman Utama</a></li>
              <li class="breadcrumb-item active">Customer</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>

    <section class="content">
      <div class="container-fluid">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fas fa-users"></i> Data Customer</h3>
            <a href="add-customer.php" class="btn btn-primary btn-sm float-right"><i class="fas fa-plus"></i> Tambah Customer</a>
          </div>
          <div class="card-body">
            <?php if ($customers === false): ?>
              <div class="alert alert-danger" role="alert">
                Error: <?= mysqli_error($koneksi) ?>
              </div>
            <?php else: ?>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Telpon</th>
                  <th>Deskripsi</th>
                  <th>Alamat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <?php foreach ($customers as $index => $customer): ?>
                <tr>
                  <td><?= $index + 1 ?></td>
                  <td><?= htmlspecialchars($customer['nama']) ?></td>
                  <td><?= htmlspecialchars($customer['telpon']) ?></td>
                  <td><?= htmlspecialchars($customer['deskripsi']) ?></td>
                  <td><?= htmlspecialchars($customer['alamat']) ?></td>
                  <td>
                    <a href="edit-customer.php?id=<?= $customer['id_customer'] ?>" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i> Edit</a>
                    <a href="del-customer.php?id=<?= $customer['id_customer'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('Yakin ingin menghapus data ini?')"><i class="fas fa-trash"></i> Hapus</a>
                  </td>
                </tr>
                <?php endforeach; ?>
              </tbody>
            </table>
            <?php endif; ?>
          </div>
        </div>
      </div>
    </section>
</div>

<?php

require "../template/footer.php";

?>