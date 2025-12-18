import api from "./axios";

const checkIdApi = async (memberId) => {

    try {

        const response = await api.post(
            "/signup/check-id",
            memberId,
            {headers : {"Content-Type" : "text/plain"}}
        );

        return response.data;

    } catch (error) {

        console.log("아이디 중복확인 실패", error);

        return null;
    }
}

export default checkIdApi