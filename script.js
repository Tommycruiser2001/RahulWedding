(function(){

  /* ---------- Gate ---------- */
  var gate = document.getElementById('gate');
  var gateBtn = document.getElementById('gate-btn');
  document.body.style.overflow = 'hidden';
  function openGate(){
    gate.classList.add('hide');
    document.body.style.overflow = '';
    window.scrollTo(0,0);
    startMusic();
    var mt = document.getElementById('music-toggle');
    if(mt) mt.hidden = false;
    setTimeout(function(){ if(gate && gate.parentNode){ gate.parentNode.removeChild(gate); } }, 1100);
  }
  gateBtn.addEventListener('click', openGate);

  /* ---------- Swipe cue -> scroll ---------- */
  var swipe = document.getElementById('swipe-cue');
  if(swipe){
    swipe.addEventListener('click', function(){
      var w = document.querySelector('.welcome');
      if(w) w.scrollIntoView({behavior:'smooth'});
    });
  }

  /* ---------- Scroll reveal ---------- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:0.16});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* ---------- Sparkle field ---------- */
  function sparkleField(canvas, host, count){
    var ctx = canvas.getContext('2d');
    function size(){ canvas.width = host.offsetWidth; canvas.height = host.offsetHeight; }
    size(); window.addEventListener('resize', size);
    var ps = [];
    for(var i=0;i<count;i++){
      ps.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.6+0.5,
        sp:Math.random()*0.3+0.06,dr:(Math.random()-0.5)*0.25,al:Math.random()*0.5+0.25,
        tw:Math.random()*0.02+0.008,ph:Math.random()*6.28});
    }
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ps.forEach(function(p){
        p.ph+=p.tw; var a=p.al*(0.5+0.5*Math.sin(p.ph));
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.2832);
        ctx.fillStyle='rgba(224,195,137,'+a.toFixed(3)+')'; ctx.fill();
        p.y-=p.sp; p.x+=p.dr;
        if(p.y<-4){p.y=canvas.height+4;p.x=Math.random()*canvas.width;}
      });
      requestAnimationFrame(draw);
    }
    draw();
  }
  sparkleField(document.getElementById('sparkle'), document.getElementById('hero'), 40);
  var sp2 = document.getElementById('sparkle2');
  if(sp2) sparkleField(sp2, document.getElementById('contact-sec'), 30);

  /* ---------- Countdown ---------- */
  (function(){
    var target = new Date('2026-08-27T10:11:00+05:30').getTime();
    var d=document.getElementById('cd-d'),h=document.getElementById('cd-h'),
        m=document.getElementById('cd-m'),s=document.getElementById('cd-s');
    function pad(n){return String(n).padStart(2,'0');}
    function tick(){
      var diff=target-Date.now(); if(diff<0)diff=0;
      d.textContent=pad(Math.floor(diff/86400000));
      h.textContent=pad(Math.floor((diff%86400000)/3600000));
      m.textContent=pad(Math.floor((diff%3600000)/60000));
      s.textContent=pad(Math.floor((diff%60000)/1000));
    }
    tick(); setInterval(tick,1000);
  })();

  /* ---------- Scratch to reveal ---------- */
  (function(){
    var holder=document.getElementById('scratch-holder');
    var canvas=document.getElementById('scratch-canvas');
    var ctx=canvas.getContext('2d');
    var revealed=false, drawing=false, scheduled=false;
    function paint(){
      var r=holder.getBoundingClientRect();
      canvas.width=r.width; canvas.height=r.height;
      var w=canvas.width,h=canvas.height;
      var g=ctx.createLinearGradient(0,0,w,h);
      g.addColorStop(0,'#e7b85f'); g.addColorStop(0.5,'#cfa15c'); g.addColorStop(1,'#b8863f');
      ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
      ctx.save(); ctx.globalAlpha=0.10; ctx.strokeStyle='#fff'; ctx.lineWidth=1;
      for(var i=0;i<7;i++){ ctx.beginPath(); ctx.moveTo(0,(h/7)*i); ctx.lineTo(w,(h/7)*i+14); ctx.stroke(); }
      ctx.restore();
      ctx.fillStyle='rgba(255,250,244,0.9)'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.font='600 13px Georgia, serif';
      ctx.fillText('S C R A T C H   H E R E', w/2, h/2);
    }
    paint(); window.addEventListener('resize', function(){ if(!revealed) paint(); });
    function pos(e){
      var r=canvas.getBoundingClientRect();
      var cx=e.touches?e.touches[0].clientX:e.clientX;
      var cy=e.touches?e.touches[0].clientY:e.clientY;
      return {x:(cx-r.left)*(canvas.width/r.width),y:(cy-r.top)*(canvas.height/r.height)};
    }
    function scratch(x,y){
      ctx.globalCompositeOperation='destination-out';
      ctx.beginPath(); ctx.arc(x,y,28,0,6.2832); ctx.fill();
      ctx.globalCompositeOperation='source-over';
    }
    function check(){
      if(revealed) return;
      var data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
      var clear=0,total=0;
      for(var i=3;i<data.length;i+=24){ total++; if(data[i]<50) clear++; }
      if(clear/total>0.52) finish();
    }
    function finish(){
      revealed=true;
      holder.style.transition='opacity 0.6s ease';
      holder.style.opacity='0';
      setTimeout(function(){ holder.style.display='none'; },650);
      confetti();
    }
    function start(e){ drawing=true; move(e); }
    function end(){ drawing=false; if(!scheduled){scheduled=true;requestAnimationFrame(function(){check();scheduled=false;});} }
    function move(e){
      if(!drawing)return; e.preventDefault();
      var p=pos(e); scratch(p.x,p.y);
      if(!scheduled){scheduled=true;requestAnimationFrame(function(){check();scheduled=false;});}
    }
    canvas.addEventListener('mousedown',start);
    canvas.addEventListener('mousemove',move);
    window.addEventListener('mouseup',end);
    canvas.addEventListener('touchstart',start,{passive:false});
    canvas.addEventListener('touchmove',move,{passive:false});
    canvas.addEventListener('touchend',end);
  })();

  /* ---------- Confetti ---------- */
  function confetti(){
    var canvas=document.getElementById('confetti');
    var ctx=canvas.getContext('2d');
    canvas.width=window.innerWidth; canvas.height=window.innerHeight;
    var colors=['#cfa15c','#c97b86','#7a1d2e','#e0c389','#d99aa2','#9ec5c9','#e8b0bd'];
    var ps=[];
    for(var i=0;i<120;i++){
      var dash=Math.random()>0.5;
      ps.push({x:canvas.width*(0.2+Math.random()*0.6),y:canvas.height*0.32+(Math.random()-0.5)*60,
        vx:(Math.random()-0.5)*5,vy:Math.random()*-7-2,g:0.16+Math.random()*0.08,
        col:colors[Math.floor(Math.random()*colors.length)],dash:dash,
        len:dash?(Math.random()*9+5):0,rad:dash?0:(Math.random()*2.4+1.4),
        rot:Math.random()*6.28,vr:(Math.random()-0.5)*0.3});
    }
    var start=Date.now();
    function frame(){
      var el=Date.now()-start;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      var alive=false;
      ps.forEach(function(p){
        p.vy+=p.g; p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr;
        if(p.y<canvas.height+20) alive=true;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
        ctx.fillStyle=p.col; ctx.strokeStyle=p.col;
        if(p.dash){ ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(-p.len/2,0); ctx.lineTo(p.len/2,0); ctx.stroke(); }
        else { ctx.beginPath(); ctx.arc(0,0,p.rad,0,6.2832); ctx.fill(); }
        ctx.restore();
      });
      if(alive && el<4200) requestAnimationFrame(frame);
      else ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    frame();
  }

  /* ---------- Background music (mp3) ---------- */
  var bgm = document.getElementById('bg-music');
  var musicOn = false;
  function startMusic(){
    if(!bgm) return;
    bgm.volume = 0.55;
    var pr = bgm.play();
    if(pr && pr.then){ pr.then(function(){ musicOn = true; }).catch(function(){ musicOn = false; }); }
    else { musicOn = true; }
  }
  window.__startMusic = startMusic;
  var toggle = document.getElementById('music-toggle');
  if(toggle){
    toggle.addEventListener('click', function(){
      if(!bgm) return;
      if(musicOn){
        bgm.pause();
        musicOn = false; toggle.classList.add('muted');
      }else{
        bgm.play();
        musicOn = true; toggle.classList.remove('muted');
      }
    });
  }

})();
