</div>
  <!-- /.content-wrapper -->

  <!-- Control Sidebar -->
  <aside class="control-sidebar control-sidebar-dark">
    <!-- Control sidebar content goes here -->
  </aside>
  <!-- /.control-sidebar -->

  <!-- Main Footer -->
  <footer class="main-footer">
    <strong>Copyright &copy; 2025 <span class="text-info">DiKasirIn</span></strong>
    All rights reserved.
    <div class="float-right d-none d-sm-inline-block">
      <b>Version</b> 1.0.0
    </div>
  </footer>
</div>
<!-- ./wrapper -->

<!-- REQUIRED SCRIPTS -->

<!-- DataTables  & Plugins -->
<script src="<?= $main_url ?>asset/AdminLTE-3.2.0/plugins/datatables/jquery.dataTables.min.js"></script>
<script src="<?= $main_url ?>asset/AdminLTE-3.2.0/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js"></script>
<script src="<?= $main_url ?>asset/AdminLTE-3.2.0/plugins/datatables-responsive/js/dataTables.responsive.min.js"></script>
<script src="<?= $main_url ?>asset/AdminLTE-3.2.0/plugins/datatables-responsive/js/responsive.bootstrap4.min.js"></script>
<script src="<?= $main_url ?>asset/AdminLTE-3.2.0/plugins/datatables-buttons/js/dataTables.buttons.min.js"></script>
<!-- Bootstrap -->
<script src="<?= $main_url ?>asset/AdminLTE-3.2.0/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- AdminLTE -->
<script src="<?= $main_url ?>asset/AdminLTE-3.2.0/dist/js/adminlte.js"></script>

<!-- OPTIONAL SCRIPTS -->
<script src="<?= $main_url ?>asset/AdminLTE-3.2.0/plugins/chart.js/Chart.min.js"></script>
<script>
  $(function () {
    $("#tblData").DataTable({
      "responsive": true,
      "lengthChange": false,
      "autoWidth": false,
      "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
    }).buttons().container().appendTo('#tblData_wrapper .col-md-6:eq(0)');
  });
</script>
</body>
</html>