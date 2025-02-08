<?php

require "../config/config.php";
require "../config/function.php";
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
                <h3 class="card-title"><i class="fa-solid fa-clipboard-list fa-sm"></i> Data Pengguna</h3>
                <div class="card-tools">
                    <a href="<?= $main_url ?>user/add-user.php" class="btn btn-sm btn-primary"><i class="fa-solid 
                    fa-plus fa-sm"></i>Tambah Pengguna</a>
                </div>
            </div>
            <div class="card-body table-responsive p-3">
                <table class="table table-hover text-nowrap">
                    <thead>
                        <tr>
                            <th class="text-center">No</th>
                            <th class="text-center">Foto</th>
                            <th class="text-center">Username</th>
                            <th class="text-center">Fullname</th>
                            <th class="text-center">Alamat</th>
                            <th class="text-center">Level User</th>
                            <th class="text-center" style="width: 10%;">Operasi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $no = 1;
                        $users = getData("SELECT * FROM tbl_user");
                        foreach ($users as $user) : ?>
                            <tr>
                                <td class="text-center"><?= $no++ ?></td>
                                <td class="text-center"><img src="../asset/image/<?= $user['foto'] ?>" class="rounded-circle" 
                                alt="" width="60px"> </td>
                                <td class="text-center"><?= $user['username'] ?></td>
                                <td class="text-center"><?= $user['fullname'] ?></td>
                                <td class="text-center"><?= $user['address'] ?></td>
                                <td class="text-center">
                                    <?php
                                    if ($user['level'] == 1) {
                                        echo "Administrator";
                                    } else if ($user['level'] == 2) {
                                        echo 'Supervisor';
                                    } else {
                                        echo "Operator";
                                    }
                                    ?>
                                </td>
                                <td class="text-center">
                                    <a href="edit-user.php?id=<?= $user['userid'] ?>" 
                                    class="btn btn-sm btn-warning" title="edit user"><i class="fa-solid fa-pencil fa-sm"></i></a>
                                    <a href="del-user.php?id=<?= $user['userid'] ?>&foto=<?= $user['foto'] ?>" 
                                    class="btn btn-sm btn-danger" title="hapus pengguna" onclick="return confirm('Apakah anda yakin akan menghapus pengguna ini?')
                                    "><i class="fa-solid fa-trash fa-sm"></i></a>
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