

export default async function authHeaderAzure() {
    let accessToken = await authAzure.acquireToken().then(() => {
        console.log('using token: ' +accessToken);

        if (accessToken) {
            return { Autorization: 'Bearer ' + accessToken };
        } else {
            return {};
        }    
    })
}