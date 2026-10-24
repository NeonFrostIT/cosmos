(() => {
  'use strict';

  // ============================================================
  // ORBIT QUEST — все настройки и вопросы в этом файле.
  // Каждая планета: 2 кристалла, каждый содержит 1 свой вопрос.
  // Для картинок достаточно положить PNG в папку assets/.
  // ============================================================
  const PLANETS = [
    {name:'Меркурий', subtitle:'Первый мир у Солнца', base:'#a99588', floor:'#6d605c', sky:'#101a3e', accent:'#ffd092', fact:'Меркурий — ближайшая к Солнцу планета. На нём почти нет атмосферы, удерживающей тепло.', questions:[
      {text:'Какая планета находится ближе всего к Солнцу?', choices:['Меркурий','Марс','Земля'],answer:0},
      {text:'Почему на Меркурии такие сильные перепады температур?', choices:['Почти нет атмосферы','Там глубокие океаны','Там постоянно идут дожди'],answer:0}
    ]},
    {name:'Венера', subtitle:'Загадка плотных облаков', base:'#e1b875', floor:'#ad7951', sky:'#31203e', accent:'#ffe29d', fact:'Венера — самая горячая планета из-за мощного парникового эффекта в её плотной атмосфере.', questions:[
      {text:'Какая планета самая горячая в Солнечной системе?',choices:['Меркурий','Венера','Нептун'],answer:1},
      {text:'Какой газ преобладает в атмосфере Венеры?',choices:['Кислород','Углекислый газ','Гелий'],answer:1}
    ]},
    {name:'Земля', subtitle:'Наш голубой дом', base:'#59a8dd', floor:'#347879', sky:'#11294f', accent:'#89ffe0', fact:'Около 71% поверхности Земли покрыто водой. Единственная известная планета с жизнью.', questions:[
      {text:'Как называется естественный спутник Земли?',choices:['Европа','Луна','Титан'],answer:1},
      {text:'Сколько примерно поверхности Земли покрыто водой?',choices:['71%','10%','100%'],answer:0}
    ]},
    {name:'Марс', subtitle:'Следы воды на красной планете', base:'#c97656', floor:'#954534', sky:'#2d2039', accent:'#ffb48a', fact:'Красный цвет Марсу придают оксиды железа. На Марсе находится огромный вулкан Олимп.', questions:[
      {text:'Какого цвета обычно поверхность Марса?',choices:['Синего','Красноватого','Зелёного'],answer:1},
      {text:'Что придаёт Марсу красноватый оттенок?',choices:['Оксиды железа','Огромные леса','Красные океаны'],answer:0}
    ]},
    {name:'Юпитер', subtitle:'Гигант огромных бурь', base:'#d4ad8d', floor:'#896776', sky:'#292343', accent:'#ffe0a5', fact:'Юпитер — крупнейшая планета. Большое красное пятно — гигантский устойчивый шторм.', questions:[
      {text:'Что такое Большое красное пятно Юпитера?',choices:['Огромный шторм','Океан','Вулкан'],answer:0},
      {text:'Какого типа планета Юпитер?',choices:['Каменная','Газовый гигант','Карликовая'],answer:1}
    ]},
    {name:'Сатурн', subtitle:'Планета сверкающих колец', base:'#dec996', floor:'#92896e', sky:'#263053', accent:'#ffebac', fact:'Кольца Сатурна состоят преимущественно из ледяных частиц с примесью каменных.', questions:[
      {text:'Чем особенно известен Сатурн?',choices:['Системой колец','Океанами','Двумя солнцами'],answer:0},
      {text:'Из чего в основном состоят кольца Сатурна?',choices:['Из льда и каменных частиц','Из дыма','Из жидкой воды'],answer:0}
    ]},
    {name:'Уран', subtitle:'Бирюзовый ледяной гигант', base:'#80d6dc', floor:'#3f8696', sky:'#12334e', accent:'#9afff0', fact:'Ось вращения Урана очень сильно наклонена: он словно вращается на боку.', questions:[
      {text:'Какого цвета часто выглядит Уран?',choices:['Голубовато-зелёного','Ярко-красного','Оранжевого'],answer:0},
      {text:'Что необычного в вращении Урана?',choices:['Сильный наклон оси','Он не вращается','Он вращается вокруг Земли'],answer:0}
    ]},
    {name:'Нептун', subtitle:'Мир ветров на окраине', base:'#5b8ef3', floor:'#24478b', sky:'#121c48', accent:'#90c4ff', fact:'На Нептуне наблюдаются очень сильные ветры. Один его оборот вокруг Солнца занимает около 165 земных лет.', questions:[
      {text:'Какая планета самая дальняя от Солнца среди восьми?',choices:['Нептун','Сатурн','Земля'],answer:0},
      {text:'Чем известна атмосфера Нептуна?',choices:['Очень сильными ветрами','Большими лесами','Тёплыми морями'],answer:0}
    ]}
  ];
  const SAVE_KEY = 'orbitQuest_2crystals_v1';
  const WORLD = {width:1200,height:600};
  const CRYSTALS = [{x:310,y:402},{x:840,y:438}];
  const SCIENTIST = {x:650,y:502};
  const ROCKET = {x:1040,y:385};
  const PLAYER_START = {x:550,y:395};
  const INTERACT_RADIUS = 112;
  const $ = (selector) => document.querySelector(selector);
  const canvas=$('#scene'),ctx=canvas.getContext('2d');
  if(!ctx){$('#toast').textContent='Браузер не поддерживает Canvas.';return;}

  const ui={
    overlay:$('#dialogOverlay'),title:$('#dialogTitle'),subtitle:$('#dialogSubtitle'),body:$('#dialogBody'),footer:$('#dialogFooter'),
    planetNumber:$('#planetNumber'),planetTitle:$('#planetTitle'),planetCrystals:$('#planetCrystals'),planetTagline:$('#planetTagline'),
    missionStep:$('#missionStep'),missionTitle:$('#missionTitle'),missionHint:$('#missionHint'),interact:$('#interactButton'),toast:$('#toast')
  };
  const freshSave=()=>({version:1,planet:0,done:PLANETS.map(()=>[false,false]),score:0});
  function readSave(){
    try{
      const raw=localStorage.getItem(SAVE_KEY);if(!raw)return freshSave();
      const parsed=JSON.parse(raw);
      if(parsed.version!==1 || !Array.isArray(parsed.done) || parsed.done.length!==8 || !parsed.done.every(x=>Array.isArray(x)&&x.length===2&&x.every(v=>typeof v==='boolean')))return freshSave();
      const score=parsed.done.reduce((n,arr)=>n+arr.filter(Boolean).length,0);
      let unlocked=0;while(unlocked<7&&parsed.done[unlocked].every(Boolean))unlocked++;
      return{version:1,done:parsed.done,score,planet:Math.min(Math.max(0,Number.isInteger(parsed.planet)?parsed.planet:0),unlocked)};
    }catch{return freshSave();}
  }
  let saveState=readSave();
  const player={...PLAYER_START,facing:1,motion:0};
  const viewport={scale:1,offX:0,offY:0,dpr:1};
  let lastFrame=0,uiElapsed=0,soundOn=false,audioCtx=null,toastTimeout=0;
  let flight=null, scientistMoodUntil=0;
  const particles=[];
  const flightBanner=$('#flightBanner');
  let modalKind='',questionResolved=false;
  const downKeys=new Set(),touchKeys=new Set();
  // Любой персонаж/ракета — обычный PNG с прозрачным фоном в assets/.
  // Если файла нет, автоматически показывается нарисованный вариант.
  const sprites={};
  for(const key of ['scientist','astronaut','crystal','rocket','background']){
    sprites[key]=null;
    const image=new Image();
    image.onload=()=>{sprites[key]=image;};
    image.onerror=()=>{sprites[key]=null;};
    image.src=`assets/${key}.png`;
  }

  const stars=Array.from({length:130},(_,i)=>{
    const r=(n)=>{const x=Math.sin(i*738.53+n*217.17)*18273.613;return x-Math.floor(x);};
    return{x:r(1)*WORLD.width,y:r(2)*400,r:.6+r(3)*1.4,a:.25+r(4)*.65,offset:r(5)*Math.PI*2};
  });
  const current=()=>PLANETS[saveState.planet];
  const found=()=>saveState.done[saveState.planet];
  const completed=()=>found().every(Boolean);
  function unlockedPlanet(){let i=0;while(i<7&&saveState.done[i].every(Boolean))i++;return i;}
  function persist(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(saveState));}catch{showToast('Не удалось сохранить прогресс в браузере');}}

  function resize(){
    const width=Math.max(1,window.innerWidth),height=Math.max(1,window.innerHeight);
    viewport.dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.floor(width*viewport.dpr);canvas.height=Math.floor(height*viewport.dpr);
    viewport.scale=Math.min(width/WORLD.width,height/WORLD.height);
    viewport.offX=(width-WORLD.width*viewport.scale)/2;
    viewport.offY=(height-WORLD.height*viewport.scale)/2;
  }
  function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
  function nearest(){
    const objects=[];
    found().forEach((yes,i)=>{if(!yes)objects.push({kind:'crystal',index:i,...CRYSTALS[i]});});
    objects.push({kind:'scientist',...SCIENTIST});
    objects.sort((a,b)=>distance(player,a)-distance(player,b));
    return objects[0]&&distance(player,objects[0])<=INTERACT_RADIUS?objects[0]:null;
  }
  function closestCrystal(){const remaining=CRYSTALS.map((pos,i)=>({kind:'crystal',index:i,...pos})).filter(o=>!found()[o.index]);remaining.sort((a,b)=>distance(a,player)-distance(b,player));return remaining[0]||null;}
  function showToast(message){ui.toast.textContent=message;ui.toast.classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>ui.toast.classList.remove('visible'),2050);}
  function refreshUI(){
    const p=current(),count=found().filter(Boolean).length,target=nearest();
    ui.planetNumber.textContent=`${String(saveState.planet+1).padStart(2,'0')} / 08`;
    ui.planetTitle.textContent=p.name;ui.planetCrystals.textContent=`◆ ${count} / 2`;
    ui.planetTagline.textContent=p.subtitle;
    ui.missionStep.textContent=`МИССИЯ · ${count} ИЗ 2`;
    ui.interact.disabled=false;
    if(completed()){
      ui.missionTitle.textContent='Планета изучена!';ui.missionHint.textContent='Оба вопроса решены.';
      ui.interact.textContent=saveState.planet===7?'Завершить экспедицию':'🚀 Запустить ракету';
    }else if(target?.kind==='crystal'){
      ui.missionTitle.textContent=`Кристалл ${target.index+1}`;
      ui.missionHint.textContent='Внутри — вопрос о планете.';
      ui.interact.textContent='Открыть вопрос';
    }else if(target?.kind==='scientist'){
      ui.missionTitle.textContent='Учёный рядом';ui.missionHint.textContent='Узнай интересный факт.';ui.interact.textContent='Поговорить';
    }else{
      const closest=closestCrystal();
      ui.missionTitle.textContent='Найди кристалл';
      ui.missionHint.textContent=closest?`До ближайшего: ${Math.round(distance(player,closest)/5)} шагов`:'Исследуй планету';
      ui.interact.textContent='Подойди к объекту';ui.interact.disabled=true;
    }
  }
  function openDialog(kind,title,subtitle=''){
    downKeys.clear();touchKeys.clear();document.querySelectorAll('.pad.pressed').forEach(btn=>btn.classList.remove('pressed'));
    modalKind=kind;ui.title.textContent=title;ui.subtitle.textContent=subtitle;ui.body.replaceChildren();ui.footer.replaceChildren();
    ui.overlay.hidden=false;$('#closeDialog').focus();
  }
  function closeDialog(){ui.overlay.hidden=true;modalKind='';questionResolved=false;refreshUI();}
  function addFooter(label,callback,secondary=false){const b=document.createElement('button');b.type='button';b.textContent=label;if(secondary)b.classList.add('secondary');b.addEventListener('click',callback);ui.footer.appendChild(b);return b;}
  function textNode(tag,text,className=''){const node=document.createElement(tag);node.textContent=text;if(className)node.className=className;return node;}

  function openQuestion(index){
    if(found()[index])return;
    const {name,questions}=current(),q=questions[index];
    questionResolved=false;
    openDialog('quiz',`Кристалл ${index+1} / 2`,`Планета ${name} · ответь правильно, чтобы забрать кристалл`);
    ui.body.appendChild(textNode('strong',q.text));
    const feedback=textNode('div','','feedback');
    q.choices.forEach((option,answerIndex)=>{
      const button=textNode('button',option,'answer-button');button.type='button';
      button.addEventListener('click',()=>{
        if(questionResolved)return;
        if(answerIndex!==q.answer){
          ui.body.querySelectorAll('.answer-button').forEach(x=>x.classList.remove('wrong'));
          button.classList.add('wrong');feedback.textContent='Неправильно. Попробуй другой ответ.';feedback.className='feedback bad';return;
        }
        questionResolved=true;
        button.classList.add('correct');ui.body.querySelectorAll('.answer-button').forEach(x=>x.disabled=true);
        // Сохраняем СРАЗУ после правильного ответа, а не после нажатия «Дальше».
        saveState.done[saveState.planet][index]=true;
        saveState.score+=1;persist();playTone('crystal');spawnCrystalBurst(CRYSTALS[index].x,CRYSTALS[index].y);scientistMoodUntil=performance.now()+2400;refreshUI();
        feedback.textContent='✓ Верно! Кристалл получен.';feedback.className='feedback good';
        ui.footer.replaceChildren();
        if(completed())addFooter('🚀 Перейти к ракете',openRocket);
        else addFooter('Найти второй кристалл',()=>{closeDialog();showToast('Остался ещё один кристалл');});
      });
      ui.body.appendChild(button);
    });
    ui.body.appendChild(feedback);
    addFooter('Вернуться к игре',closeDialog,true);
  }
  function openScientist(){
    openDialog('scientist','Учёный экспедиции',`На связи исследователь планеты ${current().name}`);
    const count=found().filter(Boolean).length;
    const sentences=[
      `Привет, исследователь! Добро пожаловать на планету ${current().name}.`,
      current().fact,
      count===2?'Отличная работа! Оба кристалла собраны. Пора отправляться дальше!':
        count===1?'Первый кристалл уже наш! Найди второй и реши его вопрос.':'Найди два светящихся кристалла. В каждом спрятан отдельный вопрос!'
    ];
    if(sprites.scientist){const preview=document.createElement('img');preview.src=sprites.scientist.src;preview.alt='Учёный';preview.className='picture-preview';ui.body.appendChild(preview);}
    const bubble=textNode('p',sentences[0],'scientist-speech');ui.body.appendChild(bubble);
    let line=0;
    const next=addFooter('Следующая фраза ▶',()=>{
      line++;bubble.textContent=sentences[Math.min(line,sentences.length-1)];
      if(line===sentences.length-1)next.textContent='Это всё ✓';
      if(line>=sentences.length){closeDialog();}
    });
    addFooter('Закрыть',closeDialog,true);
  }

  function openRocket(){
    if(!completed())return;
    openDialog('rocket',saveState.planet===7?'🏆 Миссия выполнена!':'Ракета готова!',saveState.planet===7?'Все восемь планет исследованы':'Оба кристалла собраны, оба вопроса решены');
    ui.body.appendChild(textNode('div',saveState.planet===7?'🌟 🏆 🌟':'🚀','rocket-preview'));
    ui.body.appendChild(textNode('p',saveState.planet===7?'Поздравляем! Ты прошёл МИССИЮ САНЖАРА.':'Следующая остановка: '+PLANETS[saveState.planet+1].name+'.'));
    if(saveState.planet!==7){
      addFooter('Начать полёт 🚀',startFlight);
    }else addFooter('Посмотреть карту',openMap);
    addFooter('Позже',closeDialog,true);
  }
  function startFlight(){
    if(flight||!completed()||saveState.planet>=7)return;
    closeDialog();downKeys.clear();touchKeys.clear();
    flight={elapsed:0,duration:3.4,from:saveState.planet,to:saveState.planet+1};
    document.querySelector('#game').classList.add('flying');
    flightBanner.textContent=`🚀 ${PLANETS[flight.from].name} → ${PLANETS[flight.to].name}`;
    flightBanner.hidden=false;
    playTone('rocket');
  }
  function updateFlight(dt){
    if(!flight)return;
    flight.elapsed+=dt;
    if(flight.elapsed<flight.duration)return;
    const arrival=flight.to;
    flight=null;saveState.planet=arrival;player.x=PLAYER_START.x;player.y=PLAYER_START.y;
    persist();particles.length=0;
    flightBanner.hidden=true;document.querySelector('#game').classList.remove('flying');
    refreshUI();showToast('Посадка на планету '+current().name+'!');
  }

  function openMap(){
    openDialog('map','🪐 Карта экспедиции','Следующие планеты открываются после двух правильных ответов');
    const grid=document.createElement('div');grid.className='planet-grid';
    PLANETS.forEach((planet,i)=>{
      const button=document.createElement('button');button.type='button';button.className='planet-choice';
      const status=saveState.done[i].every(Boolean)?'✓ Пройдена':i>unlockedPlanet()?'🔒 Закрыта':(saveState.done[i].filter(Boolean).length+'/2 кристалла');
      button.appendChild(textNode('span',`${i+1}. ${planet.name}`));button.appendChild(textNode('small',status));
      if(i===saveState.planet)button.classList.add('active');
      button.disabled=i>unlockedPlanet();
      button.addEventListener('click',()=>{saveState.planet=i;player.x=PLAYER_START.x;player.y=PLAYER_START.y;persist();closeDialog();refreshUI();});
      grid.appendChild(button);
    });
    ui.body.appendChild(grid);
    addFooter('Продолжить',closeDialog);
    addFooter('Начать заново',()=>{
      if(!window.confirm('Сбросить прохождение всех планет?'))return;
      saveState=freshSave();persist();player.x=PLAYER_START.x;player.y=PLAYER_START.y;
      closeDialog();showToast('Экспедиция начата заново');
    },true);
  }
  function openHelp(){
    openDialog('help','Как играть','Управление и сохранения');
    const list=document.createElement('ol');list.className='info-list';
    ['Перемещай космонавта стрелками на экране или клавишами WASD / ↑ ↓ ← →.',
     'Подойди к одному из двух кристаллов. Каждый кристалл открывает свой вопрос.',
     'Только правильный ответ засчитывает кристалл. При ошибке можно попробовать снова.',
     'После двух кристаллов запускай ракету и переходи на следующую планету.',
     'Подойди к учёному, чтобы узнать факт.',
     'Прогресс сохраняется.'].forEach(t=>list.appendChild(textNode('li',t)));
    ui.body.appendChild(list);addFooter('Понятно',closeDialog);
  }
  function interact(){
    if(!ui.overlay.hidden||flight)return;
    if(completed()){openRocket();return;}
    const target=nearest();
    if(target?.kind==='crystal')openQuestion(target.index);
    else if(target?.kind==='scientist')openScientist();
    else showToast('Подойди поближе к кристаллу');
  }
  function playTone(type){
    if(!soundOn)return;
    try{
      audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
      if(audioCtx.state==='suspended')audioCtx.resume();
      const osc=audioCtx.createOscillator(),vol=audioCtx.createGain(),t=audioCtx.currentTime;
      osc.connect(vol);vol.connect(audioCtx.destination);
      osc.type=type==='rocket'?'sawtooth':'sine';osc.frequency.setValueAtTime(type==='rocket'?130:460,t);osc.frequency.exponentialRampToValueAtTime(type==='rocket'?550:920,t+.18);
      vol.gain.setValueAtTime(.001,t);vol.gain.exponentialRampToValueAtTime(.06,t+.018);vol.gain.exponentialRampToValueAtTime(.001,t+.25);osc.start(t);osc.stop(t+.27);
    }catch{}
  }

  // --- Ввод с клавиатуры, мыши и сенсорного экрана ---
  window.addEventListener('keydown',e=>{
    const k=e.key.toLowerCase();
    if(['arrowup','arrowdown','arrowleft','arrowright',' ','w','a','s','d'].includes(k))e.preventDefault();
    if(e.key==='Escape'&&!ui.overlay.hidden){closeDialog();return;}
    if(!ui.overlay.hidden||flight)return;
    if((k==='e'||e.key==='Enter'||e.key===' ')&&!e.repeat){interact();return;}
    downKeys.add(k);
  },{passive:false});
  window.addEventListener('keyup',e=>downKeys.delete(e.key.toLowerCase()));
  window.addEventListener('blur',()=>{downKeys.clear();touchKeys.clear()});
  for(const button of document.querySelectorAll('.pad')){
    const key=button.dataset.direction;
    button.addEventListener('pointerdown',e=>{e.preventDefault();if(!ui.overlay.hidden||flight)return;touchKeys.add(key);button.classList.add('pressed');try{button.setPointerCapture(e.pointerId)}catch{};});
    for(const name of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(name,()=>{touchKeys.delete(key);button.classList.remove('pressed');});
  }
  function updateMovement(dt){
    if(!ui.overlay.hidden||flight)return;
    const has=(a,b,c)=>downKeys.has(a)||downKeys.has(b)||touchKeys.has(c);
    let dx=(has('arrowright','d','right')?1:0)-(has('arrowleft','a','left')?1:0);
    let dy=(has('arrowdown','s','down')?1:0)-(has('arrowup','w','up')?1:0);
    if(!dx&&!dy)return;
    const length=Math.hypot(dx,dy);dx/=length;dy/=length;
    const speed=265*dt;player.x=Math.max(64,Math.min(WORLD.width-70,player.x+dx*speed));player.y=Math.max(343,Math.min(542,player.y+dy*speed));
    if(dx)player.facing=dx>0?1:-1;player.motion+=dt*12;
  }
  window.addEventListener('resize',resize);
  $('#closeDialog').addEventListener('click',closeDialog);
  ui.overlay.addEventListener('pointerdown',e=>{if(e.target===ui.overlay)closeDialog();});
  $('#interactButton').addEventListener('click',interact);
  $('#mapButton').addEventListener('click',openMap);
  $('#helpButton').addEventListener('click',openHelp);
  $('#soundButton').addEventListener('click',()=>{soundOn=!soundOn;$('#soundButton').textContent=soundOn?'🔊':'🔇';$('#soundButton').title=soundOn?'Выключить звук':'Включить звук';playTone('crystal');});
  canvas.addEventListener('pointerdown',e=>{
    if(!ui.overlay.hidden || completed() || flight)return;
    const x=(e.clientX-viewport.offX)/viewport.scale,y=(e.clientY-viewport.offY)/viewport.scale;
    const list=[...CRYSTALS.map((pt,index)=>({...pt,kind:'crystal',index})).filter(o=>!found()[o.index]),{...SCIENTIST,kind:'scientist'}];
    const target=list.find(o=>Math.hypot(o.x-x,o.y-y)<51);
    if(!target)return;
    if(distance(player,target)>INTERACT_RADIUS){showToast('Подойди к объекту, затем нажми ещё раз');return;}
    if(target.kind==='crystal')openQuestion(target.index);else openScientist();
  });

  // --- Рисование сцены ---
  const rounded=(x,y,w,h,r)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);};
  function lighten(hex,amount){let v=parseInt(hex.slice(1),16),ch=[v>>16&255,v>>8&255,v&255];return 'rgb('+ch.map(n=>Math.min(255,Math.max(0,Math.round(n+(amount>0?(255-n)*amount:n*amount))))).join(',')+')';}
  function circle(x,y,r,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
  function imageAt(name,x,y,w,h){const img=sprites[name];if(!img||!img.complete||!img.naturalWidth)return false;const ratio=Math.min(w/img.naturalWidth,h/img.naturalHeight);const iw=img.naturalWidth*ratio,ih=img.naturalHeight*ratio;ctx.drawImage(img,x-iw/2,y-ih/2,iw,ih);return true;}
  function drawSky(time){
    const p=current();
    const grad=ctx.createLinearGradient(0,0,0,600);grad.addColorStop(0,p.sky);grad.addColorStop(.70,'#141b3d');grad.addColorStop(1,'#172237');ctx.fillStyle=grad;ctx.fillRect(0,0,1200,600);
    if(sprites.background){ctx.globalAlpha=.52;ctx.drawImage(sprites.background,0,0,1200,600);ctx.globalAlpha=1;}
    if(saveState.planet===1){ctx.fillStyle='rgba(252,168,69,.10)';ctx.fillRect(0,0,1200,600);}
    for(const [x,y,r] of [[320,165,260],[760,120,330]]){
      const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(130,105,198,.10)');g.addColorStop(1,'rgba(130,105,198,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
    }
    for(const s of stars){ctx.globalAlpha=s.a*(.75+.25*Math.sin(time*.0018+s.offset));circle(s.x,s.y,s.r,'#e4f8ff');}ctx.globalAlpha=1;
    // Огромная планета на горизонте.
    ctx.save();ctx.translate(880,192);
    const r=147,glow=ctx.createRadialGradient(-40,-55,12,0,0,r*1.2);
    glow.addColorStop(0,lighten(p.base,.32));glow.addColorStop(.58,p.base);glow.addColorStop(1,lighten(p.base,-.56));
    circle(0,0,r,glow);
    ctx.save();ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.clip();
    for(let i=0;i<7;i++){ctx.fillStyle='rgba(255,255,255,.06)';ctx.beginPath();ctx.ellipse(-12,-100+i*35,r*.87,7+i%3*2,.09,0,Math.PI*2);ctx.fill();}
    ctx.restore();
    if(saveState.planet===5){ctx.strokeStyle='rgba(252,239,183,.7)';ctx.lineWidth=16;ctx.beginPath();ctx.ellipse(0,0,211,65,-.26,0,Math.PI*2);ctx.stroke();}
    ctx.restore();
  }
  // У каждой планеты свой рельеф. Для газовых гигантов это исследовательские платформы.
  function drawTerrain(time){
    const id=saveState.planet,p=current();
    const isGiant=id>=4;
    const g=ctx.createLinearGradient(0,323,0,600);
    g.addColorStop(0,lighten(p.floor,.23));g.addColorStop(.43,p.floor);g.addColorStop(1,lighten(p.floor,-.42));
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,352);
    ctx.quadraticCurveTo(180,320,350,357);ctx.quadraticCurveTo(590,377,760,341);
    ctx.quadraticCurveTo(1010,319,1200,358);ctx.lineTo(1200,600);ctx.lineTo(0,600);ctx.fill();
    // Общие дальние горы / облака.
    ctx.fillStyle=isGiant?'rgba(255,255,255,.105)':'rgba(255,255,255,.095)';ctx.beginPath();
    ctx.moveTo(0,354);ctx.lineTo(90,325);ctx.lineTo(210,355);ctx.lineTo(320,300);ctx.lineTo(440,357);
    ctx.lineTo(595,321);ctx.lineTo(720,363);ctx.lineTo(831,307);ctx.lineTo(972,353);ctx.lineTo(1080,320);ctx.lineTo(1200,354);ctx.closePath();ctx.fill();
    const seed=(i,m=1)=>{let n=Math.sin((i+1)*86.28+id*74.71)*19482.63;return(n-Math.floor(n))*m;};
    if(id===0){ // Меркурий — кратеры
      for(let i=0;i<19;i++){let x=28+seed(i,1140),y=380+seed(i+30,202),r=7+seed(i+60,24);
        ctx.fillStyle='rgba(13,18,30,.14)';ctx.beginPath();ctx.ellipse(x,y,r*1.4,r*.48,0,0,7);ctx.fill();
        ctx.strokeStyle='rgba(230,231,232,.21)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,r*1.4,r*.48,0,Math.PI,Math.PI*2);ctx.stroke();}
    }else if(id===1){ // Венера — жар и трещины
      for(let i=0;i<11;i++){const x=seed(i,1140)+20,y=389+seed(i+40,190);
        ctx.strokeStyle='rgba(255,165,58,.48)';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+17,y+9);ctx.lineTo(x+45,y+2);ctx.stroke();}
      ctx.fillStyle='rgba(252,182,73,.055)';ctx.fillRect(0,345,1200,255);
    }else if(id===2){ // Земля — островки, трава и вода
      ctx.fillStyle='rgba(83,196,149,.24)';
      for(let i=0;i<32;i++){const x=seed(i,1180),y=365+seed(i+50,217);ctx.beginPath();ctx.ellipse(x,y,9,4,0,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='rgba(90,197,243,.24)';ctx.beginPath();ctx.ellipse(1020,522,120,24,-.07,0,Math.PI*2);ctx.fill();
      for(let i=0;i<18;i++){const x=seed(i+90,1170),y=370+seed(i+145,205);ctx.strokeStyle='rgba(148,250,176,.5)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-3,y-9);ctx.moveTo(x,y);ctx.lineTo(x+4,y-7);ctx.stroke();}
    }else if(id===3){ // Марс — песок и валуны
      for(let i=0;i<16;i++){const x=seed(i,1170),y=365+seed(i+45,215),r=6+seed(i+60,22);
        ctx.fillStyle='rgba(96,46,35,.35)';ctx.beginPath();ctx.ellipse(x,y,r,r*.43,0,0,Math.PI*2);ctx.fill();}
      ctx.strokeStyle='rgba(250,192,140,.17)';ctx.lineWidth=3;
      for(let i=0;i<7;i++){const y=382+i*29;ctx.beginPath();ctx.moveTo(0,y);ctx.quadraticCurveTo(480,y+16,1200,y-4);ctx.stroke();}
    }else { // Юпитер, Сатурн, Уран, Нептун — научная платформа над облаками
      for(let i=0;i<15;i++){const x=seed(i,1200),y=377+seed(i+70,200);
        ctx.fillStyle=id>=6?'rgba(169,244,255,.075)':'rgba(254,233,191,.07)';
        ctx.beginPath();ctx.ellipse(x,y,35+seed(i+20,40),6+seed(i+40,6),0,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle=id>=6?'rgba(126,222,249,.26)':'rgba(241,207,159,.24)';ctx.fillRect(35,566,1130,12);
      ctx.strokeStyle='rgba(206,241,252,.35)';ctx.lineWidth=2;
      for(let i=0;i<14;i++){const x=45+i*83;ctx.beginPath();ctx.moveTo(x,562);ctx.lineTo(x,580);ctx.stroke();}
      if(id===6||id===7){ // ледяные шпили
        for(let i=0;i<10;i++){const x=seed(i,1180),y=416+seed(i+25,135),h=16+seed(i+57,38);
          ctx.fillStyle=id===6?'rgba(153,251,248,.25)':'rgba(93,169,248,.24)';ctx.beginPath();ctx.moveTo(x-9,y);ctx.lineTo(x,y-h);ctx.lineTo(x+10,y);ctx.fill();}
      }
    }
    // Небольшой ветер/пыль, всегда в движении, но не перекрывает объекты.
    ctx.strokeStyle=id===3?'rgba(255,210,167,.13)':id===7?'rgba(175,235,255,.16)':'rgba(220,239,255,.075)';
    for(let i=0;i<7;i++){const x=(i*229+time*.008*(id===7?3:1))%1280-40,y=398+i*29;
      ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+40,y-7,x+80,y);ctx.stroke();}
  }
  function drawRocket(){
    ctx.save();ctx.translate(ROCKET.x,ROCKET.y);
    circle(0,43,52,'rgba(0,0,0,.20)');
    if(imageAt('rocket',0,-9,110,150)){ctx.restore();return;}
    ctx.fillStyle='#f0f6ff';ctx.strokeStyle='#a3b8cb';ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(0,-106);ctx.bezierCurveTo(49,-70,45,-13,32,40);ctx.lineTo(-32,40);ctx.bezierCurveTo(-45,-13,-49,-70,0,-106);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#ff9c82';ctx.beginPath();ctx.moveTo(0,-106);ctx.quadraticCurveTo(28,-89,30,-59);ctx.lineTo(-30,-59);ctx.quadraticCurveTo(-28,-89,0,-106);ctx.fill();
    ctx.fillStyle='#246f91';ctx.beginPath();ctx.arc(0,-27,17,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=5;ctx.stroke();
    ctx.fillStyle='#ed8b79';ctx.beginPath();ctx.moveTo(-30,0);ctx.lineTo(-55,38);ctx.lineTo(-30,31);ctx.moveTo(30,0);ctx.lineTo(55,38);ctx.lineTo(30,31);ctx.fill();
    ctx.fillStyle='#ffcf77';ctx.fillRect(-24,35,48,6);ctx.restore();
  }
  function spawnCrystalBurst(x,y){
    for(let i=0;i<46;i++){
      const a=Math.random()*Math.PI*2,speed=50+Math.random()*200;
      particles.push({x,y:y-15,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed-45,
        size:2+Math.random()*4,life:.6+Math.random()*.7,maxLife:1.3,hue:i%3===0?'#ffffff':i%3===1?'#8dfff1':'#56d9fc'});
    }
  }
  function updateParticles(dt){
    for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=80*dt;p.life-=dt;if(p.life<=0)particles.splice(i,1);}
  }
  function drawParticles(){
    ctx.save();ctx.globalCompositeOperation='screen';
    for(const p of particles){ctx.globalAlpha=Math.min(1,p.life*1.6);circle(p.x,p.y,p.size,p.hue);}
    ctx.restore();
  }
  function drawCrystals(time){
    CRYSTALS.forEach((pos,i)=>{
      if(found()[i])return;
      const bob=Math.sin(time*.003+i*2)*8;
      ctx.save();ctx.translate(pos.x,pos.y+bob);
      circle(0,35,31,'rgba(0,0,0,.20)');
      const aura=ctx.createRadialGradient(0,-9,4,0,-9,56);
      aura.addColorStop(0,'rgba(85,252,240,.32)');aura.addColorStop(1,'rgba(85,252,240,0)');circle(0,-9,57,aura);
      ctx.rotate(Math.sin(time*.0018+i*3)*.10);
      if(!imageAt('crystal',0,-12,64,80)){
        ctx.shadowColor='#44f9e6';ctx.shadowBlur=18;ctx.fillStyle='#4bd9e7';ctx.strokeStyle='#dbffff';ctx.lineWidth=3;
        ctx.beginPath();ctx.moveTo(0,-51);ctx.lineTo(23,-20);ctx.lineTo(14,22);ctx.lineTo(-14,22);ctx.lineTo(-23,-20);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;
        ctx.fillStyle='rgba(255,255,255,.55)';ctx.beginPath();ctx.moveTo(0,-46);ctx.lineTo(11,-20);ctx.lineTo(-3,-9);ctx.closePath();ctx.fill();
      }
      for(let j=0;j<5;j++){const angle=time*.001*(j%2?1:-1)+j*1.256+i;const radius=33+(j%2)*15;const xx=Math.sin(angle)*radius,yy=-10+Math.cos(angle)*radius*.65;ctx.globalAlpha=.40+.40*Math.abs(Math.sin(time*.005+j));circle(xx,yy,1.5+(j%3),'#dffffc');}ctx.globalAlpha=1;
      ctx.font='800 16px system-ui';ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='rgba(4,13,30,.9)';ctx.strokeText('КРИСТАЛЛ '+(i+1),0,-61);ctx.fillStyle='#eaffff';ctx.fillText('КРИСТАЛЛ '+(i+1),0,-61);
      if(distance(player,pos)<INTERACT_RADIUS){rounded(-68,42,136,24,10);ctx.fillStyle='rgba(6,24,42,.9)';ctx.fill();ctx.fillStyle='#98ffe8';ctx.font='bold 13px system-ui';ctx.fillText('НАЖМИ: ВОПРОС',0,59);}
      ctx.restore();
    });
  }
  function drawScientist(time){
    const near=distance(player,SCIENTIST)<INTERACT_RADIUS;
    ctx.save();ctx.translate(SCIENTIST.x,SCIENTIST.y+Math.sin(time*.0027)*3);
    ctx.rotate(Math.sin(time*.003)*.018);
    circle(0,38,31,'rgba(0,0,0,.20)');
    if(!imageAt('scientist',0,-11,99,116)){
      ctx.fillStyle='#f5c970';ctx.strokeStyle='#fff5cd';ctx.lineWidth=2;rounded(-22,-24,44,50,12);ctx.fill();ctx.stroke();
      ctx.fillStyle='#ebf9ff';ctx.beginPath();ctx.arc(0,-43,24,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#acc6d7';ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle='#9ac5d0';ctx.beginPath();ctx.ellipse(0,-42,17,14,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#234f64';circle(-7,-43,2.8,'#234f64');circle(7,-43,2.8,'#234f64');
      ctx.strokeStyle='#1a566e';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-39,6,0,Math.PI);ctx.stroke();
      ctx.fillStyle='#ffeec8';rounded(-28,5,15,26,6);ctx.fill();
      ctx.save();ctx.translate(20,8);ctx.rotate(Math.sin(time*.007)*.24);rounded(-7,-3,15,26,6);ctx.fill();ctx.restore();
      ctx.fillStyle='#1e6783';rounded(-17,20,13,18,4);ctx.fill();rounded(4,20,13,18,4);ctx.fill();
    }
    ctx.textAlign='center';ctx.font='800 15px system-ui';ctx.lineWidth=4;ctx.strokeStyle='rgba(6,18,34,.88)';ctx.strokeText('УЧЁНЫЙ',0,-79);ctx.fillStyle='#fff6cf';ctx.fillText('УЧЁНЫЙ',0,-79);
    if(near){
      rounded(-126,-143,252,45,13);ctx.fillStyle='rgba(9,26,48,.88)';ctx.fill();
      ctx.fillStyle='#ebfffc';ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.fillText(completed()?'Отлично! Летим дальше!':found().some(Boolean)?'Остался один кристалл!':'Привет! Подойди поговорить!',0,-116);
      rounded(-70,50,140,25,9);ctx.fillStyle='rgba(9,26,48,.91)';ctx.fill();ctx.fillStyle='#a9ffe8';ctx.font='bold 12px system-ui';ctx.fillText('НАЖМИ: ГОВОРИТЬ',0,68);}
    ctx.restore();
  }
  function drawAstronaut(time){
    const isMoving=downKeys.has('w')||downKeys.has('a')||downKeys.has('s')||downKeys.has('d')||
      [...downKeys].some(x=>x.startsWith('arrow'))||touchKeys.size>0;
    const stride=isMoving?Math.sin(player.motion):0;
    const bob=isMoving?Math.abs(stride)*4:Math.sin(time*.0025)*2;
    ctx.save();ctx.translate(player.x,player.y+bob);
    circle(0,37,28,'rgba(0,0,0,.27)');
    ctx.save();ctx.scale(player.facing,1);
    ctx.rotate(isMoving?stride*.045:Math.sin(time*.0018)*.013);
    if(imageAt('astronaut',0,-10,94,111)){ctx.restore();ctx.restore();return;}
    // Нарисованный запасной персонаж: раздельное движение ног и рук.
    ctx.fillStyle='#1a2b49';
    ctx.save();ctx.translate(-13,16);ctx.rotate(stride*.23);rounded(-7,0,15,25,5);ctx.fill();ctx.restore();
    ctx.save();ctx.translate(13,16);ctx.rotate(-stride*.23);rounded(-7,0,15,25,5);ctx.fill();ctx.restore();
    ctx.fillStyle='#e8f8ff';ctx.strokeStyle='#9eb7c8';ctx.lineWidth=2;
    rounded(-24,-27,48,52,14);ctx.fill();ctx.stroke();
    ctx.fillStyle='#167ea4';rounded(-31,-19,15,40,6);ctx.fill();
    ctx.strokeStyle='#d4ecfa';ctx.lineWidth=10;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(-21,-15);ctx.lineTo(-30-stride*7,7);ctx.moveTo(21,-15);ctx.lineTo(31+stride*7,7);ctx.stroke();
    circle(0,-43,27,'#f4faff');circle(4,-43,18,'#216b98');circle(1,-48,8,'rgba(179,255,255,.65)');
    ctx.fillStyle='#163d64';rounded(-11,-11,22,17,5);ctx.fill();circle(0,-3,4,current().accent);
    ctx.restore();ctx.restore();
  }
  function drawFlightScene(time){
    if(!flight)return;
    const f=flight,progress=Math.min(1,f.elapsed/f.duration);
    ctx.save();ctx.fillStyle='#050b24';ctx.fillRect(0,0,1200,600);
    // Полёт через звёзды: линии увеличиваются к середине перехода.
    for(let i=0;i<115;i++){
      const star=stars[i],speed=130+((i*17)%8)*95;
      const x=((star.x-progress*speed*12)%1350+1350)%1350-75,y=star.y*1.35;
      ctx.strokeStyle=`rgba(205,246,255,${.22+(i%5)*.09})`;ctx.lineWidth=i%5===0?2:1;
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+10+progress*66,y);ctx.stroke();
    }
    const gradient=ctx.createRadialGradient(820,280,5,820,280,360);
    const end=PLANETS[f.to];gradient.addColorStop(0,lighten(end.base,.2));gradient.addColorStop(1,end.base);
    if(progress>.52){ctx.save();ctx.globalAlpha=Math.min(1,(progress-.52)*2.0);circle(1000,310,80+(progress-.52)*620,gradient);ctx.restore();}
    const shipX=progress<.33?1040-(progress/.33)*420:620+Math.sin(progress*5)*22;
    const shipY=progress<.33?387-progress/.33*320:75+Math.sin(progress*20)*11;
    ctx.save();ctx.translate(shipX,shipY);ctx.rotate(progress<.33?progress*.9:1.1);
    // Выхлоп двигателя.
    const flicker=Math.sin(time*.052)*9;
    ctx.fillStyle='rgba(255,215,105,.90)';ctx.beginPath();ctx.moveTo(-17,68);ctx.lineTo(0,134+flicker);ctx.lineTo(17,68);ctx.fill();
    ctx.fillStyle='#8befff';ctx.beginPath();ctx.moveTo(-9,68);ctx.lineTo(0,112+flicker*.45);ctx.lineTo(9,68);ctx.fill();
    if(!imageAt('rocket',0,0,120,157)){
      ctx.fillStyle='#eef9ff';ctx.strokeStyle='#6d9caf';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(0,-85);ctx.quadraticCurveTo(42,-42,30,62);ctx.lineTo(-30,62);ctx.quadraticCurveTo(-42,-42,0,-85);ctx.fill();ctx.stroke();
      circle(0,-19,18,'#30a7c9');ctx.fillStyle='#ff9172';ctx.beginPath();ctx.moveTo(-28,27);ctx.lineTo(-48,66);ctx.lineTo(-23,57);ctx.moveTo(28,27);ctx.lineTo(48,66);ctx.lineTo(23,57);ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle='rgba(227,250,255,.95)';ctx.font='bold 26px system-ui';ctx.textAlign='center';
    ctx.fillText('ПОЛЁТ К '+end.name.toUpperCase(),600,525);
    ctx.fillStyle='rgba(145,241,234,.65)';ctx.fillRect(330,544,540*progress,5);
    ctx.strokeStyle='rgba(182,235,245,.3)';ctx.strokeRect(330,544,540,5);
    ctx.restore();
  }
  function drawScene(time){
    const dpr=viewport.dpr;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.setTransform(dpr*viewport.scale,0,0,dpr*viewport.scale,dpr*viewport.offX,dpr*viewport.offY);
    if(flight){drawFlightScene(time);return;}
    drawSky(time);drawTerrain(time);drawRocket();drawCrystals(time);drawScientist(time);drawAstronaut(time);drawParticles();
  }
  function frame(time){const dt=Math.min((time-lastFrame)/1000||0,.045);lastFrame=time;updateFlight(dt);updateMovement(dt);updateParticles(dt);uiElapsed+=dt;if(uiElapsed>.12&&!flight){refreshUI();uiElapsed=0;}drawScene(time);requestAnimationFrame(frame);}

  resize();refreshUI();requestAnimationFrame(frame);
})();
