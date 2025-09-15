const page = document.querySelector("body");
const form = document.querySelector("form");
const main = document.querySelector("main");
const pulse = document.querySelector(".pulse-loader");
const header = document.querySelector("header");

const imgPrincipal = document.querySelector("#block-principal img");
const titlePrincipal = document.querySelector("#block-principal #h2-principal");
const descriptionPrincipal = document.querySelector("#block-principal #d-principal");

const img1 = document.querySelector("#block1 img");
const title1 = document.querySelector("#block1 h2");
const description1 = document.querySelector("#block1 .description");

const img2 = document.querySelector("#block2 img");
const title2 = document.querySelector("#block2 h2");
const description2 = document.querySelector("#block2 .description");

const img3 = document.querySelector("#block3 img");
const title3 = document.querySelector("#block3 h2");
const description3 = document.querySelector("#block3 .description");

const buttonEx1 = document.querySelector("#btn1");
const buttonEx2 = document.querySelector("#btn2");
const buttonEx3 = document.querySelector("#btn3");


let search = "";
let url = "";
let whichInformation = 0;
const img = {
    imgBig: "",
    img1: "",
    img2: "",
    img3: ""
}

const title = {
    titleBig: "",
    title1: "",
    title2: "",
    title3: ""
}

const description = {
    descriptionBig: "",
    description1: "",
    description2: "",
    description3: ""
}

function fetchObject(url, options, callback) {
    fetch(url, options)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => {
            console.error('Erreur lors du fetch :', error);
            pulse.style.visibility = "hidden"; // cacher loader en cas d'erreur
            main.style.visibility = "visible"; // afficher contenu (ou message d'erreur)
        });
}



function recoltImage(groupData) {
    img.imgBig = groupData[0].links[0].href
    img.img1 = groupData[1].links[0].href
    img.img2 = groupData[2].links[0].href
    img.img3 = groupData[3].links[0].href

    imgPrincipal.src = img.imgBig;
    img1.src = img.img1;
    img2.src = img.img2;
    img3.src = img.img3;
}


function recoltTitle(groupData) {
    title.titleBig = groupData[0].data[0].title;
    title.title1 = groupData[1].data[0].title;
    title.title2 = groupData[2].data[0].title;
    title.title3 = groupData[3].data[0].title;


    titlePrincipal.textContent = title.titleBig
    title1.textContent = title.title1
    title2.textContent = title.title2
    title3.textContent = title.title3
}

function setupToggle(btn, textEl, fullText, previewLength) {
    let expanded = false;

    // Affichage initial : texte réduit
    textEl.textContent = fullText.slice(0, previewLength) + '...';

    btn.addEventListener("click", () => {
        if (!expanded) {
            textEl.textContent = fullText;
            btn.textContent = "Réduire";
        } else {
            textEl.textContent = fullText.slice(0, previewLength) + '...';
            btn.textContent = "Lire plus";
        }
        expanded = !expanded;
    });
}

function recoltDescription(groupData) {
    description.descriptionBig = groupData[0].data[0].description;
    description.description1 = groupData[1].data[0].description;
    description.description2 = groupData[2].data[0].description;
    description.description3 = groupData[3].data[0].description;

    descriptionPrincipal.textContent = description.descriptionBig

    setupToggle(buttonEx1, description1, description.description1, 150)
    setupToggle(buttonEx2, description2, description.description2, 150)
    setupToggle(buttonEx3, description3, description.description3, 150)
}

function recoltData(data) {
    const allDatas = data.collection.items
    recoltImage(allDatas)
    recoltTitle(allDatas)
    recoltDescription(allDatas)
    main.style.visibility = "visible"
    pulse.style.visibility = "hidden"
}

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Empêche le rechargement de la page
    search = document.querySelector('#site-search').value
    url = form.action + "&q=" + encodeURIComponent(search)
    const data = fetchObject(url, {}, recoltData)
})