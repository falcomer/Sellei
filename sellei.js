/*
  Componente: sellei
  Funcionalidade: Componente responsável por selecionar os elementos e ao selecionar, terá somente 3 tentativas para acertar.
  Desenvolvedor: arthur.santos
  
  Última alteração: 26/10/2021.
*/

module.exports = function ($compile, $rootScope) {
    return {
        restrict: 'AE',
        replace: false,
        link: (scope, element, attr) => $(() => {
            let addObjetivoEvent = new CustomEvent('addObjetivo');
            document.dispatchEvent(addObjetivoEvent);

            let selecionado = '';
            let contador = 0;
            const $root = $(element);
            const submeter = $root.find("[id^=sub]");
            const feedCerto = $root.find("[id^=feedCerto]").hide();
            const feedErrado = $root.find("[id^=feedErrado]").hide();
            const feedFinal = $root.find("[id^=feedFinal]").hide();
            const butons = $root.find("[id^=_]");
            submeter.hide();
            submeter.on("click", verificarResposta);

            desmarcarTodos();

            function apagarFeed() {
                feedCerto.fadeOut();
                feedErrado.fadeOut();
                feedFinal.fadeOut();
            }

            butons.map((i, e) => {
                $(e).on('click', selecionar);
            })

            function selecionar(elemento) {
                $(elemento.currentTarget).css('opacity', '0.6');
                selecionado = elemento.currentTarget.id;
                submeter.fadeIn();
            }

            function onButons() {
                butons.map((i, e) => {
                    $(e).on('click', selecionar);
                })
            }

            function offButons() {
                butons.map((i, e) => {
                    $(e).off('click', selecionar);
                })
            }

            function verificarResposta() {
                contador++;
                if (contador < 3) {
                    if (selecionado.indexOf('c') != -1) {
                        feedCerto.fadeIn()
                        let playAudioEvent = new CustomEvent('playAudio', { detail: { 'comp': 'feedCerto' } });
                        document.dispatchEvent(playAudioEvent);
                        offButons();
                        setTimeout(function () {
                            apagarFeed()
                        }, 7000)
                        liberarAvancar();
                    } else {
                        feedErrado.fadeIn()
                        let playAudioEvent = new CustomEvent('playAudio', { detail: { 'comp': 'feedErrado' } });
                        document.dispatchEvent(playAudioEvent);
                        offButons();
                        setTimeout(function () {
                            apagarFeed()
                            onButons();
                        }, 7000)
                        selecionado = '';
                    }
                } else {
                    contador = 0;
                    feedFinal.fadeIn()
                    let playAudioEvent = new CustomEvent('playAudio', { detail: { 'comp': 'feedFinal' } });
                    document.dispatchEvent(playAudioEvent);
                    offButons();
                    setTimeout(function () {
                        apagarFeed()
                    }, 7000)
                }
                submeter.fadeOut();
                desmarcarTodos();
            }

            function liberarAvancar() {
                let removeObjetivoEvent = new CustomEvent('removeObjetivo');
                document.dispatchEvent(removeObjetivoEvent);
                butons.map((i, e) => {
                    $(e).off();
                })
            }

            function desmarcarTodos() {
                butons.map((i, e) => {
                    $(e).css('opacity', '1')
                })
            }
        })
    }
}
