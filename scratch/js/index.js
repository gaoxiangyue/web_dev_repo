var $ = document.querySelectorAll.bind(document);
var div = $('div')[0];

var graph = document.getElementById("graph");
var activeElementId = '';
graph.setAttribute('active_id','');
var STATUS =  $('p')[0];

//init graph 
graph.style.width = '100vw';
graph.style.height = '100vh';
graph.style.position = 'absolute';
//graph.style.perspective = '1250px';
//graph.style.backgroundColor = '#668866';


var click = false;
var cursor = { x: 0, y: 0 };
/*********************************************************
**********************EventListener*************************
*********************************************************/
graph.onmousedown = function(e) {
	cursor.x = (e.pageX-getX(this));
    cursor.y = (e.pageY-getY(this));
    click = true;
	
	//scan to 
	var divs = graph.getElementsByTagName("div");
	var length = divs.length;
	for (var i=0;i<length;i++)
	{
		var element = divs[length-1-i];
		if (graph.getAttribute('active_id') != '')
			activeModule( document.getElementById(graph.getAttribute('active_id')), 0);
		var active = isActiveModule(element, cursor);
		if ( active)
		{
			activeModule(element, active);
			graph.setAttribute('active_id',element.id);
			return;
		}
		else 
		{
			if(i == length-1) 
				graph.setAttribute('active_id','');
		}
	}
	STATUS.innerHTML='mousedown:'+(e.pageX-getX(this))+' '+(e.pageY-getY(this));
};

graph.onmousemove = function(e) {
  if (click && graph.getAttribute('active_id') != '') {
	  //move element
	var move ={x : 0, y : 0};
	move.x = (e.pageX-getX(this)) - cursor.x;
    move.y = (e.pageY-getY(this)) - cursor.y;
	 cursor.x = (e.pageX-getX(this));
     cursor.y = (e.pageY-getY(this));
	moveModules(document.getElementById(graph.getAttribute('active_id')), move, true);

  	STATUS.innerHTML='mousemove:'+(e.pageX-getX(this))+' '+(e.pageY-getY(this));
  }
};

graph.onmouseup = function(e) {
   click = false;
	// exame attach
	examAttach(true);
	STATUS.innerHTML='mouseup:'+(e.pageX-getX(this))+' '+(e.pageY-getY(this));
	STATUS.innerHTML +='activeElementId:'+graph.getAttribute('active_id');
};

onkeydown = function(e) {
	  STATUS.innerHTML='keyup:'+(e.keyCode);
};

onkeyup = function(e) {
  STATUS.innerHTML='keyup:'+(e.keyCode);
};

graph.addEventListener('mousewheel', scroll, false);
graph.addEventListener('DOMMouseScroll', scroll, false);

function scroll(e) {
  e.preventDefault();
  var delta = (e.wheelDelta) ? e.wheelDelta : - e.detail;
  STATUS.innerHTML='scroll:'+(delta);
}

//get the obj's pos x y from Page
function getX(obj){ 
var parObj=obj; 
var left=obj.offsetLeft; 
while(parObj=parObj.offsetParent){ 
left+=parObj.offsetLeft; 
} 
return left; 
} 

function getY(obj){ 
var parObj=obj; 
var top=obj.offsetTop; 
while(parObj = parObj.offsetParent){ 
top+=parObj.offsetTop; 
} 
return top; 
} 
