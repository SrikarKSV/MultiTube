const videoBtn = document.querySelector(".get-video-btn");
const videoSection = document.querySelector(".videos");

videoBtn.addEventListener("click", handleVideoBtn);

function handleVideoBtn() {
  const videoLinks = document.querySelector(".link-field").value.split(",");
  videoLinks.forEach((videoLink) => {
    videoLink = videoLink.trim();
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
  });
}
