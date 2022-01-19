import { computed, reactive, readonly } from "vue";

const loginstate = reactive({
    username: "",
    jwttoken: "",
    errormessage: "",
    isLoggedIn: false
})

function doLogout() {
    loginstate.username = "";
    loginstate.jwttoken = "";
    loginstate.errormessage = "";
    loginstate.isLoggedIn = false;
}

async function doLogin(username: string, password: string): Promise<boolean> {
    return fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'username': username,
            'password': password
        })
    }).then((response) => response.text()
    ).then((res) =>{
        console.log(res);
        loginstate.errormessage = "";
        loginstate.isLoggedIn = true;
        loginstate.jwttoken = String(res);
        loginstate.username = username;
        return true;
    }).catch((e) => {
        doLogout();
        loginstate.errormessage = e;
        console.log("error:", e);
        return false;
    });
}

export function useLoginStore(){
    return {
        loginstate: readonly(loginstate),
        errormessage: computed(() => loginstate.errormessage),
        doLogin,
        doLogout,
    }}
