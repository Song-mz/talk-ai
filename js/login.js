const loginIdValidator = new FieldValidator('txtLoginId', function (val) {
    if (!val) {
        return 'Please enter a valid';
    }
});

const loginPwdValidator = new FieldValidator('txtLoginPwd', async function (val) {
    if (!val) {
        return 'Please enter password';
    }
});

const form = $('.user-form');
form.onsubmit = async e => {
    e.preventDefault();
    const results = await FieldValidator.validate(
        loginIdValidator,
        loginPwdValidator
    );
    if (!results) {
        return;
    }
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const resp = await API.login(data);
    if (resp.code === 0) {
        loginIdValidator.p.innerText = 'login successful';
        window.location.href = './index.html';
    } else {
        loginIdValidator.p.innerText = 'login failed';
        loginPwdValidator.input.value = '';
    }
}