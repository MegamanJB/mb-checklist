
$(document).ready(function(){
  $(".textWord").on("tap",function(){
    var word = $(this).text().trim();
    var popup = document.getElementById("optionsPopup");
    var aTag = popup.firstChild;
    aTag.text = "Translate " + word + "?";
    aTag.attributes["id"].value = word;
    //aTag.attributes["href"].value = "http://www.morfix.co.il/en/" + word;
  });
});

function translateInNewTab(id)
{
  var url = "http://www.morfix.co.il/en/" + id;
  var win = window.open(url, '_blank');
  win.focus();
}

function load()
{
  
}

function initialize() {
  /*
  var addbtn	= document.getElementById("btn_add"),
	    list	= document.getElementById("list"),
	    input	= document.getElementById("txt_input"),
	    li		= list.childNodes || null,
	    txt		= null,
	    todo	= null;

	if (localStorage.getItem('list')) {
		list.innerHTML = localStorage.getItem('list');

		var currentLi = document.getElementsByTagName("li");
		for (var i = 0; i <= currentLi.length - 1; i++) {
			currentLi[i].onclick = deleteToDo;
		}
	}

	addbtn.onclick = addToDo;
	
	input.onkeypress = function(e){
		if (!e) e = window.event;
		var keyCode = e.keyCode || e.which;
		if (keyCode == '13'){
			addToDo();
			return false;
		}
	};

	function addToDo() {
		txt = input.value;
		if (txt === "") {
			return false;
		}
		else {
			todo = document.createTextNode(txt);
			li = document.createElement("li");
			li.appendChild(todo);
			list.insertBefore(li, list.firstChild);
			input.value = "";
			localStorage.setItem('list', list.innerHTML);
			li.onclick = deleteToDo;
			return false;
		}
	}

	function deleteToDo() {
		this.parentNode.removeChild(this);
		localStorage.setItem('list', list.innerHTML);
		return false;
	}
  */
  
  
  
  load();
  
}

window.onload = initialize;