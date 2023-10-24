import $ from "./modules/$.js";
import { navigate } from "./components/Link.js";

let inter;

$('#search').keyup(function (proxy, _event) {
  const element = proxy.element;
  if (inter) clearTimeout(inter);
  inter = setTimeout(()=>{
    const value = element.value.replaceAll(' ', '-').trim();
    if(value === '') return navigate('/');
    navigate(`/search/${value}`);
  }, 200);
});
