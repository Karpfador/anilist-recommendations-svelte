<script lang="ts">
    import { graphql, query, type GetUser$input } from '$houdini'
    import debounce from 'lodash/debounce'

    let username: string = ''

    const handleUsernameInput = debounce(e => {
        username = e.target.value

        if (username) {
            userRefetch({ username })
        }

        tags.clear()
        tags = tags
    }, 1000)

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

    export function GetUserVariables(page): GetUser$input {
        // make sure we recognize the value
        if (!['active', 'completed'].includes(page.params.filter)) {
            return this.error(400, 'invalid filter')
        }

        return {
            username,
        }
    }

    // const user = query<IUserResult>(GET_USER, { variables: { username: username ?? 'karpfador' } })

    let tags: Set<string> = new Set()

    const refetchAnime = debounce(() => {
        if (tags.size > 0) {
            // anime.refetch({ tags: Array.from(tags) })
        }
    }, 1000)

    const handleTagToggle = tag => {
        if (tags.has(tag)) {
            tags.delete(tag)
        } else {
            tags.add(tag)
        }

        // Reassigning for rerender
        tags = tags

        refetchAnime()
    }

    // Initializing with a fixed value again to avoid issues thanks to lack of lazy query support
    // const anime = query<IAnimeResult>(GET_ANIME, {
    //     variables: { tags: ['Shounen'] },
    // })
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

    <div>
        {#if username}
            {#if $userLoading}
                Loading User...
            {:else if $userError}
                Error: {$user.error.message}
            {:else if $user}
                Found user <b>{$user.data.User.name}</b> with ID {$user.data.User.id}<br />
                Your tags sorted by minutes watched:
                <ul>
                    {#each $user.data.User.statistics.anime.tags as tag}
                        <li on:click={() => handleTagToggle(tag.tag.name)}>
                            <input
                                type="checkbox"
                                checked={tags.has(tag.tag.name)}
                                on:click={() => handleTagToggle(tag.tag.name)}
                            />
                            -->
                            <!-- svelte-ignore a11y-invalid-attribute -->
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
        {#if tags.size > 0}
            <!-- {#if $anime.loading}
                Loading Anime...
            {:else if $anime.error}
                Error: {$user.error.message}
            {:else if $anime.data}
                {#if $anime.data.Page.media.length > 0}
                    <p class="centered">The 20 highest rated anime with your selected tags</p>
                    <div class="animeGrid">
                        {#each $anime.data.Page.media as anime}
                            <div class="anime centered">
                                <a href={anime.siteUrl} target="_blank">
                                    <img
                                        src={anime.coverImage.medium}
                                        alt="anime
                                cover"
                                    />
                                    <div>{anime.title.english ?? anime.title.romaji}</div>
                                </a>
                            </div>
                        {/each}
                    </div>
                {/if}
            {:else}
                No anime found.
            {/if} -->
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
