<?php

require "../config/config.php";
require "../config/functions.php";
require "../module/mode-user.php";

$title = "Users - POS Dikasirin";
require "../template/header.php";
require "../template/navbar.php";
require "../template/sidebar.php";

?>

<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Pengguna</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="<?= $main_url ?>dashboard.php">Halaman Utama</a></li>
              <li class="breadcrumb-item active">Pengguna</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

<section class="content">
    <div class="container-fluid">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title"><i class="fa-solid fa-clipboard-list fa-sm"></i>Data Pengguna</h3>
                <div class="card-tools">
                    <a href="<?= $main_url ?>user/add-user.php" class="btn btn-sm btn-primary"><i class="fa-solid 
                    fa-plus fa-sm"></i>Tambah Pengguna</a>
                </div>
            </div>
            <div class="card-body table-responsive p-3">
                <table class="table table-hover text-nowrap">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Foto</th>
                            <th>Username</th>
                            <th>Fullname</th>
                            <th>Alamat</th>
                            <th>Level User</th>
                            <th style="width: 10%";>Operasi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $no = 1;
                        $users = getData("SELECT * FROM tbl_user");
                        foreach ($users as $user) : ?>
                        
                        <?php endforeach; ?>
                            <tr>
                                <td><?= $no++ ?></td>
                                <td><img src="../asset/image/<?= $user['foto'] ?>" class="rounded-circle" 
                                alt="" width="60px"> </td>
                                <td><?= $user['username'] ?></td>
                                <td><?= $user['fullname'] ?></td>
                                <td><?= $user['alamat'] ?></td>
                                <td>
                                    <?php
                                    if ($user['level_user'] == 1) {
                                        echo "Administrator";
                                    } else if ($user['level_user'] == 2) {
                                        echo 'Supervisor';
                                    } else {
                                        echo "Operator";
                                    }
                                    ?>
                                </td>
                                <td>
                                    <a href="edit-user.php?id=<?= $user['userid'] ?>" 
                                    class="btn btn-sm btn-warning" title="edit user"><i class="fa-solid fa-pencil fa-sm"></i></a>
                                    <a href="del-user.php?id=<?= $user['userid'] ?>&foto=<?= $user['foto'] ?>" 
                                    class="btn btn-sm btn-danger" title="hapus pengguna" onclick="return confirm('Apakah anda yakin akan menghapus pengguna ini?')
                                    "><i class="fa-solid fa-trash fa-sm"></i></a>
                                </td>
                            </tr>
                        <?php
                        
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</section>


<?php

require "../template/footer.php";

?>