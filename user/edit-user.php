<?php

require "../config/config.php";

session_start();
if (!isset($_SESSION["ssLogin"])) {
  header("Location: {$main_url}auth/login.php");
  exit();
}

require "../config/function.php"; // Include the function.php file
require "../module/mode-user.php"; // Include the mode-user.php file

$title = "Ubah Pengguna - Dikasirin POS";
require "../template/header.php";
require "../template/navbar.php";
require "../template/sidebar.php";

$id = $_GET["id"]; // Corrected variable name

$sqlEdit = "SELECT * FROM tbl_user WHERE userid = $id";
$user = getData($sqlEdit)[0]; // Corrected syntax
$level = $user['level'];

if (isset($_POST['koreksi'])) {
    if (update($_POST) > 0) {
        echo "<script>
                alert('Data berhasil diubah');
                document.location.href = 'data-user.php';
              </script>";
    } else {
        echo "<script>
                alert('Data gagal diubah');
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
              <li class="breadcrumb-item active">Ubah Pengguna</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>

    <section class="content">
      <div class="container-fluid">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title"><i class="fas fa-user-plus fa-sm" style="margin-right: 8px;"></i> Ubah Pengguna</h3>
            </div>
            <div class="card-body">
                <form action="edit-user.php?id=<?= $id ?>" method="post" enctype="multipart/form-data">
                    <div class="row">
                      <input type="hidden" name="id" value="<?= $user['userid'] ?>">
                        <div class="col-lg-8 mb-3">
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input type="text" name="username" class="form-control" id="username" 
                                placeholder="Masukan Username" autofocus autocomplete="off" value="<?= $user['username'] ?>" required>
                            </div>
                            <div class="form-group">
                                <label for="fullname">Nama Lengkap</label>
                                <input type="text" name="fullname" class="form-control" id="fullname" 
                                placeholder="Masukan Nama Lengkap" value="<?= $user['fullname'] ?>" required>
                            </div>
                            <div class="form-group">
                                <label for="level">Level</label>
                                <select name="level" id="level" class="form-control" required>
                                    <option value="">- Level User -</option>
                                    <option value="1" <?= selectUser1($level) ?>>Administrator</option>
                                    <option value="2" <?= selectUser2($level) ?>>Supervisor</option>
                                    <option value="3" <?= selectUser3($level) ?>>Operator</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="address">Address</label>
                                <textarea name="address" id="address" cols="" rows="3" class="form-control" 
                                placeholder="Masukan Alamat Lengkap" required><?= $user['address'] ?></textarea>
                            </div>
                        </div>
                        <div class="col-lg-4 text-center">
                            <input type="hidden" name="oldimg" value="<?= $user['foto'] ?>">
                            <img src="<?= $main_url ?>asset/image/<?= $user['foto'] ?>" class="profile-user-img img-circle mb-3" alt="">
                            <input type="file" class="form-control" name="foto">
                            <span class="text-sm">Type file gambar JPG | PNG | GIF</span>
                            <span class="text-sm">Width = Height</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button type="submit" name="koreksi" class="btn btn-primary btn-sm float-right"><i class="fas fa-save"></i> Koreksi</button>
                        <button type="reset" class="btn btn-danger btn-sm float-right mr-1"><i class="fas fa-times"></i> Reset</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    </section>

<?php

require "../template/footer.php";

?>