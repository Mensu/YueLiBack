declare module 'yueli' {
  namespace Model {
    type User = UserCredentials & UserEditableProps & {
      user_id: number
    }

    interface UserCredentials {
      username: string
      password?: string
    }

    interface UserEditableProps {
      nickname?: string
      password?: string
      signature?: string
    }

    interface UserFollower {
      user_id: number
      nickname: string
      signature: string
    }

    interface Spot {
      spot_id: number
      name: string
      description: string
      city: string
      location: {}
      rank: number
      favorited?: boolean
    }

    type CommentType = 'spot' | 'travel' | 'feeling'

    interface Comment {
      comment_id: number
      user_id: number
      nickname: string
      content: string
      reply_to: {
        user_id: number
        nickname: string
        content: string
      }
      time: Date
    }
  }
}