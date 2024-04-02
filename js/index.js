(async () => {

    const resp = await API.profile();
    const user = resp.data;

    async function getUserInfo() {
        const userInfo = await API.profile();
        const state = userInfo.code;
        if (userInfo.data) {
            const loginId = userInfo.data.loginId;
            const nickname = userInfo.data.nickname;
            // console.log(state, loginId, nickname);
            const result = {
                loginId,
                nickname,
                state
            }
            return result;
        }
        return state;
    }

    const doms = {
        aside: {
            nickname: $('#nickname'),
            loginId: $('#loginId')
        },
        close: $('.close'),
        chatContainer: $('.chat-container'),
        txtMsg: $('#txtMsg'),
        msgContainer: $('.msg-container'),
    }

    function addChat(chatInfo) {
        const div = $$$('div');
        div.classList.add('chat-item');
        if (chatInfo.from) {
            div.classList.add('me');
        }
        const img = $$$('img');
        img.className = 'chat-avatar';
        img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg';
        const content = $$$('div');
        content.className = 'chat-content';
        content.innerText = chatInfo.content;
        const date = $$$('div');
        date.className = 'chat-date';
        date.innerText = formatDate(chatInfo.createdAt);

        div.appendChild(img);
        div.appendChild(content);
        div.appendChild(date);
        doms.chatContainer.appendChild(div);
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    doms.close.onclick = () => {
        API.loginOut();
        window.location.href = './login.html';
    }

    async function loadHistory() {
        const resp = await API.getHistory();
        console.log(resp);
        if (resp.code !== 401) {
            for (const item of resp.data) {
                addChat(item);
            }
        }
        scrollBottom();
    }
    await loadHistory();

    function scrollBottom() {
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    }

    async function sendChat() {
        const content = doms.txtMsg.value.trim();
        if (!content) {
            return;
        }
        addChat({
            from: user.loginId,
            to: null,
            createdAt: Date.now(),
            content,
        });
        doms.txtMsg.value = '';
        scrollBottom();
        const resp = await API.sendChat(content);
        addChat({
            from: null,
            to: user.loginId,
            ...resp.data,
        });
        scrollBottom();
    }

    doms.msgContainer.onsubmit = e => {
        e.preventDefault();
        sendChat();
    }

    async function isLoginSuccess() {
        const state = await getUserInfo();
        // console.log(state);
        if (state === 0 || state.state === 0) {
            const result = await getUserInfo();
            // console.log(nickname);
            doms.aside.nickname.innerText = result.nickname;
            doms.aside.loginId.innerText = result.loginId;
            return true;
        } else {
            window.location.href = './login.html';
            return false;
        }
    }

    isLoginSuccess();
})();