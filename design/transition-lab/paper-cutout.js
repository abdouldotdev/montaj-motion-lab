// Reusable paper cutout compositor. No face/person detection, timeline, or app
// dependencies: supply any image and a matching ALPHA mask (person, object, logo).
// All dimensions and style widths are in source pixels; the whole sheet follows
// the same transform, keeping the photograph attached to its torn paper edge.
const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
const canvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
function hash(x,y,seed){let n=Math.imul(x,374761393)^Math.imul(y,668265263)^seed;n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967295;}
function noise(x,y,seed){const ix=Math.floor(x),iy=Math.floor(y);let fx=x-ix,fy=y-iy;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);const a=hash(ix,iy,seed),b=hash(ix+1,iy,seed),c=hash(ix,iy+1,seed),d=hash(ix+1,iy+1,seed);return((a+(b-a)*fx)*(1-fy)+(c+(d-c)*fx)*fy)*2-1;}

export class PaperCutout {
  constructor({mask,width=mask.width,height=mask.height,seed=71,maxBorder=40}) {
    this.sourceWidth=width;this.sourceHeight=height;this.maxBorder=maxBorder;this.padding=Math.ceil(maxBorder*1.5+16);
    width+=this.padding*2;height+=this.padding*2;
    this.width=width;this.height=height;this.seed=seed;
    this.mask=canvas(width,height);this.border=canvas(width,height);this.foreground=canvas(width,height);this.monochrome=canvas(width,height);this.lastImage=null;this.lastFrame=null;
    const ctx=this.mask.getContext('2d',{willReadFrequently:true});ctx.drawImage(mask,this.padding,this.padding,this.sourceWidth,this.sourceHeight);
    const pixels=ctx.getImageData(0,0,width,height),data=pixels.data,n=width*height;
    this.distance=new Float32Array(n);this.distance.fill(width+height);
    // A crisp photographic edge; preserve antialiasing over a narrow threshold.
    for(let i=0;i<n;i++){const alpha=clamp((data[i*4+3]-104)/48);data[i*4]=data[i*4+1]=data[i*4+2]=255;data[i*4+3]=Math.round(alpha*255);if(alpha>=.5)this.distance[i]=0;}
    ctx.putImageData(pixels,0,0);
    // Two-pass chamfer distance: computed once for this mask, reused for sliders.
    const dist=this.distance,diagonal=Math.SQRT2;
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      const i=y*width+x;if(!dist[i])continue;let value=dist[i];
      if(x)value=Math.min(value,dist[i-1]+1);
      if(y){value=Math.min(value,dist[i-width]+1);if(x)value=Math.min(value,dist[i-width-1]+diagonal);if(x+1<width)value=Math.min(value,dist[i-width+1]+diagonal);}dist[i]=value;
    }
    for(let y=height-1;y>=0;y--)for(let x=width-1;x>=0;x--){
      const i=y*width+x;if(!dist[i])continue;let value=dist[i];
      if(x+1<width)value=Math.min(value,dist[i+1]+1);
      if(y+1<height){value=Math.min(value,dist[i+width]+1);if(x)value=Math.min(value,dist[i+width-1]+diagonal);if(x+1<width)value=Math.min(value,dist[i+width+1]+diagonal);}dist[i]=value;
    }
    this.style={borderWidth:24,roughness:.7,shadow:4};this.cacheKey='';
  }
  setStyle({borderWidth=this.style.borderWidth,roughness=this.style.roughness,shadow=this.style.shadow}={}) {
    this.style={borderWidth:clamp(borderWidth,0,this.maxBorder),roughness:clamp(roughness),shadow:clamp(shadow,0,30)};return this;
  }
  prepareBorder() {
    const {borderWidth,roughness}=this.style,key=`${borderWidth}:${roughness}`;if(key===this.cacheKey)return;
    this.cacheKey=key;const {width:w,height:h,distance,seed}=this,ctx=this.border.getContext('2d');ctx.clearRect(0,0,w,h);
    if(!borderWidth)return;
    const result=ctx.createImageData(w,h),data=result.data,reach=borderWidth*(1+.5*roughness)+8*roughness,fibres=[];
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const i=y*w+x,d=distance[i];if(d>reach)continue;
      if(d===0){data[i*4]=data[i*4+1]=252;data[i*4+2]=251;data[i*4+3]=255;continue;}
      // Uneven broad tears plus fine fibres. Seeded in object coordinates: the
      // edge stays attached while moving, with no random per-frame flicker.
      const coarse=noise(x/33,y/33,seed),medium=noise(x/5.2,y/5.2,seed+19),fine=noise(x/1.35,y/1.35,seed+57);
      const width=borderWidth*(1+roughness*.47*coarse)+roughness*(3.8*medium+1.8*fine);
      const alpha=clamp(width-d+.5);if(!alpha)continue;
      const shade=250+Math.round(hash(x,y,seed+113)*5)-Math.round(Math.max(0,medium)*2);
      data[i*4]=data[i*4+1]=shade;data[i*4+2]=shade-1;data[i*4+3]=Math.round(alpha*255);
      if(roughness>0&&Math.abs(width-d)<.85&&x>0&&x<w-1&&y>0&&y<h-1&&hash(x,y,seed+217)>.58){
        const dx=distance[i+1]-distance[i-1],dy=distance[i+w]-distance[i-w],length=Math.hypot(dx,dy)||1;
        fibres.push({x,y,nx:dx/length,ny:dy/length,r:hash(x,y,seed+331)});
      }
    }
    ctx.putImageData(result,0,0);
    // Fine protruding fibres follow the local torn edge normal. Their seeded
    // position and lean are constant across frames and transforms.
    ctx.lineCap='round';
    for(const {x,y,nx,ny,r} of fibres){const length=(.7+r*4.3)*roughness,lean=(r-.5)*2.5;ctx.strokeStyle=`rgba(255,255,254,${.5+r*.45})`;ctx.lineWidth=.55+r*.55;ctx.beginPath();ctx.moveTo(x-nx*.8,y-ny*.8);ctx.quadraticCurveTo(x+nx*length*.55-ny*lean,y+ny*length*.55+nx*lean,x+nx*length,y+ny*length);ctx.stroke();}
  }
  draw(context,{image,frameKey=image,x=0,y=0,scale=1,rotation=0,anchor=[this.sourceWidth/2,this.sourceHeight/2],opacity=1,borderOpacity=1,monochrome=0}={}) {
    this.prepareBorder();const {width:w,height:h}=this,ctx=this.foreground.getContext('2d');
    if(image!==this.lastImage||frameKey!==this.lastFrame){
      this.lastImage=image;this.lastFrame=frameKey;ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='source-over';ctx.drawImage(image,this.padding,this.padding,this.sourceWidth,this.sourceHeight);ctx.globalCompositeOperation='destination-in';ctx.drawImage(this.mask,0,0);ctx.globalCompositeOperation='source-over';
      const pixels=ctx.getImageData(0,0,w,h),data=pixels.data;
      for(let i=0;i<data.length;i+=4){const luma=Math.round(.2126*data[i]+.7152*data[i+1]+.0722*data[i+2]);data[i]=data[i+1]=data[i+2]=luma;}
      this.monochrome.getContext('2d').putImageData(pixels,0,0);
    }
    context.save();context.globalAlpha*=clamp(opacity);context.translate(anchor[0]+x,anchor[1]+y);context.rotate(rotation);context.scale(scale,scale);
    if(this.style.borderWidth){context.save();context.globalAlpha*=clamp(borderOpacity);context.shadowColor='#18181850';context.shadowBlur=this.style.shadow;context.shadowOffsetX=0;context.shadowOffsetY=this.style.shadow*.6;context.drawImage(this.border,-anchor[0]-this.padding,-anchor[1]-this.padding);context.restore();}
    context.drawImage(this.foreground,-anchor[0]-this.padding,-anchor[1]-this.padding);if(monochrome>0){context.globalAlpha*=clamp(monochrome);context.drawImage(this.monochrome,-anchor[0]-this.padding,-anchor[1]-this.padding);}context.restore();
  }
}
