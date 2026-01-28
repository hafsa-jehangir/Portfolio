// =========================
// Page Load Animation
// =========================
window.addEventListener("load", () => {
  document.body.classList.add("shake-on-load");
  setTimeout(() => {
    document.body.classList.remove("shake-on-load");
  }, 500);
});

// =========================
// Navbar Burger Toggle
// =========================
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');       // animate burger icon
  navLinks.classList.toggle('active');   // show/hide nav links
});

// Close nav when clicking outside
document.addEventListener('click', (event) => {
  const isClickInsideNav = navLinks.contains(event.target);
  const isClickOnBurger = burger.contains(event.target);
  if (navLinks.classList.contains('active') && !isClickInsideNav && !isClickOnBurger) {
    navLinks.classList.remove('active');
    burger.classList.remove('open');
  }
});

// =========================
// GitHub Projects
// =========================
const username = "hafsa-jehangir";
const projectCountElem = document.getElementById("project-count");
const projectsContainer = document.getElementById("projects");

async function fetchProjects() {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    const repos = await response.json();

    projectCountElem.textContent = repos.length;
    projectsContainer.innerHTML = "";

    repos.forEach(repo => {
      const projectDiv = document.createElement("div");
      projectDiv.className = "project-card";

      // If repo has a homepage, show Live Demo button
      const liveDemoBtn = repo.homepage
        ? `<a href="${repo.homepage}" target="_blank" class="btn secondary-btn">Live Demo</a>`
        : "";
projectDiv.innerHTML = `
  <h3>${repo.name}</h3>
  <p>${repo.description || "No description available"}</p>
  <div class="project-buttons">
    <a href="${repo.html_url}" target="_blank" class="btn github-btn">View on GitHub</a>
    <a href="${repo.html_url}" target="_blank" class="btn secondary-btn">Open Repo</a>
    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn demo-btn">Live Demo</a>` : ""}
  </div>
`;


      projectsContainer.appendChild(projectDiv);
    });
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    projectCountElem.textContent = "Error";
    projectsContainer.innerHTML = "<p>Failed to load projects.</p>";
  }
}

fetchProjects();

// =========================
// Certificates Loader
// =========================
async function loadCertificates() {
  const repo = "hafsa-jehangir/portfolio";
  const folder = "certificates";
  const branch = "main";
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${folder}?ref=${branch}`;

  const container = document.getElementById("gigs-container");
  const countEl = document.getElementById("gig-count");

  if (!container) return;

  container.innerHTML = "Loading...";
  if (countEl) countEl.textContent = "Loading...";

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`GitHub API HTTP ${res.status}`);
    const files = await res.json();

    const images = files.filter(f => /\.(jpe?g|png|gif|webp|svg)$/i.test(f.name));

    container.innerHTML = "";
    let count = 0;

    images.forEach(file => {
      const title = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

      const a = document.createElement("a");
      a.href = file.download_url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "certificate-card";

      const img = document.createElement("img");
      img.src = file.download_url;
      img.alt = title;

      const h3 = document.createElement("h3");
      h3.textContent = title;
      h3.className = "overlay-title";

      a.appendChild(img);
      a.appendChild(h3);
      container.appendChild(a);

      count++;
    });

    if (countEl) countEl.textContent = count;
    if (count === 0) container.innerHTML = "<p>No certificate images found.</p>";

  } catch (err) {
    console.error("Error loading certificates:", err);
    container.innerHTML = `<p style="color:red">Failed to load certificates: ${err.message}</p>`;
    if (countEl) countEl.textContent = "0";
  }
}

// =========================
// Certificate Search
// =========================
function enableCertificateSearch() {
  const searchInput = document.getElementById("gig-search");
  const container = document.getElementById("gigs-container");

  if (!searchInput || !container) return;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const cards = container.querySelectorAll(".certificate-card");

    let visibleCount = 0;
    cards.forEach(card => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      if (title.includes(query)) {
        card.style.display = "block";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    document.getElementById("gig-count").textContent = visibleCount;
  });
}

// =========================
// Timeline Animation
// =========================
const timelineItems = document.querySelectorAll('.timeline-item');

const isInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;
};

const handleScroll = () => {
  timelineItems.forEach(item => {
    if (isInViewport(item)) {
      item.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);

// =========================
// Init
// =========================
document.addEventListener("DOMContentLoaded", () => {
  loadCertificates();
  enableCertificateSearch();
});
