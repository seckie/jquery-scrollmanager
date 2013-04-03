# jQuery-scrollmanager

This is a jQuery plugin that provides some scroll controlling.

- highlighting scroll trigger/target elements
- general smooth scrolling.

## Required Framework

- [jQuery](http://jquery.com/) (jQuery 1.7 or later)

## Demos

- http://likealunatic.jp/demo/jquery-scrollmanager/
- http://likealunatic.jp/demo/jquery-scrollmanager/index_vt.html
- http://likealunatic.jp/demo/jquery-scrollmanager/index_hr.html

## Usage

Load this script after jquery.js,  and call "scrollmanager" method when document is ready.

	<script src="/js/jquery.js"></script>
	<script src="/js/jquery.scrollmanager.js"></script>
	<script>
	$(function() {
		$('a[href^="#"]').scrollmanager({
			// some options...
			horizontal: false
		});
	});
	</script>

Selector must be "A" elements that has hash anchor to specific element id.
Attribute selector (like this:'a[href^="#"]') is convenient to select such "A" elements.

## Options

<table border="1">
<colgroup span="1" class="colh">
<colgroup span="1" class="colh">
<colgroup span="1" class="cold">
<thead>
<tr>
<th>Option name</th>
<th>Default value</th>
<th>Note</th>
</tr>
</thead>
<tbody>
<tr>
<td>vertical</td>
<td>true</td>
<td>Whether controlling vertical scrolling or not. If you set this option to false, it'll be like this <a href="http://likealunatic.jp/demo/jquery-scrollmanager/index_hr.html">demo</a>.</td></td>
</tr>
<tr>
<td>horizontal</td>
<td>true</td>
<td>Whether controlling horizontal scrolling or not. If you set this option to false, it'll be like this <a href="http://likealunatic.jp/demo/jquery-scrollmanager/index_vt.html">demo</a>.</td>
</tr>
<tr>
<td>className</td>
<td>"on"</td>
<td>This will be added to the trigger/target elements to highlight.</td>
</tr>
<tr>
<td>easing</td>
<td>"swing"</td>
<td>This will be passed to jQuery "<a href="http://api.jquery.com/animate/">animate()</a>" method option.</td>
</tr>
<tr>
<td>duration</td>
<td>750</td>
<td>This will be passed to jQuery "<a href="http://api.jquery.com/animate/">animate()</a>" method option.</td>
</tr>
<tr>
<td>delay</td>
<td>500</td>
<td>Delay of highlighting after scrolling. It's unit is millisecond.</td>
</tr>
</tbody>
</table>

## Notes

Detection of highlighting depends on the center position of screen. When the position comes in the target area, the target/the connected trigger will be highlighted.

