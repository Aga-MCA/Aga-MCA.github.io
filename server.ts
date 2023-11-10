import mime from 'https://raw.githubusercontent.com/micnic/mime.json/master/index.json' with {type:'json'};
const port = 80;
function exist(path: string){
  try {
    Deno.statSync(path);
    return true;
  } catch (_) {
    return false;
  }
}
Deno.serve({port}, async (req) => {
  const url = new URL(req.url);
  if(exist(Deno.cwd()+url.pathname) && url.pathname !== "/"){
    const type = mime[url.pathname.split('.').pop()! as keyof typeof mime] || "text/plain";
    return new Response(Deno.readFileSync(Deno.cwd()+url.pathname), {headers: {"Content-Type": type}});
  }
    return new Response(Deno.readFileSync(Deno.cwd()+"/index.html"));
});