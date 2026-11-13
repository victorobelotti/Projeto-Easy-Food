const {MailerSend,EmailParams,Sender,Recipient}=require('mailersend');
function escapeHtml(value) {return String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function buildHtml({header,body,footer}) {
  return `<div style="font-family:sans-serif;max-width:600px;margin:auto"><h2>${escapeHtml(header)}</h2><div>${body}</div><hr><p style="color:#888;font-size:12px">${escapeHtml(footer)}</p></div>`;
}
async function sendEmail({to,toName,subject,header,body,footer}) {
  if (process.env.EMAIL_SIMULATE_FAILURE==='true') throw new Error('Falha simulada no envio de e-mail');
  if (!process.env.EMAIL_API_KEY || !process.env.EMAIL_FROM) {
    console.log('[EMAIL] Não configurado: envio omitido. Configure EMAIL_API_KEY e EMAIL_FROM para ativar.');
    return {skipped:true};
  }
  if (!to) {console.log('[EMAIL] Destinatário não configurado: envio omitido.');return {skipped:true};}
  const mailerSend=new MailerSend({apiKey:process.env.EMAIL_API_KEY});
  const params=new EmailParams()
    .setFrom(new Sender(process.env.EMAIL_FROM,process.env.EMAIL_FROM_NAME || 'EasyFood'))
    .setTo([new Recipient(to,toName || to)])
    .setSubject(subject)
    .setHtml(buildHtml({header,body,footer}));
  await mailerSend.email.send(params);
  console.log(`[EMAIL] Enviado para ${to} - ${subject}`);
  return {sent:true};
}
module.exports={sendEmail,buildHtml};
