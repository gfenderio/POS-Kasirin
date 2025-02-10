<?php

session_start();
if (!isset($_SESSION["ssLogin"])) {
  header("Location: {$main_url}auth/login.php");
  exit();
}

require "../config/config.php";
require "../config/function.php";
require "../module/mode-password.php";

$title = "Ganti Password - POS Dikasirin";
require "../template/header.php";
require "../template/navbar.php";
require "../template/sidebar.php";

// update password
if (isset($_POST["btnSave"])) {
    if (update($_POST) > 0) {
        echo "<script>
            alert('Password Berhasil Diperbarui');
            document.location='?msg=ok';
        </script>";
    }
}

if (isset($_GET["msg"])) {
    if ($_GET["msg"]) {
       $msg = $_GET["msg"];
    } else {
       $msg = "";
    }
} else {
    $msg = "";
}

$alert1 = "<small class='text-danger pl-2 font-italic'>Password Baru dan Konfirmasi Password Baru Tidak Sama</small>";
$alert2 = "<small class='text-danger pl-2 font-italic'>Password Tidak Sama</small>";

?>

<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Password</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="<?= $main_url ?>dashboard.php">Halaman Utama</a></li>
              <li class="breadcrumb-item active">Password</li>
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
                <h3 class="card-title"><i class="fa-solid fa-key fa-sm"></i> Ganti Password</h3>
                <button type="submit" name="btnSave" class="btn btn-sm btn-primary float-right"><i class="fa-solid fa-save fa-sm"></i> Simpan</button>
                <button type="reset" class="btn btn-sm btn-danger float-right mr-2"><i class="fa-solid fa-undo fa-sm"></i> Reset</button>
            </div>
            <div class="card-body">
                <div class="col-lg-8 mb-3">
                    <label for="password">Password Lama</label>
                    <input type="password" name="curPass" id="CurPass" class="form-control" 
                    placeholder="Masukan Password Anda Disini" required>
                    <?php if ($msg == "err2") echo $alert2; ?>
                </div>
                    <div class="form-group">
                        <label for="password">Password Baru</label>
                        <input type="password" name="newPass" id="newPass" class="form-control" 
                        placeholder="Masukan Password Baru Anda Disini" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Konfirmasi Password Baru</label>
                        <input type="password" name="confPass" id="confPass" class="form-control" 
                        placeholder="Masukan Kembali Password Baru Anda Disini" required>
                        <?php if ($msg == "err1") echo $alert1; ?>
                <div class="form-group">

                </div>
</section>

<?php

require "../template/footer.php";

?>