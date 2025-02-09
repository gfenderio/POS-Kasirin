<?php

function update($data){
    global $koneksi;

    $curPass = trim(mysqli_real_escape_string($koneksi, $_POST['curPass']));
    $newPass = trim(mysqli_real_escape_string($koneksi, $_POST['newPass']));
    $confPass = trim(mysqli_real_escape_string($koneksi, $_POST['confPass']));
    $userActive = userLogin()['username'];

    if ($newPass !== $confPass){
        echo "<script>
            alert('Password Gagal Diperbarui, Password Baru dan Konfirmasi Password Baru Tidak Sama'); 
            document.location='?msg=err1';
        </script>";
        return false; // Prevent further execution
    }

    if (!password_verify($curPass, userLogin()['password'])){
        echo "<script>
            alert('Password Gagal Diperbarui, Password Lama Salah');
            document.location='?msg=err2';
        </script>";
        return false; // Prevent further execution
    }

    // Update the password in the database
    $pass = password_hash($newPass, PASSWORD_DEFAULT);
    mysqli_query($koneksi, "UPDATE tbl_user SET password = '$pass' WHERE username = '$userActive'");
    return mysqli_affected_rows($koneksi);
}
?>