import PocketBase from 'pocketbase';

// Conexión al backend local
export const pb = new PocketBase("http://127.0.0.1:8090");

// Cargar sesión guardada al iniciar
const authData = localStorage.getItem("pb_auth");
if (authData) {
    pb.authStore.loadFromCookie(authData);
}

// Guardar automáticamente la sesión si cambia
pb.authStore.onChange(() => {
    if (pb.authStore.isValid) {
        const cookie = pb.authStore.exportToCookie({ httpOnly: false });
        localStorage.setItem("pb_auth", cookie);
    } else {
        localStorage.removeItem("pb_auth");
    }
});