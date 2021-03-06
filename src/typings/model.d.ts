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

    type Travel = TravelEditableProps & {
      travel_id: number
      user_id: number
      nickname: string
      first_day?: Date
      favorite_count: number
      favorited: boolean
      comment_count: number
      records: TravelRecord[]
    }

    interface TravelEditableProps {
      title: string
    }

    type TravelRecord = TravelRecordEditableProps & {
      travel_record_id: number
      spot_name: string
      travel_id?: number
      user_id?: number
      time: Date
    }

    interface TravelRecordEditableProps {
      spot_id: number
      content: string
    }

    type Feeling = FeelingEditableProps & {
      feeling_id: number
      user_id: number
      nickname: string
      longitude: number
      latitude: number
      time: Date
    }

    interface FeelingEditableProps {
      content: string
    }

    interface Favorite {
      type: 'travel' | 'spot'
      id: number
      time: Date
    }

    type Notification = NotificationEditableProps & {
      notification_id: number
      sender_id: number
      time: Date
      is_read?: boolean
    }

    interface NotificationEditableProps {
      type: string
      content: {
        user_id?: number
        comment_id?: number
        travel_id?: number
        feeling_id?: number
        sender_id?: number
      }
    }
  }
}
