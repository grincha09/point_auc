class ImageShower {
	img;
	constructor() {
		this.img = [".png",".jpg",".gif",".jpeg"];
		this.start();
	}
	checker(message, full = true){
		let result=[];
		for (let i = 0; i < this.img.length; i++) {
			if (message.indexOf(this.img[i]) > -1) {
				result.push(1);
				break;
			}
		}
		if(!full) return result.length>0;
		if(message.indexOf("youtube.com/watch") > -1){
			result.push(2);
		}
		if(message.indexOf("youtu.be") > -1){
			result.push(3);
		}
		return result;
	}
	parse_img(message){
		let children = message.children; //берем всех детей сообщения
		for(let j = 0; j < children.length; j++) //перебираем детей
		{
			if( this.checker(children[j].innerText, false) ) //если нашли нужного только по картинкам
				if(children[j].innerText.indexOf("http") > -1)//если есть http то оставляем как есть
					children[j].innerHTML = "<span data-a-target='chat-message-text'> "+
						children[j].innerText+" </span> <img src='" + children[j].innerText +"'></img>"; //вставляем вместо ссылки картинку
				else//добавляем https
					children[j].innerHTML = "<span data-a-target='chat-message-text'> "+
						children[j].innerText+" </span> <img src='https://" + children[j].innerText +"'></img>"; //вставляем вместо ссылки картинку
		}
	}
	parse_YT(message, type){
		let YT_header;
		let beforeId;
		let afterId;
		if(	type === 2) {//если ютуб 1
			YT_header = "youtube.com";
			beforeId = "v=";
			afterId = "&";
		}
		else if (type === 3){//если ютуб 2
			YT_header = "youtu.be";
			beforeId = "e/";
			afterId = "?";
		}

		if(message.firstChild != null && message.firstChild.innerText.indexOf("!sr") == -1){ //если не реквест
			let children = message.children; //берем детей
			for(let j = 0; j < children.length; j++) //перебираем
			{
				if(children[j].innerText.indexOf(YT_header) > -1) //нашли нужного
				{
					let pos = children[j].innerText.indexOf(beforeId); // берем ссыль
					if( !(pos>-1) ) continue;
					let endpos = children[j].innerText.indexOf(afterId);  //без лишних символов
					//вставляю ссылку и табнейл
					if (endpos > -1 && endpos>pos) //если есть доп символы
						children[j].innerHTML = "<span data-a-target='chat-message-text'> "+
							children[j].innerText+" </span> <img src=' https://i.ytimg.com/vi/" +
							children[j].innerText.substring(pos+2,endpos).trim() +"/hqdefault.jpg'></img>";
					else
						children[j].innerHTML = "<span data-a-target='chat-message-text'> "+
							children[j].innerText+" </span> <img src=' https://i.ytimg.com/vi/" +
							children[j].innerText.substring(pos+2).trim() +"/hqdefault.jpg'></img>";
				}
			}
		}
	}
	showImages(){
		let messages = document.getElementsByClassName("message"); //берем все сообщения

		for(let i = 0; i < messages.length; i++)  //перебираем все сообщения
		{
			//от ебаного спама ссылками от бота
			if(messages[i].previousElementSibling.previousElementSibling.innerText == 'StreamElements')
				continue;

			let check = this.checker(messages[i].innerText);

			//ищем картинки
			if( check.includes(1)){ //если ссылка содержит расширение
				this.parse_img(messages[i]);
			}

			//ищем ютуб типа 1
			if(check.includes(2)){
				this.parse_YT(messages[i],2);
			}
			//ищем ютуб типа 2
			if(check.includes(3)){
				this.parse_YT(messages[i],3);
			}

			messages[i].className = "modified LinkToImg"; //меняем имя класса чтоб выкинуть из выборки уже проверенные сообщения
		}
	}
	start(){
		setInterval(()=>{this.showImages()},0);
	}
}

function returnLinks(){
	//с удаленными сообщениями - добавляем ссылку перехода
	let deletedLinks = document.getElementsByClassName("ffz-tooltip link-fragment"); //выбираем элементы с ссылками
	if(deletedLinks.length != 0) //если не пусто
	{
		for(let i=0;i<deletedLinks.length;i++)//перебираем все ссылки
		{
			if(deletedLinks[i].href == "")//если нет перехода
			{
				if(deletedLinks[i].innerText.indexOf("http")>-1)  //и если есть в названии http или https
					deletedLinks[i].href = deletedLinks[i].innerText;//вставляем переход
				else
					deletedLinks[i].href = 'https://' + deletedLinks[i].innerText;//или добавляем https и переход
			}
		}
	}
}

function pressPoints(){
	//проверка есть ли кнопка поинтов
	let button = document.getElementsByClassName("tw-button tw-button--success");
	if(button[0]){
		button[0].click(); //если есть, жму
	}
}

function putAuc() {
	let but = document.getElementById('auc_button');
	if(!but) addButton();
	let win = document.getElementById('mydiv');
	if(!win) addWin();
}

function addButton(){
	let auc_button = document.createElement('button');
	let chat = document.getElementsByClassName('chat-input__buttons-container');
	// console.log(chat);
	if(chat.length<=0) return;
	chat[0].lastChild.children[1].children[0].appendChild(auc_button);
	// document.getElementsByClassName('stream-chat-header')[0].appendChild(auc_button);

	auc_button.id="auc_button";
	auc_button.classList = "tw-button-icon tw-core-button tw-core-button--border tw-inline-flex tw-interactive tw-absolute tw-mg-r-7 tw-right-0";
	auc_button.innerText = "AUC";
	auc_button.title = "окно аукциона";
	auc_button.addEventListener('click',function(){
		hide_win('full');
	});
}

var auc_window;
var auc_content;
function addWin() {
	//window
	auc_window = document.createElement('div');
	auc_window.id='mydiv';
	auc_window.className = "movediv";

	//header
	let auc_header = document.createElement('div');
	auc_header.id="movedivheader";
	auc_header.className="movedivheader";
	//text
	let div = document.createElement('div');
	div.style.padding='0.4em';
	div.style.fontSize='1em';
	div.innerText="ОКНО";
	auc_header.appendChild(div);

	//controls
	div = document.createElement('div');
	div.className='controls';
	//min
	let button = document.createElement('button');
	button.className='controlheader';
	button.addEventListener('click',function(){hide_win('full')});
	button.innerHTML='&times;';
	div.appendChild(button);
	//close
	button = document.createElement('button');
	button.className='controlheader';
	button.addEventListener('click',function(){hide_win('part')});
	button.innerHTML='&minus;';
	div.appendChild(button);
	auc_header.appendChild(div);

	//content
	auc_content = document.createElement('div');
	auc_content.id = 'divcontent';
	auc_content.className = 'divcontent';

	//left
	div = document.createElement('div');
	div.className='left';
	auc_content.appendChild(div);

	//right
	div = document.createElement('div');
	div.className='right';

	//top
	let insideRight = document.createElement('div');
	insideRight.className='top';
	//timer
	let insideTop = document.createElement('div');
	insideTop.className='timer';
	insideTop.innerText='10:00';
	insideRight.appendChild(insideTop);
	//buttons
	insideTop = document.createElement('div');
	insideTop.style.textAlign='center';
	button = document.createElement('button');
	button.className='t-control';
	button.innerHTML='&#9654;';
	insideTop.appendChild(button);
	button = document.createElement('button');
	button.className='t-control';
	button.innerHTML='&#8741;';
	insideTop.appendChild(button);
	button = document.createElement('button');
	button.className='t-control';
	button.innerHTML='&#8718;';
	insideTop.appendChild(button);
	button = document.createElement('button');
	button.className='t-control';
	button.innerHTML='&plus;1';
	insideTop.appendChild(button);
	button = document.createElement('button');
	button.className='t-control';
	button.innerHTML='&minus;1';
	insideTop.appendChild(button);

	insideRight.appendChild(insideTop);
	div.appendChild(insideRight);

	//bottom
	insideRight = document.createElement('div');
	insideRight.className='bottom';
	div.appendChild(insideRight);

	auc_content.appendChild(div);

	auc_window.appendChild(auc_header);
	auc_window.appendChild(auc_content);

	document.body.appendChild(auc_window);
	dragElement(auc_window);

	prepare();
}

function hide_win(what){
	if(what === 'full') {
		if (auc_window.style.display == 'none')
			auc_window.style.display = '';
		else
			auc_window.style.display = 'none';
		auc_window.style.top='0px';
		auc_window.style.left='0px';
	}
	else if(what === 'part'){
		if(auc_content.style.display == 'none'){
			auc_content.style.display = '';
			auc_window.style.height = '70em';
		}
		else{
			auc_content.style.display = 'none';
			auc_window.style.height = 'auto';
		}
	}
}

function dragElement(elmnt) {
	var p = elmnt.parentNode;
	var moveX = 0, moveY = 0, clientX = 0, clientY = 0;
	document.getElementById('movedivheader').onmousedown = mouseDown;

	function mouseDown(e) {
		e.preventDefault();

		clientX = e.clientX;
		clientY = e.clientY;

		document.addEventListener('mouseup',stopDrag);
		document.addEventListener('mousemove',elementDrag);
	}

	function elementDrag(e) {
		e.preventDefault();
		let bb = p.getBoundingClientRect();

		moveX = clientX - e.clientX; //сдвиг по X
		moveY = clientY - e.clientY; //сдвиг по Y
		clientX = e.clientX;
		clientY = e.clientY;
		// set the element's new position:
		let top = (elmnt.offsetTop - moveY);
		let left = (elmnt.offsetLeft - moveX);
		if(top < 0){
			top = '0px';
		}
		else{
			if(top+elmnt.clientHeight < bb.height)
				top = elmnt.offsetTop - moveY + 'px';
			else top = bb.height - elmnt.clientHeight;
		}
		if(left < 0){
			left = '0px';
		}
		else{
			if(left+elmnt.clientWidth < bb.width)
				left = elmnt.offsetLeft - moveX + 'px';
			else left = bb.width - elmnt.clientWidth;
			// left = elmnt.offsetLeft - moveX + 'px';
		}
		elmnt.style.top = top;
		elmnt.style.left = left;
	}

	function stopDrag() {
		document.removeEventListener('mouseup',stopDrag);
		document.removeEventListener('mousemove',elementDrag);
	}
}

var newSubmit;
var newNominant;
function prepare() {
	newSubmit = document.createElement('div');
	newSubmit.id = 'submit';
	newSubmit.classList='newdiv sub';
	newSubmit.innerHTML=
		'<label style="width: 66%; ">type</label>\n' +
		'<div style="width: 10%;  margin-left: 20px; margin-right: 5px; text-align: center; vertical-align: middle;">score</div>\n' +
		'<button style="width: 8%; text-align: center;" onclick="stor()">&plus;</button>\n' +
		'<button style="width: 8%; text-align: center;" onclick="question_minus(this)">&minus;</button>\n' +
		'<button style="display:none; width:0;"></button>';
	document.getElementById('mydiv').lastChild.lastChild.lastChild.appendChild(newSubmit)
}

function getParams() {
	chrome.runtime.sendMessage({request: "params"}, function(response) {
		if(!response) return;
		let params = JSON.parse(response.storage);
		if(params['href']) setInterval(returnLinks,0); // ссылки
		if(params['img']) new ImageShower();
		if(params['point']) setInterval(pressPoints,10000); // поинты
		if(params['auc']) setInterval(putAuc,1000); // аук окно и кнопка
	});
}

window.onload = getParams;