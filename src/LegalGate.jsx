import React,{useEffect,useState} from 'react';
import SiteNav from './SiteNav.jsx';
import {supabase,base} from './lib/supabase.js';
import {legalDecision,legalGateEnabled} from './lib/legalGate.js';
import {legalVersion} from './Legal.jsx';
export default function LegalGate({children}){
 if(!legalGateEnabled)return children;
 return <ActiveGate>{children}</ActiveGate>;
}
function ActiveGate({children}){
 const [state,S]=useState('loading');
 const [retry,R]=useState(0);
 useEffect(()=>{
  let alive=true, generation=0;
  async function check(){
   const current=++generation;S('loading');
   try{
    const session=await supabase.auth.getSession();if(session.error)throw session.error;
    const userId=session.data.session?.user?.id;
    let result='allow';
    if(userId){
     const v=await supabase.from('versoes_legais').select('versao').eq('vigente',true).maybeSingle();if(v.error)throw v.error;
     if(v.data?.versao!==legalVersion)throw new Error('Versão indisponível');
     const a=await supabase.from('aceites_legais').select('versao').eq('usuario_id',userId).eq('versao',v.data.versao).maybeSingle();if(a.error)throw a.error;
     result=legalDecision({enabled:true,userId,version:v.data.versao,accepted:!!a.data});
    }
    if(alive&&current===generation)S(result);
   }catch{if(alive&&current===generation)S('error');}
  }
  let timer;const {data:{subscription}}=supabase.auth.onAuthStateChange(event=>{if(event==='SIGNED_IN'||event==='SIGNED_OUT'||event==='INITIAL_SESSION'){clearTimeout(timer);timer=setTimeout(check,0);}});
  check();return()=>{alive=false;clearTimeout(timer);subscription.unsubscribe();};
 },[retry]);
 if(state==='allow')return children;
 return <><SiteNav/><main className="legal-page" id="cult-main" tabIndex={-1}><h1>Documentos da CultSerigy</h1>{state==='loading'?<p role="status">Consultando aceite…</p>:state==='error'?<><p role="alert">Não foi possível verificar a versão jurídica. Tente novamente.</p><button onClick={()=>R(x=>x+1)}>Tentar novamente</button></>:<p>Leia os documentos e registre o aceite vigente na área Minha conta para continuar.</p>}<p><a href={base+'legal'}>Consultar documentos</a> · <a href={base+'minha-conta?tab=privacidade'}>Minha conta e privacidade</a></p></main></>;
}
