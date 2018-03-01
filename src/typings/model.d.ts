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
  }
}