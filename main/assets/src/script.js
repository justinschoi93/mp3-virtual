// media content
import { albums } from './albums.js';
import { artists } from './artists.js';

// import './style.css';

// Current Track Info
let power = false;
let albumIdx = 0;
let timeElapsed = 0;
let audioElement;

// Select Menus
const artistSelect = document.getElementById('artist-select');
const albumSelect = document.getElementById('album-select');
const trackSelect = document.getElementById('track-select');

let artist = artistSelect.value;
let track = trackSelect.value;
let album = albums.find((album, i) => album.name === albumSelect.value);

function fetchValues () {
    if (albumSelect.value !== 'All Albums') {
        track = album.tracks.find((t, i) => t.title === trackSelect.value);
    } else {
        track = albums.forEach( album => {
            album.tracks.find((t, i) => t.title === trackSelect.value);
        })
    }

}

// Populate Select Menus
function initSelects() {
    artists.forEach((artist) => {
        let option = document.createElement('option');
        option.text = artist;
        artistSelect.appendChild(option);
    })
    albums.forEach(album => {
        let option = document.createElement('option');
        option.text = album.name;
        albumSelect.appendChild(option);
    })
    albums.forEach(album => {
        album.tracks.forEach((track, i) => {
            let option = document.createElement('option');
            option.idx = i;
            option.value = track.title;
            option.text = `${option.idx + 1} - ${track.title}`;
            trackSelect.appendChild(option);
        })
    })
}

function refreshAlbums (artist) {
    albumSelect.innerHTML = '';

    if (artist === 'All Artists') {
        albums.forEach((album, i) => {
            let option = document.createElement('option');
            option.text = album.name;
            albumSelect.appendChild(option);
        })
    } else {
        albums.forEach((album, i) => {
            if (album.artist === artist) {
                let option = document.createElement('option');
                option.text = album.name;
                albumSelect.appendChild(option);
            }
        })
    }
}

function refreshTracks (album) {
    trackSelect.innerHTML = '';

    // Album selected
    if ( albumSelect === 'All Albums' ) { 
        albums.forEach( album => {
            album.forEach((track, i) => {
                let option = document.createElement('option');
                option.idx = i;
                option.value = track.title;
                option.text = `${option.idx + 1} - ${track.title}` ;
                trackSelect.appendChild(option);
            })
        })
        
    } else {
        album.tracks.forEach((track, i) => {
            let option = document.createElement('option');
            option.idx = i;
            option.value = track.title;
            option.text = `${option.idx + 1} - ${track.title}`;
            trackSelect.appendChild(option);
        })
    }

}

// The selected option, which will be a string, will be used to select the correct object in the album array.
// THe album object will be assgned as the value of album
artistSelect.addEventListener('change', () => {
    refreshAlbums( artistSelect.value);
    albumSelect.dispatchEvent(new Event('change'));
})

albumSelect.addEventListener('change', () => {
    album = albums.find((album, i) => album.name === albumSelect.value);
    refreshTracks( album);
    trackSelect.dispatchEvent(new Event('change'));
    // Make tracklist responsive

    displayTrack(track);
})

trackSelect.addEventListener('change', () => {

    
    if (playButton.style.display === 'none') {
        
        audioElement.pause();
        track = album.tracks.find( track => track.title === trackSelect.value);
        console.log('Selected track: ', track)
        
        displayTrack(track);
        pauseTrack(audioElement);
    } else {
        
        track = album.tracks.find( track => track.title === trackSelect.value);
        displayTrack(track);
    }
})


// Media Info

const trackNameD = document.querySelector('#track-title');
const trackArtistD = document.querySelector('#track-artist');
const trackAlbumD = document.querySelector('#track-album');
const albumCoverD = document.getElementById('album-cover');

// Media Controller
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const rewindButton = document.getElementById('rwd-button');
const skipButton = document.getElementById('ff-button');
const theBar = document.getElementById('the-bar');
const theDot = document.getElementById('the-dot');

// IntervalID used for play & pause buttons
let intervalID;

function displayTrack (track) {
    if (!track) return;

    albumCoverD.src = album.albumArt ? album.albumArt : album.altPhoto;
    trackNameD.innerHTML = track.title;
    trackArtistD.innerHTML = track.artist;
    trackAlbumD.innerHTML = track.album;
}


function playTrack(track){
    if (!power) power = 'on';
    displayTrack(track);
    
    if (!albumSelect.value){ 
        console.log('No track found');
    }
    
    playButton.style.display = 'none';
    pauseButton.style.display = 'block';
    
    if (timeElapsed === 0) {
        audioElement = new Audio(track.file);
    }
    
    audioElement.play().catch(error => console.error("Audio play failed:", error));    
    console.log('Playing track:', track)
    
    // Keep track of time elapsed
    intervalID = setInterval(() => {
        
        timeElapsed++;

        let durationSplit = track.duration.split(':');
        let durationSeconds = parseInt(durationSplit[0] * 60) + parseInt(durationSplit[1]);
        theDot.style.left = `${timeElapsed / durationSeconds * 100}%`;
        
        // End of Track behavior
        if (timeElapsed === durationSeconds) {
            timeElapsed = 0;
            albumIdx++;
            playTrack(track.tracks[albumIdx]);
        }

    }, 1000);
}

function pauseTrack(audioElement){
    console.log('Pausing track:', track)
    playButton.style.display = 'block';
    pauseButton.style.display = 'none';

    audioElement.pause();
    
    clearInterval(intervalID);
}

function back() {
    
    if (playButton.style.display === 'none') {
        if (timeElapsed > 5) {
            timeElapsed = 0;

            console.log('rewinding track: ', track)

            audioElement.pause();
            
            playTrack(track);
    
        } else {
            
            if (albumIdx > 0) {
                albumIdx--;
                timeElapsed = 0;
                audioElement.pause();
                track = album.tracks[albumIdx]
                audioElement = new Audio(track.file)
                
                playTrack(track);
                console.log('back 1 track to: ', album.tracks[albumIdx - 1]);
            } else {
                timeElapsed = 0;
                audioElement.currentTime = 0;
                audioElement.play();
                console.log('replaying track: ', track)
            }
        }
    } else {
        console.log('back 1 track to: ', album.tracks[albumIdx - 1]);

        if (albumIdx > 1) albumIdx--;
        track = album.tracks[albumIdx];
        audioElement = new Audio(track.file);
    }
}

function skip(){
    if (playButton.style.display === 'none') {
        console.log('skipped track: ', track);
        
        audioElement.pause();
        albumIdx === album.tracks.length - 1 ? albumIdx = 0 : albumIdx++;
        track = album.tracks[albumIdx]
        audioElement = new Audio(track.file);
        timeElapsed = 0;
        theDot.style.left = 0;

        playTrack(track);
    } else {
        console.log('skipped track: ', track)
        albumIdx === album.tracks.length - 1 ? albumIdx = 0 : albumIdx++;
        track = album.tracks[albumIdx];
        audioElement = new Audio(track.file);
        timeElapsed = 0;
        theDot.style.left = 0;

        displayTrack(track)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Buttons
    playButton.addEventListener('click', playTrack);
    pauseButton.addEventListener('click', pauseTrack);
    rewindButton.addEventListener('click', back);
    skipButton.addEventListener('click', skip);
    // User Input
    initSelects();
    fetchValues();
    // Display
    displayTrack(track);
})





// theDot.addEventListener('click', ()=>{}); // TODO: updateTimeElapsed()
// theDot.addEventListener('mousedown', () => {
//     track.pause();
// });
// theDot.addEventListener('mouseup', () => {
//     track.play();
// });