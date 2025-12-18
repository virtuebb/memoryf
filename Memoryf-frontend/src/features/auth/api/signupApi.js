import api from "./axios";

const signupApi = async (signupData) => {

    try {

        const response = await api.post("/signup", signupData);

        return response.data;

    } catch(error) {

        console.log("회원가입 ajax 통신 실패", error);

        return null;
    }
}

export default signupApi