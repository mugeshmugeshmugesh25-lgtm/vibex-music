// VIBEX MUSIC PLAYER

const songs = [
    {
        name: "Mudhal Nee Mudivum Nee",
        artist: "Darbuka Siva",
        image: "images/Mudhal-Nee-Mudivum-Nee-Title-Track-Trending-Version-Tamil-2023-20230424193324-500x500.jpg",
        color: "linear-gradient(135deg,#667eea,#764ba2)",
        url: "music/Mudhal-Nee-Mudivum-Nee-Title-Track-MassTamilan.io.mp3",
        lyrics: `Lyrics are not added yet.

Add your licensed lyrics here.`
    },
    {
        name: "One Name",
        artist: "Anirudh Ravichander",
        image: "images/One-Name.jpg",
        color: "linear-gradient(135deg,#141e30,#243b55)",
        url: "music/One Name.mp3",
        lyrics: `Lyrics are not added yet.

Add your licensed lyrics here.`
    },
    {
        name: "One Sun One Moon",
        artist: "Anirudh Ravichander",
        image: "images/one-sun-one-moon.jpg",
        color: "linear-gradient(135deg,#2193b0,#6dd5ed)",
        url: "music/One Sun One Moon.mp3",
        lyrics: `Lyrics are not added yet.

Add your licensed lyrics here.`
    },
    {
        name: "Putaapu Gang",
        artist: "Anirudh Ravichander",
        image: "images/putaapu-gang.jpg",
        color: "linear-gradient(135deg,#f7971e,#ffd200)",
        url: "music/Putaapu Gang.mp3",
        lyrics: `Lyrics are not added yet.

Add your licensed lyrics here.`
    }
];

const audio = document.getElementById("audio");
const songsList = document.getElementById("songs");
const likedList = document.getElementById("likedSongs");

let current = -1;
let currentView = "home";

let liked = JSON.parse(
    localStorage.getItem("vibex-liked") || "[]"
);

liked = liked.filter(i =>
    Number.isInteger(i) && i >= 0 && i < songs.length
);

// CREATE SONG CARD

function createCard(index) {
    const song = songs[index];

    const card = document.createElement("div");
    card.className = "song";

    const cover = document.createElement("div");
    cover.className = "cover";
    cover.style.background = song.color;

    const img = document.createElement("img");
    img.src = song.image;
    img.alt = song.name + " cover";

    img.onerror = function () {
        this.style.display = "none";
    };

    const play = document.createElement("button");
    play.textContent = "▶";
    play.setAttribute("aria-label", "Play " + song.name);

    play.onclick = event => {
        event.stopPropagation();
        openSong(index);
    };

    cover.append(img, play);

    const title = document.createElement("h3");
    title.textContent = song.name;

    const artist = document.createElement("p");
    artist.textContent = song.artist;

    card.append(cover, title, artist);

    // Song card click opens its own page
    card.onclick = () => openSong(index);

    return card;
}

// SHOW ALL SONGS

function renderSongs(filter = "") {
    songsList.innerHTML = "";

    songs.forEach((song, index) => {
        const searchText =
            (song.name + " " + song.artist).toLowerCase();

        if (searchText.includes(filter.toLowerCase())) {
            songsList.appendChild(createCard(index));
        }
    });
}

// SHOW LIKED SONGS

function renderLikedSongs(filter = "") {
    likedList.innerHTML = "";

    const filtered = liked.filter(index => {
        const song = songs[index];

        return song &&
            (song.name + " " + song.artist)
                .toLowerCase()
                .includes(filter.toLowerCase());
    });

    document.getElementById("likedCount").textContent =
        filtered.length +
        (filtered.length === 1 ? " SONG" : " SONGS");

    document.getElementById("likedEmpty").style.display =
        liked.length === 0 ? "block" : "none";

    filtered.forEach(index => {
        likedList.appendChild(createCard(index));
    });
}

// OPEN INDIVIDUAL SONG PAGE

function openSong(index) {
    current = index;

    const song = songs[index];

    showView("song");

    document.getElementById("detailTitle").textContent =
        song.name;

    document.getElementById("detailArtist").textContent =
        song.artist;

    // Album cover
    const detailCover = document.getElementById("detailCover");

    detailCover.innerHTML = "";
    detailCover.style.background = song.color;

    const img = document.createElement("img");
    img.src = song.image;
    img.alt = song.name + " cover";

    img.onerror = function () {
        this.style.display = "none";
    };

    detailCover.appendChild(img);

    // Lyrics placeholder
    const lyricsContent =
        document.getElementById("lyricsContent");

    lyricsContent.innerHTML = "";

    const lyrics = document.createElement("p");
    lyrics.className = "lyrics-placeholder";
    lyrics.textContent = song.lyrics;

    lyricsContent.appendChild(lyrics);

    // Update player details
    document.getElementById("songName").textContent =
        song.name;

    document.getElementById("artistName").textContent =
        song.artist;

    const miniCover = document.getElementById("miniCover");

    miniCover.innerHTML = "";
    miniCover.style.background = song.color;

    const miniImg = document.createElement("img");
    miniImg.src = song.image;
    miniImg.alt = song.name + " cover";

    miniImg.onerror = function () {
        this.style.display = "none";
    };

    miniCover.appendChild(miniImg);

    updateLikeButtons();

    // Play selected song
    if (audio.src !== new URL(song.url, document.baseURI).href) {
        audio.src = song.url;
        audio.load();
    }

    audio.play().catch(() => {
        updatePlayButtons();
        console.log("Audio playback failed. Check the file path.");
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// PLAY / PAUSE

function playFirst() {
    openSong(0);
}

function togglePlay() {
    if (current === -1) {
        openSong(0);
        return;
    }

    if (audio.paused) {
        audio.play().catch(() => {
            console.log("Check the song audio path.");
        });
    } else {
        audio.pause();
    }
}

function updatePlayButtons() {
    const playing = !audio.paused;

    document.getElementById("playBtn").textContent =
        playing ? "❚❚" : "▶";

    document.getElementById("detailPlayBtn").textContent =
        playing ? "❚❚ Pause" : "▶ Play";
}

audio.addEventListener("play", updatePlayButtons);
audio.addEventListener("pause", updatePlayButtons);

document.getElementById("detailPlayBtn").onclick = togglePlay;

// NEXT / PREVIOUS

function nextSong() {
    if (current === -1) {
        openSong(0);
    } else {
        openSong((current + 1) % songs.length);
    }
}

function previousSong() {
    if (current === -1) {
        openSong(0);
    } else if (audio.currentTime > 3) {
        audio.currentTime = 0;
    } else {
        openSong((current - 1 + songs.length) % songs.length);
    }
}

audio.addEventListener("ended", nextSong);

// LIKE / UNLIKE

function updateLikeButtons() {
    const isLiked = liked.includes(current);

    document.getElementById("likeBtn").textContent =
        isLiked ? "♥" : "♡";

    document.getElementById("detailLikeBtn").textContent =
        isLiked ? "♥ Liked" : "♡ Like";
}

function toggleLike() {
    if (current === -1) return;

    if (liked.includes(current)) {
        liked = liked.filter(index => index !== current);
    } else {
        liked.push(current);
    }

    localStorage.setItem(
        "vibex-liked",
        JSON.stringify(liked)
    );

    updateLikeButtons();
    renderLikedSongs(document.getElementById("search").value);
}

document.getElementById("likeBtn").onclick = toggleLike;
document.getElementById("detailLikeBtn").onclick = toggleLike;

// NAVIGATION

function showView(view) {
    currentView = view;

    document.getElementById("homeView").hidden =
        view !== "home";

    document.getElementById("likedView").hidden =
        view !== "liked";

    document.getElementById("songView").hidden =
        view !== "song";

    document.getElementById("homeNav").classList.toggle(
        "active", view === "home"
    );

    document.getElementById("discoverNav").classList.toggle(
        "active", view === "home"
    );

    document.getElementById("libraryNav").classList.toggle(
        "active", view === "home"
    );

    document.getElementById("likedNav").classList.toggle(
        "active", view === "liked"
    );
}

document.getElementById("homeNav").onclick = () => {
    showView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
};

document.getElementById("discoverNav").onclick = () => {
    showView("home");

    document.getElementById("library").scrollIntoView({
        behavior: "smooth"
    });
};

document.getElementById("libraryNav").onclick = () => {
    showView("home");

    document.getElementById("library").scrollIntoView({
        behavior: "smooth"
    });
};

document.getElementById("likedNav").onclick = () => {
    showView("liked");
    renderLikedSongs();
    window.scrollTo({ top: 0, behavior: "smooth" });
};

document.getElementById("backBtn").onclick = () => {
    if (currentView === "song") {
        showView("home");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
};

document.getElementById("exploreBtn").onclick = () => {
    showView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
};

// SEARCH

document.getElementById("search").addEventListener("input", event => {
    const query = event.target.value.trim();

    if (currentView === "liked") {
        renderLikedSongs(query);
    } else if (currentView === "home") {
        renderSongs(query);
    }
});

// VOLUME

document.getElementById("volume").addEventListener("input", event => {
    audio.volume = Number(event.target.value);
});

audio.volume = 0.7;

// PROGRESS BAR

audio.addEventListener("timeupdate", () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
        return;
    }

    document.getElementById("progress").value =
        (audio.currentTime / audio.duration) * 100;

    document.getElementById("currentTime").textContent =
        formatTime(audio.currentTime);

    document.getElementById("duration").textContent =
        formatTime(audio.duration);
});

document.getElementById("progress").addEventListener("input", event => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime =
            (Number(event.target.value) / 100) * audio.duration;
    }
});

audio.addEventListener("loadedmetadata", () => {
    document.getElementById("progress").value = 0;
    document.getElementById("currentTime").textContent = "0:00";

    document.getElementById("duration").textContent =
        formatTime(audio.duration);
});

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remaining}`;
}

// INITIALIZE

renderSongs();
renderLikedSongs();
updatePlayButtons();