// media content
import { albums } from './albums.js';
import { artists } from './artists.js';

// styles
import './style.css';


// Select Menus
const artistSelect = document.getElementById('artist-select');
const albumSelect = document.getElementById('album-select');
const trackSelect = document.getElementById('track-select');

// Current Track Info
let power = false;
let albumIdx = 0;
let timeElapsed = 0;
let album = albumSelect.value;
let artist = artistSelect.value;
let current
let audioElement; 

// Populate Select Menus

// artists
function populateSelectMenus () {

    // artists
    artists.forEach((artist, i) => {
        let option = document.createElement('option');
        option.text = artist;
        option.idx = i;
        artistSelect.appendChild(option);
    })

    // albums
    albums.forEach( (album, i) => {
        if (artist = 'All Artists'){ // no artist selected
            let option = document.createElement('option');
            option.text = album.name;
            albumSelect.appendChild(option);
        } else if (album.artist === artist) { // artist selected
            let option = document.createElement('option');
            option.idx = i;
            option.text = album.name;
            albumSelect.appendChild(option);
        }
    })

    // tracks
    if (artist === 'All Artists' && album === 'All Albums') { // all artists, all albums
        albums.forEach((album, i) => {
            album.tracks.forEach((track, i) => {
                let option = document.createElement('option');
                option.idx = i;
                option.text = `${option.idx} - ${track.title}`;
                trackSelect.appendChild(option);
            })
        })
    } else if (artist !== 'Select an artist' && artist !== 'All Artists') {  // selected artist
        if (album === 'All Albums' ) { // all albums 
            albums.forEach((album, i) => {
                if (album.artist === artist) { // all albums by selected artist
                    album.tracks.forEach((track, i) => {
                        let option = document.createElement('option');
                        option.idx = i;
                        option.text = `${option.idx - 1} - ${track.title}`;
                        trackSelect.appendChild(option);
                    })
                }
            })
        } else if ( album !== 'All Albums' && album !== 'Select an Album' ) { // selected album
            album.tracks.forEach((track, i) => {
                let option = document.createElement('option');
                option.idx = i;
                option.text = `${option.idx - 1} - ${track.title}`;
                trackSelect.appendChild(option);
            })
        }
    }
}



// The selected option, which will be a string, will be used to select the correct object in the album array.
// THe album object will be assgned as the value of album
artistSelect.addEventListener('change', () => {
    artist = artistSelect.value;
    
    albumSelect.innerHTML = ''; // Clear out old options
    albumSelect = albums.forEach((album, i) => { // Add new options
        if (album.artist === artist) {
            let option = document.createElement('option');
            option.text = album.name;
            albumSelect.appendChild(option);
        }
    })

    trackSelect.innerHTML = ''; // Clear out old options
    populateSelectMenus();
})

albumSelect.addEventListener('change', () => {
    album = albums.find((a, i) => a.name === albumSelect.value);
    console.log(album);
    albumSelect.value = album.name;
    artist = album.name;
    // Make tracklist responsive

    current = album.tracks.find((track, i) => track.title === trackName);
    displayTrack(current);
    populateSelectMenus();
})

trackSelect.addEventListener('change', () => {

    console.log('trackSelect.value:', trackSelect.value)
    let trackName = trackSelect.value;

    if (playButton.style.display === 'none') {
        
        audioElement.pause();
        current = album.tracks.name;

        displayTrack(current);
        pauseTrack(audioElement);
    } else {
        
        current = album.tracks.find((track, i) => track.title === trackName);
        displayTrack(current);
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
    albumCoverD.src = album.albumArt ? album.albumArt : album.altPhoto;
    trackNameD.innerHTML = track.title;
    trackArtistD.innerHTML = track.artist;
    trackAlbumD.innerHTML = track.album;
}


function playTrack(track){
    if (!power) power = 'on';
    if (current) displayTrack(track);
    
    playButton.style.display = 'none';
    pauseButton.style.display = 'block';
    
    if (timeElapsed === 0) {
        audioElement = new Audio(track.src);
    }
    
    audioElement.play().catch(error => console.error("Audio play failed:", error));    
    if (current) console.log('Playing track:', current);
    
    // Keep track of time elapsed
    intervalID = setInterval(() => {
        
        timeElapsed++;

        let durationSplit = track.duration.split(':');
        let durationSeconds = parseInt(durationSplit[0] * 60) + parseInt(durationSplit[1]);
        theDot.style.left = `${timeElapsed / durationSeconds * 100}%`;
        
        // End of Track behavior
        if (timeElapsed === durationSeconds && !current) {
            timeElapsed = 0;
            albumIdx++;
            playTrack(current.tracks[albumIdx]);
        }

    }, 1000);
}

function pauseTrack(audioElement){
    console.log('Pausing track:', current)
    playButton.style.display = 'block';
    pauseButton.style.display = 'none';

    audioElement.pause();
    
    clearInterval(intervalID);
}

function back() {
    
    if (playButton.style.display === 'none') {
        if (timeElapsed > 5) {
            timeElapsed = 0;

            console.log('rewinding track: ', current)

            audioElement.pause();
            
            playTrack(current);
    
        } else {
            console.log('back 1 track to: ', album.tracks[albumIdx - 1]);
            
            if (albumIdx > 1) albumIdx--;
            audioElement.pause();
            current = album.tracks[albumIdx]
            audioElement = new Audio(current.src)

            playTrack(current);
        }
    } else {
        console.log('back 1 track to: ', album.tracks[albumIdx - 1]);

        if (albumIdx > 1) albumIdx--;
        current = album.tracks[albumIdx];
        audioElement = new Audio(current.src);
    }
}

function skip(){
    if (playButton.style.display === 'none') {
        console.log('skipped track: ', current);
        
        audioElement.pause();
        albumIdx === album.tracks.length - 1 ? albumIdx = 0 : albumIdx++;
        current = album.tracks[albumIdx]
        audioElement = new Audio(current.src);

        playTrack(current);
    } else {
        console.log('skipped track: ', current)
        albumIdx === album.tracks.length - 1 ? albumIdx = 0 : albumIdx++;
        current = album.tracks[albumIdx];
        audioElement = new Audio(current.src);

        displayTrack(current)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateSelectMenus();
    playButton.addEventListener('click', ()=>playTrack(current));
    pauseButton.addEventListener('click', ()=>pauseTrack(audioElement));
    rewindButton.addEventListener('click', back);
    skipButton.addEventListener('click', skip);
    // displayTrack(current);
    // theDot.addEventListener('click', ()=>{}); // TODO: updateTimeElapsed()
    // theDot.addEventListener('mousedown', () => {
    //     track.pause();
    // });
    // theDot.addEventListener('mouseup', () => {
    //     track.play();
    // });
})