// Typewriter Effect
function typeWriter(element, text, speed, callback) {
    let i = 0;
    element.style.opacity = '1';
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}

// Initialize typewriter on load
window.addEventListener('load', () => {
    const titleLines = document.querySelectorAll('.title-line');
    const designation = document.querySelector('.designation');
    const statusText = document.querySelector('.status-bar span:last-child');
    const sectionHeaders = document.querySelectorAll('.section-header h2');
    const contactLabels = document.querySelectorAll('.contact-label');
    const contactValues = document.querySelectorAll('.contact-value');
    
    // Hide elements initially
    designation.style.opacity = '0';
    statusText.style.opacity = '0';
    sectionHeaders.forEach(h => h.style.opacity = '0');
    contactLabels.forEach(label => label.style.opacity = '0');
    contactValues.forEach(value => value.style.opacity = '0');
    
    // Sequence the typewriter effects
    typeWriter(designation, 'SE-001', 60, () => {
        typeWriter(titleLines[0], 'DEL', 80, () => {
            const cursor = titleLines[1].querySelector('.cursor');
            const cursorHTML = cursor ? cursor.outerHTML : '';
            
            typeWriter(titleLines[1], 'MONTE', 80, () => {
                if (cursorHTML) {
                    titleLines[1].innerHTML += cursorHTML;
                }
                
                // Type status
                typeWriter(statusText, 'AVAILABLE', 50, () => {
                    
                    // Type section headers with delays
                    setTimeout(() => {
                        typeWriter(sectionHeaders[0], 'REPOSITORIES', 40, () => {
                            setTimeout(() => {
                                typeWriter(sectionHeaders[1], 'CONTACT', 40, () => {
                                    
                                    // Type contact labels and values
                                    setTimeout(() => {
                                        typeWriter(contactLabels[0], 'EMAIL', 30, () => {
                                            typeWriter(contactValues[0], 'a@delmonte.io', 30);
                                        });
                                    }, 100);
                                    
                                    setTimeout(() => {
                                        typeWriter(contactLabels[1], 'GITHUB', 30, () => {
                                            typeWriter(contactValues[1], 'adelmonte', 30);
                                        });
                                    }, 300);
                                });
                            }, 200);
                        });
                    }, 300);
                });
            });
        });
    });
});

// Floating Particles (Rainbow)
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const colors = [
        '#ff0000',
        '#ff7f00',
        '#ffff00',
        '#00ff00',
        '#0000ff',
        '#4b0082',
        '#9400d3'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.background = randomColor;
    particle.style.boxShadow = `0 0 4px ${randomColor}`;
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    document.body.appendChild(particle);
    
    const duration = 3000 + Math.random() * 2000;
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 100;
    
    particle.animate([
        { transform: 'translate(0, 0)', opacity: 0.6 },
        { 
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`, 
            opacity: 0 
        }
    ], {
        duration: duration,
        easing: 'ease-out'
    }).onfinish = () => particle.remove();
}

setInterval(createParticle, 50);

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
