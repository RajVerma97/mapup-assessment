export async function isUserLoggedIn() {
    const token = localStorage.getItem('token');
    if (token) {
        return true;
    }
    else {
        return false;
    }
}
