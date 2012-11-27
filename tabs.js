var tabBar;
var tabs = [];
var selectedTab;

function output(tab, string)
{
  var shouldScroll = outputArea.scrollHeight - outputArea.scrollTop < 616;
  
  tab.body.innerHTML += string + "<br />";
  
  if(tab.selected && shouldScroll)
    outputArea.scrollTop = outputArea.scrollHeight;
}
function addTab(title)
{
  var tab = {};
  
  tab.body = document.createElement("div");
  
  tab.list = document.createElement("ul");
  tab.subTabs = [];
  
  tab.body.className = "tab";
  tab.body.id = "tab" + tabs.length;
  tab.body.appendChild(tab.list);
  
  tab.link = document.createElement("a");
  tab.link.href = "#" + tab.body.id;
  tab.link.innerHTML = title;
  
  addSubTab(tab, title);
  
  tab.scrollTop = 0;
  
  // hacky and ugly, but the only way with the tabs set up like this
  tab.link.onclick = function() {
    if(selectedTab)
      selectedTab.deselect();
    
    tab.link.style.backgroundColor = "white";
    tab.body.style.display = "block";
    
    selectedTab = tab;
    selectedTab.selectedSubTab.item.click();
  }
  tab.deselect = function()
  {
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
function addSubTab(tab, title)
{
  var subtab = {};
  subtab.body = document.createElement("section");
  subtab.body.className = "subtab";
  subtab.body.id = tab.body.id + "sub" + tab.subTabs.length;
  
  subtab.item = document.createElement("a");
  subtab.item.innerHTML = title;
  subtab.item.href = "#" + subtab.body.id;
  var li = document.createElement("li");
  li.appendChild(subtab.item);
  tab.list.appendChild(li);
  
  subtab.scrollTop = 0;
  
  // hacky and ugly, but the only way with the tabs set up like this
  subtab.item.onclick = function() {
    if(tab.selectedSubTab)
      tab.selectedSubTab.deselect();
      
    subtab.item.style.backgroundColor = "white";
    subtab.body.style.display = "block";
    
    setTimeout(function() { outputArea.scrollTop = subtab.scrollTop; }, 1); // This is a horrifying piece of code, fix if possible
    
    tab.selectedSubTab = subtab;
    subtab.selected = true;
  }
  subtab.deselect = function()
  {
    subtab.scrollTop = outputArea.scrollTop;
    subtab.item.style.backgroundColor = "#bfe1ea"; // this will need to be changed if the style changes
    subtab.body.style.display = "none";
    subtab.selected = false;
  }
  
  tab.body.appendChild(subtab.body);
  
  subtab.item.click();
  
  tab.subTabs.push(subtab);
  
  return subtab;
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