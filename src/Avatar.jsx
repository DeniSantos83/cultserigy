import {mensagemErro} from './lib/mensagemErro.js';
import React,{useState,useEffect,useRef} from 'react';
import {supabase} from './lib/supabase.js';
export function Avatar({profile,name,size=40}){
 const [failed,F]=useState(false); const url=profile?.avatar_url; useEffect(()=>F(false),[url]);
 let valid=false;try{valid=new URL(url).protocol==='https:'}catch{}
 return <span style={{display:'inline-flex',width:size,height:size,flex:'0 0 auto',borderRadius:'50%',overflow:'hidden',alignItems:'center',justifyContent:'center',background:'#777',color:'white',verticalAlign:'middle',fontSize:size*.4}}>{valid&&!failed?<img src={url} alt="" onError={()=>F(true)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:(name||profile?.nome||'?').slice(0,1).toUpperCase()}</span>
}
export default function AvatarEditor({user}){
 const [profile,P]=useState(null),[notice,N]=useState(''),[busy,B]=useState(false);const input=useRef(null);const lock=useRef(false);
 useEffect(()=>{let active=true;P(null);supabase.from('perfis').select('id,nome,avatar_url').eq('id',user.id).single().then(({data,error})=>{if(active){P(data);N(error ? mensagemErro(error) : '')}});return()=>{active=false}},[user.id]);
 async function save(e){e.preventDefault();if(lock.current||!profile)return;const file=input.current?.files[0];const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[file?.type];if(!ext||!file.size||file.size>5*1024*1024){N('Escolha uma imagem JPG, PNG ou WebP de até 5 MB.');return}lock.current=true;B(true);N('');let path,uploaded=false;try{path=`${user.id}/${crypto.randomUUID()}.${ext}`;const r=await supabase.storage.from('avatares').upload(path,file);if(r.error)throw r.error;uploaded=true;const url=supabase.storage.from('avatares').getPublicUrl(path).data.publicUrl;const result=await supabase.from('perfis').update({avatar_url:url}).eq('id',user.id).select('id,nome,avatar_url').single();if(result.error)throw result.error;uploaded=false;P(result.data);if(input.current)input.current.value='';N('Foto atualizada.');}catch(err){if(uploaded)await supabase.storage.from('avatares').remove([path]);N(mensagemErro(err))}finally{lock.current=false;B(false)}}
 return <section className="feed-card panel-form"><h2>Minha foto de perfil</h2><Avatar profile={profile} size={88}/><p>A foto será pública no feed e nos comentários.</p><form onSubmit={save}><label>Escolher foto<input ref={input} type="file" accept="image/jpeg,image/png,image/webp" required disabled={busy}/></label><button disabled={!profile||busy}>{busy?'Salvando…':'Salvar foto'}</button></form>{notice&&<p role="status">{notice}</p>}</section>
}
