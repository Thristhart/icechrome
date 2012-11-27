chrome.app.runtime.onLaunched.addListener(function()
{
	chrome.app.window.create('main.html', {
		width: 800,
		height: 600,
		minWidth: 800,
		minHeight: 600,
		left: 100,
		top: 100,
		type: 'shell',
    frame: 'none'
	});
});

chrome.runtime.onInstalled.addListener(function() { 
  chrome.storage.local.set({name: "Thrist"}, function() { });
});
chrome.runtime.onSuspend.addListener(function() { 
  console.log("Clean up on aisle me!");
});