const videoBtn = document.querySelector(".get-video-btn");
const videoSection = document.querySelector(".videos");
const moreBtn = document.querySelector(".more");
const youtubeLinkRegex = /^(https:\/\/)?(www\.)?youtube\.com\/(watch\?v=\w|playlist\?list=\w|channel\/\w)/;
let idList = [];
let currentNextPageToken = null;

videoBtn.addEventListener("click", handleVideoBtn);
moreBtn.addEventListener("click", fetchVideos);

function handleVideoBtn() {
  const inputValue = document.querySelector(".link-field").value;
  if (!inputValue.length) return;
  currentNextPageToken = null;
  idList = [];

  inputLinks = inputValue.split(",");
  inputLinks.forEach((inputLink) => {
    inputLink = inputLink.trim();
    let validBool = youtubeLinkRegex.test(inputLink);
    if (validBool) {
      if (inputLink.includes("watch")) {
        videoLinkIframes(inputLink);
      } else if (inputLink.includes("playlist")) {
        idList.push(["p", inputLink]);
      } else if (inputLink.includes("channel")) {
        idList.push(["c", inputLink]);
      }
      console.log(`YES: ${inputLink}`);
    } else {
      console.log(`WRONG: ${inputLink}`);
    }
  });
  console.log(idList);
  fetchVideos();
}

function fetchVideos() {
  if (idList.length < 1) return;
  const categoryLink = idList[0];
  if (categoryLink[0] === "p") {
    playlistLinkIframes(categoryLink[1], currentNextPageToken);
  } else {
    channelLinkIframes(categoryLink[1], currentNextPageToken);
  }
}

// Fetching and Creating Iframes
async function getChannelOrPlaylistVideos(category, id, nextPageToken) {
  const response = await fetch(
    `http://localhost:5000/${category}?id=${id}&nextPageToken=${nextPageToken}`
  );
  const data = await response.json();
  const videoIds = data.video_ids;
  currentNextPageToken = data.nextPageToken;
  videoIds.forEach((videoId) => {
    const iframeHtml = `<div class="videoWrapper">
                      <iframe width="560" height="315"
                      src="https://www.youtube.com/embed/${videoId}"
                      frameborder="0" allow="accelerometer; autoplay; clipboard-write;
                      encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                      </div>`;
    const iframHtmlFragment = document
      .createRange()
      .createContextualFragment(iframeHtml);
    videoSection.appendChild(iframHtmlFragment);
  });
  console.log(currentNextPageToken);
  if (currentNextPageToken) {
    moreBtn.style.display = "block";
  } else {
    if (idList.length > 1) {
      moreBtn.style.display = "block";
      currentNextPageToken = null;
      idList.shift();
      console.log(idList);
    } else {
      moreBtn.style.display = "none";
    }
  }
}

function channelLinkIframes(channelLink, nextPageToken) {
  const channelId = channelLink.split("/").slice(-1);
  getChannelOrPlaylistVideos("channel", channelId, nextPageToken);
}

function playlistLinkIframes(playlistLink, nextPageToken) {
  const playlistId = playlistLink.split("=")[1];
  getChannelOrPlaylistVideos("playlist", playlistId, nextPageToken);
}

function videoLinkIframes(videoLink) {
  const videoId = videoLink.split("=")[1].split("&")[0];
  const iframeHtml = `<div class="videoWrapper">
                        <iframe width="560" height="315"
                        src="https://www.youtube.com/embed/${videoId}"
                        frameborder="0" allow="accelerometer; autoplay; clipboard-write;
                        encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>`;
  const iframHtmlFragment = document
    .createRange()
    .createContextualFragment(iframeHtml);
  videoSection.appendChild(iframHtmlFragment);
}
