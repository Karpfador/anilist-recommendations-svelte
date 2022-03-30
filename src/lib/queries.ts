import { graphql } from '$houdini'

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
