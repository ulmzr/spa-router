class Router {
    routes = []
    notFoundComponent = null
    matchCallback = null

    on(path, componentPromise) {
        const keys = []
        const regex = new RegExp(
            `^${path.replace(/:[^\s/]+/g, (match) => {
                keys.push(match.slice(1))
                return '([^/]+)'
            })}$`
        )
        this.routes.push({ regex, keys, componentPromise })
        return this
    }

    on404(componentPromise) {
        this.notFoundComponent = componentPromise
        return this
    }

    async run(href) {
        const url = new URL(href, location.origin)
        const path = url.pathname

        for (const { regex, keys, componentPromise } of this.routes) {
            const match = path.match(regex)
            if (match) {
                const params = keys.reduce((acc, key, i) => ({ ...acc, [key]: match[i + 1] }), {})
                const query = Object.fromEntries(url.searchParams.entries())

                try {
                    const module = await componentPromise
                    this.matchCallback({
                        cmp: module.default || module,
                        params,
                        query,
                    })
                } catch (err) {
                    console.error('Failed to load component:', err)
                }
                return
            }
        }

        if (this.notFoundComponent) {
            try {
                const module = await this.notFoundComponent
                this.matchCallback({
                    cmp: module.default || module,
                    params: {},
                    query: {},
                })
            } catch (err) {
                console.error('Failed to load 404 component:', err)
            }
        } else {
            console.log('404 | PAGE NOT FOUND')
        }
    }

    listen(callback) {
        this.matchCallback = callback

        const handleLink = (evt) => {
            evt.preventDefault()
            const href = evt.currentTarget.getAttribute('href')

            if (location.pathname + location.search === href) {
                console.warn('Ignoring click: Already on the current page', href)
                return
            }

            history.pushState({}, '', href)
            this.run(href)
        }

        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('a[href]').forEach((link) => {
                link.addEventListener('click', handleLink)
            })
        })

        window.addEventListener('popstate', () => this.run(location.pathname + location.search))
        this.run(location.pathname + location.search)

        return this
    }
}

export default Router
