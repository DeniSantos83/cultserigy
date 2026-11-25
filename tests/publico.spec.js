import {test, expect} from '@playwright/test';

// Read-only against the configured Supabase. No signup, mutations or emails.
test('landing e navegação ao feed', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'CultSerigy',exact:true})).toBeVisible();
  await page.getByRole('navigation',{name:'Menu principal'}).getByRole('button',{name:'Explorar',exact:true}).click();
  await expect(page).toHaveURL(/\/feed$/);
  await expect(page.getByRole('heading',{name:'Explore nossa cultura'})).toBeVisible();
});
test('feed anônimo sem consultar interações privadas', async ({page}) => {
  const privateReads=[];
  page.on('request',r=>{if(r.method()==='GET' && /\/rest\/v1\/(curtidas|favoritos|seguidores)(?:\?|$)/.test(r.url())) privateReads.push(r.url());});
  for(let i=0;i<2;i++) {
    if(i===0) await page.goto('/feed'); else await page.reload();
    await expect(page.getByRole('heading',{name:'Explore nossa cultura'})).toBeVisible();
    await expect(page.getByRole('button',{name:'Todos',exact:true})).toBeVisible();
    await expect(page.getByText('Carregando…',{exact:true})).toHaveCount(0);
    await expect(page.getByRole('alert')).toHaveCount(0);
    await expect(page.getByRole('link',{name:'Entrar',exact:true})).toBeVisible();
  }
  expect(privateReads).toEqual([]);
});
test('descoberta de artistas', async ({page})=>{
  await page.goto('/artistas');
  await expect(page.getByRole('heading',{name:'Descubra artistas'})).toBeVisible();
});
test('agenda cultural', async ({page})=>{
  await page.goto('/agenda');
  await expect(page.getByRole('heading',{name:'Agenda cultural'})).toBeVisible();
});
test('login e recuperação sem envio de e-mail', async ({page})=>{
  await page.goto('/login');
  await expect(page.getByRole('heading',{name:'Bem-vindo de volta'})).toBeVisible();
  await expect(page.getByLabel('E-mail',{exact:true})).toBeVisible();
  await page.getByRole('link',{name:'Esqueci minha senha'}).click();
  await expect(page.getByRole('heading',{name:'Recupere sua senha'})).toBeVisible();
});
test('cadastro permanece bloqueado durante revisão legal', async ({page})=>{
  await page.goto('/cadastro');
  await expect(page.getByRole('heading',{name:'Crie sua conta'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Criar conta',exact:true})).toBeDisabled();
});
test('feed em viewport mobile', async ({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/feed');
  await expect(page.getByRole('heading',{name:'Explore nossa cultura'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Entrar',exact:true})).toBeVisible();
});
