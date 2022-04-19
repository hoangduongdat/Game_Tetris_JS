

let btns = document.querySelectorAll('[id*="btn-"]')
let body = document.querySelector('body')

btns.forEach(e => {
    let btn_id= e.getAttribute('id')
    e.addEventListener('click',() => {
        switch(btn_id) {
            case 'btn-play': 
                body.classList.add('play')
                body.classList.remove('pause')
                break
            case 'btn-theme': 
                body.classList.toggle('dark')
                break
            case 'btn-help': 
                let how_to= document.querySelector('.how-to')
                how_to.classList.toggle('active')
                break
            case 'btn-pause': 
                let btn_play= document.querySelector('#btn-play')
                btn_play.innerHTML='Resume'
                body.classList.add('pause')
                body.classList.remove('play')
                break
            case 'btn-new-game': 
                body.classList.add('play')
                body.classList.remove('pause')
                body.classList.remove('end')
                break

        }
    })
})