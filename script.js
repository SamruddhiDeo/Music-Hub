let artists = document.querySelector(".artists");


//Show all the artists on home
async function showArtists() {
    let fetchArtists  = await fetch("assets/artists/")
    let response = await fetchArtists.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = Array.from(div.getElementsByTagName("a"));

    for (let i = 0; i < anchors.length; i++) {
        // console.log(anchors[i].innerHTML);
        if(anchors[i].innerHTML.endsWith("Singer/")){
            let folderName = anchors[i].innerHTML.toString().split(",");
            let name = folderName[0].slice(0,-5);
            // let singer = folderName[1] ? folderName[1].slice(0,-8) : "";
            let singer = folderName[1].slice(0,-8);
            let src = `${anchors[i].href}img.jpg`;
            // console.log(src);
            let html = ` <div class="cardInfo artistsInfo" data-type="artists">
                                <img src="${src}" alt="vvv">
                                <div class="cardName">${name}</div>
                                <p class="singer">${singer}</p>
                                <img class="greenPlayBtn" width="43" src="assets/greenPlay.svg" alt="">
                            </div>`
                            artists.innerHTML += html;
        }
    }
}

async function main(){
     await showArtists()
    // showAlbums()

    let cardInfo = document.querySelectorAll(".cardInfo")
    let categories = document.querySelector(".categories")
    let cardDetails = document.querySelector(".cardDetails")
    let songsList = document.querySelector(".songsList")
    let nameImg = document.querySelector(".header").getElementsByTagName("img")[0];
    let nameTitle =  document.querySelector(".header").querySelector(".name");
    let currentSong;
    
    // console.log(cardInfo)
    //listener on all artists/albums
    Array.from(cardInfo).forEach(async (e) => {
        e.addEventListener("click",async ()=>{
            categories.style.display = "none";
            cardDetails.style.display = "block";
            console.log(e.dataset.type);
            let type = e.dataset.type;
            let name = e.querySelector(".cardName").innerHTML;
            let singer = e.querySelector(".singer").innerHTML
            let folderName = `${name}-Name,${singer}-Singer`

            nameImg.setAttribute("src",`assets/${type}/${folderName}/img.jpg`);
            nameTitle.innerHTML = name;

            // console.log(folderName);
            let fetchSongs  = await fetch(`assets/${type}/${folderName}/songs`)
            let response = await fetchSongs.text();
            console.log(response)
            let div = document.createElement("div")
            div.innerHTML = response;
            let anchors = Array.from(div.getElementsByTagName("a"));

            let srno = 1;
            for (let i = 0; i < anchors.length; i++) {
                if(!(anchors[i].innerHTML.endsWith("./"))){
                    console.log(anchors[i].innerHTML.slice(0,-1));
                    let songName = anchors[i].innerHTML.slice(0,-1);
                    let html = ` <div class="song">
                            <div class="songInfo">
                                <p>${srno++}</p>
                                <p class="songName">${songName}</p>
                            </div>
                            <p class="duration">3:97</p>
                            <img class="play" src="assets/play.png" alt="">
                        </div>`
                        songsList.innerHTML += html;
                }

            }
        })
    });

    //listener to songs
    

}

main();