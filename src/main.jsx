import React, {useState,useRef,useEffect,lazy,Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import {projects} from './data.js';
import './style.css';
const Feed = lazy(() => import('./Feed.jsx'));
import './feed.css';
const Auth = lazy(() => import('./Auth.jsx'));
const Legal = lazy(() => import('./Legal.jsx'));
const Account = lazy(() => import('./Account.jsx'));
const ArtistPanel = lazy(() => import('./ArtistPanel.jsx'));
const AdminPanel = lazy(() => import('./AdminPanel.jsx'));
import './auth.css';
const Community = lazy(() => import('./Community.jsx'));
const Discover = lazy(() => import('./Discover.jsx'));
import './design-system.css';
import SiteNav from './SiteNav.jsx';
import LegalGate from './LegalGate.jsx';
function App(){
 const [position,setPosition]=useState({x:0,y:0});
 const [dark,setDark]=useState(()=>localStorage.getItem('cult-theme')==='dark');
 const [page,setPage]=useState('');
 const container=useRef(null);
 const dialog=useRef(null);
 useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';localStorage.setItem('cult-theme',dark?'dark':'light')},[dark]);
 function move(e){if(e.pointerType==='touch'||!container.current)return;const r=container.current.getBoundingClientRect();setPosition({x:(e.clientX-r.left-r.width/2)/(r.width/2),y:(e.clientY-r.top-r.height/2)/(r.height/2)});}
 function open(name){if(name==='Agenda'){location.href=import.meta.env.BASE_URL+'agenda';return;}if(name==='Entrar'){window.location.href=import.meta.env.BASE_URL+'login';return;}if(name==='Artistas'){location.href=import.meta.env.BASE_URL+'artistas';return;}if(name==='Explorar'){window.location.href=import.meta.env.BASE_URL+'feed'+(name==='Artistas'?'?view=artists':'');return;}setPage(name);dialog.current.showModal();}
 return <div className="layout"><SiteNav dark={dark} onTheme={setDark}/><main id="cult-main" tabIndex={-1} ref={container} onPointerMove={move} onPointerLeave={()=>setPosition({x:0,y:0})}>
 <div className="image-layer" style={{transform:`translate(${-position.x*40}px,${-position.y*40}px)`}}><div className="mosaic">{projects.map(p=><div className="tile" key={p.name}><img src={p.coverImage} alt="" decoding="async"/></div>)}</div></div><div className="overlay"/><div className="title"><h1>CultSerigy</h1></div><div className="bio"><p>A arte sergipana tem seu lugar. Descubra quem cria, escreve, canta e transforma a cultura do nosso estado.</p><button onClick={()=>open('Explorar')}>Conheça a cultura sergipana <span aria-hidden="true">↗</span></button></div><span className="location">SERGIPE · BRASIL</span></main><dialog ref={dialog}><button className="close" aria-label="Fechar" onClick={()=>dialog.current.close()}>×</button><h2>{page}</h2>{page==='Explorar'?<div className="categories">{projects.map(p=><div key={p.name}><img src={p.coverImage} alt="" decoding="async"/><span>{p.name}</span></div>)}</div>:<p>Esta área será implementada na próxima etapa da rede social.</p>}</dialog></div>;
}
createRoot(document.getElementById('root')).render(<Suspense fallback={<p role="status" style={{padding:24}}>Carregando…</p>}>{/\/minha-conta\/?$/.test(location.pathname)?<Account/>:/\/legal\/?$/.test(location.pathname)?<Legal/>:/\/artistas\/?$/.test(location.pathname)?<LegalGate><Discover/></LegalGate>:/\/(agenda|notificacoes)\/?$/.test(location.pathname)?<LegalGate><Community/></LegalGate>:/\/admin\/?$/.test(location.pathname)?<LegalGate><AdminPanel/></LegalGate>:/\/painel-artista\/?$/.test(location.pathname)?<LegalGate><ArtistPanel/></LegalGate>:/\/(login|cadastro|recuperar-senha|nova-senha)\/?$/.test(location.pathname)?<Auth/>:/\/feed\/?$/.test(location.pathname)?<LegalGate><Feed/></LegalGate>:<App/>}</Suspense>);
