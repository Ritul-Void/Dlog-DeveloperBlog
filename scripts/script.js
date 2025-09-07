// Global variables
let posts = [];
let currentFilter = 'all';
let postsContainer = document.querySelector('.posts-container');
let postContent = document.querySelector('.post-content');
let postFullContent = document.querySelector('.post-full-content');
let backButton = document.querySelector('.back-button');
let banner = document.querySelector('.banner')
let profile = document.querySelector('.profile-section')
let navBar = document.querySelector('.nav-bar')
// Setup event listeners
function setupEventListeners() {
    // Navigation filter clicks
    document.querySelectorAll('.nav-item').forEach(function (item) {
        item.addEventListener('click', function (e) {
            setActiveFilter(e.target.dataset.filter);
        });
    });

    // Back button
    backButton.addEventListener('click', function () {
        showPostsList();
    });
}

// Load posts from JSON (or sample data)
async function loadPosts() {
    try {

        const response = await fetch("https://raw.githubusercontent.com/Ritul-Void/while-true-blog/refs/heads/main/posts/posts.json")
        const allPosts = await response.json()
        posts = allPosts.filter(function (post) {
            return post.published;
        });
        renderPosts();
    } catch (error) {
        showError('Failed to load posts. Please try again later.');
    }
}

// Set active filter and update posts
function setActiveFilter(filter) {

    document.querySelectorAll('.nav-item').forEach(function (item) {
        item.classList.remove('active');
    });
    document.querySelector('[data-filter="' + filter + '"]').classList.add('active');

    currentFilter = filter;
    renderPosts();
}


function getFilteredPosts() {
    if (currentFilter === 'all') {
        return posts;
    }
    return posts.filter(function (post) {
        return post.tags.includes(currentFilter);
    });
}


function renderPosts() {
    const filteredPosts = getFilteredPosts();

    if (filteredPosts.length === 0) {
        postsContainer.innerHTML = '<div class="no-posts">No posts found for this filter.</div>';
        return;
    }

    let postsHTML = '';
    filteredPosts.forEach(function (post) {
        postsHTML += '<div class="post-card" data-id="' + post.id + '">' +
            '<h3 class="post-title">' + post.title + '</h3>' +

            '<div class="post-preview">' + getPreview(post.body) + '</div>' +
            '<div class="post-tags">' +
            post.tags.map(function (tag) {
                return '<span class="tag">' + tag + '</span>';
            }).join('') +
            '</div>' + '<div class="post-meta">' +
            '<span>' + formatDate(post.created) + '</span>' +
            '<span>' + post.time_to_read + ' read</span>' +
            '</div>' +
            '</div>';
    });

    postsContainer.innerHTML = postsHTML;


    document.querySelectorAll('.post-card').forEach(function (card) {
        card.addEventListener('click', function () {
            const postId = parseInt(card.dataset.id);
            showPost(postId);
        });
    });
}


function getPreview(body, maxLength) {
    if (!maxLength) maxLength = 150;


    const plainText = body
        .replace(/#{1,6}\s/g, '') // Headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
        .replace(/\*(.*?)\*/g, '$1') // Italic
        .replace(/`(.*?)`/g, '$1') // Inline code
        .replace(/```[\s\S]*?```/g, '[Code block]') // Code blocks
        .trim();

    return plainText.length > maxLength
        ? plainText.substring(0, maxLength) + '...'
        : plainText;
}


function showPost(postId) {
    let post = null;
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === postId) {
            post = posts[i];
            break;
        }
    }

    if (!post) return;

    const postHTML = '<h1 class="post-full-title">' + post.title + '</h1>' +
        '<div class="post-full-meta">' +
        formatDate(post.created) + ' • ' + post.time_to_read + ' read' +
        '<div class="post-tags" style="margin-top: 8px;">' +
        post.tags.map(function (tag) {
            return '<span class="tag">' + tag + '</span>';
        }).join('') +
        '</div>' +
        '</div>' +
        '<div class="post-body">' + parseMarkdown(post.body) + '</div>';

    postFullContent.innerHTML = postHTML;
    postContent.style.opacity = '1'
    postsContainer.style.display = 'none';
    navBar.style.display = 'none';
    banner.style.display = 'none';
    profile.style.display = 'none';
    window.scrollTo({ top: 0, behaviour: 'smooth' })
    postContent.classList.add('active');

}

// Show posts list
function showPostsList() {
    postContent.style.opacity = '0'

    banner.style.display = 'block';
    profile.style.display = 'block';
    navBar.style.display = 'flex';
    postsContainer.style.display = 'block';
    postContent.classList.remove('active');
}

// Parse markdown to HTML
function parseMarkdown(text) {
    return text

        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')

        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')

        .replace(/`([^`]+)`/g, '<code>$1</code>')

        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')

        .replace(/\n\n/g, '</p><p>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>')

        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<h[1-6]>)/g, '$1')
        .replace(/(<\/h[1-6]>)<\/p>/g, '$1');
}


function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}


function showError(message) {
    postsContainer.innerHTML = '<div class="error">' + message + '</div>';
}


document.addEventListener('DOMContentLoaded', function () {
    setupEventListeners();
    loadPosts();
});