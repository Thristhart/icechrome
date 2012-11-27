function doStyleMagic()
{
  outputArea.onmouseover = function() {outputArea.style.overflowY = "scroll" }
  outputArea.onmouseout = function() {outputArea.style.overflowY = "hidden" }
}