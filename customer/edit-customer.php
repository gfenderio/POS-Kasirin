<?php

require "../config/config.php";

session_start();
if (!isset($_SESSION["ssLogin"])) {
  header("Location: {$main_url}auth/login.php");
  exit();
}

require "../config/function.php";
require "../module/mode-customer.php";

$title = "Edit Customer - Dikasirin POS";
require "../template/header.php";
require "../template/navbar.php";
require "../template/sidebar.php";

// Jalankan fungsi update data
$alert = '';
if (isset($_POST["update"])) {
    if (updateCustomer($_POST)){
        $alert = "<div class='alert alert-success alert-dismissible fade show' role='alert'>
                    <i class='icon fas fa-check'></i> Customer berhasil diupdate
                    <button type='button' class='close' data-dismiss='alert' aria-label='Close'>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                  </div>";
    } else {
        $alert = "<div class='alert alert-danger alert-dismissible fade show' role='alert'>
                    <i class='icon fas fa-times'></i> Customer gagal diupdate
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

$id = $_GET["id"];

$sqlEdit = "SELECT * FROM tbl_customer WHERE id_customer = $id";
$customer = getData($sqlEdit);

// Check if the query was successful
if (!$customer) {
    die("Error: " . mysqli_error($koneksi));
}

$customer = $customer[0];

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
              <li class="breadcrumb-item active">Edit Customer</li>
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
                <h3 class="card-title"><i class="fas fa-user-plus fa-sm" style="margin-right: 8px;"></i> Edit Customer</h3>
                <button type="submit" name="update" class="btn btn-primary btn-sm float-right"><i class="fas fa-save"></i> Update</button>
                <button type="reset" class="btn btn-danger btn-sm float-right mr-1"><i class="fas fa-times"></i> Reset</button>
            </div>
            <div class="card-body">
                <?php if ($alert != '') { 
                    echo $alert;
                }?>
                <div class="row">
                    <input type="hidden" name="id_customer" value="<?=$customer['id_customer']?>">
                    <div class="col-lg-8 mb-3">
                        <div class="form-group">
                            <label for="nama">Nama</label>
                            <input type="text" name="nama" class="form-control" id="nama" 
                            placeholder="Nama Customer" autofocus value="<?=$customer['nama']?>" required>
                        </div>
                        <div class="form-group">
                            <label for="telpon">Telpon</label>
                            <input type="text" name="telpon" class="form-control" id="telpon" 
                            placeholder="No. Telpon customer" pattern="[0-9]{5,}" value="<?=$customer['telpon']?>" required>
                        </div>    
                        <div class="form-group">
                            <label for="deskripsi">Deskripsi</label>
                            <input type="text" name="deskripsi" class="form-control" 
                            placeholder="Keterangan Customer" value="<?=$customer['deskripsi']?>" required>
                        </div>                    
                        <div class="form-group">
                            <label for="alamat">Alamat</label>
                            <textarea name="alamat" id="alamat" rows="3" class="form-control" 
                            placeholder="Masukan Alamat Customer" required><?=$customer['alamat']?></textarea>
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