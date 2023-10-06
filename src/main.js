import api from './api';

class App {

    //Construtor
    constructor() {
        // Lista de repositórios
        this.repositories = [];

        // Form
        this.form = document.querySelector('form');

        // Lista
        this.list = document.querySelector('.list-group');

        // Método para registar os eventos do form
        this.registerEvents();
    }

    registerEvents() {
        this.form.onsubmit = event => this.addRepositorie(event);
    }

    async addRepositorie(event) {
        // Evita que o formulátio recarregue a página
        event.preventDefault();

        // Recuperar o valor do input
        let input = this.form.querySelector('input[id=repository]').value;

        // Se o input vier vazio...sai da appp
        if (input.length === 0) {
            return; //return sempre sai da função
        }

        // Ativa o carregamento
        this.introduceSearching();

        try {
            let response = await api.get(`repos/${input}`);

            //console.log(response);

            let { name, description, html_url, owner: { avatar_url } } = response.data;

            // Adiciona o repositorio na lista
            this.repositories.push({
                name,
                description,
                avatar_url,
                link: html_url,
            });

            // Renderizar a tela
            this.renderScreen();
        } catch (erro) {
            // Limpa buscando
            this.list.removeChild(document.querySelector('.list-group-item-warning'));

            // Limpar erro existente
            let er = this.list.querySelector('.list-group-item-danger');
            if (er !== null) {
                this.list.removeChild(er);
            }

            //<li>
            let listItem = document.createElement('li');
            listItem.setAttribute('class', 'list-group-item list-group-item-danger');
            let txtError = document.createTextNode(`O repositório ${input} não existe.`);
            listItem.appendChild(txtError);
            this.list.appendChild(listItem);
        }
    }

    introduceSearching() {
        //<li>
        let listItem = document.createElement('li');
        listItem.setAttribute('class', 'list-group-item list-group-item-warning');
        let txtSeekingOut = document.createTextNode(`Aguarde, buscando o repositório...`);
        listItem.appendChild(txtSeekingOut);
        this.list.appendChild(listItem);
    }

    renderScreen() {
        //Limpar o conteúdo de lista
        this.list.innerHTML = '';

        // Percorrer toda a lista de repositórios e criar os elementos
        this.repositories.forEach(repository => {

            //<li>
            let listItem = document.createElement('li');
            listItem.setAttribute('class', 'list-group-item list-group-item-action');

            //<img>
            let img = document.createElement('img');
            img.setAttribute('src', repository.avatar_url);
            listItem.appendChild(img);

            //<strong>
            let strong = document.createElement('strong');
            let txtName = document.createTextNode(repository.name);
            strong.appendChild(txtName);
            listItem.appendChild(strong);

            //<p>
            let p = document.createElement('p');
            let txtDescription = document.createTextNode(repository.description);
            p.appendChild(txtDescription);
            listItem.appendChild(p);

            //<a>
            let a = document.createElement('a');
            a.setAttribute('target', '_blank');
            a.setAttribute('href', repository.link);
            let txtA = document.createTextNode('Acessar');
            a.appendChild(txtA);
            listItem.appendChild(a);

            // Adicionar <li> como filho da ul
            this.list.appendChild(listItem);

            // Limpar o conteúdo do input
            this.form.querySelector('input[id=repository]').value = '';

            // Adiciona o foco no input
            this.form.querySelector('input[id=repository]').focus();
        });
    }
}

new App();
