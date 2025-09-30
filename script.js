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

// Show body content in order
function showBodyContent() {
    // Show info grid first
    document.querySelector('.info-grid').classList.add('show');
    
    // Show repositories section header after a delay
    setTimeout(() => {
        const reposHeader = document.querySelector('.projects-section .section-header');
        if (reposHeader) {
            reposHeader.classList.add('show');
            // Trigger typewriter for REPOSITORIES header
            const reposH2 = reposHeader.querySelector('h2');
            if (reposH2) {
                const originalText = reposH2.getAttribute('data-text') || 'REPOSITORIES';
                typeWriter(reposH2, originalText, 50);
            }
        }
        
        // Show repos grid slightly after header
        setTimeout(() => {
            document.querySelector('.repos-grid').classList.add('show');
        }, 500);
    }, 300);
    
// Show contact section after repos
setTimeout(() => {
    const contactSection = document.querySelector('.contact-section');
    if (contactSection) {
        contactSection.classList.add('show');
        
        const contactHeader = contactSection.querySelector('.section-header');
        if (contactHeader) {
            contactHeader.classList.add('show');
            
            // Trigger typewriter for CONTACT header after fade-in completes
            setTimeout(() => {
                const contactH2 = contactHeader.querySelector('h2');
                if (contactH2) {
                    const originalText = contactH2.getAttribute('data-text') || 'CONTACT';
                    typeWriter(contactH2, originalText, 50);
                }
            }, 500);
        }
    }
}, 1800);
    
    // Show footer last
    setTimeout(() => {
        document.querySelector('.footer').classList.add('show');
    }, 2500);
}

// Initialize animations on load
window.addEventListener('load', () => {
    const titleLines = document.querySelectorAll('.title-line');
    const designation = document.querySelector('.designation');
    const statusText = document.querySelector('.status-bar span:last-child');
    
    // Hide elements initially
    designation.style.opacity = '0';
    statusText.style.opacity = '0';
    
    // Store original text for section headers
    const reposH2 = document.querySelector('.projects-section .section-header h2');
    const contactH2 = document.querySelector('.contact-section .section-header h2');
    if (reposH2) {
        reposH2.setAttribute('data-text', reposH2.textContent);
        reposH2.textContent = '';
    }
    if (contactH2) {
        contactH2.setAttribute('data-text', contactH2.textContent);
        contactH2.textContent = '';
    }
    
    // Fade in SE-001
    setTimeout(() => {
        designation.style.transition = 'opacity 0.8s ease-in';
        designation.style.opacity = '1';
    }, 300);
    
    // Start title typewriter after fade
    setTimeout(() => {
        typeWriter(titleLines[0], 'DEL', 50, () => {
            const cursor = titleLines[1].querySelector('.cursor');
            const cursorHTML = cursor ? cursor.outerHTML : '';
            
            typeWriter(titleLines[1], 'MONTE', 50, () => {
                if (cursorHTML) {
                    titleLines[1].innerHTML += cursorHTML;
                }
                
                // Offset available status
                setTimeout(() => {
                    typeWriter(statusText, 'AVAILABLE', 50, () => {
                        // Show body content after header animation completes
                        setTimeout(showBodyContent, 300);
                    });
                }, 400);
            });
        });
    }, 1100);
});

// Floating Particles (Programming Language Colors)
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const colors = [
        '#4EAA25', // Shell/Bash
        '#4B8BBE', // Python
        '#E8D44D', // JavaScript (darkened)
        '#3178C6', // TypeScript
        '#F34B7D', // C++
        '#00ADD8', // Go
        '#F74C00', // Rust
        '#39457E', // Perl
        '#CC342D', // Ruby
        '#777BB4', // PHP
        '#F89820', // Java
        '#FA7343', // Swift
        '#B125EA', // Kotlin
        '#2496ED', // Dockerfile
        '#E34C26', // HTML
        '#1572B6'  // CSS
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.background = randomColor;
    particle.style.boxShadow = `0 0 4px ${randomColor}`;
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    document.body.appendChild(particle);
    
    const duration = 10000 + Math.random() * 2000;
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

setInterval(createParticle, 40);

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
                <span><span class="star-icon">★</span> ${repo.stargazers_count}</span>
                <span><span class="fork-icon">⑂</span> ${repo.forks_count}</span>
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
