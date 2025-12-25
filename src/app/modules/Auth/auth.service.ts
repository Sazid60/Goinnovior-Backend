
import { createNewAccessTokenWithRefreshToken } from '../../helpers/userToken';


const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
    return newAccessToken

}

export const AuthServices = {
    getNewAccessToken
}