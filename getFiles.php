<?php
$dir    = 'images';
echo json_encode(array(
    'files' => scandir($dir),
    'folder' => $dir
));

