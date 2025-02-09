<?php

require "../config/config.php";

session_start();
if (!isset($_SESSION["ssLogin"])) {
  header("Location: {$main_url}auth/login.php");
  exit();
}

require "../config/function.php";
require "../module/mode-user.php";

$title = "Tambah User - Dikasirin POS";
require "../template/header.php";
require "../template/navbar.php";
require "../template/sidebar.php";

if (isset($_POST["simpan"])) {
    if (insert($_POST) > 0) {
        echo "<script>
                alert('Data berhasil ditambahkan');
              </script>";
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
            <h1 class="m-0">Pengguna</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="<?=$main_url?>dashboard.php">Halaman Utama</a></li>
              <li class="breadcrumb-item"><a href="<?=$main_url?>user/data-user.php">Pengguna</a></li>
              <li class="breadcrumb-item active">Dashboard</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>

    <section class="content">
      <div class="container-fluid">
        <div class="card">
          <form action="" method="post" enctype="multipart/form-data">
            <div class="card-header">
                <h3 class="card-title"><i class="fas fa-user-plus fa-sm" style="margin-right: 8px;"></i> Tambah Pengguna</h3>
            </div>
            <div class="card-body">
                <form action="your_form_action.php" method="post" enctype="multipart/form-data">
                    <div class="row">
                        <div class="col-lg-8 mb-3">
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input type="text" name="username" class="form-control" id="username" 
                                placeholder="Masukan Username" autofocus autocomplete="off" required>
                            </div>
                            <div class="form-group">
                                <label for="fullname">Nama Lengkap</label>
                                <input type="text" name="fullname" class="form-control" id="fullname" 
                                placeholder="Masukan Nama Lengkap" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" name="password" class="form-control" id="password" 
                                placeholder="Masukan Password" required>
                            </div>
                            <div class="form-group">
                                <label for="password2">Konfirmasi Password</label>
                                <input type="password" name="password2" class="form-control" id="password2" 
                                placeholder="Masukan Kembali Password Anda" required>
                            </div>
                            <div class="form-group">
                                <label for="level">Level</label>
                                <select name="level" id="level" class="form-control" required>
                                    <option value="">- Level User -</option>
                                    <option value="1">Administrator</option>
                                    <option value="2">Supervisor</option>
                                    <option value="3">Operator</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="address">Address</label>
                                <textarea name="address" id="address" cols="" rows="3" class="form-control" 
                                placeholder="Masukan Alamat Lengkap" required></textarea>
                            </div>
                        </div>
                        <div class="col-lg-4 text-center">
                            <img src="<?= $main_url ?>asset/image/default.png" class="profile-user-img img-circle mb-3" alt="">
                            <input type="file" class="form-control" name="foto">
                            <span class="text-sm">Tipe file gambar JPG | PNG | GIF</span>
                            <span class="text-sm"> Lebar = Tinggi</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button type="submit" name="simpan" class="btn btn-primary btn-sm float-right"><i class="fas fa-save"></i> Simpan</button>
                        <button type="reset" class="btn btn-danger btn-sm float-right mr-1"><i class="fas fa-times"></i> Reset</button>
                    </div>
                  </div>
              </div>
          </form>
          </div>
    </section>

<?php
require "../template/footer.php";
?>