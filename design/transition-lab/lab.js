import {TransitionRenderer, transitions, FPS, W, H, clamp, drawCrop} from './effects.js?v=murtpf86';
import {editorial, aiCatalogue} from './catalog.js?v=murtpf86';

const $=id=>document.getElementById(id);
const video=$('source'),renderer=new TransitionRenderer($('preview'));
let selected=null,ready=false,original=false,lastActive=null,filter='all',lastTime=0;
let pendingSeek=null;
const status=$('player-status');
const timeLabel=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;
const timecode=t=>timeLabel(t)+'.'+String(Math.floor((t%1)*100)).padStart(2,'0');
const tags=items=>`<span class="usage-tags">${items.map(tag=>`<span class="usage-tag">${tag}</span>`).join('')}</span>`;

function library() {
  $('transition-list').replaceChildren();$('markers').replaceChildren();
  transitions.forEach((t,index)=>{
    const row=document.createElement('button');row.className='transition-row'+(t.original?' original':'');row.dataset.id=t.id;
    row.setAttribute('aria-label',`${t.name}${t.original?' · Concept original':''} à ${timeLabel(t.cut)}`);
    row.innerHTML=`<span class="row-number">${String(index+1).padStart(2,'0')}</span><span class="row-copy"><span class="row-title">${t.name}</span><span class="row-sub ${t.original?'original-label':''}">${t.original?'Concept original · Montaj':t.frames+' images · '+Math.round(t.duration*1000)+' ms'}</span>${tags(editorial[t.id].tags)}</span><span class="row-time">${timeLabel(t.cut)}</span><span class="row-arrow" aria-hidden="true">↗</span>`;
    row.onclick=()=>selectTransition(t,true);$('transition-list').append(row);
    const marker=document.createElement('button');marker.className='marker'+(t.original?' original':'');marker.dataset.id=t.id;marker.dataset.label=`${String(index+1).padStart(2,'0')} · ${t.name}`;
    marker.style.left=(Number.isFinite(video.duration)&&video.duration>0?t.cut/video.duration*100:0)+'%';marker.setAttribute('aria-label',`Aller à ${t.name}, ${timeLabel(t.cut)}`);marker.onclick=()=>selectTransition(t,true);$('markers').append(marker);
  });
}
function paintSelection() {
  if(!selected)return;
  document.querySelectorAll('[data-id]').forEach(el=>{const match=el.dataset.id===selected.id;el.classList.toggle('selected',match);if(el.classList.contains('transition-row'))el.setAttribute('aria-pressed',String(match));});
  const t=selected;$('detail').className='detail'+(t.original?' original':'');
  const metadata=editorial[t.id],style=renderer.style(t.id),variant=metadata.variants?.find(v=>v.id===style.variant);
  const intensity=t.intensityTarget?`<div class="effect-control"><div class="control-heading"><label for="intensity">Intensité</label><output id="intensity-value" for="intensity">${Math.round(renderer.intensity(t.id)*100)} %</output><button id="reset-intensity" class="reset-control" aria-label="Rétablir l’intensité à 100 %">↺</button></div><input id="intensity" type="range" min="0" max="150" step="5" value="${Math.round(renderer.intensity(t.id)*100)}" aria-describedby="intensity-hint"><p id="intensity-hint">${t.intensityTarget}.<br>0 = coupe franche · 100 = réglage initial</p></div>`:'<p class="control-hint">Timing naturel : aucune intensité à régler.</p>';
  const duration=`<div class="effect-control duration-control"><div class="control-heading"><label for="duration">Durée</label><output id="duration-value" for="duration">${Math.round(t.duration*1000)} ms</output><button id="reset-duration" class="reset-control" aria-label="Rétablir la durée initiale">↺</button></div><input id="duration" type="range" min="${t.minFrames}" max="${t.maxFrames}" step="1" value="${t.frames}" aria-valuetext="${Math.round(t.duration*1000)} millisecondes" aria-describedby="duration-hint"><p id="duration-hint">${Math.round(t.minFrames/FPS*1000)}–${Math.round(t.maxFrames/FPS*1000)} ms · pas de 1 image à 30 ips.${t.id==='blink'?' Coupe toujours calée sur ton clignement.':' La voix garde sa vitesse.'}</p></div>`;
  const variants=metadata.variants?`<div class="variant-control"><span class="control-label">Sens du passage</span><div class="variant-buttons">${metadata.variants.map(v=>`<button data-variant="${v.id}" aria-pressed="${v.id===style.variant}">${v.name}</button>`).join('')}</div><p id="variant-description">${variant.use}</p></div>`:'';
  const material=['portal','gravity'].includes(t.id)?`<div class="effect-control paper-control"><label class="material-toggle"><input id="paper" type="checkbox" ${style.paper?'checked':''}> Papier déchiré <span>COLLAGE</span></label><div id="paper-settings" ${style.paper?'':'hidden'}><div class="control-heading"><label for="paper-border">Largeur du bord</label><output id="paper-border-value" for="paper-border">${style.border} px</output></div><input id="paper-border" type="range" min="0" max="40" step="1" value="${style.border}"><div class="control-heading"><label for="paper-roughness">Irrégularité</label><output id="paper-roughness-value" for="paper-roughness">${Math.round(style.roughness*100)} %</output></div><input id="paper-roughness" type="range" min="0" max="100" step="5" value="${Math.round(style.roughness*100)}"><label class="monochrome-toggle"><input id="paper-monochrome" type="checkbox" ${style.monochrome?'checked':''}> Découpe en noir et blanc</label><p>Bord blanc fibreux, déchirure irrégulière, ombre légère. Le fond conserve ses couleurs.</p></div></div>`:'';
  $('detail').innerHTML=`<div class="detail-eyebrow">${t.original?'CONCEPT ORIGINAL · PROPOSITION MONTAJ':'ÉTUDE '+String(t.index+1).padStart(2,'0')}</div><h3>${t.name}</h3><p>${t.motif}</p><div id="detail-tags">${tags(variant?.tags??metadata.tags)}</div><div class="person-treatment"><span>SUR LA PERSONNE</span>${t.person}</div>${variants}${intensity}${duration}${material}<dl class="specs"><div><dt>DURÉE</dt><dd id="spec-duration">${Math.round(t.duration*1000)} ms</dd></div><div><dt>IMAGES</dt><dd id="spec-frames">${t.frames} à 30 ips</dd></div><div><dt>COUPE</dt><dd>${timecode(t.cut)}</dd></div></dl><details class="ai-guidance"><summary>Cas d’usage · critères pour l’IA</summary><p><b>Favoriser</b> ${metadata.favor}</p><p><b>Éviter</b> ${metadata.avoid}</p><p><b>Prérequis</b> ${metadata.needs.join(' · ')}.</p><p><b>Ton</b> ${metadata.tone}. Score attendu : pertinence 0–100 %, distinct de l’intensité. Aucun score IA calculé dans ce labo.</p></details><p class="implementation-note">${t.note}</p><details><summary>Physique · 100 % et durée initiale</summary><p>${t.physics}</p><p>La durée étire les phases proportionnellement. Les poses détourées de cet aperçu restent extraites aux timecodes initiaux.</p>${metadata.variants?'<p>IN fait entrer la découpe de B ; OUT fait sortir celle de A. La photo et son bord papier suivent la même transformation, puis B reprend tout le cadre.</p>':''}</details>`;
  bindEffectControls(t);
  $('active-number').textContent=`${String(t.index+1).padStart(2,'0')} / 11`;
  const out=$('outgoing').getContext('2d'),incoming=$('incoming').getContext('2d');
  out.save();out.scale(108/W,192/H);out.clearRect(0,0,W,H);drawCrop(out,renderer.plates[t.id].image,t.before);out.restore();
  incoming.save();incoming.scale(108/W,192/H);incoming.clearRect(0,0,W,H);drawCrop(incoming,renderer.plates[t.id].incoming??renderer.plates[t.id].image,t.after);incoming.restore();
  $('out-label').textContent=t.before===1?'Cadre large':'Cadre rapproché';$('in-label').textContent=t.after===1?'Cadre large':'Cadre rapproché';
}
function previewSetting(t) {
  if(original){original=false;$('compare').setAttribute('aria-pressed','false');$('compare').textContent='Voir la source';$('video-mode').textContent='TRANSITIONS ACTIVES';}
  if(video.paused&&(video.currentTime<t.start||video.currentTime>=t.end))video.currentTime=t.start+t.duration*.55;
  else render();
  status.textContent=`${t.name} · réglages mémorisés. Rejoue ou boucle le passage pour voir le mouvement.`;
}
function bindEffectControls(t) {
  const updateDuration=()=>{
    renderer.setDuration(t.id,Number($('duration').value));const ms=Math.round(t.duration*1000);
    $('duration-value').value=ms+' ms';$('duration').setAttribute('aria-valuetext',ms+' millisecondes');
    $('spec-duration').textContent=ms+' ms';$('spec-frames').textContent=t.frames+' à 30 ips';
    if(!t.original)document.querySelector(`.transition-row[data-id="${t.id}"] .row-sub`).textContent=t.frames+' images · '+ms+' ms';
    previewSetting(t);
  };
  $('duration').oninput=updateDuration;$('reset-duration').onclick=()=>{$('duration').value=String(t.defaultFrames);updateDuration();};
  if($('intensity')){
    const update=()=>{renderer.setIntensity(t.id,Number($('intensity').value)/100);$('intensity-value').value=$('intensity').value+' %';$('intensity').setAttribute('aria-valuetext',$('intensity').value+' %');previewSetting(t);};
    $('intensity').oninput=update;$('reset-intensity').onclick=()=>{$('intensity').value='100';update();};
  }
  document.querySelectorAll('[data-variant]').forEach(button=>button.onclick=()=>{
    renderer.setStyle(t.id,{variant:button.dataset.variant});document.querySelectorAll('[data-variant]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    const variant=editorial[t.id].variants.find(v=>v.id===button.dataset.variant);$('variant-description').textContent=variant.use;$('detail-tags').innerHTML=tags(variant.tags);previewSetting(t);
  });
  if($('paper')){
    $('paper').onchange=()=>{renderer.setStyle(t.id,{paper:$('paper').checked});$('paper-settings').hidden=!$('paper').checked;previewSetting(t);};
    $('paper-border').oninput=()=>{renderer.setStyle(t.id,{border:Number($('paper-border').value)});$('paper-border-value').value=$('paper-border').value+' px';previewSetting(t);};
    $('paper-roughness').oninput=()=>{renderer.setStyle(t.id,{roughness:Number($('paper-roughness').value)/100});$('paper-roughness-value').value=$('paper-roughness').value+' %';previewSetting(t);};
    $('paper-monochrome').onchange=()=>{renderer.setStyle(t.id,{monochrome:$('paper-monochrome').checked});previewSetting(t);};
  }

}
function selectTransition(t,autoplay=false) {
  if(!ready)return;
  selected=t;history.replaceState(null,'','#'+t.id);paintSelection();
  seekToTransition(t);
  if(autoplay)play();else{video.pause();render();}
  status.textContent=`${t.name} · lecture 0,85 s avant l’effet.`;
}
function seekToTransition(t) {
  const target=Math.max(0,t.start-.85);
  if(video.readyState>=1&&Number.isFinite(video.duration))video.currentTime=target;
  else pendingSeek=target;
}
function updateDurationMetadata() {
  if(!Number.isFinite(video.duration)||video.duration<=0)return;
  $('total-time').textContent=timecode(video.duration);$('seek').max=String(video.duration);
  document.querySelectorAll('.marker').forEach(marker=>{const t=transitions.find(t=>t.id===marker.dataset.id);if(t)marker.style.left=(t.cut/video.duration*100)+'%';});
  if(pendingSeek!==null){const target=pendingSeek;pendingSeek=null;video.currentTime=clamp(target,0,video.duration-.001);}
}
function render(time=video.currentTime) {
  if(!ready||video.readyState<2)return;
  lastTime=time;
  const active=renderer.render(video,time,{original});
  $('current-time').textContent=timecode(time);$('seek').value=String(time);
  $('timeline-progress').style.width=(time/video.duration*100)+'%';
  $('frame-label').textContent='IMAGE '+String(Math.floor(time*FPS+.001)).padStart(4,'0');
  $('effect-chip').hidden=!active;
  if(active){$('effect-name').textContent=active.name+(active.id==='portal'?' · '+renderer.style('portal').variant.toUpperCase():'');$('effect-chip').classList.toggle('original',Boolean(active.original));}
  if(active?.id!==lastActive){
    document.querySelectorAll('.transition-row').forEach(row=>row.classList.toggle('active',row.dataset.id===active?.id));
    if(active&&active!==selected&&!$('loop').checked){selected=active;paintSelection();}
    lastActive=active?.id??null;
  }
  if($('loop').checked&&selected&&!video.paused&&!video.seeking&&time>selected.end+.85){video.currentTime=Math.max(0,selected.start-.85);}
}
async function play() {
  if(!ready)return;
  try {
    // iPhone Safari can defer media loading until an explicit user gesture.
    // Start the request from Lire or a transition click instead of setup.
    if(video.networkState===HTMLMediaElement.NETWORK_EMPTY||video.error)video.load();
    await video.play();status.textContent=$('loop').checked?'Boucle du passage sélectionné.':'Lecture du montage · les onze transitions sont actives.';
  }
  catch(error){status.textContent='Appuie sur Lire pour démarrer la vidéo.';console.warn(error);}
}
function togglePlay(){if(video.paused)play();else video.pause();}
function stepFrame(direction){if(!ready)return;video.pause();const index=Math.floor(video.currentTime*FPS+.001)+direction;video.currentTime=clamp(index/FPS+.0001,0,video.duration-.001);}
$('play').onclick=togglePlay;$('center-play').onclick=togglePlay;
$('preview').onclick=togglePlay;
$('replay').onclick=()=>selectTransition(selected,true);
$('rate').onchange=()=>{video.playbackRate=Number($('rate').value);status.textContent=`Vitesse ${$('rate').value.replace('.',',')}× · les durées affichées restent celles du montage à 30 ips.`;};
$('sound').onclick=()=>{video.muted=!video.muted;$('sound').setAttribute('aria-pressed',String(!video.muted));$('sound').textContent=video.muted?'Son off':'Son on';$('sound').setAttribute('aria-label',video.muted?'Activer le son':'Couper le son');};
$('seek').addEventListener('input',()=>{if(!ready)return;video.currentTime=Number($('seek').value);});
$('previous-frame').onclick=()=>stepFrame(-1);$('next-frame').onclick=()=>stepFrame(1);
$('compare').onclick=()=>{original=!original;$('compare').setAttribute('aria-pressed',String(original));$('compare').textContent=original?'Revenir aux effets':'Voir la source';$('video-mode').textContent=original?'SOURCE SANS EFFETS':'TRANSITIONS ACTIVES';render();};
$('loop').onchange=()=>{if($('loop').checked&&selected)selectTransition(selected,true);};
$('export-catalog').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(aiCatalogue(transitions,renderer),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='montaj-transition-catalogue-ia.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
document.querySelectorAll('[data-filter]').forEach(button=>button.onclick=()=>{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('.transition-row').forEach(row=>{row.hidden=filter==='original'&&!row.classList.contains('original');});});
video.addEventListener('play',()=>{$('play').textContent='Ⅱ Pause';$('center-play').hidden=true;});
video.addEventListener('loadedmetadata',updateDurationMetadata);
video.addEventListener('durationchange',updateDurationMetadata);
video.addEventListener('loadeddata',()=>{if(pendingSeek!==null)updateDurationMetadata();render();});
video.addEventListener('error',()=>{if(video.error){status.textContent=`La vidéo ne peut pas être décodée (code ${video.error.code}). Réessaie avec le bouton Lire.`;console.error('Échec du chargement vidéo',video.error.message);}});
video.addEventListener('pause',()=>{$('play').textContent='▶ Lire';$('center-play').hidden=false;render();});
video.addEventListener('seeked',()=>render());
video.addEventListener('ended',()=>{if($('loop').checked&&selected)selectTransition(selected,true);else status.textContent='Fin du montage. Choisis un effet pour revoir son passage.';});
video.addEventListener('waiting',()=>{if(ready)status.textContent='Chargement du passage…';});
document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
document.addEventListener('keydown',event=>{
  if(['INPUT','SELECT','TEXTAREA','BUTTON','A'].includes(document.activeElement?.tagName))return;
  if(event.code==='Space'){event.preventDefault();togglePlay();}
  if(event.code==='ArrowLeft'){event.preventDefault();stepFrame(-1);}
  if(event.code==='ArrowRight'){event.preventDefault();stepFrame(1);}
});

async function setup() {
  try {
    // Don't block the editor on video data: mobile Safari may defer it until Play.
    await Promise.all([renderer.load('../output/transition-lab/plates'),document.fonts.ready]);
    ready=true;$('load-cover').hidden=true;$('play').disabled=false;
    updateDurationMetadata();
    library();
    updateDurationMetadata();
    const requested=location.hash.slice(1);selected=transitions.find(t=>t.id===requested)??transitions[0];
    selectTransition(selected,false);
    if('requestVideoFrameCallback' in video){const tick=(_,meta)=>{render(meta.mediaTime);video.requestVideoFrameCallback(tick);};video.requestVideoFrameCallback(tick);}
    else {const tick=()=>{if(!video.paused)render();requestAnimationFrame(tick);};requestAnimationFrame(tick);}
    status.textContent='Prêt · touche Lire ou sélectionne un effet pour charger la vidéo. Espace = lecture, flèches = image par image.';
  } catch(error){$('load-status').textContent=error.message;status.textContent=error.message;$('load-cover').querySelector('.loader').hidden=true;console.error(error);}
}
// Small deterministic interface used to inspect the rendered effect frames.
window.motionLab={get ready(){return ready;},renderer,transitions,select(id,autoplay=false){selectTransition(transitions.find(t=>t.id===id),autoplay);},get state(){return{selected:selected?.id,time:video.currentTime,paused:video.paused,original,rate:video.playbackRate,active:renderer.find(lastTime)?.id,glass:!!renderer.glassRenderer};},async inspect(id,progress){video.pause();const t=transitions.find(t=>t.id===id);selected=t;paintSelection();const target=t.start+clamp(progress)*t.duration;await new Promise(resolve=>{if(Math.abs(video.currentTime-target)<.001){resolve();return;}video.addEventListener('seeked',resolve,{once:true});video.currentTime=target;});renderer.render(video,target,{override:{transition:t,progress:clamp(progress)}});return{time:target,id,progress};}};
setup();
