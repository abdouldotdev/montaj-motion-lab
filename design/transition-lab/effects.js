import {PaperCutout} from './paper-cutout.js?v=murtpf86';
export const FPS = 30;
export const W = 720, H = 1280;
export const transitions = [
  {id:'face', name:'Face Match', cut:4, frames:4, motif:'Le regard reste le point fixe.', use:'Nouvelle idée · changement d’angle', physics:'Le cadrage bascule autour du milieu des yeux. Un dépassement de 3 % retombe en 2 images suivant 1 − (1 − t)³.', note:'Deux cadrages du même rush simulent le raccord entre deux prises. Le point d’ancrage vient des yeux détectés dans ton image.', icon:'◎'},
  {id:'gesture', name:'Geste continu', cut:9, frames:6, motif:'Le geste traverse la coupe.', use:'Énumération · démonstration', physics:'La coupe tombe à mi-fenêtre. La main reste sur son ancre au changement d’échelle, puis le cadre retrouve son centre en 3 images.', note:'Le mouvement de ta main vient de la vidéo. Le second angle est simulé par recadrage autour de la main détectée.', icon:'↗'},
  {id:'hand', name:'Main devant l’objectif', cut:14, frames:12, motif:'Une main emporte le plan suivant.', use:'Changement de sujet · révélation', physics:'Une main extraite du rush approche l’objectif : échelle 1 → 14, défocalisation jusqu’à 10 px. A → B au maximum de couverture, puis sortie latérale.', note:'Mouvement simulé : ta main est extraite de l’image à 40 s. Ce rush ne contient pas de vrai geste couvrant l’objectif.', icon:'◒'},
  {id:'peel', name:'Découpe du personnage', cut:19, frames:14, motif:'Tu te détaches de ton propre plan.', use:'Avant / après · changement de ton', physics:'Le fond A disparaît en 3 images. La silhouette A pivote de 12°, recule à 0,92× puis glisse de 90 % de la largeur. Ombre portée de 18 px.', note:'Silhouette extraite localement de ta vidéo. La dernière pose de A est figée pendant son déplacement.', icon:'◩'},
  {id:'echo', name:'Écho figé', cut:24, frames:10, motif:'Un geste. Trois traces. Un nouveau plan.', use:'Punchline · réaction', physics:'A se fige pendant 2 images. Trois empreintes à 12, 24 et 36 px suivent le mouvement ; opacités 45 %, 25 %, 10 %, puis décroissance quadratique.', note:'Les échos utilisent ton détourage réel, adouci sous les épaules pour éviter une découpe visible à la taille.', icon:'≋'},
  {id:'word', name:'Mot-pivot', cut:29, frames:12, motif:'Le mot fait basculer l’image.', use:'Mot clé · point à retenir', physics:'RÉFÉRENCES entre à 0,85×, monte à 1,30× en 3 images, puis revient avec un ressort amorti. La coupe passe sous le mot à l’image 4.', note:'Mot de démonstration choisi pour ce passage. Le texte ajouté est une couche du labo ; les sous-titres du rush sont déjà intégrés à la vidéo.', icon:'Aa'},
  {id:'blink', name:'Blink cut', cut:35.4666667, frames:4, motif:'Un clignement, un autre cadrage.', use:'Raccord discret · respiration', physics:'Coupe franche au minimum d’ouverture des yeux détecté entre 33 et 36 s. Aucune paupière dessinée, aucun fondu : la vidéo fournit le clignement.', note:'Clignement réel repéré à 35,47 s. L’effet est volontairement discret ; le ralenti permet de voir le changement de cadrage.', icon:'—'},
  {id:'lag', name:'Décor en retard', cut:39, frames:16, original:true, motif:'Le monde change avant toi.', use:'Révélation · nouvelle réalité', physics:'Le décor A glisse de 1,12 largeur sous la silhouette, immobile pendant 4 images. Elle reprend le mouvement avec un ressort amorti de 3,5 %, puis laisse place à B en 2 images.', note:'Concept original Montaj : un décalage de temps entre la personne et le décor. Le détourage provient du rush, la pose sortante est figée.', icon:'⧖'},
  {id:'portal', name:'Passe-muraille', cut:44, frames:18, original:true, motif:'Un portrait déchiré traverse le plan.', use:'Transformation · promesse tenue', physics:'IN : la découpe B entre à 0,08×, rejoint 1× avec un dépassement de 4 %. OUT : la découpe A passe de 1× à 0,08× et pivote de 3,2°. Photo, masque et papier partagent leur transformation ; B reprend tout le cadre sur les dernières images.', note:'Variante collage inspirée de tes références : deux photos réellement détourées, un bord blanc déchiré et un noir et blanc optionnel. Les poses sont figées pendant le raccord, puis la vidéo reprend.', icon:'◈'},
  {id:'glass', name:'Onde de verre', cut:49, frames:14, original:true, motif:'La réalité se réfracte, puis se remplace.', use:'Déclic · prise de conscience', physics:'Une onde part du visage. Un anneau réfracte les pixels jusqu’à 2,8 % de la largeur, avec une séparation chromatique de 1,5 px. B reste net derrière son passage.', note:'Concept original Montaj : réfraction calculée par pixel, sur les deux cadrages de ta vidéo. Le visage retrouve sa forme dès que l’onde passe.', icon:'◉'},
  {id:'gravity', name:'Gravité inversée', cut:55, frames:18, original:true, motif:'Le décor part. Tu résistes. Tout bascule.', use:'Chute · conclusion · retournement', physics:'Le décor A accélère vers le haut avec y = −1,4 H t². La silhouette résiste 3 images, descend de 4 % puis est emportée. B se pose avec un rebond amorti de 3 %.', note:'Concept original Montaj : deux masses avec des inerties différentes. La silhouette figée et le décor viennent de la même image de ta vidéo.', icon:'↑'}
];
const treatment = {
  face: ['Recadrage autour du visage', 'Dépassement à l’arrivée'],
  gesture: ['Recadrage autour de la main', null],
  hand: ['Anime ta main détourée', 'Approche, rotation et flou de la main'],
  peel: ['Déplace et tourne ta silhouette', 'Déplacement, inclinaison et ombre'],
  echo: ['Duplique ta silhouette', 'Écartement et visibilité des échos'],
  word: ['Texte superposé · personne intacte', 'Rebond et présence du mot'],
  blink: ['Clignement réel · aucune animation du visage', null],
  lag: ['Anime ta silhouette et le décor séparément', 'Décalage du décor et rebond de la silhouette'],
  portal: ['Anime une photo détourée de ta silhouette', 'Accélération, rotation et dépassement'],
  glass: ['Déforme l’image, visage compris', 'Réfraction et séparation des couleurs'],
  gravity: ['Emporte ta silhouette vers le haut', 'Accélération, rotation et rebond']
};
const durationRanges={face:[2,12],gesture:[2,15],hand:[8,30],peel:[8,36],echo:[6,24],word:[8,36],blink:[2,6],lag:[10,36],portal:[10,45],glass:[8,30],gravity:[10,45]};
transitions.forEach(t=>{[t.person,t.intensityTarget]=treatment[t.id];t.defaultFrames=t.frames;[t.minFrames,t.maxFrames]=durationRanges[t.id];});
export const clamp = (x, a=0, b=1) => Math.max(a, Math.min(b, x));
const mix = (a,b,t) => a+(b-a)*t;
const smooth = x => {x=clamp(x);return x*x*(3-2*x);};
const easeOut = x => 1-Math.pow(1-clamp(x),3);
function surface(width=W,height=H){const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;return canvas;}
function clear(canvas){const context=canvas.getContext('2d');context.resetTransform();context.globalAlpha=1;context.globalCompositeOperation='source-over';context.filter='none';context.clearRect(0,0,canvas.width,canvas.height);return context;}
export function drawCrop(context,source,zoom=1,anchor=[.5,.22]) {
  context.drawImage(source,(1-zoom)*W*anchor[0],(1-zoom)*H*anchor[1],W*zoom,H*zoom);
}
function centroid(points){return points?.length ? [points.reduce((s,p)=>s+p[0],0)/points.length,points.reduce((s,p)=>s+p[1],0)/points.length] : [.5,.22];}
function loadImage(url){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Image introuvable : '+url));image.src=url;});}
function alphaMatte(image) {
  const canvas=surface(),context=clear(canvas);context.drawImage(image,0,0,W,H);
  const pixels=context.getImageData(0,0,W,H);
  for(let n=0;n<pixels.data.length;n+=4){pixels.data[n+3]=pixels.data[n];pixels.data[n]=pixels.data[n+1]=pixels.data[n+2]=255;}
  context.putImageData(pixels,0,0);return canvas;
}
function compositeMask(image,mask,zoom=1){const canvas=surface(),context=clear(canvas);drawCrop(context,image,zoom);context.globalCompositeOperation='destination-in';drawCrop(context,mask,zoom);context.globalCompositeOperation='source-over';return canvas;}

export class TransitionRenderer {
  constructor(canvas) {
    this.canvas=canvas;this.context=canvas.getContext('2d',{alpha:false});this.plates={};
    this.a=surface();this.b=surface();this.layer=surface();this.mask=surface();this.background=surface();
    this.glassRenderer=createGlassRenderer();
    this.intensities={};this.styles={};this.durations={};this.paperCutouts={};
    try {const stored=JSON.parse(localStorage.getItem('montaj-transition-intensities')??'{}');for(const t of transitions){if(Number.isFinite(stored[t.id]))this.intensities[t.id]=clamp(stored[t.id],0,1.5);}} catch {}
    try {const stored=JSON.parse(localStorage.getItem('montaj-transition-paper-styles')??localStorage.getItem('montaj-transition-styles')??'{}');for(const id of ['portal','gravity']){const value=stored[id];if(value&&typeof value==='object')this.styles[id]={variant:value.variant==='out'?'out':'in',paper:value.paper!==false,border:Number.isFinite(value.border)?clamp(value.border,0,40):24,roughness:Number.isFinite(value.roughness)?clamp(value.roughness):.7,monochrome:value.monochrome!==false};}}catch{}
    try{const stored=JSON.parse(localStorage.getItem('montaj-transition-durations')??'{}');for(const t of transitions){if(Number.isFinite(stored[t.id]))this.durations[t.id]=Math.round(clamp(stored[t.id],t.minFrames,t.maxFrames));}}catch{}
  }
  intensity(id){return this.intensities[id]??1;}
  setIntensity(id,value){this.intensities[id]=clamp(value,0,1.5);try{localStorage.setItem('montaj-transition-intensities',JSON.stringify(this.intensities));}catch{}}
  style(id){return this.styles[id]??{variant:'in',paper:true,border:24,roughness:.7,monochrome:true};}
  setStyle(id,patch){this.styles[id]={...this.style(id),...patch};try{localStorage.setItem('montaj-transition-paper-styles',JSON.stringify(this.styles));}catch{}}
  paperCutout(id,incoming=false){const key=id+(incoming?'-incoming':'');if(!this.paperCutouts[key]){const plate=this.plates[id];this.paperCutouts[key]=new PaperCutout({mask:incoming?plate.incomingMask:plate.mask,width:W,height:H,seed:71});}const style=this.style(id);return this.paperCutouts[key].setStyle({borderWidth:style.paper?style.border:0,roughness:style.roughness,shadow:4});}
  setDuration(id,frames){const t=transitions.find(t=>t.id===id);this.durations[id]=Math.round(clamp(frames,t.minFrames,t.maxFrames));this.updateTiming(t);try{localStorage.setItem('montaj-transition-durations',JSON.stringify(this.durations));}catch{}}
  updateTiming(t){t.frames=this.durations[t.id]??t.defaultFrames;t.duration=t.frames/FPS;t.start=t.cut-t.duration/2;t.end=t.start+t.duration;}
  async load(base) {
    const response=await fetch(base+'/analysis.json');if(!response.ok)throw new Error('Les repères vidéo ne sont pas accessibles.');
    this.analysis=await response.json();
    transitions.find(t=>t.id==='blink').cut=this.analysis.blinkTime;
    transitions.forEach((t,index)=>{t.index=index;this.updateTiming(t);t.before=index%2?1.22:1;t.after=index%2?1:1.22;});
    await Promise.all([...transitions.map(t=>t.id),'hand-source'].map(async id=>{
      const [image,maskImage,incoming]=await Promise.all([loadImage(base+'/'+id+'.jpg'),loadImage(base+'/'+id+'-mask.png'),id==='hand-source'?Promise.resolve(null):loadImage(base+'/'+id+'-incoming.jpg')]);
      const matte=alphaMatte(maskImage);const info=this.analysis.frames[id];
      const transition=transitions.find(t=>t.id===id);const zoom=transition?.before??1;
      const foreground=compositeMask(image,matte,zoom);
      const plate=surface();drawCrop(clear(plate),image,zoom);
      const mask=surface();drawCrop(clear(mask),matte,zoom);
      this.plates[id]={image,incoming,matte,foreground,plate,mask,info,eyes:centroid([...(info.leftEye??[]),...(info.rightEye??[])])};
    }));
    const portal=this.plates.portal,portalTransition=transitions.find(t=>t.id==='portal');
    const incomingMatte=alphaMatte(await loadImage(base+'/portal-incoming-mask.png'));
    portal.incomingMask=surface();drawCrop(clear(portal.incomingMask),incomingMatte,portalTransition.after);
    portal.incomingPlate=surface();drawCrop(clear(portal.incomingPlate),portal.incoming,portalTransition.after);
    // Warm the reusable masks once so the first playback does not build them.
    for(const [id,incoming] of [['portal',false],['portal',true],['gravity',false]])this.paperCutout(id,incoming).prepareBorder();
    this.prepareHand();
  }
  prepareHand() {
    // Follow the contour of the actual raised hand in hand-source.jpg (720 × 1280).
    const hand=surface(240,430),ctx=hand.getContext('2d');
    ctx.translate(-20,-260);ctx.beginPath();
    ctx.moveTo(32,663);ctx.bezierCurveTo(28,606,72,550,61,484);
    ctx.bezierCurveTo(48,442,44,403,62,370);ctx.bezierCurveTo(69,336,114,310,160,309);
    ctx.bezierCurveTo(188,302,207,313,209,333);ctx.bezierCurveTo(213,352,190,364,174,346);
    ctx.bezierCurveTo(147,342,129,352,127,372);ctx.bezierCurveTo(126,390,144,399,160,382);
    ctx.bezierCurveTo(174,365,198,369,212,393);ctx.bezierCurveTo(219,421,210,475,189,505);
    ctx.bezierCurveTo(171,546,150,570,133,604);ctx.lineTo(106,690);ctx.closePath();ctx.clip();
    ctx.drawImage(this.plates['hand-source'].image,0,0,W,H);this.handTexture=hand;
  }
  find(time){return transitions.find(t=>time>=t.start&&time<t.end);}
  zoomAt(time){const previous=transitions.filter(t=>time>=t.cut).at(-1);return previous?.after??1;}
  render(video,time,{original=false,override=null}={}) {
    const ctx=this.context;ctx.resetTransform();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.filter='none';
    ctx.fillStyle='#090b08';ctx.fillRect(0,0,W,H);
    if(original){drawCrop(ctx,video);return null;}
    const t=override?.transition??this.find(time);
    if(!t){drawCrop(ctx,video,this.zoomAt(time));return null;}
    const p=override?.progress??clamp((time-t.start)/t.duration);
    const plate=this.plates[t.id];
    const strength=t.intensityTarget?this.intensity(t.id):1;
    if(strength===0){drawCrop(ctx,video,p<.5?t.before:t.after);return t;}
    drawCrop(clear(this.a),plate.image,t.before);
    drawCrop(clear(this.b),video,t.after);
    this[t.id](ctx,p,t,plate,video,strength);
    return t;
  }
  face(ctx,p,t,plate,video,strength) {
    const q=p<.5?0:(p-.5)*2;
    const zoom=p<.5?t.before:t.after*(1+.03*strength*(1-easeOut(q)));
    const settle=easeOut(q);
    drawCrop(ctx,video,zoom,[mix(plate.eyes[0],.5,settle),mix(plate.eyes[1],.22,settle)]);
  }
  gesture(ctx,p,t,plate,video) {
    const hands=plate.info.hands??[];const moving=hands.find(h=>centroid(h)[0]<.4);
    const anchor=moving?centroid(moving):[.23,.35];
    if(p<.5){drawCrop(ctx,video,t.before);return;}
    const q=easeOut((p-.5)*2);
    // Compensation preserves the hand's screen position on the first frame of B.
    const dx=(t.before-t.after)*(anchor[0]-.5)*W*(1-q);
    const dy=(t.before-t.after)*(anchor[1]-.22)*H*(1-q);
    ctx.save();ctx.translate(dx,dy);drawCrop(ctx,video,t.after);ctx.restore();
  }
  hand(ctx,p,t,plate,video,strength) {
    drawCrop(ctx,video,p<.5?t.before:t.after);
    const pulse=Math.pow(Math.sin(Math.PI*p),2);
    // Keep enough palm coverage to conceal the cut at low intensities.
    const scale=1+13*(.75+.25*strength)*pulse;
    const x=p<.5?mix(-230,W*.52,easeOut(p*2)):mix(W*.52,W*4.2,Math.pow((p-.5)*2,1.5));
    const y=mix(H*.74,H*.49,pulse);
    ctx.save();ctx.translate(x,y);ctx.rotate((-.24+.45*p)*strength);ctx.scale(scale,scale);
    ctx.filter=`blur(${(1+9*pulse*strength)/scale}px)`;ctx.drawImage(this.handTexture,-110,-210);ctx.restore();
  }
  peel(ctx,p,t,plate,video,strength) {
    ctx.drawImage(this.b,0,0);
    ctx.save();ctx.globalAlpha=1-smooth(p/.20);ctx.drawImage(this.a,0,0);ctx.restore();
    const q=easeOut((p-.07)/.93);const scale=1-.08*q*strength;
    ctx.save();ctx.translate(W*.48+W*.90*q*strength,H*.65-H*.16*q*strength);ctx.rotate(.21*q*strength);ctx.scale(scale,scale);
    ctx.shadowColor=`rgba(0,0,0,${clamp(.5*Math.sin(Math.PI*p)*strength)})`;ctx.shadowBlur=28*strength;ctx.shadowOffsetX=-18*strength;ctx.shadowOffsetY=18*strength;
    ctx.globalAlpha=1-smooth((p-.72)/.28);ctx.drawImage(plate.foreground,-W*.48,-H*.65);ctx.restore();
  }
  echo(ctx,p,t,plate,video,strength) {
    ctx.drawImage(this.b,0,0);
    if(p<.2){ctx.drawImage(this.a,0,0);return;}
    const layer=clear(this.layer);layer.drawImage(plate.foreground,0,0);
    layer.globalCompositeOperation='destination-in';const gradient=layer.createLinearGradient(0,H*.45,0,H*.8);gradient.addColorStop(0,'#fff');gradient.addColorStop(1,'#fff0');layer.fillStyle=gradient;layer.fillRect(0,0,W,H);layer.globalCompositeOperation='source-over';
    for(let n=3;n>=1;n--){const q=clamp((p-n*.045)/.82);ctx.save();ctx.globalAlpha=clamp([0,.45,.25,.10][n]*Math.pow(1-q,2)*smooth((p-.15)/.12)*strength);ctx.translate(-12*n*(1+q*2)*strength,-4*n*q*strength);ctx.drawImage(this.layer,0,0);ctx.restore();}
  }
  word(ctx,p,t,plate,video,strength) {
    drawCrop(ctx,video,p<1/3?t.before:t.after);
    const q=p<.25?easeOut(p/.25):1;
    const settle=clamp((p-.25)/.55);
    const scale=p<.25?mix(1-.15*strength,1+.3*strength,q):1+.30*strength*Math.exp(-5*settle)*Math.cos(8*settle);
    const alpha=smooth(p/.12)*(1-smooth((p-.72)/.28))*Math.min(strength,1);
    ctx.save();ctx.globalAlpha=alpha;ctx.translate(W*.5,H*.49);ctx.scale(scale,scale);ctx.rotate(-.055*(1-smooth(p)));
    ctx.font='900 117px Satoshi, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle='#d6fa72';ctx.shadowColor='#0009';ctx.shadowBlur=16;ctx.shadowOffsetY=8;
    ctx.fillText('RÉFÉ-',0,-56);ctx.fillText('RENCES.',0,57);ctx.restore();
  }
  blink(ctx,p,t,plate,video){drawCrop(ctx,video,p<.5?t.before:t.after);}
  lag(ctx,p,t,plate,video,strength) {
    ctx.drawImage(this.b,0,0);
    const bg=clear(this.background);bg.drawImage(this.a,0,0);bg.globalCompositeOperation='destination-out';bg.drawImage(plate.mask,0,0);bg.globalCompositeOperation='source-over';
    const travel=easeOut(p/.72);
    ctx.save();ctx.globalAlpha=1-smooth((p-.78)/.22);ctx.translate(-W*1.12*travel*strength,0);ctx.drawImage(this.background,0,0);ctx.restore();
    const q=clamp((p-.25)/.75),spring=Math.exp(-6*q)*Math.sin(11*q);
    ctx.save();ctx.translate(W*.5+spring*W*.024*strength,H*.4);ctx.scale(1+.035*spring*strength,1+.035*spring*strength);
    ctx.globalAlpha=1-smooth((p-.64)/.125);ctx.shadowColor='#0005';ctx.shadowBlur=20;ctx.shadowOffsetX=12;
    ctx.drawImage(plate.foreground,-W*.5,-H*.4);ctx.restore();
  }
  portal(ctx,p,t,plate,video,strength) {
    const style=this.style(t.id),out=style.variant==='out',travel=easeOut(p);
    const appearance=smooth(p/.12)*(1-smooth((p-.82)/.18));
    // A photographic paper sheet, not an independently moving hole: its photo,
    // alpha and rough white lip share the exact same transform.
    ctx.drawImage(out?this.b:this.a,0,0);
    if(out&&p<.2){ctx.save();ctx.globalAlpha=1-smooth(p/.2);ctx.drawImage(this.a,0,0);ctx.restore();}
    if(!out&&p>.64){ctx.save();ctx.globalAlpha=smooth((p-.64)/.36);ctx.drawImage(this.b,0,0);ctx.restore();}
    const scale=out?mix(1,.08,Math.pow(p,.65+.45*strength)):mix(.08,1,travel)+.04*strength*Math.sin(Math.PI*p);
    const anchor=[plate.eyes[0]*W,plate.eyes[1]*H];
    this.paperCutout(t.id,!out).draw(ctx,{image:out?plate.plate:plate.incomingPlate,scale,anchor,rotation:(out?-.055:.045)*Math.sin(Math.PI*p)*strength,opacity:out?1-smooth((p-.82)/.18):smooth(p/.10),borderOpacity:appearance,monochrome:style.paper&&style.monochrome?appearance:0});
    if(p>.82){ctx.save();ctx.globalAlpha=smooth((p-.82)/.18);ctx.drawImage(this.b,0,0);ctx.restore();}
  }
  glass(ctx,p,t,plate,video,strength) {
    if(this.glassRenderer){this.glassRenderer.render(this.a,this.b,p,strength);ctx.drawImage(this.glassRenderer.canvas,0,0);return;}
    // Canvas fallback still has a refracting lens and an expanding reveal.
    ctx.drawImage(this.a,0,0);const radius=p*H*1.25;
    ctx.save();ctx.beginPath();ctx.arc(W*.48,H*.24,radius,0,Math.PI*2);ctx.clip();ctx.drawImage(this.b,0,0);ctx.restore();
    ctx.save();ctx.beginPath();ctx.arc(W*.48,H*.24,radius,0,Math.PI*2);ctx.strokeStyle='#e4f2de88';ctx.lineWidth=8*strength;ctx.shadowColor='#e4f2de';ctx.shadowBlur=16*strength;ctx.stroke();ctx.restore();
  }
  gravity(ctx,p,t,plate,video,strength) {
    const rebound=.03*Math.exp(-5*p)*Math.sin(9*p)*strength;
    ctx.save();ctx.translate(W*.5,H*.5);ctx.scale(1+rebound,1+rebound);ctx.drawImage(this.b,-W*.5,-H*.5);ctx.restore();
    const bg=clear(this.background);bg.drawImage(this.a,0,0);bg.globalCompositeOperation='destination-out';bg.drawImage(plate.mask,0,0);bg.globalCompositeOperation='source-over';
    ctx.drawImage(this.background,0,-H*1.4*p*p*strength);
    const q=clamp((p-1/6)/(5/6));const y=(H*.04*Math.sin(Math.PI*clamp(p*3))-H*1.5*q*q)*strength;
    ctx.save();ctx.translate(W*.5+W*.06*Math.sin(Math.PI*p)*strength,H*.55+y);ctx.rotate(-.09*q*strength);
    const style=this.style(t.id),appearance=smooth(p/.12)*(1-smooth((p-.88)/.12));
    const paper=this.paperCutout(t.id);
    paper.draw(ctx,{image:plate.plate,x:-W*.5,y:-H*.55,anchor:[0,0],borderOpacity:appearance,monochrome:style.paper&&style.monochrome?appearance:0});ctx.restore();
    if(p>.88){ctx.save();ctx.globalAlpha=smooth((p-.88)/.12);ctx.drawImage(this.b,0,0);ctx.restore();}
  }
}

function createGlassRenderer() {
  const canvas=surface(),gl=canvas.getContext('webgl',{alpha:false,preserveDrawingBuffer:true});if(!gl)return null;
  const vertex='attribute vec2 position; varying vec2 uv; void main(){uv=(position+1.0)*0.5;gl_Position=vec4(position,0.,1.);}';
  const fragment=`precision mediump float; varying vec2 uv; uniform sampler2D imageA; uniform sampler2D imageB; uniform float progress; uniform float strength;
  void main(){
    vec2 q=vec2(uv.x,1.0-uv.y), center=vec2(.48,.24), aspect=vec2(.5625,1.0);
    vec2 delta=(q-center)*aspect;float distance=length(delta);float radius=progress*1.15;
    float wave=exp(-pow((distance-radius)/.045,2.0));vec2 direction=delta/max(distance,.001)/aspect;
    vec2 offset=direction*wave*.01575*sin(progress*3.14159265)*strength;
    float reveal=1.0-smoothstep(radius-.022,radius+.022,distance);
    vec2 coord=clamp(q+offset,vec2(.001),vec2(.999));
    vec3 a=texture2D(imageA,coord).rgb, b=texture2D(imageB,coord).rgb;
    vec3 color=mix(a,b,reveal);float fringe=wave*.00118125*strength;
    color.r=mix(texture2D(imageA,clamp(coord+direction*fringe,0.,1.)).r,texture2D(imageB,clamp(coord+direction*fringe,0.,1.)).r,reveal);
    color.b=mix(texture2D(imageA,clamp(coord-direction*fringe,0.,1.)).b,texture2D(imageB,clamp(coord-direction*fringe,0.,1.)).b,reveal);
    color+=vec3(.13,.16,.12)*wave*sin(progress*3.14159265)*strength;
    if(progress<.001)color=texture2D(imageA,q).rgb;if(progress>.999)color=texture2D(imageB,q).rgb;
    gl_FragColor=vec4(color,1.0);
  }`;
  function shader(type,text){const s=gl.createShader(type);gl.shaderSource(s,text);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
  try {
    const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return null;gl.useProgram(program);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const location=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,2,gl.FLOAT,false,0,0);
    const textures=[0,1].map(index=>{const tex=gl.createTexture();gl.activeTexture(gl.TEXTURE0+index);gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.uniform1i(gl.getUniformLocation(program,index?'imageB':'imageA'),index);return tex;});
    const progress=gl.getUniformLocation(program,'progress'),strength=gl.getUniformLocation(program,'strength');
    return {canvas,render(a,b,p,amount=1){gl.useProgram(program);[a,b].forEach((img,index)=>{gl.activeTexture(gl.TEXTURE0+index);gl.bindTexture(gl.TEXTURE_2D,textures[index]);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);});gl.uniform1f(progress,p);gl.uniform1f(strength,amount);gl.viewport(0,0,W,H);gl.drawArrays(gl.TRIANGLES,0,6);}};
  } catch(error){console.warn('Réfraction : moteur Canvas utilisé.',error);return null;}
}
