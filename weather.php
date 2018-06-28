<?php
header('Content-Language: en-us');
header('Content-Type: text/plain; charset=utf-8');
$rss = new DOMDocument();
$rss->load(
	'http://api.wxbug.net/getLiveCompactWeatherRSS.aspx?ACode=A1581001812&zipCode=' .
	(array_key_exists('zip', $_GET) && preg_match('/^\d{5}$/', $_GET['zip']) ? $_GET['zip'] : 90210)
);
$weather = $rss->getElementsByTagName('current-condition')->item(0);
$code = $weather->getAttribute('icon');
preg_match('/cond(\d+)\.gif$/', $code, $code);
$code = $code[1];
$weather = $weather->nodeValue;
if ($weather == 'Rain Showers')
	$weather = 'rain';
else if ($weather == 'Thunderstorms')
	$weather = 'thunder';
else
{
	preg_match('/^(?:Mostly |Partly )?(Clear|Cloudy|Sunny)$/', $weather, $weather);
	$weather = strtolower($weather[1]);
}
echo $weather, "\r\n", $code;
?>