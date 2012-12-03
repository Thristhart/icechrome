var outputArea;

var networks = [];
function connect(host, port, profile) {
  var network = {};
  network.tab = addTab(host);
  network.tab.network = network;
  network.serverTab = network.tab.subTabs[0];
  
  network.client = new IRC(host, port, profile);
  network.client.connect();
  
  network.client.registerEvent("PRIVMSG", function(data) {
    message(network, data);
  });

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

function message(network, data)
{
  var sender = data.prefix;
  var nick = data.prefix.split("!")[0];
  var target = data.target;
  if(target == network.client.profile.nick)
    target = nick;
  var subtab = getSubTab(selectedTab, target);
  print(subtab, "<"  + nick + "> " + data.parameters.join(" "));

}

function close_window()
{
  for(var i = 0; i < networks.length; i++)
    networks[i].client.quit();
  window.close();
}


var command_regex = /\/[A-Za-z]+( |$)/
function oninput(ev)
{
  var iBox = ev.srcElement.children[0];
  var message = iBox.value;
  
  
  if(message.search(command_regex) != -1) // a command
  {
    split = message.split(" ");
    command = split[0].trim().slice(1);
    params = split.slice(1);
    
    if(known_commands[command])
      known_commands[command](params);
    else
      unknown_command(command, params);
    output(selectedTab.selectedSubTab, command + ": " + params);
  }
  else
  {
    known_commands.msg([selectedTab.selectedSubTab.target, message]);
  }
  message.replace(/\/\//g, "/");
  iBox.value = "";
  return false;
}

var known_commands = {};

known_commands.join = function(params)
{
  selectedTab.network.client.join(params);
  selectedTab.network.client.expectResponse("JOIN", function(event) {
    var tab = getSubTab(selectedTab, event.data.target);
    print(tab, "Joined " + event.data.target);
  })
}
known_commands.privmsg = known_commands.msg = function(params)
{
  message(selectedTab.network, {prefix:selectedTab.network.client.profile.nick, target:params[0], parameters:params.slice(1)});
  selectedTab.network.client.privmsg(params[0], params.slice(1).join(" "));
}

unknown_command = function(command, params)
{
  error(selectedTab.network, {parameters:"Unknown command: " + command + " (" + params + ")"});
}

window.onload = function()
{
  outputArea = document.getElementById("output");
  tabBar = document.getElementById("tabBar");
  
  doStyleMagic();
  
  document.getElementById("closeWindow").onclick = close_window;
  document.getElementById("input").onsubmit = oninput;
  
  connect("irc.freenode.net", 6667, {nick: "thristhart", username: "thristhart", hostname: "scylla", realname: "Tom Shea", quit_message: "This is IceChrome's default quit message"});
}