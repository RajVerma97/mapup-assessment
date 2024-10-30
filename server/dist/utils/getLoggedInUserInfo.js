export async function getLoggedInUserInfo() {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/user', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const message = await response.text();
        throw new Error(message);
    }
}
