import api from "./axios";

const verifyEmailCodeApi = async(email, code) => {

    try {

        const response = await api.post(
            "/signup/verify-code",
            {email : email, code : code}
        )

        return response.data;

    } catch(error) {

        console.log(error);

        return 0;
    }
}

export default verifyEmailCodeApi