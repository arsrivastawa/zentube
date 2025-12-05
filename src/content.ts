// State cache
type Settings = {
  hideShorts: boolean;
  subsOnly: boolean;
  turnOffComments: boolean;
  hideRecommended: boolean;
  focusMode: boolean;
};

const settings: Settings = {
  hideShorts: false,
  subsOnly: false,
  turnOffComments: false,
  hideRecommended: false,
  focusMode: false,
};

// DOM helpers
const updateShorts = (shouldHide: boolean) => {
  const shortsShelves = document.getElementsByTagName(
    "ytd-rich-section-renderer"
  );

  for (let i = 0; i < shortsShelves.length; i++) {
    const shelf = shortsShelves[i] as HTMLElement;
    shelf.style.display = shouldHide ? "none" : "block";
  }
};

const hideComments = (shouldHide: boolean) => {
  const commentSections = document.getElementsByTagName("ytd-comments");
  for (let i = 0; i < commentSections.length; i++) {
    const section = commentSections[i] as HTMLElement;
    section.style.display = shouldHide ? "none" : "block";
  }
};

const showSubscriptionsOnly = (subsOnly: boolean) => {
  if (subsOnly && !window.location.href.includes("feed/subscription")) {
    window.location.href = "https://www.youtube.com/feed/subscriptions";
  }
};

let hasShownHideRecoAlert = false;
const hideRecommendations = (shouldHide: boolean) => {
  const recommendedSections1 = document.getElementById("secondary");
  const recommendedSections2 = document.getElementsByClassName(
    "ytd-watch-next-secondary-results-renderer"
  );

  if (shouldHide && !hasShownHideRecoAlert) {
    alert(
      "You are about to hide recommendations. You may switch to Theater Mode for a better experience."
    );
    hasShownHideRecoAlert = true;
  }

  if (recommendedSections1) {
    recommendedSections1.style.display = shouldHide ? "none" : "block";
  }

  for (let i = 0; i < recommendedSections2.length; i++) {
    const section = recommendedSections2[i] as HTMLElement;
    section.style.display = shouldHide ? "none" : "block";
  }
};

// Apply everything based on current settings
const applySettings = () => {
  const active = settings.focusMode;
  // Shorts
  updateShorts(active && settings.hideShorts);

  // Comments
  hideComments(active && settings.turnOffComments);

  // Recommendations
  hideRecommendations(active && settings.hideRecommended);

  // Show subscriptions only
  if (settings.subsOnly) {
    showSubscriptionsOnly(true);
  }
};

// Run at Initial load
chrome.storage.local.get(
  ["hideShorts", "subsOnly", "turnOffComments", "hideRecommended", "focusMode"],
  (result) => {
    settings.hideShorts = !!result.hideShorts;
    settings.subsOnly = !!result.subsOnly;
    settings.turnOffComments = !!result.turnOffComments;
    settings.hideRecommended = !!result.hideRecommended;
    settings.focusMode = !!result.focusMode;

    applySettings();
  }
);

// For Live changes on toggle
chrome.storage.onChanged.addListener((changes) => {
  for (const key in changes) {
    const value = (changes as any)[key].newValue;
    if (key in settings) {
      (settings as any)[key] = value;
    }
  }

  applySettings();
});

// MutationObserver to re-apply settings whenever DOM changes
const observer = new MutationObserver(() => {
  applySettings();
});

observer.observe(document.body, { childList: true, subtree: true });