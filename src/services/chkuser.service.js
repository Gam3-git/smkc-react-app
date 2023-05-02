
export const ChkUser = () => { 
    let user = JSON.parse(localStorage.getItem('user'));
    if(!user) { console.log('NoUser'); return false; }
    if(user.roles === 'USER'){ return user; }
    if(user.roles === 'OPERATER'){ return user; }
    if(user.roles === 'ADMIN'){ return user; }
    if(user.roles != null){ return user; }
}
