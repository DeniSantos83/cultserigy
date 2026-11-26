import React,{useEffect,useState} from 'react';
import {base,supabase} from './lib/supabase.js';
const icons={bell:'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4',grid:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',bookmark:'M6 3h12v18l-6-4-6 4z'};
function Icon({name}){return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"><path d={icons[name]}/></svg>}
export default function CommunitySidebar({uid,view,onSelect}){
 const [sessionUid,setUid]=useState(null);
 useEffect(()=>{if(uid!==undefined)return;const {data:{subscription}}=supabase.auth.onAuthStateChange((_,s)=>setUid(s?.user?.id??null));return()=>subscription.unsubscribe()},[uid]);
 const logged=!!(uid===undefined?sessionUid:uid);
 const notifications=/\/notificacoes\/?$/.test(location.pathname);
 const items=[['grid','Categorias','categorias'],...(logged?[['bookmark','Salvos','salvos']]:[])];
 return <aside className="feed-nav cult-community-sidebar" aria-label="Menu da comunidade">{logged&&<a className={notifications?'selected':''} aria-current={notifications?'page':undefined} href={base+'notificacoes'}><Icon name="bell"/>Notificações</a>}{items.map(([icon,label,param])=>onSelect?<button type="button" key={param} className={view===label?'selected':''} aria-pressed={view===label} onClick={()=>onSelect(label)}><Icon name={icon}/><span>{label}</span></button>:<a key={param} href={base+'feed?view='+param}><Icon name={icon}/>{label}</a>)}</aside>
}
