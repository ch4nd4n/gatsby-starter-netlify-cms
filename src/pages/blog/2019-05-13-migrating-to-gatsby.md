---
templateKey: blog-post
title: Migrating to Gatsy
date: 2019-05-13T08:00:00.000Z
description: I had to struggle a bit on migrating blog to Gatsby following is my notes on the migration flow
tags:
  - blog
  - JavaScript
---

![Migrating to Gatsby](/img/migrating-birds.jpg)

There was no real strong reason to migrate from Jekyll to [Gatsby](https://www.gatsbyjs.org/). I have been wanting to try out Gatsby for sometime now, and migrating something that was live would have given a good hands on. So I decided to try out Gatsby on this blog. I would not say that it was a breeze, especially because I wanted to preserve the existing URLs of my blog. I tried out the steps given at this [Gatsby post](https://www.gatsbyjs.org/blog/2017-11-08-migrate-from-jekyll-to-gatsby/) but it did not work for me. Following is the notes on what I did different.

## What worked

For sometime my blog has been hosted on Google Cloud and as a part of this migration, I have decided to move the host to Netlify. So that it's easier to compose things. Plus there is some recurring charge on GCP which I am not sure why I am being charged for. Netlify provides [this](https://www.gatsbyjs.org/starters/netlify-templates/gatsby-starter-netlify-cms/) template and went with it.

So some of the steps mentioned on Gatsby were not necessary for me. Two things that I had to do,

1. change `./gatsby-node.js` onCreateNode function.
2. Change all existing template to include `templateKey` and change `categories` to tags. This step was time consuming, rather, boring as I manually made the edits to each of the existing markdown template.

Changset of `./gatsby-node.js`

```
diff --git a/gatsby-node.js b/gatsby-node.js
index 1c73a4e..df58c17 100644
--- a/gatsby-node.js
+++ b/gatsby-node.js
@@ -77,11 +77,31 @@ exports.onCreateNode = ({ node, actions, getNode }) => {
   fmImagesToRelative(node) // convert image paths for gatsby images
 
   if (node.internal.type === `MarkdownRemark`) {
-    const value = createFilePath({ node, getNode })
-    createNodeField({
-      name: `slug`,
-      node,
-      value,
-    })
+    const value = createFilePath({ node, getNode, basePath: `pages` })
+    // console.log('value:', value)
+    if (value && value.includes('/blog')){
+      BLOG_POST_SLUG_REGEX = /^\/blog\/([\d]{4})-([\d]{2})-([\d]{2})-(.+)\/$/
+      const match = BLOG_POST_SLUG_REGEX.exec(value)
+      const year = match[1]
+      const month = match[2]
+      const day = match[3]
+      const filename = match[4]
+
+      const slug = `/blog/${year}/${month}/${day}/${filename}/`
+      // console.log('slug:', slug);
+      createNodeField({
+        name: `slug`,
+        node,
+        value: slug,
+      })
+    } else {
+      console.log('slug-original:', value);
+      createNodeField({
+        name: `slug`,
+        node,
+        value,
+      })
+    }
+    
   }
 }
```

Git diff of a sample post.

```
 diff --git a/_source/_posts/2012-05-09-hello-octopress.markdown b/_source/_posts/2012-05-09-hello-octopress.markdown
index 03a748b..080974c 100644
--- a/_source/_posts/2012-05-09-hello-octopress.markdown
+++ b/_source/_posts/2012-05-09-hello-octopress.markdown
@@ -1,9 +1,10 @@
 ---
-layout: post
+templateKey: blog-post
 title: "hello octopress"
 date: 2012-05-09 19:20
 comments: true
-categories: [octopress]
+tags: 
+    - octopress
 ---
 If for some reason it's not obvious, this site is powered by Octopress. I  am 
 fascinated with simplicity of octopress. After playing around with it for sometime,
```

In addition I have to update the template to my taste, as the original template is something to with Coffee store.