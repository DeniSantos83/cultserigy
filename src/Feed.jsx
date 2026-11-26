import {profileStyle,SocialIcon} from './ProfileColors.jsx';
import CommunitySidebar from './CommunitySidebar.jsx';
import SiteNav from './SiteNav.jsx';
import {projects} from './data.js';
import {PhotoModal,UiIcon} from './UiComponents.jsx';
import {mensagemErro} from './lib/mensagemErro.js';
import React,{useEffect,useState,useRef} from 'react';
import {supabase,base} from './lib/supabase.js';
import {Avatar} from './Avatar.jsx';
const paths={home:'M3 10l9-7 9 7v10h-6v-7H9v7H3z',search:'M21 21l-5-5 M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0',users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-4 M16 3a4 4 0 0 1 0 8',grid:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',bookmark:'M6 3h12v18l-6-4-6 4z',heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8',calendar:'M3 5h18v16H3z M7 3v4 M17 3v4 M3 10h18',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4'};
function NavIcon({name,filled=false}){return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill={filled?'currentColor':'none'} stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]}/></svg>;}
function safe(url){try{const u=new URL(url);return u.protocol==='https:'?u.href:null}catch{return null}}
function Media({m}){const url=safe(m.url);if(!url)return null;const u=new URL(url);let embed=null;if(m.tipo==='youtube'){const id=u.hostname==='youtu.be'?u.pathname.slice(1):['www.youtube.com','youtube.com','m.youtube.com'].includes(u.hostname)?u.searchParams.get('v')||u.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/)?.[1]:null;if(/^[\w-]{11}$/.test(id||''))embed='https://www.youtube-nocookie.com/embed/'+id;}if(m.tipo==='spotify'&&u.hostname==='open.spotify.com'&&/^\/(track|album|artist|playlist|episode|show)\/[a-zA-Z0-9]+\/?$/.test(u.pathname))embed='https://open.spotify.com/embed'+u.pathname;if(m.tipo==='imagem')return <PhotoModal url={url}/>;return embed?<iframe className="media-frame" title={m.tipo} src={embed} loading="lazy" allow="encrypted-media; fullscreen; picture-in-picture" allowFullScreen/>:<a href={url} target="_blank" rel="noopener noreferrer">Abrir mídia</a>}

const motivosDenuncia=['Spam ou publicidade indevida','Conteúdo ofensivo','Violação de direitos autorais','Conteúdo inadequado','Falsidade de identidade','Outro motivo'];
function ReportButton({post,uid}){
 const dialog=useRef(null), lock=useRef(false);
 const [reason,setReason]=useState(''),[details,setDetails]=useState(''),[pending,setPending]=useState(false),[message,setMessage]=useState(''),[sent,setSent]=useState(false);
 function open(){setReason('');setDetails('');setMessage('');dialog.current.showModal()}
 async function submit(e){e.preventDefault();if(!uid||!motivosDenuncia.includes(reason)||lock.current||sent)return;lock.current=true;setPending(true);setMessage('');try{
 const motivo=reason+(details.trim()?' — '+details.trim():'');
 const {error}=await supabase.from('denuncias').insert({usuario_id:uid,publicacao_id:post.id,motivo});if(error)throw error;setSent(true);setMessage('Denúncia enviada à administração.');
 }catch(e){setMessage(mensagemErro(e))}finally{lock.current=false;setPending(false)}}
 return <><button type="button" onClick={open} aria-label="Denunciar publicação" title="Denunciar publicação"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65"><path d="M5 21V3m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0"/></svg></button><dialog ref={dialog} className="cult-report" aria-label="Denunciar publicação" onCancel={e=>{if(lock.current)e.preventDefault()}}><h2>Denunciar publicação</h2><p>{post.titulo}</p>{!uid?<><p>Entre na sua conta para denunciar esta publicação.</p><a href={base+'login'}>Entrar na conta</a></>:sent?<p role="status">Denúncia enviada à administração.</p>:<form onSubmit={submit}><label>Motivo<select required value={reason} disabled={pending} onChange={e=>setReason(e.target.value)}><option value="">Selecione um motivo</option>{motivosDenuncia.map(m=><option key={m}>{m}</option>)}</select></label><label>Informações adicionais (opcional)<textarea maxLength={300} rows={3} value={details} disabled={pending} onChange={e=>setDetails(e.target.value)}/></label><small>{details.length}/300</small><p>O motivo e sua identificação ficam disponíveis à administração, não ao público.</p>{message&&<p role="alert">{message}</p>}<button type="submit" disabled={pending||!reason}>{pending?'Enviando…':'Enviar denúncia'}</button></form>}<button type="button" disabled={pending} onClick={()=>dialog.current.close()}>{sent?'Fechar':'Cancelar'}</button></dialog></>
}

export default function Feed(){
const [session,S]=useState(null),[view,V]=useState(({artists:'Artistas',categorias:'Categorias',salvos:'Salvos'})[new URLSearchParams(location.search).get('view')]||'Início'),[artist,A]=useState(new URLSearchParams(location.search).get('artist')),[category,C]=useState('Todos'),[query,Q]=useState(''),[dark,D]=useState(localStorage.getItem('cult-theme')==='dark'),[data,B]=useState({posts:[],artists:[],cats:[],links:[],likes:[],saved:[],follows:[],comments:[],profiles:[],postCounts:{},artistCounts:{}}),[draft,F]=useState({}),[error,E]=useState(''),[loading,L]=useState(true),[busy,U]=useState(false),[page,P]=useState(0);
const uid=session?.user.id;
 const [adminUid,setAdminUid]=useState(null);
 useEffect(()=>{let live=true;setAdminUid(null);if(!uid)return;const controller=new AbortController();
 supabase.from('administradores').select('usuario_id').eq('usuario_id',uid).abortSignal(controller.signal).maybeSingle().then(({data,error})=>{if(live&&!error&&data?.usuario_id===uid)setAdminUid(uid)}).catch(()=>{});
 return()=>{live=false;controller.abort()};},[uid]);
const [postId,setPostId]=useState(()=>new URLSearchParams(location.search).get('post'));
const [shareNotice,setShareNotice]=useState('');
function postUrl(id){const u=new URL(location.href);u.search='';u.hash='';u.searchParams.set('post',id);return u.href}
async function share(p,mode){const url=postUrl(p.id);setShareNotice('');try{if(mode==='native'&&navigator.share){await navigator.share({title:p.titulo,text:p.titulo,url});return}if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);setShareNotice('Link copiado.');}else{window.prompt('Copie o link da publicação:',url)}}catch(e){if(e.name!=='AbortError')window.prompt('Copie o link da publicação:',url)}}
function clearPost(){setPostId(null);history.pushState({},'',location.pathname);P(0)}
useEffect(()=>{const {data:{subscription}}=supabase.auth.onAuthStateChange((_,s)=>S(s));return ()=>subscription.unsubscribe()},[]);
useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';localStorage.setItem('cult-theme',dark?'dark':'light')},[dark]);
useEffect(()=>{const fn=()=>{const q=new URLSearchParams(location.search);A(q.get('artist'));setPostId(q.get('post'));P(0);C('Todos');Q('');V(({categorias:'Categorias',salvos:'Salvos'})[q.get('view')]||'Início')};window.addEventListener('popstate',fn);return()=>window.removeEventListener('popstate',fn)},[]);
const generation=useRef(0);
const [searchTerm,setSearchTerm]=useState('');
useEffect(()=>{const timer=setTimeout(()=>{P(0);setSearchTerm(query.trim().slice(0,120))},350);return()=>clearTimeout(timer)},[query]);
function chooseCategory(value){P(0);C(value)}
async function fetchPosts(checked,cats){
 if(view==='Salvos'&&!uid&&!postId&&!artist)return [];
 const savedOnly=view==='Salvos'&&!postId&&!artist;
 const term=postId?'':searchTerm;
 let columns='*,midias(*),autor:artistas!inner(id,nome_artistico,aprovado,capa_url,bio,instagram,youtube,spotify,pix,cor_primaria,cor_secundaria,cor_complementar,whatsapp)';
 if(savedOnly)columns+=',meus_salvos:favoritos!inner(usuario_id)';
 if(term)columns+=',autor_busca:artistas()';
 let q=supabase.from('publicacoes').select(columns).eq('visivel',true).eq('autor.aprovado',true);
 if(postId)return checked(q.eq('id',postId));
 if(artist)q=q.eq('artista_id',artist);
 if(category!=='Todos'){const cat=cats.find(c=>c.nome===category);if(!cat)return [];q=q.eq('categoria_id',cat.id)}
 if(savedOnly)q=q.eq('meus_salvos.usuario_id',uid);
 if(term){
  const pattern='%'+term.replace(/[\\%_*]/g,c=>'\\'+c)+'%';
  const quoted='"'+pattern.replace(/\\/g,'\\\\').replace(/"/g,'\\"')+'"';
  q=q.ilike('autor_busca.nome_artistico',pattern).or(`titulo.ilike.${quoted},conteudo.ilike.${quoted},autor_busca.not.is.null`);
 }
 return checked(q.order('criado_em',{ascending:false}).order('id',{ascending:false}).range(page*30,page*30+30));
}
async function load(){
 const ticket=++generation.current;
 L(true);E('');
 const checked=async(q)=>{const r=await q;if(r.error)throw r.error;return r.data||[]};
 const chunks=ids=>Array.from({length:Math.ceil(ids.length/100)},(_,i)=>ids.slice(i*100,i*100+100));
 const byIds=async(ids,query)=> (await Promise.all(chunks([...new Set(ids.filter(Boolean))]).map(batch=>checked(query(batch))))).flat();
 try{
 const [artistList,cats,links]=await Promise.all([
 checked(supabase.from('artistas').select('*').eq('aprovado',true)),
 checked(supabase.from('categorias').select('*').order('nome')),
 checked(supabase.from('artista_categorias').select('*'))]);
 if(ticket!==generation.current)return;
 const rows=await fetchPosts(checked,cats);
 if(ticket!==generation.current)return;
 const posts=rows.slice(0,30);
 const artists=[...new Map([...posts.map(p=>p.autor).filter(Boolean),...artistList].map(a=>[a.id,a])).values()];
 const ids=posts.map(p=>p.id);
 const counts=async(name,rows)=>Object.fromEntries((await byIds(rows.map(x=>x.id),batch=>supabase.rpc(name,{p_ids:batch}))).map(x=>[x.id,x]));
 const personal=(table,column,keys)=>uid?byIds(keys,batch=>supabase.from(table).select(column).eq('usuario_id',uid).in(column,batch)):Promise.resolve([]);
 const [comments,likes,saved,follows,postCounts,artistCounts]=await Promise.all([
 byIds(ids,batch=>supabase.from('comentarios').select('*').in('publicacao_id',batch).order('criado_em')),
 personal('curtidas','publicacao_id',ids),personal('favoritos','publicacao_id',ids),personal('seguidores','artista_id',artists.map(a=>a.id)),counts('contadores_posts',posts),counts('contadores_artistas',artists)]);
 const profiles=await byIds([...artists.map(a=>a.id),...comments.map(c=>c.usuario_id),uid],batch=>supabase.from('perfis').select('id,nome,avatar_url,municipio').in('id',batch));
 if(ticket===generation.current)B({posts,artists,cats,links,comments,profiles,likes,saved,follows,postCounts,artistCounts,hasNext:rows.length>30});
 }catch(e){if(ticket===generation.current)E(mensagemErro(e))}finally{if(ticket===generation.current)L(false)}
}
useEffect(()=>{B(d=>({...d,likes:[],saved:[],follows:[]}));if(postId&&!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId)){B(d=>({...d,posts:[]}));E('');L(false);return}load();return()=>{generation.current++}},[uid,page,postId,artist,category,searchTerm,view]);
function open(id){P(0);C('Todos');Q('');setSearchTerm('');setPostId(null);A(id);history.pushState({},'',id?'?artist='+encodeURIComponent(id):location.pathname);window.scrollTo(0,0)}
function select(v){if(v==='Artistas'){location.href=base+'artistas';return}open(null);V(v);C('Todos');Q('');P(0);if(v==='Categorias'||v==='Salvos')history.replaceState({},'',base+'feed?view='+(v==='Categorias'?'categorias':'salvos'))}
function cats(id){return data.links.filter(x=>x.artista_id===id).map(x=>data.cats.find(c=>c.id===x.categoria_id)?.nome).filter(Boolean)}
function requireUser(){if(uid)return true;setShareNotice('Entre na sua conta para curtir, comentar, salvar ou seguir artistas.');return false}
async function action(fn){if(!requireUser()||busy)return;U(true);E('');try{const {error}=await fn();if(error)throw error;await load()}catch(e){E(mensagemErro(e))}finally{U(false)}}
function toggle(t,col,id,exists){return action(()=>exists?supabase.from(t).delete().eq('usuario_id',uid).eq(col,id):supabase.from(t).insert({usuario_id:uid,[col]:id}))}
const profile=id=>data.profiles.find(x=>x.id===id);
const current=data.artists.find(a=>a.id===artist),matches=a=>a&&(category==='Todos'||cats(a.id).includes(category)),filtered=data.posts.filter(p=>data.artists.some(a=>a.id===p.artista_id));
return <div className="feed-shell"><SiteNav dark={dark} onTheme={D}><input aria-label="Buscar" placeholder="Buscar artistas e obras" value={query} onChange={e=>Q(e.target.value)}/></SiteNav><div className="feed-grid"><CommunitySidebar uid={uid} view={view} onSelect={select}/><section className="feed-content" role="main" id="cult-main" tabIndex={-1}><div className="feed-heading"><small>COMUNIDADE CULTURAL</small><h1>{postId?'Publicação':current?'Perfil artístico':view==='Início'?'Explore nossa cultura':view}</h1></div>{postId&&<button onClick={()=>{clearPost();A(null);V('Início');C('Todos');Q('')}}>← Voltar ao feed</button>}{shareNotice&&<p role="status">{shareNotice} {!uid&&<a href={base+'login'}>Entrar na conta</a>}</p>}{error&&<p role="alert">{error} <button onClick={load}>Tentar novamente</button></p>}{loading&&<p role="status">Carregando…</p>}{current&&<section className="feed-card profile-custom" style={profileStyle(current)}><button className="artist-back" onClick={()=>select('Artistas')}>← Artistas</button>{safe(current.capa_url)&&<img className="artist-cover" src={safe(current.capa_url)} alt="Capa" loading="lazy" decoding="async"/>}<div className="feed-body"><Avatar profile={profile(current.id)} name={current.nome_artistico} size={88}/><h2>{current.nome_artistico}</h2><p className="profile-category">{cats(current.id).join(' · ')}</p><p>{current.bio}</p><p>{data.artistCounts[current.id]?.seguidores??0} seguidores · {data.artistCounts[current.id]?.publicacoes??0} publicações</p><div className="artist-buttons">{uid!==current.id&&<button disabled={busy} onClick={()=>toggle('seguidores','artista_id',current.id,data.follows.some(f=>f.artista_id===current.id))}>{data.follows.some(f=>f.artista_id===current.id)?'Seguindo':'Seguir'}</button>}{current.pix&&<button onClick={async()=>{try{await navigator.clipboard.writeText(current.pix);alert('Chave Pix copiada. Confira o destinatário no seu banco.')}catch{E('Não foi possível copiar a chave Pix.')}}}><SocialIcon name="pix"/> Apoiar artista · Copiar Pix</button>}</div><div className="profile-social">{['instagram','youtube','spotify','whatsapp'].map(k=>{const url=k==='whatsapp'?(/^55[1-9]\d{9,10}$/.test(current.whatsapp||'')?'https://wa.me/'+current.whatsapp:null):safe(current[k]);return url&&<a key={k} href={url} target="_blank" rel="noopener noreferrer" aria-label={k} title={k}><SocialIcon name={k}/><span>{k}</span></a>})}</div>{uid===current.id&&<a href={base+'painel-artista'}>Editar perfil</a>}</div></section>}<div className="feed-filters" hidden={!!postId}>{['Todos',...data.cats.map(c=>c.nome)].map(c=><button key={c} className={category===c?'selected':''} onClick={()=>chooseCategory(c)}>{c}</button>)}</div>{!artist&&view==='Categorias'?<div className="feed-gallery">{data.cats.map(c=><button className="category-tile" key={c.id} onClick={()=>{V('Início');chooseCategory(c.nome)}}>{projects.find(x=>x.name===c.nome)&&<img src={projects.find(x=>x.name===c.nome).coverImage} alt="" loading="lazy"/>}<span>{c.nome}</span></button>)}</div>:!artist&&view==='Artistas'?<div className="feed-gallery">{data.artists.filter(a=>matches(a)&&a.nome_artistico.toLowerCase().includes(query.toLowerCase())).map(a=><button key={a.id} onClick={()=>open(a.id)}>{safe(a.capa_url)&&<img src={safe(a.capa_url)} alt="" loading="lazy" decoding="async"/>}<Avatar profile={profile(a.id)} name={a.nome_artistico}/><strong>{a.nome_artistico}</strong><small>{cats(a.id).join(' · ')}</small><small>{data.artistCounts[a.id]?.seguidores??0} seguidores · {data.artistCounts[a.id]?.publicacoes??0} publicações</small></button>)}</div>:<>{!loading&&!filtered.length&&<p>{postId?'Publicação indisponível ou não encontrada.':view==='Salvos'&&!uid?'Entre na sua conta para ver seus favoritos.':'Nenhuma publicação encontrada.'}</p>}{!loading&&filtered.map(p=>{const a=data.artists.find(a=>a.id===p.artista_id),liked=data.likes.some(x=>x.publicacao_id===p.id),saved=data.saved.some(x=>x.publicacao_id===p.id),comments=data.comments.filter(x=>x.publicacao_id===p.id);return <article className="feed-card" key={p.id}><div className="feed-author"><Avatar profile={profile(a.id)} name={a.nome_artistico}/><div><button className="artist-link" onClick={()=>open(a.id)}>{a.nome_artistico}</button><small>{cats(a.id).join(' · ')}</small></div></div>{p.midias.map(m=><Media key={m.id} m={m}/>)}<div className="feed-body"><div className="feed-actions"><button disabled={busy} aria-label="Curtir" aria-pressed={liked} onClick={()=>toggle('curtidas','publicacao_id',p.id,liked)}><NavIcon name="heart" filled={liked}/> {data.postCounts[p.id]?.curtidas??0}</button><span className="comment-count"><UiIcon name="comment"/> {data.postCounts[p.id]?.comentarios??0} comentários</span><button disabled={busy} aria-label="Salvar" aria-pressed={saved} onClick={()=>toggle('favoritos','publicacao_id',p.id,saved)}><NavIcon name="bookmark" filled={saved}/></button><button onClick={()=>share(p,'copy')} aria-label="Copiar link" title="Copiar link"><UiIcon name="link"/></button><a href={'https://wa.me/?text='+encodeURIComponent(p.titulo+' '+postUrl(p.id))} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no WhatsApp" title="WhatsApp"><UiIcon name="chat"/></a>{typeof navigator.share==='function'&&<button onClick={()=>share(p,'native')} aria-label="Compartilhar" title="Compartilhar"><UiIcon name="share"/></button>}<ReportButton key={uid||'visitor'} post={p} uid={uid}/></div><small>{data.cats.find(c=>c.id===p.categoria_id)?.nome||'Sem categoria'}</small><h2>{p.titulo}</h2><p style={{whiteSpace:'pre-wrap'}}>{p.conteudo}</p>{comments.map(c=><p className="feed-comment" key={c.id}><Avatar profile={profile(c.usuario_id)} size={24}/> <strong>{data.profiles.find(x=>x.id===c.usuario_id)?.nome||'Usuário'}:</strong> {c.texto} {c.usuario_id===uid&&<button disabled={busy} onClick={()=>action(()=>supabase.from('comentarios').delete().eq('id',c.id))}>Excluir</button>}</p>)}{!uid?<p className="visitor-cta"><a href={base+'login'}>Entre para comentar</a></p>:<><form onSubmit={e=>{e.preventDefault();const texto=(draft[p.id]||'').trim();if(texto)action(async()=>{const r=await supabase.from('comentarios').insert({usuario_id:uid,publicacao_id:p.id,texto});if(!r.error)F(d=>({...d,[p.id]:''}));return r})}}><input aria-label="Comentário" maxLength={140} placeholder="Adicionar comentário…" value={draft[p.id]||''} onChange={e=>F(d=>({...d,[p.id]:e.target.value}))}/><button disabled={busy||!(draft[p.id]||'').trim()}>Enviar</button></form><small>{(draft[p.id]||'').length}/140</small></>}</div></article>})}<div className="artist-buttons" hidden={!!postId}><button disabled={!page||loading} onClick={()=>P(p=>p-1)}>Anterior</button><span>Página {page+1}</span><button disabled={!data.hasNext||loading} onClick={()=>P(p=>p+1)}>Próxima</button></div></>}</section><aside className="feed-right"><h3>Artistas</h3>{data.artists.slice(0,3).map(a=><button key={a.id} onClick={()=>open(a.id)}>{a.nome_artistico}</button>)}<hr/><small>© CultSerigy · Sergipe, Brasil</small></aside></div></div>}
