
export interface JWTUser {
    id: string,
    email: string,
    role: string,
}
export interface GraphQlContext {
    user?: JWTUser,
}