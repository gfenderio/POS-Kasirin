<body class="hold-transition sidebar-mini">
<div class="wrapper">
  <!-- Navbar -->
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
      </li>
    </ul>
    <!-- Right navbar links -->
      <ul class="navbar-nav ml-auto">
        <li class="nav-item dropdown">
          <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">
            <?= userLogin()['username'] ?><i class="fas fa-user-cog ml-2"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-right text-center">
            <a href="<?= $main_url ?>auth/change-password.php" class="dropdown-item">
              Ganti Password <i class="fas fa-key"></i>
            </a>
            <div class="dropdown-divider"></div>
            <a href="<?= $main_url ?>auth/logout.php" class="dropdown-item">
              Log Out <i class="fas fa-sign-out-alt"></i>
            </a>
            </div>
      </li>
    </ul>
  </nav>
  <!-- /.navbar -->