// Smooth anchors
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const el = document.querySelector(a.getAttribute('href'));
    if(el) el.scrollIntoView({behavior:'smooth'});
  });
});

// Active link on scroll
const links = document.querySelectorAll('.nav a');
const sections = [...links].map(a=>document.querySelector(a.getAttribute('href')));
function syncActive(){
  const y = window.scrollY + 120;
  sections.forEach((sec,i)=>{
    if(!sec) return;
    const top = sec.offsetTop, bottom = top + sec.offsetHeight;
    links[i].classList.toggle('active', y>=top && y<bottom);
  });
}
window.addEventListener('scroll', syncActive); syncActive();

// Back to top
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', ()=>{
  toTop.style.display = window.scrollY>500 ? 'block' : 'none';
});
toTop.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));

// Theme toggle
const toggleTheme = document.getElementById('toggleTheme');
toggleTheme.addEventListener('click', ()=>{
  document.body.classList.toggle('dark');
  toggleTheme.textContent = document.body.classList.contains('dark') ? 'Light' : 'Dark';
});

// Tabs
const tabs = document.querySelectorAll('.tab');
const panes = document.querySelectorAll('.tabpane');
tabs.forEach(t=>{
  t.addEventListener('click', ()=>{
    tabs.forEach(x=>x.classList.remove('active'));
    panes.forEach(p=>p.classList.remove('active'));
    t.classList.add('active');
    const id = t.dataset.tab;
    document.getElementById('tab-'+id).classList.add('active');
  });
});

// Live metrics
const cfg = {
  ph: {min:5.5, max:6.5},
  ppm:{min:700, max:900},
  temp:{min:18, max:24},
  light:{min:12, max:14}
};
const $ = s=>document.querySelector(s);
const alertsList = $('#alertsList');

function badge(el, state){
  el.classList.remove('warn','danger');
  if(state==='ok') { el.textContent='Óptimo'; }
  if(state==='warn'){ el.textContent='Atención'; el.classList.add('warn'); }
  if(state==='bad'){ el.textContent='Alerta'; el.classList.add('danger'); }
}

function addAlert(msg){
  const li = document.createElement('li');
  li.textContent = msg;
  alertsList.appendChild(li);
}

function updatePH(val){
  $('#phVal').textContent = val.toFixed(1);
  $('#phBar').style.width = ((val-4.5)/(8.0-4.5)*100)+'%';
  const b = $('#phBadge');
  if(val<cfg.ph.min-0.2 || val>cfg.ph.max+0.2){ badge(b,'bad'); addAlert(`⚠️ pH fuera de rango: ${val.toFixed(1)}`); }
  else if(val<cfg.ph.min || val>cfg.ph.max){ badge(b,'warn'); }
  else { badge(b,'ok'); }
}

function updatePPM(val){
  $('#nutVal').textContent = Math.round(val);
  $('#nutBar').style.width = Math.min(100, val/1200*100)+'%';
  const b = $('#nutBadge');
  if(val<cfg.ppm.min*0.7 || val>cfg.ppm.max*1.3){ badge(b,'bad'); addAlert(`⚠️ Nutrientes críticos: ${Math.round(val)} ppm`); }
  else if(val<cfg.ppm.min || val>cfg.ppm.max){ badge(b,'warn'); }
  else { badge(b,'ok'); }
}

function updateTemp(val){
  $('#tempVal').textContent = Math.round(val);
  $('#tempBar').style.width = ((val-10)/(35-10)*100)+'%';
  const b = $('#tempBadge');
  if(val<cfg.temp.min-3 || val>cfg.temp.max+3){ badge(b,'bad'); addAlert(`⚠️ Temperatura fuera de rango: ${Math.round(val)} °C`); }
  else if(val<cfg.temp.min || val>cfg.temp.max){ badge(b,'warn'); }
  else { badge(b,'ok'); }
}

function updateLight(val){
  $('#lightVal').textContent = val.toFixed(1);
  $('#lightBar').style.width = (val/24*100)+'%';
  const b = $('#lightBadge');
  if(val<cfg.light.min-2 || val>cfg.light.max+2){ badge(b,'bad'); addAlert(`⚠️ Luz diaria inadecuada: ${val.toFixed(1)} h`); }
  else if(val<cfg.light.min || val>cfg.light.max){ badge(b,'warn'); }
  else { badge(b,'ok'); }
}

// Ranges listeners
$('#phRange').addEventListener('input', e=>updatePH(parseFloat(e.target.value)));
$('#nutRange').addEventListener('input', e=>updatePPM(parseFloat(e.target.value)));
$('#tempRange').addEventListener('input', e=>updateTemp(parseFloat(e.target.value)));
$('#lightRange').addEventListener('input', e=>updateLight(parseFloat(e.target.value)));

// Config save
$('#saveCfg').addEventListener('click', ()=>{
  cfg.ph.min = parseFloat($('#phMin').value); cfg.ph.max = parseFloat($('#phMax').value);
  cfg.ppm.min = parseFloat($('#ppmMin').value); cfg.ppm.max = parseFloat($('#ppmMax').value);
  cfg.temp.min = parseFloat($('#tMin').value); cfg.temp.max = parseFloat($('#tMax').value);
  cfg.light.min = parseFloat($('#lMin').value); cfg.light.max = parseFloat($('#lMax').value);
  addAlert('ℹ️ Configuración guardada.');
  // Re-evaluar con valores actuales
  updatePH(parseFloat($('#phRange').value));
  updatePPM(parseFloat($('#nutRange').value));
  updateTemp(parseFloat($('#tempRange').value));
  updateLight(parseFloat($('#lightRange').value));
});

// Clear alerts
$('#clearAlerts').addEventListener('click', ()=>{ alertsList.innerHTML=''; });

// Contact form (demo)
$('#contactForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const ok = $('#cName').value && $('#cMail').value && $('#cMsg').value;
  $('#cStatus').textContent = ok ? 'Enviado ✅ (demo)' : 'Completa todos los campos';
});

// Init
updatePH(6.2); updatePPM(350); updateTemp(22); updateLight(12.8);
