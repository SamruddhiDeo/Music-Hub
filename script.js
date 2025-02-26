let artists = document.querySelector(".artists");
let albums = document.querySelector(".albums");
let play = document.querySelector(".play");
let back = document.querySelector(".back");
let categories = document.querySelector(".categories")
let cardDetails = document.querySelector(".cardDetails")
let songsList = document.querySelector(".songsList")
let currentDuration = document.querySelector(".currentDuration")
let totalDuration = document.querySelector(".totalDuration")
let songSeekBar = document.querySelector(".songSeekBar")
let previous = document.querySelector(".previous")
let next = document.querySelector(".next")
let volumeSeekBar = document.querySelector(".volumeSeekBar")
let playBarContainer = document.querySelector(".playBarContainer")
let currentSong = new Audio();
let currentSongPlayBtn;
let currentSongPlaySrc;
let currentVolume = volumeSeekBar.value;

let type;
let folderName;
let name;
let singer;

//Show all the artists on home
async function showArtists() {
    let fetchArtists = await fetch("assets/artists/artists.json");
    let artistsData = await fetchArtists.json();

    artistsData.forEach(artist => {
        let artistName = artist.name;
        let singer = artist.singer;
        let artistfolderName = artist.folder;
        let src = `assets/artists/${artistfolderName}/img.jpg`;

        let html = ` <div class="cardInfo artistsInfo" data-type="artists">
                                <img src="${src}" alt="">
                                <div class="cardName">${artistName}</div>
                                <p class="singer">${singer}</p>
                                <img class="greenPlayBtn" width="43" src="assets/greenPlay.svg" alt="">
                            </div>`
        artists.innerHTML += html;
        // }
    });
}

//Show all the albums on home
async function showAlbums() {
    let fetchAlbums = await fetch("assets/albums/albums.json");
    let albumData = await fetchAlbums.json();

    albumData.forEach(album => {
        let albumName = album.name;
        let singer = album.singer;
        let albumfolderName = album.folder;
        let src = `assets/albums/${albumfolderName}/img.jpg`;

        let html = ` <div class="cardInfo albumsInfo" data-type="albums">
                                <img src="${src}" alt="">
                                <div class="cardName">${albumName}</div>
                                <p class="singer">${singer}</p>
                                <img class="greenPlayBtn" width="43" src="assets/greenPlay.svg" alt="">
                            </div>`
        albums.innerHTML += html;
        // }
    });
}

function playMusic(track) {
    // console.log(track)
    currentSong.src = track;
    currentSong.play();
    totalDuration.innerHTML = convertToMinutesSeconds(currentSong.duration);
}

async function main() {
    await showArtists()
    await showAlbums()

    let cardInfo = document.querySelectorAll(".cardInfo")

    let nameImg = document.querySelector(".header").getElementsByTagName("img")[1];
    let nameTitle = document.querySelector(".header").querySelector(".name");


    // console.log(cardInfo)
    //listener on all artists/albums
    Array.from(cardInfo).forEach(async (e) => {

      

        e.addEventListener("click", async () => {
            categories.style.display = "none";
            cardDetails.style.display = "block";
            // console.log(e.dataset.type);
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
                    console.log(e);

                    //to play song
                    if ((currentSong.src == "") || (currentSongPlaySrc != "" && currentSongPlaySrc != song)) {
                        if(currentSong.src == ""){
                            playBarContainer.style.display = "flex";
                        }
                        // console.log(currentSongPlaySrc+" != "+song)
                        currentSongPlaySrc = song;
                        if (currentSongPlayBtn != undefined) {
                            currentSongPlayBtn.src = "assets/play.png";
                        }
                        playMusic(song);
                        totalDuration.innerHTML = convertToMinutesSeconds(currentSong.duration);
                        currentSongPlayBtn = e;
                        // currentSong.src = song;
                        play.src = "assets/pause.png";
                        currentSongPlayBtn.src = "assets/pause.png";
                    } else {
                        // console.log("changed")
                        if (currentSong.paused) {
                            currentSong.play()
                            play.src = "assets/pause.png";
                            currentSongPlayBtn.src = "assets/pause.png";
                        } else {
                            currentSong.pause()
                            play.src = "assets/play.png";
                            currentSongPlayBtn.src = "assets/play.png";
                        }

                    }

                    //change song playing info
                    document.querySelector(".playBarSongInfo").firstElementChild.innerHTML = songName;
                    document.querySelector(".playBarSongInfo").lastElementChild.innerHTML = name;

                })

            });
        })
    });

}

function convertToMinutesSeconds(seconds) {
    const minutes = Math.floor(seconds / 60); // Get the integer minutes
    let remainingSeconds = seconds % 60;     // Get the remaining seconds after minutes

    // Round the seconds to two decimal places
    remainingSeconds = remainingSeconds.toFixed(2);

    // Split seconds into integer and decimal parts, if any
    const [wholeSeconds, decimal] = remainingSeconds.split('.');

    // Format seconds to always show two digits
    const formattedSeconds = decimal ? wholeSeconds.padStart(2, '0') : wholeSeconds.padStart(2, '0');

    return `${minutes}:${formattedSeconds}`;
}

play.addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play()
        play.src = "assets/pause.png";
        currentSongPlayBtn.src = "assets/pause.png";
    } else {
        currentSong.pause()
        play.src = "assets/play.png";
        currentSongPlayBtn.src = "assets/play.png";
    }
})

back.addEventListener("click", () => {
    categories.style.display = "block";
    cardDetails.style.display = "none";
    songsList.innerHTML = `<div class="headings">
                            <div class="headingInfo">
                                <p>#</p>
                                <p>Title</p>
                            </div>
                            <img src="assets/clock.svg" alt="">
                            <p></p>
                        </div>
                        <hr>`
    // console.log( songsList.innerHTML)
})

currentSong.addEventListener("timeupdate", () => {
    currentDuration.innerHTML = convertToMinutesSeconds(currentSong.currentTime);
    totalDuration.innerHTML = convertToMinutesSeconds(currentSong.duration);
    songSeekBar.value = (currentSong.currentTime / currentSong.duration) * 100;
})

songSeekBar.addEventListener("input", () => {
    currentSong.currentTime = (songSeekBar.value / 100) * currentSong.duration;
})

previous.addEventListener("click", () => {
    if (currentSongPlayBtn.parentElement.previousElementSibling.classList.contains("song")) {
        let songName = currentSongPlayBtn.parentElement.previousElementSibling.children[0].lastElementChild.innerHTML;
        let song = `assets/${type}/${folderName}/songs/${songName}/${songName}.mp3`;

        currentSongPlayBtn.src = "assets/play.png";
        currentSongPlaySrc = song;

        playMusic(song);
        currentSongPlayBtn = currentSongPlayBtn.parentElement.previousElementSibling.lastElementChild;
        play.src = "assets/pause.png";
        currentSongPlayBtn.src = "assets/pause.png";

        document.querySelector(".playBarSongInfo").firstElementChild.innerHTML = songName;
    }
})

next.addEventListener("click", () => {
    if (currentSongPlayBtn.parentElement.nextElementSibling.classList.contains("song")) {
        let songName = currentSongPlayBtn.parentElement.nextElementSibling.children[0].lastElementChild.innerHTML;
        let song = `assets/${type}/${folderName}/songs/${songName}/${songName}.mp3`;

        currentSongPlayBtn.src = "assets/play.png";
        currentSongPlaySrc = song;

        playMusic(song);
        currentSongPlayBtn = currentSongPlayBtn.parentElement.nextElementSibling.lastElementChild;
        play.src = "assets/pause.png";
        currentSongPlayBtn.src = "assets/pause.png";

        document.querySelector(".playBarSongInfo").firstElementChild.innerHTML = songName;
    }
})

volumeSeekBar.addEventListener("input",(e)=>{
    if(volumeSeekBar.value == 0){
  volumeSeekBar.previousElementSibling.src =  "assets/mute.png"
    }else if(volumeSeekBar.value>currentVolume){
        volumeSeekBar.previousElementSibling.src =  "assets/highVolume.png"
    }else{
        volumeSeekBar.previousElementSibling.src =  "assets/lowVolume.png"

    }
    currentVolume = volumeSeekBar.value;
    // console.log(volumeSeekBar.value)
    currentSong.volume = volumeSeekBar.value/100;
})

main();