<?php

function uploadimg($url = null){
    $namafile = $_FILES['foto']['name'];
    $ukuran   = $_FILES['foto']['size'];
    $tmpfile  = $_FILES['foto']['tmp_name'];

    // validasi file gambar yang bisa diupload
    $ekstensivalid = ['jpg', 'jpeg', 'png', 'gif'];
    $ekstensigambar = explode('.', $namafile);
    $ekstensigambar = strtolower(end($ekstensigambar));
    
    if(!in_array($ekstensigambar, $ekstensivalid)){
        if($url != null){
            echo "<script>
            alert('Yang anda upload bukan file gambar'); document.location.href = '$url';
            </script>";
            die();
        } else {
            echo "<script>
            alert('Yang anda upload bukan file gambar');
            </script>";
            return false;
        }
    }

    // validasi ukuran gambar maksimal 1MB
    if($ukuran > 1000000){
        if($url != null){
            echo "<script>
            alert('Ukuran gambar terlalu besar'); document.location.href = '$url';
            </script>";
            die();
        } else {
            echo "<script>
            alert('Ukuran gambar terlalu besar');
            </script>";
            return false;
        }
    }

    $namafileBaru = rand(10, 1000) . '-' . $namafile;
    move_uploaded_file($tmpfile, '../asset/image/' . $namafileBaru);
    return $namafileBaru;
}

function getData($sql){
    global $koneksi;

    $result = mysqli_query($koneksi, $sql);
    $rows = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
    }
    return $rows;
}

?>