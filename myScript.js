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
			return true;
		}
	}
	return false;
}

setInterval(function() {
	
	let messages = document.getElementsByClassName("message"); //берем все сообщения
	
	for(let i = 0; i < messages.length; i++)  //перебираем все сообщения
    {
		//ищем картинки
		
        if( checker(messages[i].innerText) ) //если ссылка содержит расширение
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
		
		if(messages[i].firstChild != null)//проверка на существование
		{
			if (messages[i].firstChild.innerText.indexOf("!sr") == -1)//если не реквест
			{
				if(messages[i].innerText.indexOf("youtube.com/watch") > -1) //если это ютуб "первого вида"
				{
					let children = messages[i].children; //берем детей
					for(let j = 0; j < children.length; j++) //перебираем
					{
						if(children[j].innerText.indexOf("youtube.com") > -1) //нашли нужного
						{
							let pos = children[j].innerText.indexOf("v="); // берем ссыль
							if( !(pos>-1) ) continue;
							let endpos = children[j].innerText.indexOf("&");  //без лишних символов
							//вставляю ссылку и табнейл
							if (endpos > -1 && endpos>pos) //если есть доп символы
								children[j].innerHTML = "<span data-a-target='chat-message-text'> "+
									children[j].innerText+" </span> <img src=' https://i.ytimg.com/vi/" +
									children[j].innerText.substring(pos+2,endpos) +"/hqdefault.jpg'></img>";
							else
								children[j].innerHTML = "<span data-a-target='chat-message-text'> "+
									children[j].innerText+" </span> <img src=' https://i.ytimg.com/vi/" +
									children[j].innerText.substring(pos+2) +"/hqdefault.jpg'></img>";
						}
					}
				}
			
				if(messages[i].innerText.indexOf("youtu.be") > -1) //если это ютуб "второго вида"
				{
					let children = messages[i].children; //берем детей
					for(let j = 0; j < children.length; j++) //перебираем
					{
						if(children[j].innerText.indexOf("youtu.be") > -1) //нашли нужного
						{
							let pos = children[j].innerText.lastIndexOf("/"); // берем ссыль
							if( !(pos>-1) ) continue;
							let endpos = children[j].innerText.indexOf("?");  //без лишних символов
							//вставляю ссылку и табнейл
							if (endpos > -1) //если есть доп символы
								children[j].innerHTML = "<span data-a-target='chat-message-text'> "+
									children[j].innerText+" </span> <img src=' https://i.ytimg.com/vi/" +
									children[j].innerText.substring(pos+1,endpos) +"/hqdefault.jpg'></img>";
							else
								children[j].innerHTML = "<span data-a-target='chat-message-text'> "+
									children[j].innerText+" </span> <img src=' https://i.ytimg.com/vi/" +
									children[j].innerText.substring(pos+1) +"/hqdefault.jpg'></img>";
						}
					}
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