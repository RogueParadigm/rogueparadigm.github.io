const choices=[...document.querySelectorAll('.choices button')];
const clips=[...document.querySelectorAll('.clips figure')];
choices.forEach((button,index)=>button.addEventListener('click',()=>{
  choices.forEach((choice,i)=>choice.setAttribute('aria-pressed',String(i===index)));
  clips.forEach((clip,i)=>{clip.hidden=i!==index;if(clip.hidden)clip.querySelector('video').pause()});
}));
const dialog=document.querySelector('#cinema');
const video=dialog.querySelector('video');
document.querySelector('#watch').addEventListener('click',()=>{dialog.showModal();video.play().catch(()=>{})});
document.querySelector('#close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
dialog.addEventListener('close',()=>video.pause());
