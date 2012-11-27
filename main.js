var outputArea;
function output(tab, string)
{
  tab.body.innerHTML += string + "<br />";
}

function connect(host, port, profile) {
  var tab = addTab(host);
  
  var client = new IRC(host, port, profile);
  client.connect();

  client.registerEvent("NOTICE", function(data) { output(tab, data.parameters) });
}



window.onload = function()
{
  outputArea = document.getElementById("output");
  tabBar = document.getElementById("tabBar");
  doStyleMagic();
  connect("irc.freenode.net", 6667, {nick: "thristhart", username: "thristhart", hostname: "scylla", realname: "Tom Shea"});
}