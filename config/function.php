<?php

if (!function_exists('uploadimg')) {
    function uploadimg($oldImg, $id){
        $namafile = $_FILES['foto']['name'];
        $ukuran   = $_FILES['foto']['size'];
        $tmpfile  = $_FILES['foto']['tmp_name'];
        $error    = $_FILES['foto']['error'];

        // Check if no file is uploaded
        if ($error === 4) {
            return $oldImg ? $oldImg : 'no_product.png';
        }

        // Validasi file gambar yang bisa diupload
        $ekstensivalid = ['jpg', 'jpeg', 'png', 'gif'];
        $ekstensigambar = explode('.', $namafile);
        $ekstensigambar = strtolower(end($ekstensigambar));
        
        if (!in_array($ekstensigambar, $ekstensivalid)) {
            echo "<script>
            alert('Yang anda upload bukan file gambar');
            </script>";
            return false;
        }

        // Validasi ukuran gambar maksimal 1MB
        if ($ukuran > 1000000) {
            echo "<script>
            alert('Ukuran gambar terlalu besar');
            </script>";
            return false;
        }

        $namafileBaru = $id . '-' . uniqid() . '.' . $ekstensigambar;

        move_uploaded_file($tmpfile, '../asset/image/' . $namafileBaru);

        // Delete old image if it exists and is not the default image
        if ($oldImg && $oldImg !== 'no_product.png') {
            unlink('../asset/image/' . $oldImg);
        }

        return $namafileBaru;
    }
}

function getData($query) {
    global $koneksi;
    $result = mysqli_query($koneksi, $query);
    if (!$result) {
        // Log the error message
        error_log("Error: " . mysqli_error($koneksi));
        return false;
    }
    $rows = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
    }
    return $rows;
}

function userLogin() {
    $userActive = $_SESSION["ssUser"];
    $dataUser = getData("SELECT * FROM tbl_user WHERE username = '$userActive'")[0];
    return $dataUser;
}

function userMenu() {
    $uri_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri_segments = explode('/', $uri_path);
    $menu = $uri_segments[2];
    return $menu;
}

function menuHome(){
    if (userMenu() == 'dashboard.php') {
        $result = 'active';
    } else {
        $result = null;
    }
    return $result;
}

function menuSetting(){
    if (userMenu() == 'user') {
        $result = 'menu-is-opening menu-open';
    } else {
        $result = null;
    }
    return $result;
}

function menuUser(){
    if (userMenu() == 'user') {
        $result = 'active';
    } else {
        $result = null;
    }
    return $result;
}

function menuSupplier(){
    if (userMenu() == 'supplier') {
        $result = 'active';
    } else {
        $result = null;
    }
    return $result;
}

function menuCustomer(){
    if (userMenu() == 'customer') {
        $result = 'active';
    } else {
        $result = null;
    }
    return $result;
}

function menuBarang(){
    if (userMenu() == 'barang') {
        $result = 'active';
    } else {
        $result = null;
    }
    return $result;
}

function menuMaster(){
    if (userMenu() == 'supplier' || userMenu() == 'customer' or userMenu() == 'barang') {
        $result = 'menu-is-opening menu-open';
    } else {
        $result = null;
    }
    return $result;
}
?>