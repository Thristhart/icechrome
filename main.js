var outputArea;

var networks = [];
function connect(host, port, profile) {
  var network = {};
  network.tab = addTab(host);
  network.serverTab = network.tab.subTabs[0];
  
  network.client = new IRC(host, port, profile);
  network.client.connect();

  network.client.registerEvent(UNHANDLED_EVENT, function(data) { 
    if(data.command.substr(0, 3) == "ERR")
      error(network, data);
    else if(data.command.substr(0, 3) == "RPL")
      notice(network, data);
    else
      print(network.serverTab, data.command + " " + data.parameters.join(" "));
  });
  
  networks.push(network);
}

function notice(network, data)
{
  print(network.serverTab, data.parameters.join(" "));
}

function error(network, data)
{
  output(network.serverTab, "<span class='error'>" + data.command + ": " + data.parameters.join(" "));
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