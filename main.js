var ouputArea;
function output(string)
{
  outputArea.innerHTML += "<br />" + string;
}

function connect(host, port, profile) {
  var client = new IRC(host, port, profile);
  client.connect();

  client.registerEvent("NOTICE", function(data) { output(data.parameters) });
}




window.onload = function()
{
  outputArea = document.getElementById("output");
  connect("irc.freenode.net", 6667, {nick: "thristhart", username: "thristhart", hostname: "scylla", realname: "Tom Shea"});
}