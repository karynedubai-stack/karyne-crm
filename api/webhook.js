export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const from = (req.body.From || '').replace('whatsapp:', '');
  const body = req.body.Body || '';
  const timestamp = new Date().toLocaleString('fr-FR', {timeZone:'Asia/Dubai'});

  const URL = 'https://gjmcepexmwhdomvxftmk.supabase.co';
  const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqbWNlcGV4bXdoZG9tdnhmdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNTY3MzQsImV4cCI6MjA5MTczMjczNH0.ZhwXXGynXIAIK_3XjQrZipdwW2gY_tuyaQehD7DP2d4';
  const headers = { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' };

  const search = await fetch(`${URL}/rest/v1/contacts?phone=eq.${encodeURIComponent(from)}`, { headers });
  const contacts = await search.json();
  const note = `[${timestamp}] ${body}`;

  if (contacts.length > 0) {
    const c = contacts[0];
    const updated = c.notes ? c.notes + '\n' + note : note;
    await fetch(`${URL}/rest/v1/contacts?id=eq.${c.id}`, {
      method: 'PATCH', headers,
      body: JSON.stringify({ notes: updated })
    });
  } else {
    await fetch(`${URL}/rest/v1/contacts`, {
      method: 'POST', headers,
      body: JSON.stringify({ name: from, phone: from, notes: note })
    });
  }

  res.status(200).send('<Response></Response>');
}
