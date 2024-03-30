import { BlueHawaii, EnemaOfTheState } from './albums.js';
let album = EnemaOfTheState;

// Media Info
const trackNameD = document.querySelector('.track');
const trackArtistD = document.querySelector('.artist');
const trackAlbumD = document.querySelector('.album');
const albumCoverD = document.getElementById('album-cover');

// Media Controller
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const rewindButton = document.getElementById('rwd-button');
const fastforwardButton = document.getElementById('ff-button');
const theBar = document.getElementById('the-bar');
const theDot = document.getElementById('the-dot');

let albumIdx = 0;
let timeElapsed = 0;
let audioElement; 
let intervalID;

function displayTrack (track) {
    albumCoverD.src = album.albumArt ? album.albumArt : album.altPhoto;
    trackNameD.textContent = track.title;
    trackArtistD.textContent = track.artist;
    trackAlbumD.textContent = track.album;
}

function back() {}

function playTrack(track){
    playButton.style.display = 'none';
    pauseButton.style.display = 'block';
    displayTrack(track);
    audioElement = new Audio(track.src);
    audioElement.play().catch(error => console.error("Audio play failed:", error));    displayTrack(track);
    intervalID = setInterval(() => {
        timeElapsed++;
        let durationSplit = track.duration.split(':');
        let durationSeconds = durationSplit[0] * 60 + durationSplit[1];
        theDot.style.left = `${timeElapsed / durationSeconds * 100}%`;

        if (timeElapsed === durationSeconds) {
            timeElapsed = 0;
            albumIdx++;
            playTrack(album.tracks[albumIdx]);
        }
    }, 1000);
    

}

function pauseTrack(audioElement){
    playButton.style.display = 'block';
    pauseButton.style.display = 'none';
    audioElement.pause();
    clearInterval(intervalID)
}
function skip(){}


document.addEventListener('DOMContentLoaded', () => {
    playButton.addEventListener('click', ()=>playTrack(album.tracks[4]));
    pauseButton.addEventListener('click', ()=>pauseTrack(audioElement));
    rewindButton.addEventListener('click', back);
    fastforwardButton.addEventListener('click', skip);
    // theDot.addEventListener('click', ()=>{}); // TODO: updateTimeElapsed()
    // theDot.addEventListener('mousedown', () => {
    //     track.pause();
    // });
    // theDot.addEventListener('mouseup', () => {
    //     track.play();
    // });
})