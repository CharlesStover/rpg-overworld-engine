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
	array_key_exists('foreground', $_GET) &&
	array_key_exists('shape', $_GET) &&
	in_array($_GET['shape'], Array('corner', 'horizontal', 'stem', 'vertical')) &&
	preg_match('/^[\da-f]{6}$/', $_GET['background']) &&
	preg_match('/^[\da-f]{6}$/', $_GET['foreground'])
)
{
	header('Content-Type: image/gif');
	$url = $_GET['shape'] . '/' . $_GET['background'] . '-' . $_GET['foreground'] . '.gif';
	if (!file_exists($url))
	{
		$shape = imagecreatefromgif($_GET['shape'] . '/ffffff-000000.gif');
		$bgcolor = imagecolorexact($shape, 255, 255, 255);
		$fgcolor = imagecolorexact($shape, 0, 0, 0);
		$background = hex2rgb($_GET['background']);
		$foreground = hex2rgb($_GET['foreground']);
		if ($_GET['foreground'] == '000000')
		{
			imagecolorset($shape, $bgcolor, $background[0], $background[1], $background[2]);
			imagecolorset($shape, $fgcolor, $foreground[0], $foreground[1], $foreground[2]);
		}
		else
		{
			imagecolorset($shape, $bgcolor, $background[0], $background[1], $background[2]);
			imagecolorset($shape, $fgcolor, $foreground[0], $foreground[1], $foreground[2]);
		}
		imagegif($shape, $url);
		imagedestroy($shape);
	}
	echo file_get_contents($url);
}
else
{
	header('Content-Language: en-us');
	header('Content-Type: text/plain; charset=utf-8');
	echo '404';
}

?>