(function () {
    "use strict";

    var BLOG_LIST_ID = "blog-list";
    var BLOG_POST_ROOT_ID = "blog-post-root";

    function formatDate(iso) {
        var d = new Date(iso);
        return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    }

    function renderList() {
        var container = document.getElementById(BLOG_LIST_ID);
        if (!container || typeof window.BLOG_POSTS === "undefined") return;

        var posts = window.BLOG_POSTS;
        var html = '<div class="blog-grid">';
        posts.forEach(function (post) {
            html +=
                '<article class="blog-card">' +
                '<a href="blog-post.html?slug=' + encodeURIComponent(post.slug) + '" class="blog-card__link">' +
                '<img class="blog-card__image" src="' + (post.image || "") + '" alt="" width="800" height="500" loading="lazy">' +
                '<div class="blog-card__content">' +
                '<time class="blog-card__date" datetime="' + post.date + '">' + formatDate(post.date) + '</time>' +
                '<h2 class="blog-card__title">' + post.title + '</h2>' +
                '<p class="blog-card__excerpt">' + post.excerpt + '</p>' +
                '<span class="blog-card__meta">' + (post.readTime || "") + '</span>' +
                '</div></a></article>';
        });
        html += "</div>";
        container.innerHTML = html;
    }

    function renderPost() {
        var container = document.getElementById(BLOG_POST_ROOT_ID);
        if (!container || typeof window.BLOG_POSTS === "undefined") return;

        var params = new URLSearchParams(window.location.search);
        var slug = params.get("slug");
        if (!slug) {
            container.innerHTML = "<p class=\"section-body\">Post not found.</p>";
            return;
        }

        var post = window.BLOG_POSTS.find(function (p) { return p.slug === slug; });
        if (!post) {
            container.innerHTML = "<p class=\"section-body\">Post not found.</p>";
            return;
        }

        document.title = post.title + " | Blog | Standen — Web Development & SaaS Agency Hampshire UK";

        container.innerHTML =
            '<div class="section-inner section-inner--narrow"><div class="blog-post">' +
            '<a href="blog.html" class="blog-post__back">← Back to blog</a>' +
            '<article class="blog-post__article">' +
            '<header class="blog-post__header">' +
            '<time datetime="' + post.date + '" class="blog-post__date">' + formatDate(post.date) + '</time>' +
            '<h1 class="blog-post__title">' + post.title + '</h1>' +
            '<p class="blog-post__meta">' + (post.author || "") + ' · ' + (post.readTime || "") + '</p>' +
            '</header>' +
            (post.image ? '<img class="blog-post__image" src="' + post.image + '" alt="" width="800" height="500">' : '') +
            '<div class="blog-post__body">' + post.body + '</div>' +
            '</article></div></div>';
    }

    if (document.getElementById(BLOG_LIST_ID)) renderList();
    if (document.getElementById(BLOG_POST_ROOT_ID)) renderPost();
})();
