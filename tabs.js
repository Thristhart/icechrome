var tabBar;
var tabs = [];
var selectedTab;

function addTab(title)
{
  var tab = {};
  
  tab.body = document.createElement("section");
  tab.body.className = "tab";
  tab.body.id = "tab" + tabs.length;
  
  tab.link = document.createElement("a");
  tab.link.href = "#" + tab.body.id;
  tab.link.innerHTML = title;
  
  
  
  tab.scrollTop = 0;
  
  // hacky and ugly, but the only way with the tabs set up like this
  tab.link.onclick = function() {
    if(selectedTab)
      selectedTab.deselect();
      
    tab.link.style.backgroundColor = "white";
    tab.body.style.display = "block";
    
    setTimeout(function() { outputArea.scrollTop = tab.scrollTop; }, 1); // This is a horrifying piece of code, fix if possible
    
    selectedTab = tab;
  }
  tab.deselect = function()
  {
    tab.scrollTop = outputArea.scrollTop;
    tab.link.style.backgroundColor = "#bfe1ea"; // this will need to be changed if the style changes
    tab.body.style.display = "none";
  }
  
  
  tabs.push(tab);
  calculateTabWidths();
  
  tabBar.appendChild(tab.link);
  outputArea.appendChild(tab.body);
  
  tab.link.click();
  
  return tab;
}
function calculateTabWidths()
{
  var newWidth = Math.floor(99 / tabs.length);
  if(newWidth > 17)
    newWidth = 17;
  newWidth += "%";
  for(var i = 0; i < tabs.length; i++)
  {
    tabs[i].link.style.width = newWidth;
  }
}