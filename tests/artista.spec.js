import {test,expect} from '@playwright/test';
import {randomUUID} from 'node:crypto';
import {loginSeguro} from './login-seguro.js';
test.use({trace:'off',screenshot:'off',video:'off'});
test('artista de teste: perfil, categorias e ciclo da publicação',async ({page},testInfo)=>{
 test.setTimeout(120000);
 page.setDefaultTimeout(8000);
 page.setDefaultNavigationTimeout(15000);
 const email=process.env.CULT_ARTIST_EMAIL,password=process.env.CULT_ARTIST_PASSWORD;
 test.skip(!email||!password||process.env.CULT_ARTIST_ALLOW_WRITE!=='SIM','Use uma conta exclusiva de artista aprovado e autorize as escritas.');
 await loginSeguro(page,email,password);
 await page.goto('/painel-artista');
 await expect(page.getByRole('button',{name:'Meu perfil',exact:true})).toBeVisible();
 const name=page.locator('input[name="nome_artistico"]');
 await expect(name).toHaveValue('TESTE CULTSERIGY');
 const bio=page.locator('textarea[name="bio"]');
 await expect(bio).toBeVisible();
 const original=await bio.inputValue();
 const marker='TESTE E2E '+randomUUID();
 const status=page.getByRole('status').filter({hasText:'Operação concluída.'});
 const boxes=page.getByRole('group',{name:'Categorias'}).getByRole('checkbox');
 await expect(boxes.first()).toBeEnabled();
 const count=await boxes.count(); expect(count).toBeGreaterThanOrEqual(2);
 const initial=[]; for(let i=0;i<count;i++) initial.push(await boxes.nth(i).isChecked());
 const tab=async label=>{const b=page.getByRole('button',{name:label,exact:true}); await b.click(); await expect(b).toHaveAttribute('aria-pressed','true');};
 const works=async()=>{await tab('Minhas obras'); await expect(page.getByRole('heading',{name:'Minhas publicações',exact:true})).toBeVisible();};
 const post=()=>page.locator('article').filter({has:page.getByRole('heading',{name:marker,exact:true})});
 const edited=()=>page.locator('article').filter({has:page.getByRole('heading',{name:marker+' editado',exact:true})});
 let failure;
 try{
  await bio.fill(marker); await page.getByRole('button',{name:'Salvar perfil',exact:true}).click(); await expect(status).toBeVisible();
  await page.reload(); await expect(bio).toHaveValue(marker);
  for(let i=0;i<count;i++) await boxes.nth(i).setChecked(i<2);
  await page.getByRole('button',{name:'Salvar categorias'}).click(); await expect(page.getByText('Categorias salvas com sucesso.')).toBeVisible();
  await page.reload(); await expect(boxes.nth(0)).toBeChecked(); await expect(boxes.nth(1)).toBeChecked();
  await tab('Nova publicação');
  await page.locator('form:visible select[name="categoria_id"]').selectOption({index:1});
  await page.locator('form:visible input[name="titulo"]').fill(marker); await page.locator('form:visible textarea[name="conteudo"]').fill('Publicação temporária de teste automatizado.');
  await page.getByRole('button',{name:'Pré-visualizar publicação'}).click();
  await expect(page.getByRole('region',{name:'Pré-visualização da publicação'}).getByRole('heading',{name:marker,exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Confirmar publicação'}).click(); await expect(status).toBeVisible();
  await works(); await expect(post()).toBeVisible();
  await page.goto('/feed'); await expect(page.getByText(marker,{exact:true}).first()).toBeVisible();
  await page.goto('/painel-artista'); await works();
  await post().getByRole('button',{name:'Editar',exact:true}).click();
  await post().locator('input[name="titulo"]').fill(marker+' editado');
  await post().getByRole('button',{name:'Salvar alterações'}).click(); await expect(status).toBeVisible(); await expect(edited()).toBeVisible();
  await edited().getByRole('button',{name:'Ocultar',exact:true}).click(); await expect(edited().getByRole('button',{name:'Exibir',exact:true})).toBeVisible();
  await edited().getByRole('button',{name:'Exibir',exact:true}).click(); await expect(edited().getByRole('button',{name:'Ocultar',exact:true})).toBeVisible();
 }catch(e){failure=e;}
 finally{
  testInfo.setTimeout(testInfo.timeout+60000);
  try{
  await page.goto('/painel-artista'); await expect(name).toHaveValue('TESTE CULTSERIGY'); await works();
  for(const item of [post(),edited()]) if(await item.count()){
   page.once('dialog',d=>d.accept()); await item.getByRole('button',{name:'Excluir',exact:true}).click(); await expect(item).toHaveCount(0);
  }
  await page.goto('/painel-artista');
  await expect(name).toHaveValue('TESTE CULTSERIGY');
  await tab('Meu perfil');
  await expect(bio).toBeVisible();
  await bio.fill(original); await page.getByRole('button',{name:'Salvar perfil',exact:true}).click(); await expect(status).toBeVisible();
  for(let i=0;i<count;i++) await boxes.nth(i).setChecked(initial[i]);
  await page.getByRole('button',{name:'Salvar categorias'}).click(); await expect(page.getByText('Categorias salvas com sucesso.')).toBeVisible();
  }catch(cleanup){if(failure){console.warn("Limpeza incompleta:",cleanup.message);}else{failure=cleanup;}}
 }
 if(failure)throw failure;
});
