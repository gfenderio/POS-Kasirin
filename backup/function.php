<?php

function uploadimg(){
    $namafile = $_FILES['foto']['name'];
    $ukuran   = $_FILES['foto']['size'];
    $tmpfile  = $_FILES['foto']['tmp_name'];

    // validasi file gambar yang bisa diupload
    $ekstensivalid = ['jpg', 'jpeg', 'png', 'gif'];
    $ekstensigambar = explode('.', $namafile);
    $ekstensigambar = strtolower(end($ekstensigambar));
    
    if(!in_array($ekstensigambar, $ekstensivalid)){
        echo "<script>
                alert('Yang anda upload bukan file gambar');
              </script>";
        return false;
    }

    // validasi ukuran gambar maksimal 1MB
    if($ukuran > 1000000){
        echo "<script>
                alert('Ukuran gambar terlalu besar');
              </script>";
        return false;
    }

    $namafileBaru = rand(10, 1000) . '-' . $namafile;
    move_uploaded_file($tmpfile, '../asset/image/' . $namafileBaru);
    return $namafileBaru;
}

?>