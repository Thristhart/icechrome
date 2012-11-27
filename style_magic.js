function doStyleMagic()
{
  
  setTimeout(function() {
    document.getElementById("titlebar").style.height = "30px";
    var t = document.getElementById("titlebarText");
    
    t.style.paddingTop = "7px";
    t.style.paddingLeft = "7px";
    t.style.display = "block";
    t.style.fontWeight = "bold";
  }, 1) // WTF? this only works with a timeout
}