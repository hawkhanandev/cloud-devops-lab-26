// All API calls to the Express backend
// Vite proxies /expenses → http://localhost:3000 in dev

const BASE = '/expenses';

const handleRes = async (res) => {
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Request failed');
  return json;
};

export const getAll     = ()       => fetch(BASE).then(handleRes);
export const getSummary = ()       => fetch(`${BASE}/summary`).then(handleRes);
export const getOne     = (id)     => fetch(`${BASE}/${id}`).then(handleRes);

export const create = (data) =>
  fetch(BASE, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  }).then(handleRes);

export const update = (id, data) =>
  fetch(`${BASE}/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  }).then(handleRes);

export const remove = (id) =>
  fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(handleRes);
