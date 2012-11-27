var outputArea;

var networks = [];
function connect(host, port, profile) {
  var network = {};
  network.tab = addTab(host);
  network.serverTab = network.tab.subTabs[0];
  
  network.client = new IRC(host, port, profile);
  network.client.connect();

  network.client.registerEvent("NOTICE", function(data) { notice(network, data) });
  network.client.registerEvent("RPL_WELCOME", function(data) { notice(network, data) });
  network.client.registerEvent("RPL_YOURHOST", function(data) { notice(network, data) });
  network.client.registerEvent("RPL_CREATED", function(data) { notice(network, data) });
  network.client.registerEvent("RPL_MYINFO", function(data) { });
  network.client.registerEvent("RPL_ISUPPORT", function(data) { });
  network.client.registerEvent("RPL_MOTD", function(data) { notice(network, data) });
  network.client.registerEvent(UNHANDLED_EVENT, function(data) { output(network.serverTab, data.command + " " + data.parameters.join(" ")) });
  
  networks.push(network);
}

function notice(network, data)
{
  output(network.serverTab, "<b>" + data.parameters[data.parameters.length - 1] + "</b>");
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