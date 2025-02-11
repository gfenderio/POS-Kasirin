<?php
session_start();

if (!isset($_SESSION["ssLogin"])) {
    $main_url = "http://yourdomain.com/";
    header("Location: {$main_url}auth/login.php");
    exit();
}

require '../vendor/autoload.php';

use Picqer\Barcode\BarcodeGeneratorPNG;

$barcode = isset($_GET['barcode']) ? $_GET['barcode'] : '';
$jmlCetak = isset($_GET['jmlCetak']) ? intval($_GET['jmlCetak']) : 1;
$namaBarang = isset($_GET['nama']) ? $_GET['nama'] : '';
$harga = isset($_GET['harga']) ? number_format($_GET['harga'], 0, ',', '.') : '';

// Create new barcode generator instance with specific parameters
$generator = new BarcodeGeneratorPNG();
$widthFactor = 2; // Width of a single bar
$height = 100;    // Height of the barcode
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Print Barcode</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .barcode-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            padding: 20px;
        }
        .barcode {
            border: 1px solid #000;
            padding: 10px;
            text-align: center;
            width: 200px;
        }
        .barcode img {
            max-width: 100%;
            height: auto;
        }
        .barcode-name {
            font-size: 14px;
            margin-top: 5px;
            font-weight: bold;
        }
        .store-info {
            margin-bottom: 10px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }
        .store-name {
            font-weight: bold;
            font-size: 16px;
        }
        .store-address {
            font-size: 12px;
            color: #666;
        }
        .price {
            font-weight: bold;
            color: #e44d26;
            margin-top: 5px;
            font-size: 16px;
        }

        @media print {
            body {
                margin: 0;
                padding: 10px;
            }
            .barcode {
                page-break-inside: avoid;
                margin-bottom: 10px;
            }
            @page {
                size: auto;
                margin: 0mm;
            }
        }
    </style>
</head>
<body onload="window.print();">
    <div class="barcode-container">
        <?php for ($i = 0; $i < $jmlCetak; $i++): ?>
            <div class="barcode">
                <div class="store-info">
                    <div class="store-name">9/11 Mart</div>
                    <div class="store-address">Twin Tower World Trade Center</div>
                </div>
                <div class="barcode-name"><?= htmlspecialchars($namaBarang) ?></div>
                <?php
                    try {
                        // Generate barcode with specific dimensions
                        $barcodeData = $generator->getBarcode(
                            $barcode,
                            $generator::TYPE_CODE_128,
                            $widthFactor,
                            $height
                        );
                        $barcodeBase64 = base64_encode($barcodeData);
                    } catch (Exception $e) {
                        die('Error generating barcode: ' . htmlspecialchars($e->getMessage()));
                    }
                ?>
                <img src="data:image/png;base64,<?= $barcodeBase64 ?>" alt="Barcode">
                <div><?= htmlspecialchars($barcode) ?></div>
                <?php if ($harga): ?>
                    <div class="price">Rp <?= htmlspecialchars($harga) ?></div>
                <?php endif; ?>
            </div>
        <?php endfor; ?>
    </div>
</body>
</html>