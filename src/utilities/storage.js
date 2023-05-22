export function saveUsername(username) {
    localStorage.setItem('username_smartcontext', username);
}
  
export function getUsername() {
    const username = localStorage.getItem('username_smartcontext');
    return username;
}
