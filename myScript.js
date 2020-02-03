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

function checker(message){
	for (let i = 0; i < img.length; i++) {
		if (message.indexOf(img[i]) > -1) {
			return 1;
		}
	}
	if(message.indexOf("youtube.com/watch") > -1){
		return 2;
	}
	if(message.indexOf("youtu.be") > -1){
		return 3;
	}
	return 0;
}

setInterval(function() {
	
	let messages = document.getElementsByClassName("message"); //берем все сообщения
	
	for(let i = 0; i < messages.length; i++)  //перебираем все сообщения
    {
		//ищем картинки
		
        if( checker(messages[i].innerText) === 1) //если ссылка содержит расширение
        {
			let children = messages[i].children; //берем всех детей сообщения
			for(let j = 0; j < children.length; j++) //перебираем детей
			{
				if( checker(children[j].innerText) ) //если нашли нужного
					if(children[j].innerText.indexOf("http") > -1)//если есть http то оставляем как есть
						children[j].innerHTML = "<span data-a-target='chat-message-text'> "+
							children[j].innerText+" </span> <img src='" + children[j].innerText +"'></img>"; //вставляем вместо ссылки картинку
					else//добавляем https
						children[j].innerHTML = "<span data-a-target='chat-message-text'> "+
							children[j].innerText+" </span> <img src='https://" + children[j].innerText +"'></img>"; //вставляем вместо ссылки картинку
			}
        }
		
		//ищем ютуб

		let YT_type = checker(messages[i].innerText);
        if(YT_type === 0) continue;
        let YT_header;
		let beforeId;
		let afterId;
		if(	YT_type === 2) {//если ютуб 1
			YT_header = "youtube.com";
			beforeId = "v=";
			afterId = "&";
		}
		else if (YT_type === 3){//если ютуб 2
			YT_header = "youtu.be";
			beforeId = "/";
			afterId = "?";
		}

		if(messages[i].firstChild != null && messages[i].firstChild.innerText.indexOf("!sr") == -1){ //если не реквест
			let children = messages[i].children; //берем детей
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
							children[j].innerText.substring(pos+(4-YT_type),endpos) +"/hqdefault.jpg'></img>";//тип или 2 или 3, если 2 то удаляю 4-2 символа(v=) иначе 4-3 (/)
					else
						children[j].innerHTML = "<span data-a-target='chat-message-text'> "+
							children[j].innerText+" </span> <img src=' https://i.ytimg.com/vi/" +
							children[j].innerText.substring(pos+(4-YT_type)) +"/hqdefault.jpg'></img>";
				}
			}
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