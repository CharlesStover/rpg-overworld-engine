<?php

function hex2rgb($color)
{
	$hex = '0123456789abcdef';
	$rgb = Array();
	for ($x = 0; $x < 3; $x++)
		array_push($rgb,
			stripos($hex,
				substr($color, $x * 2, 1)
			) * 16 +
			stripos($hex,
				substr($color, $x * 2 + 1, 1)
			)
		);
	return $rgb;
}

if (
	array_key_exists('background', $_GET) &&
	array_key_exists('character', $_GET) &&
	array_key_exists('height', $_GET) &&
	preg_match('/^[\da-f]{6}$/', $_GET['background']) &&
	preg_match('/^[\d\-\w]+$/', $_GET['character']) &&
	preg_match('/^\d+$/', $_GET['height']) &&
	file_exists($_GET['character'] . '.jpg')
)
{
	header('Content-Type: image/jpeg');
	$url = $_GET['character'] . '/' . $_GET['background'] . '-' . $_GET['height'] . '.jpg';
	if (!file_exists($url))
	{
		$_GET['height'] = (int) $_GET['height'];
		$character = imagecreatefromjpeg($_GET['character'] . '.jpg');
		$size = getimagesize($_GET['character'] . '.jpg');
		$size2 = Array($size[0] * $_GET['height'] / $size[1], $_GET['height']);
		$message = imagecreatetruecolor($size2[0], $size2[1]);
		imagecopyresized($message, $character, 0, 0, 0, 0, $size2[0], $size2[1], $size[0], $size[1]);
		imagedestroy($character);
		$lines = round($size2[1] / 2);
		$rgb = hex2rgb($_GET['background']);
		for ($x = 0; $x < $lines; $x++)
			imageline($message, $size2[0] - $x - 1, 0, $size2[0] - $x - 1, $size2[1] - 1, imagecolorallocatealpha($message, $rgb[0], $rgb[1], $rgb[2], round($x / $lines * 127)));
		imagejpeg($message, $url);
		imagedestroy($message);
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