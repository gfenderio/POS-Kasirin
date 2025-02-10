<?php

require "../config/config.php";

session_start();
if (!isset($_SESSION["ssLogin"])) {
  header("Location: {$main_url}auth/login.php");
  exit();
}

require "../config/function.php";
require "../module/mode-customer.php";

$title = "Tambah Customer - Dikasirin POS";
require "../template/header.php";
require "../template/navbar.php";
require "../template/sidebar.php";

$alert = '';

if (isset($_POST["simpan"])) {
    if (insertCustomer($_POST)){
        $alert = "<div class='alert alert-success alert-dismissible fade show' role='alert'>
                    <i class='icon fas fa-check'></i> Customer berhasil ditambahkan
                    <button type='button' class='close' data-dismiss='alert' aria-label='Close'>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                  </div>";
    } else {
        $alert = "<div class='alert alert-danger alert-dismissible fade show' role='alert'>
                    <i class='icon fas fa-times'></i> Customer gagal ditambahkan
                    <button type='button' class='close' data-dismiss='alert' aria-label='Close'>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                  </div>";
        // Display the error message
        $alert .= "<div class='alert alert-danger' role='alert'>
                    Error: " . mysqli_error($koneksi) . "
                  </div>";
    }
}

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
              <li class="breadcrumb-item"><a href="<?=$main_url?>customer/data-customer.php">Customer</a></li>
              <li class="breadcrumb-item active">Tambah Customer</li>
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
                <h3 class="card-title"><i class="fas fa-user-plus fa-sm" style="margin-right: 8px;"></i> Tambah Customer</h3>
                <button type="submit" name="simpan" class="btn btn-primary btn-sm float-right"><i class="fas fa-save"></i> Simpan</button>
                <button type="reset" class="btn btn-danger btn-sm float-right mr-1"><i class="fas fa-times"></i> Reset</button>
            </div>
            <div class="card-body">
                <?php if ($alert != '') { 
                    echo $alert;
                }?>
                <div class="row">
                    <div class="col-lg-8 mb-3">
                        <div class="form-group">
                            <label for="nama">Nama</label>
                            <input type="text" name="nama" class="form-control" id="nama" 
                            placeholder="Nama Customer" autofocus autocomplete="off" required>
                        </div>
                        <div class="form-group">
                            <label for="telpon">Telpon</label>
                            <input type="text" name="telpon" class="form-control" id="telpon" placeholder="No. Telpon customer" pattern="[0-9]{5,}" required>
                        </div>    
                        <div class="form-group">
                            <label for="deskripsi">Deskripsi</label>
                            <input type="text" name="deskripsi" class="form-control" 
                            placeholder="Keterangan Customer" required>
                        </div>                    
                        <div class="form-group">
                            <label for="alamat">Alamat</label>
                            <textarea name="alamat" id="alamat" rows="3" class="form-control" 
                            placeholder="Masukan Alamat Customer" required></textarea>
                        </div>
                    </div>
                </div>
            </div>
          </form>
        </div>
      </div>
    </section>
</div>

<?php

require "../template/footer.php";

?>