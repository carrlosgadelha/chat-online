const login = document.querySelector(".login")
const loginForm = document.querySelector(".login__form")
const loginInput = document.querySelector(".login__input")

const chat = document.querySelector(".chat")
const chatForm = document.querySelector(".chat__form")
const chatInput = document.querySelector(".chat__input")
const chatMessages = document.querySelector(".chat__messages")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = {
    id:"",
    name:"",
    color: ""
}

let ws

const createMessageSelfElement = function(content) {
    const div = document.createElement("div")
    div.classList.add("message--self")
    div.innerHTML = content
    return div
}

const createMessageOtherElement = function(sender,senderColor,content) {
    const div = document.createElement("div")
    const span = document.createElement("span")
    div.classList.add("message--other")
    span.classList.add("message--sender")
    span.style.color = senderColor

    div.appendChild(span)
    span.innerHTML = sender
    div.innerHTML += content
    return div
}

const getRandomColor = function(){
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = function(){
    window.scrollTo({
        top:document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = function({data}){
    const {userId, userName, userColor, content} = JSON.parse(data)
    
    const message = userId == user.id ? createMessageSelfElement(content) : createMessageOtherElement(userName, userColor,content)

    chatMessages.appendChild(message)
    scrollScreen()
}

loginForm.addEventListener("submit", function(e){
    e.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    ws = new WebSocket("ws://localhost:8080")
    ws.onmessage = processMessage

    chatInput.focus()
})

chatForm.addEventListener("submit", function(e){
    e.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    ws.send(JSON.stringify(message))
    chatInput.value = ""
})