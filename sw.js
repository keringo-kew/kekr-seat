// KEKR좌석배정 - 오프라인 동작용
// 인터넷이 되면 최신 파일 사용, 끊기거나 3초 안에 응답이 없으면 태블릿 저장본으로 바로 실행
const CACHE='kekr-seat-v2';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const fromCache=()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'));
  const net=fetch(e.request).then(r=>{if(r&&r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r});
  const timeout=new Promise(res=>setTimeout(res,3000)).then(fromCache);
  e.respondWith(Promise.race([net.catch(fromCache),timeout]).then(r=>r||net.catch(fromCache)));
});
