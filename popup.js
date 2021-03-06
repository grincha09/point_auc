let href = document.getElementById('href-switch');
let img = document.getElementById('img-switch');
let point = document.getElementById('point-switch');
let auc = document.getElementById('auc-switch');

href.addEventListener('click',()=>{saveState(href,'href');});
img.addEventListener('click',()=>{saveState(img,'img');});
point.addEventListener('click',()=>{saveState(point,'point');});
auc.addEventListener('click',()=>{saveState(auc,'auc');});

function saveState(switchElem, paramName) {
    let params = localStorage.getItem('params');
    params = JSON.parse(params);
    if(!params){
        params={};
        params['href']=0;
        params['img']=0;
        params['point']=0;
        params['auc']=0;
    }
    params[paramName]= switchElem.checked?1:0;
    localStorage.setItem('params',JSON.stringify(params));
}

function getStates(){
    let params = localStorage.getItem('params');
    if(!params) return;
    try{
        params = JSON.parse(params);
        href.checked = parseInt(params['href']);
        img.checked = parseInt(params['img']);
        point.checked = parseInt(params['point']);
        auc.checked = parseInt(params['auc']);
    }
    catch (e) {
        href.checked = 0;
        img.checked = 0;
        point.checked = 0;
        auc.checked = 0;
    }
}
getStates();