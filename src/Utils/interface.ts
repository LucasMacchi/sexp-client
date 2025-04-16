export interface IUser {
    first_name: string,
    last_name: string,
    email: string,
    activated: boolean,
    admin: boolean
}
export interface IUserStore {
    user: IUser,
    log: boolean,
    login: (email: string) => void,
    logout: () => void,
    session: () => void
}

export interface IUserCreate {
    first_name: string,
    last_name: string,
    email: string,
}