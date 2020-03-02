const app = {
    imguri : "",
    match : [],
    savematch :[],
    ses:[],
    KEY:"SMITTUNDRA",
    init: () => {
        app.getmatch();
        document.querySelector(".home").addEventListener("click",app.showmatch);
        document.getElementById("favsBtn").addEventListener("click",app.details);
        // app.getmatch();
    },
    getDiv:()=>{
        let section = document.querySelector(".first");
        let target= document.createElement('div');
        target.setAttribute('class','card fixed top');
        // target
        section.appendChild(target);
        let tiny = new tinyshell(target);
        tiny.addEventListener("swipeleft", app.swipeleft);
        tiny.addEventListener("swiperight", app.swiperight);
        // app.showmatch();
        setTimeout(()=>{app.showmatch()},200);
    },
    getmatch:()=>{
        let url = "https://griffis.edumedia.ca/mad9022/tundra/get.profiles.php";
        fetch(url)
        .then(response=>{
            return response.json();
        })
        .then(elements=>{
            let imgurl = "https:"+decodeURIComponent(elements.imgBaseURL);
           
            app.imguri = imgurl;
            app.match = elements.profiles;
            app.getDiv();
        })
    },
    showmatch:()=>{
 
        document.querySelector(".saved").classList.remove("active");
        document.querySelector(".first").classList.add("active");
        // document.querySelector(".tab.home").classList.add("current");
        // document.querySelector(".tab.heart").classList.remove("current");
        if(app.match.length <= 3){
            app.getmatch();
        }
        let card=  document.querySelector('.card');
        setTimeout(()=>{
            card.classList.remove('top')
            card.classList.add('active')
    },200)
        card.innerHTML="";
        let source = app.match[0];
 
    let image = document.createElement("img");
    image.setAttribute("src", app.imguri + source.avatar);
    let personName = document.createElement("p");
    personName.textContent = source.first + " " + source.last;
    let personGender = document.createElement("p");
    personGender.textContent = "Gender:- " + source.gender;
    let distance = document.createElement("p");
    distance.textContent = "Distance:- " + source.distance;
    card.appendChild(image);
    image.insertAdjacentElement("afterend", personName);
    personName.insertAdjacentElement("afterend", personGender);
    personGender.insertAdjacentElement("afterend", distance);
       
    },
    swipeleft:()=>{
        let card=  document.querySelector('.card');
        document.querySelector(".rejected").classList.add("overlay", "message");
        setTimeout(() => {
            app.getDiv();
            card.parentElement.removeChild(card);
        document
        .querySelector(".rejected")
        .classList.remove("overlay","message");
 
    }, 500);
        app.match.splice([0],1);
    },
    swiperight:()=>{
        let card=  document.querySelector('.card');
        document.querySelector(".pass").classList.add("overlay", "message");
        setTimeout(() => {
            app.getDiv();
        card.parentElement.removeChild(card);
        document.
        querySelector(".pass")
        .classList.remove("overlay","message");
 
    }, 500);
         app.ses.push(app.match[0]);
         app.match.splice([0],1)
         sessionStorage.setItem(app.KEY,JSON.stringify(app.ses));
    },
    details:()=>{
        if(app.ses.length==0){
            alert("You don't have any match yet");
            document.querySelector(".saved").classList.remove("active");
            document.querySelector(".first").classList.add("active");
            // document.querySelector(".heart").classList.remove("current");
        }
        else{
            document.querySelector(".first").classList.remove("active");
            document.querySelector(".saved").classList.add("active");
            // document.querySelector(".tab.home").classList.remove("current");
            // document.querySelector(".tab.heart").classList.add("current");
        let ul = document.querySelector("ul");
        ul.innerHTML="";
        let item = sessionStorage.getItem(app.KEY);
        let data = JSON.parse(item);
        app.ses = data;
        data.forEach(element=>{
 
            let list = document.createElement("li");
            list.setAttribute("class", "list-item");
           
            let div = document.createElement("div");
            div.setAttribute("class", "list-text");
 

            let image = document.createElement("img");
            image.setAttribute("src",app.imguri + element.avatar);
            image.setAttribute("alt","image");
            image.setAttribute("class","avatar");
           
 
            let name = document.createElement("p");
            name.textContent = element.first+" "+element.last;
 
            let del = document.createElement("span");
                del.setAttribute('class','icon delete')
            list.setAttribute("data-id",element.id);
            div.appendChild(image);
            image.insertAdjacentElement("afterend",name);
            name.insertAdjacentElement("afterend",del);
            del.addEventListener("click",app.deletematch);
            list.appendChild(div)
            ul.appendChild(list);
 
        });
        }
       
 
    },
    deletematch:(ev)=>{
        let target = ev.target;
        let close = target.closest("[data-id]");
        let compare = parseInt(close.getAttribute("data-id"));
        let index = app.ses.find(element=>
        element.id == compare
        )
        let indexof = app.ses.indexOf(index);
        app.ses.splice(indexof,1);
        sessionStorage.setItem(app.KEY,JSON.stringify(app.ses))
        app.details();
   
    },



}
const ready = "cordova" in window ? "deviceready" : "DOMContentLoaded";
document.addEventListener(ready, app.init);
 