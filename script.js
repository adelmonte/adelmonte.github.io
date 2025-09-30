// Time update
function updateTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
            timeZone: 'America/New_York',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        timeElement.textContent = timeString;
    }
}
updateTime();
setInterval(updateTime, 1000);

// Update copyright year dynamically
const currentYear = new Date().getFullYear();
const footerYear = document.getElementById('footer-year');
if (footerYear) {
    footerYear.textContent = `© ${currentYear} DELMONTE.IO`;
}

// Fetch repositories
function getCommitActivity(updatedAt) {
    const now = new Date();
    const updated = new Date(updatedAt);
    const daysDiff = (now - updated) / (1000 * 60 * 60 * 24);
    
    if (daysDiff < 30) return 'commit-recent';
    if (daysDiff < 90) return 'commit-moderate';
    return 'commit-old';
}

function getLanguageClass(language) {
    if (!language) return '';
    return 'lang-' + language.toLowerCase().replace(/\+/g, 'pp').replace(/\s+/g, '').replace(/#/g, 'sharp');
}

function renderRepos(repos) {
    const container = document.getElementById('repos-container');
    
    if (repos.length === 0) {
        container.innerHTML = '<div class="loading">NO REPOSITORIES FOUND</div>';
        return;
    }
    
    container.innerHTML = repos.map(repo => `
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-card">
            <div class="repo-header">
                <div class="repo-name">${repo.name}</div>
                <div class="repo-meta">
                    ${repo.language ? `<span class="repo-language ${getLanguageClass(repo.language)}">${repo.language}</span>` : ''}
                    ${repo.updated_at ? `<span class="commit-dot ${getCommitActivity(repo.updated_at)}"></span>` : ''}
                </div>
            </div>
            <div class="repo-description">${repo.description || 'No description available'}</div>
            <div class="repo-stats">
                <span>★ ${repo.stargazers_count}</span>
                <span>⑂ ${repo.forks_count}</span>
            </div>
        </a>
    `).join('');
}

// Fetch from pinned repos API
fetch('https://pinned.berrysauce.dev/get/adelmonte')
    .then(response => response.json())
    .then(data => {
        const formattedRepos = data.map(repo => ({
            id: `${repo.author}/${repo.name}`,
            name: repo.name,
            description: repo.description,
            html_url: `https://github.com/${repo.author}/${repo.name}`,
            stargazers_count: repo.stars,
            forks_count: repo.forks,
            language: repo.language,
            updated_at: repo.updated_at
        }));
        renderRepos(formattedRepos);
    })
    .catch(error => {
        console.error('Error fetching pinned repos:', error);
        // Fallback to regular GitHub API
        fetch('https://api.github.com/users/adelmonte/repos?sort=updated&per_page=6')
            .then(response => response.json())
            .then(data => {
                renderRepos(data);
            })
            .catch(fallbackError => {
                console.error('Error fetching fallback repos:', fallbackError);
                document.getElementById('repos-container').innerHTML = 
                    '<div class="loading">ERROR LOADING REPOSITORIES</div>';
            });
    });
