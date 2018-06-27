<?php
header('Content-Language: en-us');
header('Content-Type: text/javascript');
if (array_key_exists('QUERY_STRING', $_SERVER))
{
	parse_str($_SERVER['QUERY_STRING'], $get);
	$_GET = array_merge($_GET, $get);
	unset($get);
}
if (array_key_exists('files', $_GET))
{
	$dir = explode('/', dirname($_SERVER['PHP_SELF']));
	array_pop($dir);
	$dir = '/^http:\/\/127\.0\.0\.1' . implode('\\/', $dir) . '/';
	$files = explode(',', $_GET['files']);
	$count_files = count($files);
	$sizes = Array();
	for ($x = 0; $x < $count_files; $x++)
	{
		if (strpos($files[$x], '..') === false)
		{
			if (file_exists('../' . preg_replace($dir, '', $files[$x])))
				$sizes[$files[$x]] = filesize('../' . preg_replace($dir, '', $files[$x]));

			// dynamic files ahoy!
			else if (file_exists('../' . preg_replace('/\/(?:33|50|66|75)\//', '/100/', preg_replace($dir, '', $files[$x]))))
				$sizes[$files[$x]] = filesize('../' . preg_replace('/\/(?:33|50|66|75)\//', '/100/', preg_replace($dir, '', $files[$x])));
		}
	}
	asort($sizes);
	$temp = Array();
	foreach ($sizes as $file => $size)
		array_push($temp, '["' . $file . '",' . $size . ']');
	echo 'GAME.preloader.init([', implode(',', $temp), ']);';
}
else
	echo '/* 404 */';
?>