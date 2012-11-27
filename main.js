var outputArea;

var networks = [];
function connect(host, port, profile) {
  var network = {};
  network.tab = addTab(host);
  network.serverTab = network.tab.subTabs[0];
  
  network.client = new IRC(host, port, profile);
  network.client.connect();

  network.client.registerEvent("NOTICE", function(data) { output(network.serverTab, data.parameters) });
  network.client.registerEvent(UNHANDLED_EVENT, function(data) { output(network.serverTab, data.parameters) });
  
  networks.push(network);
}

function close_window()
{
  window.close();
}

window.onload = function()
{
  outputArea = document.getElementById("output");
  tabBar = document.getElementById("tabBar");
  
  doStyleMagic();
  
  document.getElementById("closeWindow").onclick = close_window;
  
  connect("irc.freenode.net", 6667, {nick: "thristhart", username: "thristhart", hostname: "scylla", realname: "Tom Shea", quit_message: "This is IceChrome's default quit message"});
}