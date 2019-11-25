const usuarioDadosLogin = {
    "$nome" : null,
    "$ultimoNome"  : null,
    "$email"     : null,
    "$senha"  : null,
    "$numeroCartao" : null,

    validEmail: function validaEmail(email) {
        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    validPasswd: function validaSenha(senha) {
        return (senha.length > 7)
    },

    signUp: function signUp(form) {
        this.$nome = form["firstName"].value;
        this.$ultimoNome = form["lastName"].value;
        this.$email = form["email"].value;
        this.$senha = form["password"].value;
        this.$numeroCartao = form["cartao"].value;


        if (!this.$nome || !this.$ultimoNome) {
            alert("Nome invalido!\nTente novamente.");
            throw new Error("Nome invalido!\nTente novamente.");
        }
        else if (!this.validEmail(this.$email)) {
            alert("Email invalido!\nTente novamente.");
            throw new Error("Email invalido!\nTente novamente.");
        }

        else if (!this.validPasswd(this.$senha)) {
            alert("Senha invalida!\nTamanho minimo de 8 caracteres.\nTente novamente.");
            throw new Error("Senha invalida!\nTamanho minimo de 8 caracteres.\nTente novamente.");
        }
    },

    signIn: function signIn(form) {
        this.$email = form["email"].value;
        this.$senha = form["password"].value;

        if (!this.validEmail(this.$email)) {
            alert("Email invalido!\nTente novamente.");
            throw new Error("Email invalido!\nTente novamente.");
        }

        else if (!this.validPasswd(this.$senha)) {
            alert("Senha invalida!\nTente novamente.");
            throw new Error("Senha invalida!\nTente novamente.");
        }
    },

    signUpToJson: function signUpToJson() {
        return  {
            email:        this.$email,
            nome:         this.$nome,
            ultimoNome:   this.$ultimoNome,
            numeroCartao: this.$numeroCartao,
            senha:        this.$senha
        }
    },

    signInToJson: function signInToJson() {
        return  {
            email:     this.$email,
            senha:     this.$senha
        }
    },
};

export default usuarioDadosLogin;
