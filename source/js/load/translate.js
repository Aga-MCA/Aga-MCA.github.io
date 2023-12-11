class Lang{
  constructor(lang, name, father) {
    this.lang = lang;
    this.name = name;
    this.father = father;
  }
  get(key) {
    const actual = this.lang[key];
    if(actual) return actual;
    if(this.father) return this.father.get(key);
    return key;
  }
  use(key, args) {
    return this.get(key).replace(/\{([\w\d]+)\}/g, (_, key) => args[key] );
  }
}

async function loadLang(lang, father = null) {
  if(!lang || lang.length > 2) return father ?? new Lang({}, lang, father);
  const data = await fetch(`../../../lang/${lang}.json`).then(r=>r.json()).catch(e=>e);
  if(data instanceof Error) return father ?? new Lang({}, lang, father);
  return new Lang(data, lang, father);
}
export default async function translate() {
  const english = await loadLang('en');
  const navigatorLangStr = navigator.language.split('-')[0]
  const navigatorLang = await loadLang(navigatorLangStr, english);
  const localStorageLangStr = localStorage.getItem('lang');
  const localStorageLang = await loadLang(localStorageLangStr, navigatorLang);
  const urlLang = await loadLang(location.pathname.split('/')[1], localStorageLang);
  globalThis.lang = urlLang;
  return urlLang;
}