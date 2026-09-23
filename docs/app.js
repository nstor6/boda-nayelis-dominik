'use strict';
const config = window.WEDDING;
const $ = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const phone = value => String(value).replace(/\D/g, '');
const whatsapp = (number, message = '') => `https://wa.me/${phone(number)}?text=${encodeURIComponent(message)}`;
const externalLink = (url, text) => `<a class="action" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const music = $('music'); const musicToggle = $('music-toggle');
if (config.music) { music.src = config.music; musicToggle.hidden = false; }
function updateMusic() { musicToggle.setAttribute('aria-pressed', String(!music.paused)); musicToggle.setAttribute('aria-label', music.paused ? 'Activar música' : 'Silenciar música'); }
async function startMusic() { if (!config.music) return; try { await music.play(); } catch { /* El usuario puede volver a activarla con el botón. */ } updateMusic(); }
music.addEventListener('error', () => { musicToggle.hidden = true; });
musicToggle.addEventListener('click', () => { if (music.paused) startMusic(); else { music.pause(); updateMusic(); } });

const root = document.documentElement;
const hero = $('hero'); const envBack = document.querySelector('.env-back'); const seal = $('env-seal');
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
function openEnvelope() {
  if (root.classList.contains('env-open')) return;
  root.classList.remove('env-sealed'); root.classList.add('env-open');
  seal.setAttribute('aria-disabled', 'true'); seal.tabIndex = -1;
  $('env-note').textContent = 'Desliza hacia abajo para sacar la invitación';
  startMusic();
}
seal.addEventListener('click', openEnvelope);
// La tarjeta sube con el scroll nativo; al salir casi entera, el sobre cae con su propia animación CSS.
const intro = document.querySelector('.env-intro');
let leaveAt = Infinity;
function measureEnvelope() {
  const envStyle = getComputedStyle(envBack);
  const envHeight = parseFloat(envStyle.height);
  leaveAt = hero.offsetHeight + 12 - envHeight * .3;
}
function updateEnvelope() {
  const scrolled = window.scrollY;
  if (scrolled > 0) openEnvelope();
  intro.style.opacity = String(Math.max(0, 1 - scrolled / 180));
  const leaving = root.classList.contains('env-leaving');
  if (!leaving && scrolled > leaveAt) root.classList.add('env-leaving');
  else if (leaving && scrolled < leaveAt - 60) root.classList.remove('env-leaving');
}
let envFrame = 0;
const scheduleEnvelope = () => { if (!envFrame) envFrame = requestAnimationFrame(() => { envFrame = 0; updateEnvelope(); }); };
addEventListener('scroll', scheduleEnvelope, {passive:true});
addEventListener('resize', () => { measureEnvelope(); scheduleEnvelope(); });
measureEnvelope(); updateEnvelope();
document.fonts?.ready.then(() => { measureEnvelope(); updateEnvelope(); });

if (config.photo) { const photo = new Image(); photo.alt = 'Nayelis y Dominik'; photo.onload = () => { $('portrait').classList.add('has-photo'); $('portrait').replaceChildren(photo); }; photo.src = config.photo; }

function countdown(now = Date.now()) {
  const remaining = Math.max(0, new Date(config.ceremonyAt).getTime() - now);
  const parts = [Math.floor(remaining/86400000), Math.floor(remaining/3600000)%24, Math.floor(remaining/60000)%60, Math.floor(remaining/1000)%60];
  ['days','hours','minutes','seconds'].forEach((id,index) => { $(id).textContent = String(parts[index]).padStart(2,'0'); });
  if (!remaining) $('countdown-note').textContent = '¡Ha llegado nuestro gran día!';
}
countdown(); setInterval(countdown, 1000);

$('ceremony-time').textContent = config.ceremonyTime;
$('ceremony-note').hidden = !config.ceremonyProvisional;
if (config.arrivalTime) { $('arrival-time').textContent = config.arrivalTime; $('ceremony-arrival').hidden = false; }
$('reception-time').textContent = config.receptionTime;

const rsvpFormMarkup = `<form id="rsvp-form"><label>Nombre y apellidos<input name="name" autocomplete="name" maxlength="120" required></label><label>¿Asistirás?<select name="attendance"><option value="Sí">Sí, ¡allí estaré!</option><option value="No">No podré asistir</option></select></label><div id="guest-details"><label>Nombres de acompañantes<textarea name="companions" maxlength="400" placeholder="Si vienes acompañado/a"></textarea></label><div class="form-grid"><label>Adultos (incluyéndote)<input name="adults" type="number" min="1" max="30" value="1" required></label><label>Menús infantiles<input name="children" type="number" min="0" max="30" value="0" required></label></div><label>Menús especiales o alergias<textarea name="menus" maxlength="600" placeholder="Indica el nombre y lo que necesita cada persona"></textarea></label><label>¿Necesitas autobús?<select name="bus"><option>No</option><option>Sí</option><option>Pendiente de confirmar</option></select></label></div><label>¿A quién quieres enviárselo?<select name="recipient"><option value="bride">Nayelis</option><option value="groom">Dominik</option></select></label><label>Un mensaje para nosotros<textarea name="message" maxlength="600"></textarea></label><p class="notice">Prepararemos un mensaje con tus respuestas. Deberás enviarlo en WhatsApp para confirmar tu asistencia. No se guardan datos en esta web.</p><button class="action" type="submit">Preparar mi confirmación</button><div id="form-status" role="status"></div></form>`;
$('rsvp-content').innerHTML = config.formUrl && /^https:\/\//i.test(config.formUrl) ? externalLink(config.formUrl,'Abrir formulario de asistencia') : !config.bridePhone || !config.groomPhone ? '<p class="notice">La confirmación de asistencia estará disponible próximamente.</p>' : rsvpFormMarkup;
$('gift-content').innerHTML = config.iban ? `<p class="iban">${escapeHtml(config.iban)}</p><button class="action" id="copy-iban">Copiar número de cuenta</button><p role="status" id="copy-status" class="small"></p>` : '<p class="notice">Pronto compartiremos el número de cuenta. Si lo necesitas, puedes contactar con nosotros.</p>';
if ($('copy-iban')) $('copy-iban').addEventListener('click', async () => { try { await navigator.clipboard.writeText(config.iban); $('copy-status').textContent='Número de cuenta copiado.'; } catch { $('copy-status').textContent='No se pudo copiar. Selecciona el número de cuenta y cópialo manualmente.'; } });
if ($('rsvp-form')) {
  const form = $('rsvp-form'); const status = $('form-status');
  form.addEventListener('input', () => { status.replaceChildren(); });
  form.elements.attendance.addEventListener('change', () => { const absent = form.elements.attendance.value === 'No'; $('guest-details').hidden = absent; $('guest-details').querySelectorAll('input,textarea,select').forEach(input => { input.disabled = absent; }); });
  form.addEventListener('submit', event => {
    event.preventDefault(); const data = new FormData(form); const name = String(data.get('name')).trim();
    if (!name) { form.elements.name.setCustomValidity('Escribe tu nombre y apellidos.'); form.elements.name.reportValidity(); form.elements.name.addEventListener('input', () => form.elements.name.setCustomValidity(''), {once:true}); return; }
    const lines = ['Confirmación boda Nayelis & Dominik', `Nombre: ${name}`, `Asistencia: ${data.get('attendance')}`];
    if (data.get('attendance') === 'Sí') lines.push(`Acompañantes: ${data.get('companions') || 'Ninguno'}`,`Adultos: ${data.get('adults')}`,`Menús infantiles: ${data.get('children')}`,`Menús especiales o alergias: ${data.get('menus') || 'Ninguno'}`,`Autobús: ${data.get('bus')}`);
    if (data.get('message')) lines.push(`Mensaje: ${data.get('message')}`);
    const target = data.get('recipient') === 'groom' ? config.groomPhone : config.bridePhone;
    status.innerHTML = '<p>Tu mensaje está preparado. Ábrelo y envíalo en WhatsApp para completar la confirmación.</p>' + externalLink(whatsapp(target,lines.join('\n')),'Abrir WhatsApp y enviar');
  });
}

const revealItems = document.querySelectorAll('.reveal');
if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); } }), {threshold:.12, rootMargin:'0px 0px -30px 0px'});
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add('in'));
