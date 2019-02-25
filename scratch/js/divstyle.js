
function addModule(){ 
	//new element
	var element = document.createElement('div');
	element.id=graph.getElementsByTagName("div").length+Date()[23];
	element.className = 'module';
	/*
	var style ={
		margin : '10px',
		width : '240px',
		height : '80px',
		backgroundColor :  '#66dd66',
		border : '2px solid #66FFFF',
		borderRadius : '8px',
		position : 'absolute',
		left : 20*graph.getElementsByTagName("div").length + 'px',
		top : 20*graph.getElementsByTagName("div").length + 'px',
	};
	element.setAttribute('style',JSON.stringify(style));
	*/
	element.style.margin ='10px';
	element.style.width = '240px';
	element.style.height = '80px';
	element.style.backgroundColor = '#66dd66';
	element.style.border = '2px solid #66FFFF';
	element.style.borderRadius = '8px';
	element.style.position = 'absolute';
	element.style.left = 20*graph.getElementsByTagName("div").length + 'px';
	element.style.top = 20*graph.getElementsByTagName("div").length + 'px';
    //attach
	var point = {x: 0, y: 0};
	var attach = {
		father : [ {x: 120, y: 0, id: '', style: 0}],
		child : [ {x: 120, y: 80, id: '' , style: 0} ,  {x: 0, y: 80, id: '', style: 0}]
	};
	var pointText = JSON.stringify(attach);
	attach = JSON.parse(pointText);
	element.setAttribute('attach',pointText);
	//element.setAttribute('attr_name','attr_value');
	//element.removeAttribute('attr_name');
	element.setAttribute('attr_class','sin');
	element.innerHTML=svgStyles[0]+element.id; 
	graph.appendChild(element);//add element
	
	//status
	var status = 'STATUS' ;
	status += '    graphDivs:'+graph.getElementsByTagName("div").length;
	status += '    attrClass:'+element.getAttribute('attr_class');
	status += '    position:'+element.style.position;
    //alert(graph.innerHTML);
	STATUS.innerHTML=element.getAttribute('attr_class'); 
}

/*********************************************************
**********************ModuleHandle*************************
*********************************************************/
//return range of module element
function rangeModule(element){
	var range ={ minx : 0, maxx : 0, miny : 0, maxy : 0};
	range.minx = parseInt(element.style.left) + parseInt(element.style.margin);
	range.maxx = range.minx + parseInt(element.style.width);
	range.miny = parseInt(element.style.top) + parseInt(element.style.margin);
	range.maxy = range.miny + parseInt(element.style.height);
	return range;
}
//return attach of module element
function attachModule(element){
	var pointText = element.getAttribute('attach');
	var attach = JSON.parse(pointText);
	return attach;
}
//style of elements in active
function activeModule(element ,active){
	if (!active)//normal
	{
		element.style.backgroundColor = '#66dd66';
		element.style.border = '2px solid #66FFFF';
	}
	else //active
	{
		element.style.backgroundColor = '#66ddFF';
		element.style.border = '2px solid #66FF66';
		graph.appendChild(element);
	}
}
//point mode in module element
function isActiveModule(element ,point){
	var tolerance = 5;
	var range = rangeModule(element);
	if ( (point.x > range.minx-tolerance && point.x < range.maxx+tolerance ) && (point.y > range.miny-tolerance&& point.y < range.maxy+tolerance ) )
	{
		return true; //in element area
	}	
	return false; //not in element area
}
//caculate attach moves element A2B
function moveAttach( element, element1, result)
{
	var move ={x:0, y:0};
	var attach = attachModule(element);
	var attach1 = attachModule(element1);
	var range = rangeModule(element);
	var range1 = rangeModule(element1);
	if(result.relation == 0)
			{
				//element1.father attach to element.child[order]
				move.x = range.minx + attach.child[result.order].x - range1.minx - attach1.father[0].x;
				move.y = range.miny + attach.child[result.order].y - range1.miny - attach1.father[0].y;
				moveModules(element1, move, true);		
				attach1.father[0].id = element.id;
				attach.child[result.order].id = element1.id;
				element.setAttribute('attach',JSON.stringify(attach));
				element1.setAttribute('attach',JSON.stringify(attach1));
			}
	else if(result.relation == 1)
			{
				//element.father attach to element1.child[order]
				move.x = range1.minx + attach1.child[result.order].x - range.minx - attach.father[0].x;
				move.y = range1.miny + attach1.child[result.order].y - range.miny - attach.father[0].y;
				moveModules(element, move, true);
				attach.father[0].id = element1.id;
				attach1.child[result.order].id = element.id;
				element.setAttribute('attach',JSON.stringify(attach));
				element1.setAttribute('attach',JSON.stringify(attach1));
			}
	else ;
	return move;
}
// exame attach activeElement with all others
function examAttach( isAttach)
{
	var result ={
	relation : -1,
	order : 0
	};
	// exame attach
	var divs = graph.getElementsByTagName("div");
	var length = divs.length;
	for (var i=0;i<length;i++)
	{
		var element = divs[i];
		if(graph.getAttribute('active_id')!='' && element.id != graph.getAttribute('active_id'))
		{
			result= modeAttach(element , document.getElementById(graph.getAttribute('active_id')));
				if(result.relation != -1)
				{
					if(isAttach)
					{
						//move attach
						moveAttach(element , document.getElementById(graph.getAttribute('active_id')), result);
					}
					else
					{
						//show attaching style============
					}
				}
		}
	}

	return result;
}
//attach mode in two module elements
function modeAttach(element ,element1){
	var result ={
		relation : -1,
		order : 0
	};
	var tolerance = 20;
	var attach = attachModule(element);
    var attach1 = attachModule(element1);
	var range = rangeModule(element);
	var range1 = rangeModule(element1);
	for( var i =0; i< attach1.father.length; i++)
		for( var j =0; j< attach.child.length; j++)
		{
			var father = attach1.father[i]; 
			var child = attach.child[j]; 
			if ( father.style ==child.style && Math.abs(range.minx + child.x - range1.minx - father.x) < tolerance && Math.abs(range.miny + child.y - range1.miny - father.y) < tolerance )
			{
				result.relation = 0; //element--->element1
				result.order = j;
				return result;
			}
		}
	for( var i =0; i< attach.father.length; i++)
		for( var j =0; j< attach1.child.length; j++)
		{
			var father = attach.father[i]; 
			var child = attach1.child[j]; 
			if ( father.style ==child.style && Math.abs(range1.minx + child.x - range.minx - father.x) < tolerance && Math.abs(range1.miny + child.y - range.miny - father.y) < tolerance )
			{
				result.relation = 1; //element1--->element
				result.order = j;
				return result;
			}
		}
	return result;
}
//move modules group in graph with steps 
function moveModules(element ,move , isSeparate){
	var attach = attachModule(element);
	var result = examAttach(false);
	//separate from his father
	if (isSeparate)
	{
		var fatherId = attach.father[0].id;
		attach.father[0].id =''; 
		element.setAttribute('attach',JSON.stringify(attach));
		if (fatherId != '' && document.getElementById(fatherId) != null)
		{
			var father = document.getElementById(fatherId);
			var fatherAttach = attachModule(father);
			fatherAttach.child[result.order].id ='';
			father.setAttribute('attach',JSON.stringify(fatherAttach));
		}
	}
	//move module and all his childs
	moveModule(element ,move);
	for( var j =0; j< attach.child.length; j++)
	 {
		 var child = attach.child[j]; 
		 if(child.id !='')
		 {
		 	var childElement =document.getElementById(child.id); 
			if (childElement != null)
		 		moveModules(childElement ,move, false);
		 }
	 }
}
//move module element in graph with steps 
function moveModule(element ,move){
	element.style.left = (parseInt(element.style.left) + move.x)+ 'px';
	element.style.top = (parseInt(element.style.top) + move.y)+ 'px';
}
//remove module element from graph
function removeModule(element){ 
	graph.removeChild(element);
}
//remove active module element from graph
function removeActiveModule(){ 
	if (graph.getAttribute('active_id') !='')
	{
		graph.removeChild(document.getElementById(graph.getAttribute('active_id')));
		graph.setAttribute('active_id','');
	}	
}
//remove all elements from graph
function removeAllModule(){ 
	graph.innerHTML='';
	/*
	var divs = graph.getElementsByTagName("div");
	var length = divs.length;
	for (var i=0;i<length;i++)
	{
		var element = divs[0];
		removeModule(element);
	}
	*/
	graph.setAttribute('active_id','');
}


//svgStyles
var svgStyles = new Array();
  svgStyles[0] = 
 ' <svg width="50%" height="50%">' +
 ' <rect height="50%" width="100%" y="0" x="0" stroke-width="1.5" stroke="#000" fill="#ff7f00" id="svg_2"/>' +
 ' </svg>' ;

