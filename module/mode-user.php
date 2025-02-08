<?php
function insert($data) {
    global $koneksi;
    
    $username   = strtolower(mysqli_real_escape_string($koneksi, $data["username"]));
    $fullname   = mysqli_real_escape_string($koneksi, $data["fullname"]);
    $password   = mysqli_real_escape_string($koneksi, $data["password"]);
    $password2  = mysqli_real_escape_string($koneksi, $data["password2"]);
    $address    = mysqli_real_escape_string($koneksi, $data["address"]);
    $level      = mysqli_real_escape_string($koneksi, $data["level"]);
    $gambar     = mysqli_real_escape_string($koneksi, $_FILES["foto"] ['name']);

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
        $gambar = uploadimg();
    }   else {
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


?>