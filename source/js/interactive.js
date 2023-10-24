import $ from "./modules/$.js";

let inter;

$('#search').keyup(function (proxy, _event) {
  const element = proxy.element;
  if (inter) clearTimeout(inter);
  inter = setTimeout(()=>{
    const value = element.value.replaceAll(' ', '-');
    location.pathname = `/search/${value}`;
  }, 500);
});
