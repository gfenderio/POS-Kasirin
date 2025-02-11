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

$generator = new BarcodeGeneratorPNG();
$widthFactor = 1; // Reduced from 2
$height = 40;     // Reduced height for more compact layout
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Print Barcode</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            margin: 0;
            padding: 0;
            background: white;
        }
        
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
        }
        
        .barcode-container {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            width: 100%;
            margin: 0;
            page-break-inside: avoid;
        }
        
        .barcode {
            background: white;
            border-right: 1px dashed #999;
            border-bottom: 1px dashed #999;
            padding: 3px;
            text-align: center;
            margin: 0;
        }

        .barcode:nth-child(5n) {
            border-right: none;
        }

        .store-info {
            margin-bottom: 2px;
            padding-bottom: 2px;
            border-bottom: 1px dotted #ccc;
        }

        .store-name {
            font-weight: bold;
            font-size: 8px;
        }

        .store-address {
            font-size: 6px;
            color: #666;
            line-height: 1;
        }

        .barcode-name {
            font-size: 9px;
            font-weight: bold;
            margin: 2px 0;
        }

        .barcode-number {
            font-size: 8px;
            color: #666;
            margin: 2px 0;
        }

        .price {
            font-weight: bold;
            color: #e74c3c;
            font-size: 10px;
            margin-top: 2px;
        }

        .barcode img {
            max-width: 100%;
            height: auto;
            margin: 2px 0;
        }

        @media print {
            @page {
                size: A4 portrait;
                margin: 0;
            }
            
            html, body {
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
            }
            
            .barcode-container {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
            }

            .barcode {
                page-break-inside: avoid;
                border-right: 1px dashed #999 !important;
                border-bottom: 1px dashed #999 !important;
            }

            .barcode:nth-child(5n) {
                border-right: none !important;
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
                    <div class="store-address">World Trade Center Twin Tower<br>New York</div>
                </div>
                <div class="barcode-name"><?= htmlspecialchars($namaBarang) ?></div>
                <?php
                    try {
                        $barcodeData = $generator->getBarcode(
                            $barcode,
                            $generator::TYPE_CODE_128,
                            $widthFactor,
                            $height
                        );
                        $barcodeBase64 = base64_encode($barcodeData);
                ?>
                        <img src="data:image/png;base64,<?= $barcodeBase64 ?>" alt="Barcode">
                        <div class="barcode-number"><?= htmlspecialchars($barcode) ?></div>
                        <div class="price">Rp <?= htmlspecialchars($harga) ?></div>
                <?php
                    } catch (Exception $e) {
                        die('Error generating barcode: ' . htmlspecialchars($e->getMessage()));
                    }
                ?>
            </div>
        <?php endfor; ?>
    </div>
</body>
</html>