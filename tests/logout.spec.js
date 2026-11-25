import {loginSeguro} from './login-seguro.js';
import {test,expect} from '@playwright/test';
test.use({trace:"off", screenshot:"off", video:"off"});
test('login e logout sem erro de permissões',async ({page})=>{
  const email=process.env.CULT_TEST_EMAIL,password=process.env.CULT_TEST_PASSWORD;
  test.skip(!email||!password,'Defina credenciais de uma conta de teste na sessão do terminal.');
  await loginSeguro(page,email,password);
  await expect(page.getByRole('button',{name:'Sair',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Sair',exact:true}).click();
  await expect(page.getByRole('link',{name:'Entrar',exact:true})).toBeVisible();
  await expect(page.getByText('Carregando…',{exact:true})).toHaveCount(0);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('link',{name:'Entrar',exact:true})).toBeVisible();
  await expect(page.getByText('Carregando…',{exact:true})).toHaveCount(0);
  await expect(page.getByRole('alert')).toHaveCount(0);
});
