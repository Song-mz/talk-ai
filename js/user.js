class FieldValidator {
    constructor(txtId, validatorFunc) {
        this.input = $(`#${txtId}`);
        this.p = this.input.nextElementSibling;
        this.validatorFunc = validatorFunc;
        this.input.onblur = () => {
            this.validate();
        };
    }

    async validate() {
        const err = await this.validatorFunc(this.input.value);
        if (err) {
            this.p.innerText = err;
            return false;
        } else {
            this.p.innerText = '';
            return true;
        }
    }

    static async validate(...validates) {
        const proms = validates.map(v => v.validate());
        const result = await Promise.all(proms);
        // console.log(result);
        return result.every(r=>r);
    }
}




