 // Global variables
        let posts = [];
        let currentFilter = 'all';
        let postsContainer = document.querySelector('.posts-container');
        let postContent = document.querySelector('.post-content');
        let postFullContent = document.querySelector('.post-full-content');
        let backButton = document.querySelector('.back-button');
        let banner = document.querySelector('.banner')
        let profile = document.querySelector('.profile-section')
        let navBar =  document.querySelector('.nav-bar')
        // Setup event listeners
        function setupEventListeners() {
            // Navigation filter clicks
            document.querySelectorAll('.nav-item').forEach(function(item) {
                item.addEventListener('click', function(e) {
                    setActiveFilter(e.target.dataset.filter);
                });
            });

            // Back button
            backButton.addEventListener('click', function() {
                showPostsList();
            });
        }

        // Load posts from JSON (or sample data)
        async function loadPosts() {
            try {
              
                const samplePosts = [
                    {
                        id: 1,
                        title: "Getting Started with Python Async/Await",
                        tags: ["Python", "Tutorials"],
                        time_to_read: "5 min",
                        created: "2024-09-01",
                        published: true,
                        body: "# Understanding Async/Await in Python\n\nAsynchronous programming in Python allows you to write concurrent code that can handle multiple tasks efficiently.\n\n## What is Async/Await?\n\n`async` and `await` are keywords that help you write asynchronous code that looks and feels like synchronous code.\n\n```python\nimport asyncio\n\nasync def fetch_data():\n    await asyncio.sleep(1)\n    return 'Data fetched!'\n\nasync def main():\n    result = await fetch_data()\n    print(result)\n\nasyncio.run(main())\n```\n\nThis approach is particularly useful for I/O operations, web requests, and database queries."
                    },
                    {
                        id: 2,
                        title: "JavaScript ES6+ Cheat Sheet",
                        tags: ["JavaScript", "Cheat Sheets"],
                        time_to_read: "3 min",
                        created: "2024-08-28",
                        published: true,
                        body: "# JavaScript ES6+ Quick Reference\n\n## Arrow Functions\n```javascript\n// Traditional function\nfunction add(a, b) {\n    return a + b;\n}\n\n// Arrow function\nconst add = (a, b) => a + b;\n```\n\n## Destructuring\n```javascript\n// Array destructuring\nconst [first, second] = ['hello', 'world'];\n\n// Object destructuring\nconst {name, age} = {name: 'John', age: 30};\n```\n\n## Template Literals\n```javascript\nconst name = 'World';\nconst greeting = `Hello, ${name}!`;\n```"
                    },
                    {
                        id: 3,
                        title: "Building Responsive Layouts with CSS Grid",
                        tags: ["Web Dev", "Tutorials"],
                        time_to_read: "8 min",
                        created: "2024-08-25",
                        published: true,
                        body: "# Mastering CSS Grid for Responsive Design\n\nCSS Grid is a powerful layout system that allows you to create complex, responsive layouts with ease.\n\n## Basic Grid Setup\n\n```css\n.container {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n    gap: 1rem;\n}\n```\n\n## Grid Areas\n\nYou can define named grid areas for more semantic layouts:\n\n```css\n.layout {\n    display: grid;\n    grid-template-areas:\n        'header header'\n        'sidebar main'\n        'footer footer';\n}\n\n.header { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.main { grid-area: main; }\n.footer { grid-area: footer; }\n```"
                    },
                    {
                        id: 4,
                        title: "Python List Comprehensions Guide",
                        tags: ["Python", "Cheat Sheets"],
                        time_to_read: "4 min",
                        created: "2024-08-20",
                        published: true,
                        body: "# Python List Comprehensions\n\nList comprehensions provide a concise way to create lists based on existing lists.\n\n## Basic Syntax\n```python\n# Traditional approach\nresult = []\nfor x in range(10):\n    if x % 2 == 0:\n        result.append(x**2)\n\n# List comprehension\nresult = [x**2 for x in range(10) if x % 2 == 0]\n```\n\n## Nested Comprehensions\n```python\n# Creating a matrix\nmatrix = [[i*j for i in range(3)] for j in range(3)]\n```\n\n## Dictionary Comprehensions\n```python\nsquares = {x: x**2 for x in range(5)}\n```"
                    }
                ];
                
                posts = samplePosts.filter(function(post) {
                    return post.published;
                });
                renderPosts();
            } catch (error) {
                showError('Failed to load posts. Please try again later.');
            }
        }

        // Set active filter and update posts
        function setActiveFilter(filter) {
  
            document.querySelectorAll('.nav-item').forEach(function(item) {
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
            return posts.filter(function(post) {
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
            filteredPosts.forEach(function(post) {
                postsHTML += '<div class="post-card" data-id="' + post.id + '">' +
                    '<h3 class="post-title">' + post.title + '</h3>' +
                    '<div class="post-meta">' +
                        '<span>' + formatDate(post.created) + '</span>' +
                        '<span>' + post.time_to_read + ' read</span>' +
                    '</div>' +
                    '<div class="post-preview">' + getPreview(post.body) + '</div>' +
                    '<div class="post-tags">' +
                        post.tags.map(function(tag) {
                            return '<span class="tag">' + tag + '</span>';
                        }).join('') +
                    '</div>' +
                '</div>';
            });

            postsContainer.innerHTML = postsHTML;

       
            document.querySelectorAll('.post-card').forEach(function(card) {
                card.addEventListener('click', function() {
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
                        post.tags.map(function(tag) {
                            return '<span class="tag">' + tag + '</span>';
                        }).join('') +
                    '</div>' +
                '</div>' +
                '<div class="post-body">' + parseMarkdown(post.body) + '</div>';

            postFullContent.innerHTML = postHTML;
            postContent.style.opacity ='1'
            postsContainer.style.display = 'none';
            navBar.style.display = 'none';
            banner.style.display = 'none';
            profile.style.display = 'none';
            window.scrollTo({top:0,behaviour:'smooth'})
            postContent.classList.add('active');

        }

        // Show posts list
        function showPostsList() {
            postContent.style.opacity ='0'

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


        document.addEventListener('DOMContentLoaded', function() {
            setupEventListeners();
            loadPosts();
        });