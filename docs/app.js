'use strict';
const config = window.WEDDING;
const $ = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const phone = value => String(value).replace(/\D/g, '');
const mapLink = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const whatsapp = (number, message = '') => `https://wa.me/${phone(number)}?text=${encodeURIComponent(message)}`;
const externalLink = (url, text, extra = '') => `<a class="action ${extra}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
const music = $('music');
if (config.music) { music.src = config.music; $('music-toggle').hidden = false; }
function updateMusic() { $('music-toggle').textContent = music.paused ? '♫ Activar música' : '♫ Silenciar música'; $('music-toggle').setAttribute('aria-pressed', String(!music.paused)); }
async function startMusic() { if (!config.music) return; try { await music.play(); } catch { /* El usuario puede volver a activarla con el botón. */ } updateMusic(); }
music.addEventListener('error', () => { $('music-toggle').textContent = 'Música no disponible'; $('music-toggle').disabled = true; });
$('music-toggle').addEventListener('click', () => { if (music.paused) startMusic(); else { music.pause(); updateMusic(); } });
$('open-invitation').addEventListener('click', () => {
  $('open-invitation').disabled = true;
  $('open-invitation').classList.add('open'); startMusic();
  setTimeout(() => { $('entrance').hidden = true; $('invitation').hidden = false; const heading = document.querySelector('h1'); heading.tabIndex = -1; heading.focus({preventScroll:true}); window.scrollTo(0,0); }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1300);
});
if (config.photo) { const photo = new Image(); photo.alt = 'Nayelis y Dominik'; photo.onload = () => $('portrait').replaceChildren(photo); photo.src = config.photo; }
function countdown(now = Date.now()) {
  const remaining = Math.max(0, new Date(config.ceremonyAt).getTime() - now);
  const parts = [Math.floor(remaining/86400000), Math.floor(remaining/3600000)%24, Math.floor(remaining/60000)%60, Math.floor(remaining/1000)%60];
  ['days','hours','minutes','seconds'].forEach((id,index) => { $(id).textContent = String(parts[index]).padStart(2,'0'); });
  if (!remaining) $('countdown-note').textContent = '¡Ha llegado nuestro gran día!';
}
countdown(); setInterval(countdown, 1000);
const heading = (icon, title) => `<div class="modal-icon" aria-hidden="true">${icon}</div><p class="eyebrow modal-eyebrow">NAYELIS & DOMINIK</p><h2 id="modal-title">${title}</h2>`;
const content = {
  story: () => `${heading('♡','Nuestra historia')}<p>Hemos reído, viajado, crecido y construido una familia. Ahora queremos celebrar el siguiente capítulo de nuestra historia contigo.</p><p>Lo que empezó como una historia de dos, hoy es una historia de amor, familia y sueños compartidos.</p><p>Tenemos una historia que contar, un amor que celebrar y un «sí, quiero» que compartir contigo.</p><p class="signature center">¡Nos casamos!</p>`,
  ceremony: () => `${heading('⛪','La ceremonia')}<p class="modal-time">${escapeHtml(config.ceremonyTime)}</p>${config.ceremonyProvisional ? '<p class="small center">Hora provisional · pendiente de confirmación</p>' : ''}<h3 class="center">Basílica de San Juan el Real</h3><p class="center">Oviedo · 9 de julio de 2027</p>${externalLink(mapLink('Basílica de San Juan el Real, Oviedo'),'Ver ubicación')}`,
  reception: () => `${heading('🥂','La celebración')}<p class="modal-time">${escapeHtml(config.receptionTime)}</p><h3 class="center">DeLoya Latores</h3><p class="center">C. Latores, 5c<br>33193 Oviedo, Asturias</p>${externalLink(mapLink('DeLoya Latores, C. Latores, 5c, 33193 Oviedo, Asturias'),'Ver ubicación')}`,
  dress: () => `${heading('👗 👔','Dress code')}<p class="center">Elegancia y mucho amor para nuestro gran día.</p><p>Os pedimos evitar el blanco, el rojo y el amarillo pastel, reservado para nuestras damas. 💛</p><div class="swatches" aria-label="Colores a evitar"><span><b></b>Blanco</span><span><b></b>Rojo</span><span><b></b>Amarillo pastel</span></div>`,
  contact: () => `${heading('✉','Hablemos')}<p>Pronto compartiremos los datos de contacto.</p>`
};
const rsvpFormMarkup = `<form id="rsvp-form"><label>Nombre y apellidos<input name="name" autocomplete="name" maxlength="120" required></label><label>¿Asistirás?<select name="attendance"><option value="Sí">Sí, ¡allí estaré!</option><option value="No">No podré asistir</option></select></label><div id="guest-details"><label>Nombres de acompañantes<textarea name="companions" maxlength="400" placeholder="Si vienes acompañado/a"></textarea></label><div class="form-grid"><label>Adultos (incluyéndote)<input name="adults" type="number" min="1" max="30" value="1" required></label><label>Menús infantiles<input name="children" type="number" min="0" max="30" value="0" required></label></div><label>Menús especiales o alergias<textarea name="menus" maxlength="600" placeholder="Indica el nombre y lo que necesita cada persona"></textarea></label><label>¿Necesitas autobús?<select name="bus"><option>No</option><option>Sí</option><option>Pendiente de confirmar</option></select></label></div><label>¿A quién quieres enviárselo?<select name="recipient"><option value="bride">Nayelis</option><option value="groom">Dominik</option></select></label><label>Un mensaje para nosotros<textarea name="message" maxlength="600"></textarea></label><p class="notice">Prepararemos un mensaje con tus respuestas. Deberás enviarlo en WhatsApp para confirmar tu asistencia. No se guardan datos en esta web.</p><button class="action" type="submit">Preparar mi confirmación</button><div id="form-status" role="status"></div></form>`;
$('rsvp-content').innerHTML = config.formUrl && /^https:\/\//i.test(config.formUrl) ? externalLink(config.formUrl,'Abrir formulario de asistencia') : !config.bridePhone || !config.groomPhone ? '<p class="notice">La confirmación de asistencia estará disponible próximamente.</p>' : rsvpFormMarkup;
$('gift-content').innerHTML = config.iban ? `<p class="iban">${escapeHtml(config.iban)}</p><button class="action" id="copy-iban">Copiar número de cuenta</button><p role="status" id="copy-status"></p>` : '<p class="notice">Pronto compartiremos el número de cuenta. Si lo necesitas, puedes contactar con nosotros.</p>';
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
const modal = $('modal'); let opener;
function closeModal() { modal.close(); }
document.querySelectorAll('[data-modal]').forEach(button => button.addEventListener('click', () => {
  opener = button; $('modal-content').innerHTML = content[button.dataset.modal](); modal.showModal(); document.body.classList.add('modal-open'); modal.scrollTop = 0;
}));
$('close-modal').addEventListener('click',closeModal);
modal.addEventListener('click',event => { const r=modal.getBoundingClientRect(); if(event.target===modal && (event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom)) closeModal(); });
modal.addEventListener('close', () => { document.body.classList.remove('modal-open'); opener?.focus(); });
