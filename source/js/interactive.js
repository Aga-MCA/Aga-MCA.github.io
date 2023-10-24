import $ from "./modules/$.js";
import { navigate } from "./components/Link.js";

let inter;

$('#search').keyup(function (proxy, _event) {
  const element = proxy.element;
  if (inter) clearTimeout(inter);
  inter = setTimeout(()=>{
    let pre = '/'
    if(location.pathname.startsWith('/addon')) pre = '/addon/';
    if(location.pathname.startsWith('/textura')) pre = '/textura/';
    const value = element.value.replaceAll(' ', '-').trim();
    if(value === '') return navigate(pre);
    navigate(`${pre}/search/${value}`.replace(/\/+/g, '/'));
  }, 200);
});
