let artists = document.querySelector(".artists");
let play = document.querySelector(".play");
let currentSong = new Audio();

//Show all the artists on home
async function showArtists() {
    let fetchArtists = await fetch("assets/artists/")
    let response = await fetchArtists.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = Array.from(div.getElementsByTagName("a"));

    for (let i = 0; i < anchors.length; i++) {
        // console.log(anchors[i].innerHTML);
        if (anchors[i].innerHTML.endsWith("Singer/")) {
            let folderName = anchors[i].innerHTML.toString().split(",");
            let name = folderName[0].slice(0, -5);
            // let singer = folderName[1] ? folderName[1].slice(0,-8) : "";
            let singer = folderName[1].slice(0, -8);
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

function playMusic(track) {
    // console.log(track)
    currentSong.src = track;
    currentSong.play();
}

async function main() {
    await showArtists()
    // showAlbums()

    let cardInfo = document.querySelectorAll(".cardInfo")
    let categories = document.querySelector(".categories")
    let cardDetails = document.querySelector(".cardDetails")
    let songsList = document.querySelector(".songsList")
    let nameImg = document.querySelector(".header").getElementsByTagName("img")[0];
    let nameTitle = document.querySelector(".header").querySelector(".name");


    // console.log(cardInfo)
    //listener on all artists/albums
    Array.from(cardInfo).forEach(async (e) => {
        let type;
        let name;
        let singer;
        let folderName;
        e.addEventListener("click", async () => {
            categories.style.display = "none";
            cardDetails.style.display = "block";
            console.log(e.dataset.type);
            type = e.dataset.type;
            name = e.querySelector(".cardName").innerHTML;
            singer = e.querySelector(".singer").innerHTML;
            folderName = `${name}-Name,${singer}-Singer`
            nameImg.setAttribute("src", `../assets/${type}/${folderName}/img.jpg`);
            nameTitle.innerHTML = name;

            // console.log(folderName);
            let fetchSongs = await fetch(`assets/${type}/${folderName}/songs`)
            let response = await fetchSongs.text();
            // console.log(response)
            let div = document.createElement("div")
            div.innerHTML = response;
            let anchors = Array.from(div.getElementsByTagName("a"));

            let srno = 1;
            for (let i = 0; i < anchors.length; i++) {
                if (!(anchors[i].innerHTML.endsWith("./"))) {
                    // console.log(anchors[i].innerHTML.slice(0,-1));
                    let songName = anchors[i].innerHTML.slice(0, -1);
                    let html = ` <div class="song">
                            <div class="songInfo">
                                <p>${srno++}</p>
                                <p class="songName">${songName}</p>
                            </div>
                            <p class="duration">3:97</p>
                            <img class="songPlay" src="assets/play.png" alt="">
                        </div>`
                    songsList.innerHTML += html;
                }

            }

            //listener to songs
            let songPlayBtns = document.getElementsByClassName("songPlay")
            // let songs = songsList.getElementsByClassName("song");
            // console.log(songs)

            //play buttons listener
            Array.from(songPlayBtns).forEach(e => {
                e.addEventListener("click", () => {
                    let songName = e.parentElement.children[0].lastElementChild.innerHTML
                    let song = `assets/${type}/${folderName}/songs/${songName}/${songName}.mp3`;
                    console.log(e)
                    //to play song
                    
                    playMusic(song);
                    play.src = "assets/pause.png";
                    // e.src = "assets/pause.png";
                    if (e.src = "assets/pause.png") {
                        currentSong.pause()
                        e.src = "assets/play.png";
                    } else {
                        currentSong.play()
                        e.src = "assets/pause.png";
                    }

                    //change song playing info
                    document.querySelector(".playBarSongInfo").firstElementChild.innerHTML = songName;
                    document.querySelector(".playBarSongInfo").lastElementChild.innerHTML = name;

                })

            });
        })
    });



}

play.addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play()
        play.src = "assets/pause.png";
    } else {
        currentSong.pause()
        play.src = "assets/play.png";
    }
})

main();