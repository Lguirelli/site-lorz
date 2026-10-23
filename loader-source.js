/* LORZ SD loader. Public API: element.ready(), element.waitFor(promise), element.destroy(). */
class LorzLoader extends HTMLElement {
 connectedCallback(){
  if(this.started)return;this.started=true;this.state='loading';this.dataset.state='loading';this.dataset.lock='locked';this.lockedY=-.23;this.unlockedY=0;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  this.innerHTML='<div class="lorz-stage"><button class="lorz-action" type="button" disabled aria-label="Destravar cartão e entrar"></button></div><div class="lorz-caption"><div class="lorz-eyebrow">Lorz / Marketing</div><p class="lorz-message" role="status" aria-live="polite">Carregando<span class="lorz-dots">…</span></p></div>';
  this.stage=this.querySelector('.lorz-stage');this.action=this.querySelector('button');this.message=this.querySelector('.lorz-message');
  this.action.addEventListener('click',()=>this.unlock());this.startedAt=performance.now();this.pending=0;this.loaded=false;
  this.previousFocus=document.activeElement;this.locked=[];for(const e of document.body.children){if(e!==this&&!e.contains(this)&&!['SCRIPT','STYLE','LINK'].includes(e.tagName)){this.locked.push([e,e.inert]);e.inert=true;}}
  this.oldOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';
  this.onLoad=()=>{this.loaded=true;this.checkReady()};if(!this.hasAttribute('manual')){if(document.readyState==='complete')this.onLoad();else window.addEventListener('load',this.onLoad,{once:true})}
  this.init3D();
 }
 init3D(){
  try{
   this.renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.1;this.renderer.setClearColor(0,0);
   this.renderer.domElement.setAttribute('aria-hidden','true');this.stage.prepend(this.renderer.domElement);
   this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(32,1,.1,50);this.camera.position.z=9;
   this.scene.add(new THREE.HemisphereLight(0xffffff,0x778395,1.7));
   for(const [x,y,z,power] of [[-4,5,6,3],[4,1,3,1.5],[-2,-3,-4,3]]){const l=new THREE.DirectionalLight(0xffffff,power);l.position.set(x,y,z);this.scene.add(l)}
   this.card=new THREE.Group();this.scene.add(this.card);
   const texture=new THREE.TextureLoader().load(LORZ_TEXTURE,()=>{this.visualReady=true;this.checkReady()},undefined,()=>{this.visualReady=true;this.checkReady()});texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(4,this.renderer.capabilities.getMaxAnisotropy());this.texture=texture;
   this.materials={SDBody:new THREE.MeshStandardMaterial({color:0x191c22,roughness:.38,metalness:.12}),LabelBG:new THREE.MeshStandardMaterial({color:0x111418,roughness:.4}),Label:new THREE.MeshStandardMaterial({map:texture,roughness:.42,metalness:0,side:THREE.DoubleSide}),Contact:new THREE.MeshStandardMaterial({color:0xc7a452,metalness:.8,roughness:.24}),Slider:new THREE.MeshStandardMaterial({color:0xe4dfcf,roughness:.3,metalness:.25})};
   for(const part of LORZ_MODEL){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(part.positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(part.normals,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(part.uv,2));if(part.indices)g.setIndex(part.indices);const mesh=new THREE.Mesh(g,this.materials[part.material]);this.card.add(mesh);if(part.name==='SDcard.001'){this.slider=mesh;mesh.position.y=this.lockedY}}
   this.resize=()=>{const w=this.stage.clientWidth,h=this.stage.clientHeight;const cardPixels=Math.min(350,h*.48,w*.65);const worldHeight=3.2*h/cardPixels;this.offscreenY=worldHeight/2+2.4;this.camera.position.z=worldHeight/(2*Math.tan(16*Math.PI/180));this.camera.far=Math.max(50,this.camera.position.z+25);this.style.setProperty('--card-height',cardPixels+'px');this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix()};this.observer=new ResizeObserver(this.resize);this.observer.observe(this.stage);this.resize();
   this.frame=now=>{if(this.state==='done')return;this.animate(now);this.renderer.render(this.scene,this.camera);if(this.exitRendered){this.exitRendered=false;this.reveal()}this.raf=requestAnimationFrame(this.frame)};this.raf=requestAnimationFrame(this.frame);
  }catch(error){this.renderer?.dispose();this.renderer?.domElement.remove();this.renderer=null;const el=document.createElement('div');el.className='lorz-fallback';el.innerHTML='<img alt="Cartão Lorz" src="'+LORZ_FALLBACK+'">';this.stage.prepend(el);this.visualReady=true;this.checkReady()}
 }
 animate(now){const seconds=(now-this.startedAt)/1000;const ease=t=>1-Math.pow(1-Math.max(0,Math.min(1,t)),3);
  if(this.state==='loading'){this.card.position.y=this.reduced?0:-this.offscreenY*(1-ease(seconds/.95));this.card.rotation.set(0,0,this.reduced?0:Math.max(0,seconds-.8)*1.65);if(this.slider)this.slider.position.y=this.lockedY}
  if(this.state==='settling'){const t=ease((now-this.settleAt)/650);this.card.rotation.set(0,0,this.startAngle+(this.targetAngle-this.startAngle)*t);this.card.position.y=0;if(t===1)this.makeReady()}
  if(this.state==='unlocking'){const elapsed=now-this.unlockAt;const t=this.reduced?1:ease(elapsed/650);if(this.slider)this.slider.position.y=this.lockedY+(this.unlockedY-this.lockedY)*t;this.card.rotation.set(0,0,0);this.card.position.y=0;if(t===1&&this.dataset.lock!=='unlocked'){this.dataset.lock='unlocked';this.message.textContent='Cartão destravado';this.dispatchEvent(new CustomEvent('lorz:unlock'))}if(this.reduced||elapsed>=850)this.startExit(now)}
  if(this.state==='exiting'){const t=this.reduced?1:Math.min(1,(now-this.exitAt)/900);const smooth=t*t*(3-2*t);this.card.position.y=this.offscreenY*smooth;this.card.rotation.set(0,0,0);if(t===1)this.exitRendered=true}
 }
 checkReady(){if(this.loaded&&this.pending===0&&this.visualReady&&this.state==='loading'){clearTimeout(this.readyTimer);const min=Number(this.getAttribute('min-duration')||1800);this.readyTimer=setTimeout(()=>{if(this.pending>0||this.state!=='loading')return;if(this.renderer&&!this.reduced){this.state=this.dataset.state='settling';this.settleAt=performance.now();this.startAngle=this.card.rotation.z;this.targetAngle=Math.ceil(this.startAngle/(Math.PI*2))*Math.PI*2;}else this.makeReady()},Math.max(0,min-(performance.now()-this.startedAt)))}}
 ready(){this.loaded=true;this.checkReady();return this}
 waitFor(promise){if(this.state!=='loading')throw new Error('Registre waitFor antes de o loading terminar.');this.pending++;Promise.resolve(promise).then(()=>{this.pending--;this.checkReady()},error=>{this.pending--;this.dispatchEvent(new CustomEvent('lorz:error',{detail:error}));this.checkReady()});return this}
 makeReady(){this.state=this.dataset.state='ready';this.readyAt=performance.now();if(this.card){this.card.rotation.set(0,0,0);this.card.position.y=0;this.slider.position.y=this.lockedY}this.message.textContent='Clique no cartão para entrar';this.action.disabled=false;this.dispatchEvent(new CustomEvent('lorz:ready'))}
 unlock(){if(this.state!=='ready')return;this.state=this.dataset.state='unlocking';this.unlockAt=performance.now();this.action.disabled=true;this.message.textContent='Destravando cartão…';if(!this.renderer){this.exitTimer=setTimeout(()=>{this.dataset.lock='unlocked';this.dispatchEvent(new CustomEvent('lorz:unlock'));this.startExit(performance.now());this.endTimer=setTimeout(()=>this.reveal(),this.reduced?0:900)},this.reduced?0:850)}}
 startExit(now){this.state=this.dataset.state='exiting';this.exitAt=now;this.querySelector('.lorz-caption').style.opacity=0;this.dispatchEvent(new CustomEvent('lorz:exit'))}
 reveal(){if(this.state!=='exiting')return;this.state=this.dataset.state='revealing';this.style.opacity=0;this.fadeTimer=setTimeout(()=>this.finish(),this.reduced?0:350)}
 finish(){this.destroy();this.hidden=true;this.dispatchEvent(new CustomEvent('lorz:complete'));const target=document.querySelector(this.getAttribute('focus-target')||'main');if(target){if(!target.hasAttribute('tabindex'))target.tabIndex=-1;target.focus({preventScroll:true})}else this.previousFocus?.focus?.({preventScroll:true})}
 destroy(){this.state=this.dataset.state='done';cancelAnimationFrame(this.raf);for(const timer of ['readyTimer','exitTimer','endTimer','fadeTimer'])clearTimeout(this[timer]);window.removeEventListener('load',this.onLoad);this.observer?.disconnect();this.card?.traverse(o=>o.geometry?.dispose());Object.values(this.materials||{}).forEach(m=>m.dispose());this.texture?.dispose();this.renderer?.dispose();for(const [e,v]of this.locked||[])e.inert=v;document.documentElement.style.overflow=this.oldOverflow||'';this.hidden=true}
 disconnectedCallback(){this.destroy()}
}
if(!customElements.get('lorz-loader'))customElements.define('lorz-loader',LorzLoader);
