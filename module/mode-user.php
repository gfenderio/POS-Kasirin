<?php

if (userLogin()['level'] != '1') {
    header("Location: {$main_url}error-page.php");
    exit();
}

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION["ssLogin"])) {
    header("Location: {$main_url}auth/login.php");
    exit();
}

require_once "../config/config.php";

function insert($data) {
    global $koneksi;
    
    $username   = strtolower(mysqli_real_escape_string($koneksi, $data["username"]));
    $fullname   = mysqli_real_escape_string($koneksi, $data["fullname"]);
    $password   = mysqli_real_escape_string($koneksi, $data["password"]);
    $password2  = mysqli_real_escape_string($koneksi, $data["password2"]);
    $address    = mysqli_real_escape_string($koneksi, $data["address"]);
    $level      = mysqli_real_escape_string($koneksi, $data["level"]);
    $gambar     = mysqli_real_escape_string($koneksi, $_FILES["foto"]['name']);

    if ($password !== $password2) {
        echo "<script>
                alert('Konfirmasi password tidak sesuai');
              </script>";
        return false;
    }

    $pass = password_hash($password, PASSWORD_DEFAULT);
    $cekUsername = mysqli_query($koneksi, "SELECT username FROM tbl_user WHERE username = '$username'");
    if (mysqli_num_rows($cekUsername) > 0) {
        echo "<script>
                alert('Username sudah terdaftar');
              </script>";
        return false;
    }

    if ($gambar != null) {
        $url = "add-user.php";
        $gambar = uploadimg($url);
    } else {
        $gambar = 'default.png';
    }

    // gambar tidak sesuai validasi
    if ($gambar == '') {
        return false;
    }

    $sqlUser = "INSERT INTO tbl_user (username, fullname, password, address, level, foto) 
            VALUES ('$username', '$fullname', '$pass', '$address', '$level', '$gambar')";
    mysqli_query($koneksi, $sqlUser);

    return mysqli_affected_rows($koneksi);
}

function delete($id, $foto) {
    global $koneksi;

    $sqlDel = "DELETE FROM tbl_user WHERE userid = $id";
    mysqli_query($koneksi, $sqlDel);

    if ($foto != 'default.png') {
        unlink('../asset/image/' . $foto);
    }

    return mysqli_affected_rows($koneksi);
}

function selectUser1($level){
    return $level == '1' ? 'selected' : '';
}

function selectUser2($level){
    return $level == '2' ? 'selected' : '';
}

function selectUser3($level){
    return $level == '3' ? 'selected' : '';
}

function update($data) {
    global $koneksi;

    $iduser     = mysqli_real_escape_string($koneksi, $data["id"]);
    $username   = strtolower(mysqli_real_escape_string($koneksi, $data["username"]));
    $fullname   = mysqli_real_escape_string($koneksi, $data["fullname"]);
    $address    = mysqli_real_escape_string($koneksi, $data["address"]);
    $level      = mysqli_real_escape_string($koneksi, $data["level"]);
    $gambar     = mysqli_real_escape_string($koneksi, $_FILES["foto"]['name']);
    $fotolama   = mysqli_real_escape_string($koneksi, $data['oldimg']);

    // cek username sekarang
    $queryUsername = mysqli_query($koneksi, "SELECT username FROM tbl_user WHERE userid = $iduser");
    $dataUsername = mysqli_fetch_assoc($queryUsername);
    $curUsername = $dataUsername['username'];

    // cek username baru
    if ($username != $curUsername) {
        $newUsername = mysqli_query($koneksi, "SELECT username FROM tbl_user WHERE username = '$username'");
        if (mysqli_num_rows($newUsername) > 0) {
            echo "<script>
                alert('Username sudah terdaftar, update data user gagal');
              </script>";
            return false;
        }
    }

    // cek gambar
    if ($gambar != null) {
        $url = "data-user.php";
        if ($fotolama != 'default.png') {
            unlink('../asset/image/' . $fotolama);
        }
        $gambar = uploadimg($url);
    } else {
        $gambar = $fotolama;
    }

    mysqli_query($koneksi, "UPDATE tbl_user SET username = '$username', fullname = '$fullname', address = '$address', level = '$level', foto = '$gambar' WHERE userid = $iduser");

    return mysqli_affected_rows($koneksi);
}
?>