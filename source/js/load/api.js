const ADDONS = fetch('/api/addons.json').then(res => res.json());
const USERS = fetch('/api/users.json').then(res => res.json());

/**
 * @param {({
 *  type: 'textura' | 'addon';
 *  name: string;
 * } | {
 *  type?: 'textura' | 'addon';
 * }) & {
 *  search?: string;
 * }} query
 */
export default async function loadApi(query={}) {
  query.type === 'all' && delete query.type;
  /** @type {[typeof addons['content'][2], boolean][]} */
  const data = [];
  const addons = await ADDONS;
  const users = await USERS;
  for (const preaddon of addons.content) {
    const addon = preaddon['$ref'] ? (await fetch(preaddon['$ref']).then(res => res.json())) : preaddon;
    const isType = query && query.type && query.type === addon.type;
    const isName =
      query && query.name && query.name.toLowerCase() === addon.name;
    const isSearch =
      query && query.search && includes(addon, query.search.toLowerCase());
    const isShow =
      !query ||
      (!query.type || isType) &&
      (!query.name || isName) &&
      (!query.search || isSearch);

    const update = addon.versions.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))[0].date;
    data.push([addon, isShow, update]);
  }
  data.sort((a, b) => Date.parse(b[2]) - Date.parse(a[2]));
  return { data, users: users.content };
}

/**
 * @param {typeof addons['content'][0]} addon
 * @param {string} data
 */
function includes(addon, data) {
  if (!data) return true;
  if (addon.name.toLowerCase().includes(data)) return true;
  if (addon.type.toLowerCase().includes(data)) return true;
  if (
    addon.versions.find(
      v =>
        v.description?.toLowerCase().includes(data) ||
        v.tags?.find(t => t.toLowerCase().includes(data))
    )
  )
    return true;
  return false;
}
