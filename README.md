# spa-router

A minimalistic version of router for SPA application.

Usage example with MalinaJS:

In Script section,

import Router from '...'

let cmp,
params = {},
query = {}

const router = new Router()

router
.on('/', import('./Home.xht'))
.on('/about/:name', import('./About.xht'))
.on('/setting', import('./Setting.xht'))
.on('/users/:id', import('./Users.xht'))
.on('/posts/:postId/comments', import('./Posts.xht'))
.on404(import('./404.xht'))
.listen((matchedRoute) => {
({ cmp, params, query } = matchedRoute)
})

In Body section,

```html
<ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about/me">About</a></li>
    <li><a href="/setting?about=setting">Setting</a></li>
    <li><a href="/users/123?active=true">User 123</a></li>
    <li><a href="/posts/456/comments?sort=latest">Comments for Post 456</a></li>
</ul>

{#if cmp}
<component:cmp {params} {query} />
{/if}
```
