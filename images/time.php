<?php

if (
	array_key_exists('directory', $_GET) &&
	array_key_exists('file', $_GET) &&
	array_key_exists('time', $_GET) &&
	array_key_exists('type', $_GET) &&
	in_array($_GET['directory'], Array('characters', 'maps')) &&
	in_array($_GET['time'], Array('33', '50', '66', '75')) &&
	in_array($_GET['type'], Array('gif', 'jpg', 'png')) &&
	preg_match('/^[\d\-\/\w]+$/', $_GET['file']) &&
	file_exists('./' . $_GET['directory'] . '/100/' . $_GET['file'] . '.' . $_GET['type'])
)
{
	$file = './' . $_GET['directory'] . '/100/' . $_GET['file'] . '.' . $_GET['type'];
	$url = './' . $_GET['directory'] . '/' . $_GET['time'] . '/' . $_GET['file'] . '.' . $_GET['type'];
	$type = Array(
		'gif' => 'gif',
		'jpg' => 'jpeg',
		'png' => 'png'
	);
	header('Content-Type: image/' . $type[$_GET['type']]);
	if (!file_exists($url))
	{
		$p = $_GET['time'] / 100;
		if ($_GET['type'] == 'gif')
			$image1 = imagecreatefromgif($file);
		else if ($_GET['type'] == 'png')
			$image1 = imagecreatefrompng($file);
		else
			$image1 = imagecreatefromjpeg($file);
		$size = getimagesize($file);
		$image2 = imagecreatetruecolor($size[0], $size[1]);
		imagecopymerge($image2, $image1, 0, 0, 0, 0, $size[0] - 1, $size[1] - 1, 100);
		$transparent = imagecolorallocate($image2, 255, 0, 255);
		imagecolortransparent($image2, $transparent);
		for ($x = 0; $x < $size[0]; $x++)
		{
			for ($y = 0; $y < $size[1]; $y++)
			{
				$rgba = imagecolorsforindex($image1, imagecolorat($image1, $x, $y)); // Array(($color >> 16) & 0xFF, ($color >> 8) & 0xFF, $color & 0xFF);
				if ($rgba['alpha'] != 127)
					imagesetpixel($image2, $x, $y, imagecolorallocate($image2, $rgba['red'] * $p, $rgba['green'] * $p, $rgba['blue'] * $p));
				else
					imagesetpixel($image2, $x, $y, $transparent);
			}
		}
		if ($_GET['type'] == 'gif')
			imagegif($image2, $url);
		else if ($_GET['type'] == 'png')
			imagepng($image2, $url);
		else
			imagejpeg($image2, $url);
		imagedestroy($image1);
		imagedestroy($image2);
		/*$image = imagecreatefromgif($file);
		$size = getimagesize($file);
		$p = $_GET['time'] / 100;
		for ($x = 0; $x < $size[0]; $x++)
		{
			for ($y = 0; $y < $size[1]; $y++)
			{
				$rgba = imagecolorsforindex($image, imagecolorat($image, $x, $y)); // Array(($color >> 16) & 0xFF, ($color >> 8) & 0xFF, $color & 0xFF);
				if ($rgba['alpha'] != 127)
					imagesetpixel($image, $x, $y, imagecolorallocate($image, $rgba['red'] * $p, $rgba['green'] * $p, $rgba['blue'] * $p));
			}
		}
		imagegif($image, $url);
		imagedestroy($image);
		*/
	}
	echo file_get_contents($url);
}
else
{
	header('Content-Language: en-us');
	header('Content-Type: text/plain; charset=utf-8');
	echo '/* 404 */';
}
?>