<script context="module" lang="ts">
    //FIXME THIS IS NOT REACTIVE
    let username = ''
    // Without initial value, houdini throws an error
    let tags = ['Shounen']
    // These are up here in the first place because for some reason the
    // "XVariables" Functions arent being found when outside of the module context

    export function GetUserVariables(): GetUser['input'] {
        if (username.length > 0) {
            return this.error('Username not set')
        }

        return {
            username,
        }
    }

    export function GetAnimeVariables(): GetAnime['input'] {
        if (tags.length === 0) {
            return this.error('Tags not set')
        }

        return {
            tags: [...tags],
        }
    }
</script>

<script lang="ts">
    import { graphql, query } from '$houdini'
    import type { GetUser, GetAnime } from '$houdini'
    import debounce from 'lodash/debounce'

    const handleUsernameInput = debounce(e => {
        username = e.target.value

        if (username) {
            userRefetch({ username })
        }

        tags = []
    }, 500)

    const {
        data: user,
        error: userError,
        loading: userLoading,
        refetch: userRefetch,
    } = query(graphql`
        query GetUser($username: String!) {
            User(name: $username) {
                id
                name
                statistics {
                    anime {
                        tags(sort: PROGRESS_DESC) {
                            minutesWatched
                            tag {
                                name
                                id
                            }
                        }
                    }
                }
            }
        }
    `)

    const handleTagToggle = (tag: string) => {
        if (tags.includes(tag)) {
            tags = tags.filter(t => t !== tag)
        } else {
            tags = [...tags, tag]
        }

        refetchAnime()
    }

    const {
        data: anime,
        error: animeError,
        loading: animeLoading,
        refetch: animeRefetch,
    } = query(graphql`
        query GetAnime($tags: [String!]!) {
            Page(perPage: 20, page: 1) {
                media(tag_in: $tags, type: ANIME, sort: SCORE_DESC) {
                    id
                    siteUrl
                    title {
                        english
                        romaji
                    }
                    coverImage {
                        medium
                    }
                }
            }
        }
    `)

    const refetchAnime = debounce(() => {
        if (tags.length > 0) {
            animeRefetch({ tags })
        }
    }, 500)
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

<section>
    <h1>First Test: Recommending based on a tag (currently not respecting already watched etc.)</h1>
    <p>Warning: There is no filter on adult content yet</p>
    <p>
        Enter your AniList username: <input
            value={username ?? ''}
            placeholder="Username"
            on:input={handleUsernameInput}
        />
    </p>
    {username}
    <div>
        {#if username}
            {#if $userLoading}
                Loading User...
            {:else if $userError}
                Error: {$user.error.message}
            {:else if $user.User}
                Found user <b>{$user.User.name}</b> with ID {$user.User.id}<br />
                Your tags sorted by minutes watched:
                <ul>
                    {#each $user.User.statistics.anime.tags as tag}
                        <li on:click={() => handleTagToggle(tag.tag.name)}>
                            <input type="checkbox" checked={tags.includes(tag.tag.name)} />
                            <!-- svelte-ignore a11y-invalid-attribute-->
                            <a href="javascript:;">
                                {tag.tag.name} ({tag.minutesWatched} minutes)
                            </a>
                        </li>
                    {/each}
                </ul>
            {/if}
        {/if}
    </div>

    <div>
        {#if tags.length > 0}
            {tags}
            {#if $animeLoading}
                Loading Anime...
            {:else if $animeError}
                Error: {$user.error.message}
            {:else if $anime && $user.User}
                {#if $anime.Page.media.length > 0}
                    <p class="centered">The 20 highest rated anime with your selected tags</p>
                    <div class="animeGrid">
                        {#each $anime.Page.media as anime}
                            <div class="anime centered">
                                <a href={anime.siteUrl} target="_blank">
                                    <img src={anime.coverImage.medium} alt="anime cover" />
                                    <div>{anime.title.english ?? anime.title.romaji}</div>
                                </a>
                            </div>
                        {/each}
                    </div>
                {/if}
            {:else}
                No anime found.
            {/if}
        {/if}
    </div>
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
    }

    h1 {
        width: 100%;
    }

    .centered {
        text-align: center;
    }

    .animeGrid {
        margin-left: 20%;
        margin-right: 20%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    .anime {
        min-width: unset;
        min-height: unset;
        text-align: center;
    }
</style>
