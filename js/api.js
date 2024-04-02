var API = (() => {
    const TOKEN_KEY = 'token';

    function get(path) {
        const headers = {};
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(path, {
            method: 'GET',
            headers
        });
    }

    function post(path, bodyObj) {
        console.log(JSON.stringify(bodyObj));
        const headers = {
            'Content-Type': 'application/json'
        };
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(path, {
            method: 'POST',
            headers,
            body: JSON.stringify(bodyObj)
        });
    }

    async function reg(userInfo) {
        return await post(
            'https://study.duyiedu.com/api/user/reg',
            userInfo
        ).then(reg => reg.json());
    }

    async function login(loginInfo) {
        const resp = await post(
            'https://study.duyiedu.com/api/user/login',
            loginInfo
        );
        const result = await resp.json();
        if (result.code === 0) {
            const token = resp.headers.get('authorization');
            localStorage.setItem(TOKEN_KEY, token);
        }
        return result;
    }

    async function exists(loginId) {
        return await get(
            `https://study.duyiedu.com/api/user/exists?loginId=${loginId}`
        ).then(reg => reg.json());
    }

    async function profile() {
        return await get(
            'https://study.duyiedu.com/api/user/profile',
        ).then(reg => reg.json());
    }

    async function sendChat(content) {
        return await post(
            'https://study.duyiedu.com/api/chat', {
                content
            }
        ).then(reg => reg.json());
    }

    async function getHistory() {
        return await get(
            'https://study.duyiedu.com/api/chat/history'
        ).then(reg => reg.json());
    }

    function loginOut() {
        localStorage.removeItem(TOKEN_KEY);
    }

    return {
        reg,
        login,
        exists,
        profile,
        sendChat,
        getHistory,
        loginOut,
    }
})();