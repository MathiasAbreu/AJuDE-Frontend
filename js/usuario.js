const entriesModel = {
    "$nome" : null,
    "$ultimoNome"  : null,
    "$email"     : null,
    "$senha"  : null,
    "$numeroCartao" : null,

    validEmail: function validaEmail(email) {
        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    validPasswd: function validaSenha(passwd) {
        return (passwd.length > 7)
    },

    signUp: function signUp(form) {
        this.$nome = form["nome"].value;
        this.$ultimoNome = form["ultimoNome"].value;
        this.$email = form["email"].value;
        this.$senha = form["senha"].value;
        this.$numeroCartao = form["numeroCartao"].value;


        if (!this.$nome || !this.$ultimoNome) {
            alert("Nome invalido!\nTente novamente.");
            throw new Error("Nome invalido!\nTente novamente.");
        }
        else if (!this.validaEmail(this.$email)) {
            alert("Email invalido!\nTente novamente.");
            throw new Error("Email invalido!\nTente novamente.");
        }

        else if (!this.validaSenha(this.$senha)) {
            alert("Senha invalida!\nTamanho minimo de 8 caracteres.\nTente novamente.");
            throw new Error("Senha invalida!\nTamanho minimo de 8 caracteres.\nTente novamente.");
        }
    },

    signIn: function signIn(form) {
           this.$email = form["email"].value;
        this.$senha = form["senha"].value;

        if (!this.validaEmail(this.$email)) {
            alert("Email invalido!\nTente novamente.");
            throw new Error("Email invalido!\nTente novamente.");
        }

        else if (!this.validaSenha(this.$senha)) {
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
            senha:  this.$senha
        }
    },
};

export default entriesModel;
