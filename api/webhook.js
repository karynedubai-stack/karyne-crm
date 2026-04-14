export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const from = req.body.From || '';
  const body = req.body.Body || '';
  console.log(`Message de ${from}: ${body}`);
  res.status(200).send('OK');
}
