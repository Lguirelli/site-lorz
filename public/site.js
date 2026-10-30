const themeToggle = document.querySelector('.theme-toggle');
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
function setTheme(theme) {
 document.documentElement.dataset.theme = theme;
 const dark = theme === 'dark';
 const label = dark ? 'Ativar modo claro' : 'Ativar modo escuro';
 themeToggle.setAttribute('aria-pressed', String(dark));
 themeToggle.setAttribute('aria-label', label);
 themeToggle.title = label;
 document.querySelector('meta[name="theme-color"]').content = dark ? '#0A0F23' : '#FAE4CF';
}
setTheme(document.documentElement.dataset.theme || 'light');
themeToggle.addEventListener('click', () => {
 const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
 setTheme(theme);
 try { localStorage.setItem('lorz-theme', theme); } catch {}
});
systemTheme.addEventListener('change', event => {
 let saved;
 try { saved = localStorage.getItem('lorz-theme'); } catch {}
 if (saved !== 'dark' && saved !== 'light') setTheme(event.matches ? 'dark' : 'light');
});
window.addEventListener('storage', event => {
 if (event.key === 'lorz-theme') setTheme(event.newValue === 'dark' || (event.newValue !== 'light' && systemTheme.matches) ? 'dark' : 'light');
});
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#main-nav');
function closeMenu(){toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
nav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.querySelectorAll('nav a').forEach(a=>{if(new URL(a.href).pathname===location.pathname)a.setAttribute('aria-current','page');});
const form=document.querySelector('#contact-form');
if(form){
 const service=document.querySelector('#service');const requested=new URLSearchParams(location.search).get('servico');if([...service.options].some(o=>o.value===requested))service.value=requested;
 const fields=[document.querySelector('#name'),document.querySelector('#message')];
 const validate=field=>{const valid=field.value.trim().length>0;field.setAttribute('aria-invalid',String(!valid));document.querySelector('#'+field.id+'-error').textContent=valid?'':field.id==='name'?'Informe seu nome para identificar o briefing.':'Conte um pouco sobre o que você quer melhorar.';return valid;};
 fields.forEach(field=>{field.addEventListener('blur',()=>validate(field));field.addEventListener('input',()=>{if(field.getAttribute('aria-invalid')==='true')validate(field);});});
 form.addEventListener('submit',event=>{event.preventDefault();const valid=fields.map(validate);if(valid.includes(false)){fields[valid.indexOf(false)].focus();return;}
 const message=`Briefing Lorz\nNome: ${fields[0].value.trim()}\nServiço: ${service.selectedOptions[0].text}\n\n${fields[1].value.trim()}`;
 const {email,whatsapp}=document.body.dataset;
 if(whatsapp){location.href='https://wa.me/'+whatsapp.replace(/\D/g,'')+'?text='+encodeURIComponent(message);document.querySelector('#form-status').textContent='Mensagem preparada. Revise e envie no WhatsApp.';}
 else if(email){location.href='mailto:'+email+'?subject='+encodeURIComponent('Projeto Lorz: '+service.selectedOptions[0].text)+'&body='+encodeURIComponent(message);document.querySelector('#form-status').textContent='Mensagem preparada. Revise e envie no seu aplicativo de e-mail.';}
 else{const blob=new Blob([message],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='meu-briefing-lorz.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#form-status').textContent='Briefing preparado para download. Nada foi enviado à Lorz.';}
 });
}
