var tabBtn = document.querySelectorAll('.tab-btn'); 
var tabContent = document.querySelectorAll('.tab-content');

//binding event
for(let i=0;i<tabBtn.length;i++){
  tabBtn[i].addEventListener('click',openTab);
}

function openTab(ev){
  //removing active id
  for(let i=0;i<tabBtn.length;i++){
    tabBtn[i].setAttribute('id',"");
    tabContent[i].setAttribute('id',"");
  }
  
  //displaying target
  ev.target.setAttribute('id',"active-tab");
  let t = ev.target.getAttribute('data-tab');
  document.querySelectorAll('.tab-content')[t].setAttribute('id','active-content');
}

