const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return 'Please enter a valid';
    }
    const result = await API.exists(val);
    if (result.data) {
        return 'This user already exists';
    }
});

const nicknameValidator = new FieldValidator('txtNickname', async function (val) {
    if (!val) {
        return 'Please enter a nickname';
    }
});

const loginPwdValidator = new FieldValidator('txtLoginPwd', async function (val) {
    if (!val) {
        return 'Please enter password';
    }
});

const loginPwdConfirmValidator = new FieldValidator('txtLoginPwdConfirm', async function (val) {
    if (!val) {
        return 'Enter confirmation password';
    }
    if (val !== loginPwdValidator.input.value) {
        return 'Two passwords do not match';
    }
});

const form = $('.user-form');
form.onsubmit = async e => {
    e.preventDefault();
    const results = await FieldValidator.validate(
        loginIdValidator, 
        nicknameValidator, 
        loginPwdValidator, 
        loginPwdConfirmValidator
    );
    if(!results){
        return;
    }
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const resp = await API.reg(data);
    if(resp.code === 0){
        alert('Registered successfully');
        window.location.href = './login.html';
    }
}