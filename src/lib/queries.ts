import { graphql } from '$houdini'

export const GET_USER = graphql`
    query User($username: String!) {
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
`
export interface IUserResult {
    User: {
        id: string
        name: string
        statistics: {
            anime: {
                tags: {
                    minutesWatched: number
                    tag: {
                        name: string
                    }
                }[]
            }
        }
    }
}

export const GET_ANIME = graphql`
    query Anime($tags: [String!]!) {
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
`

export interface IAnimeResult {
    Page: {
        media: {
            id: string
            siteUrl: string
            title: {
                english: string
                romaji: string
            }
            coverImage: {
                medium: string
            }
        }[]
    }
}
