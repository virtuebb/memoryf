import api from "./axios";

const sendEmailCodeApi = async(email) => {

    try {

        const response = await api.post(
            "/signup/send-code",
            {email : email}
        )

        return response.data;

    } catch(error) {

        console.log(error);

        return 0;
    }
}

export default sendEmailCodeApi;