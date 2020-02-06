var img = [".png",".jpg",".gif",".jpeg"]; //глобальные расширения

setInterval(function() {
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
	
},0); //в отдельном потоке

function checker(message, full = true){
	let result=[];
	for (let i = 0; i < img.length; i++) {
		if (message.indexOf(img[i]) > -1) {
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

function parse_img(message){
	let children = message.children; //берем всех детей сообщения
	for(let j = 0; j < children.length; j++) //перебираем детей
	{
		if( checker(children[j].innerText, false) ) //если нашли нужного только по картинкам
			if(children[j].innerText.indexOf("http") > -1)//если есть http то оставляем как есть
				children[j].innerHTML = "<span data-a-target='chat-message-text'> "+
					children[j].innerText+" </span> <img src='" + children[j].innerText +"'></img>"; //вставляем вместо ссылки картинку
			else//добавляем https
				children[j].innerHTML = "<span data-a-target='chat-message-text'> "+
					children[j].innerText+" </span> <img src='https://" + children[j].innerText +"'></img>"; //вставляем вместо ссылки картинку
	}
}

function parse_YT(message, type){
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

setInterval(function() {
	
	let messages = document.getElementsByClassName("message"); //берем все сообщения
	
	for(let i = 0; i < messages.length; i++)  //перебираем все сообщения
    {
		let check = checker(messages[i].innerText);

		//ищем картинки
		if( check.includes(1)){ //если ссылка содержит расширение
			parse_img(messages[i]);
        }
		
		//ищем ютуб типа 1
		if(check.includes(2)){
			parse_YT(messages[i],2);
		}
		//ищем ютуб типа 2
		if(check.includes(3)){
			parse_YT(messages[i],3);
		}

		messages[i].className = "modified LinkToImg"; //меняем имя класса чтоб выкинуть из выборки уже проверенные сообщения
	}
},0); // и все это в потоке

setInterval(function() {
	//проверка есть ли кнопка поинтов
	let button = document.getElementsByClassName("tw-button tw-button--success tw-interactive");
	if(button[0]){
		button[0].click(); //если есть, жму
	}
},10000); //раз в 10 сек