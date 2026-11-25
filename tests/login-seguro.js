import {expect} from '@playwright/test';
export async function loginSeguro(page,email,password){
 await page.goto('/login');
 await page.getByLabel('E-mail',{exact:true}).fill(email);
 const field=page.locator('input[autocomplete="current-password"]');
 try{
  await field.fill(password);
  await page.getByRole('button',{name:'Entrar',exact:true}).click();
  await page.waitForURL(/\/feed$/,{timeout:15000});
 }catch{
  // Remove a página com os campos antes de registrar a falha.
  await page.goto('about:blank').catch(()=>page.close().catch(()=>{}));
  throw new Error('Login não concluído. Confira a conta de teste e a configuração local.');
 }
 await expect(page).toHaveURL(/\/feed$/);
}
